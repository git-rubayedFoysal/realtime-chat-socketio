import { useEffect, useRef, useState } from "react";
import { socket } from "./socket";

const App = () => {
  const timer = useRef(null);
  const [showPopup, setShowPopup] = useState(true);
  const [inputName, setInputName] = useState("");
  const [userName, setUserName] = useState("");

  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [typier, setTypier] = useState([]);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    const trimmedName = inputName.trim();
    if (!trimmedName) return;
    setUserName(trimmedName);
    setShowPopup(false);

    // connect socket.io after user set username
    socket.emit("join-room", trimmedName);
    socket.connect();
  };

  useEffect(() => {
    socket.on("connect", () => {
      socket.on("room-notice", (name) => {
        console.log(`${name} was joined.`);
      });
    });

    socket.on("chat:msg", (msg) => {
      console.log(msg);
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", (name) => {
      setTypier((prev) => {
        const isExist = prev?.find((n) => n === name);

        if (!isExist) return [...prev, name];
        return prev;
      });
    });
    socket.on("stop:typing", (name) => {
      setTypier((prev) => {
        return prev?.filter((ty) => ty !== name);
      });
    });

    return () => {
      socket.disconnect();
      socket.off("typing");
      socket.off("chat:msg");
      socket.off("stop:typing");
      socket.off("room-notice");
    };
  }, []);

  useEffect(() => {
    if (text) {
      socket.emit("typing", userName);

      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      socket.emit("stop:typing", userName);
    }, 1000);

    return () => clearTimeout(timer.current);
  }, [text, userName]);

  const formatTime = (ts) => {
    const d = new Date(ts);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");

    return `${hh}:${mm}`;
  };

  const extractFirstLatter = () => {
    const user = userName.toUpperCase();
    const name = user.includes(" ") ? user.split(" ") : [user];

    return name.length > 1
      ? name[0].slice(0, 1) + name[1].slice(0, 1)
      : name[0].slice(0, 1);
  };

  const sendMessage = () => {
    const trimmedMsg = text.trim();
    if (!trimmedMsg) return;

    const msg = {
      id: Date.now(),
      sender: userName,
      text: trimmedMsg,
      ts: Date.now(),
    };

    setMessages((prev) => [...prev, msg]);
    socket.emit("chat:msg", msg);
    setText("");
  };

  const handelKeySubmit = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-zinc-100 p-4 font-inter">
      {/* popup menu */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center z-40">
          <div className="bg-white max-w-md rounded-lg shadow-lg p-6">
            <h1 className="text-xl font-semibold text-black mt-1">
              Enter your name
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Enter your name for stat chatting. This will be used as your
              identify
            </p>

            <form onSubmit={handleNameSubmit} className="mt-4">
              <input
                autoFocus
                className="w-full border border-gray-200 outline-green-500 placeholder-gray-400 py-2 px-2 rounded-md font-medium"
                type="text"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
                placeholder="John Doe..."
              />
              <button
                className="py-1.5 text-md font-semibold text-white px-3 bg-green-600 rounded-md mt-3 cursor-pointer"
                type="submit"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Message Window */}
      {!showPopup && (
        <div className="w-full max-w-2xl h-[90vh] bg-white rounded-xl shadow-md flex flex-col overflow-hidden">
          {/* Chat header */}
          <div className="flex items-center gap-3 border-b border-gray-200 py-3 px-2">
            <div className="w-10 h-10 flex justify-center items-center border rounded-full font-semibold bg-[#075E54] text-white">
              {extractFirstLatter()}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium text-[#303030]">
                Realtime group chat
              </div>
              {typier.length ? (
                <div className="text-xs text-gray-500 transition-all">
                  {typier
                    .map((ty) => ty.charAt(0).toUpperCase() + ty.slice(1))
                    .join(", ")}{" "}
                  is typing...
                </div>
              ) : (
                ""
              )}
            </div>
            <div className="text-sm text-gray-500">
              Signin as{" "}
              <span className="font-semibold text-[#303030] capitalize">
                {userName}
              </span>
            </div>
          </div>

          {/* Message Lists */}
          <div className="flex-1 py-3 px-1.5 space-y-2 overflow-auto bg-zinc-100 flex flex-col">
            {messages.map((m) => {
              const mine = m.sender === userName;

              return (
                <div
                  key={m.id}
                  className={`flex ${mine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[78%] p-3 my-2 rounded text-sm leading-5 shadow-sm text-[#303030] ${mine ? "bg-[#CCF8C6] rounded-br-2xl" : "bg-white rounded-bl-2xl"}`}
                  >
                    <div className="wrap-break-word  whitespace-pre-wrap">
                      {m.text}
                    </div>
                    <div className="flex justify-between items-center mt-1 gap-16">
                      <div className="text-[10px] font-semibold capitalize">
                        {m.sender}
                      </div>
                      <div className="text-[10px] text-gray-500 text-right">
                        {formatTime(m.ts)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat Textarea */}
          <div className="px-3 py-2 border-t border-gray-200 bg-white">
            <div className="flex items-center justify-between gap-4 border border-gray-200 rounded-full">
              <textarea
                rows={1}
                value={text}
                onKeyDown={handelKeySubmit}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type a message..."
                className="w-full resize-none px-4 py-4 text-sm outline-none placeholder:font-medium"
              />
              <button
                className="bg-green-500 text-white px-4 py-2 mr-2 rounded-full text-sm font-semibold cursor-pointer"
                onClick={sendMessage}
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
