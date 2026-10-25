# Real-Time Chat App

A real-time group chat application built with **Node.js**, **Express**, **Socket.io**, **React**, **Vite**, and **Tailwind CSS**.

Users join a shared room with a username and can send messages, see join notices, and view typing indicators — all in real time.

---

## Project Structure

```
real-time_chat_using_socket.io/
├── backend/                  # Node.js + Express + Socket.io server
│   ├── index.js              # Server entry point
│   ├── package.json
│   ├── package-lock.json
│   └── .gitignore
└── frontend/                 # React + Vite client
    ├── src/
    │   ├── App.jsx           # Chat UI component
    │   ├── main.jsx          # React entry point
    │   ├── socket.js         # Socket.io client instance
    │   └── index.css         # Tailwind CSS imports
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── eslint.config.js
    ├── README.md             # Vite template README
    └── .gitignore
```

---

## Features

- **Real-time messaging** via WebSockets (Socket.io)
- **Username-based join** — enter your name before entering the chat room
- **Join notices** — system messages when someone enters the room
- **Typing indicators** — see who is typing in real time
- **Message timestamps** — each message shows the time it was sent
- **Own vs. others styling** — your messages are styled differently from others'
- **Single shared room** — all users chat in one group room (`my-room`)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Node.js, Express, Socket.io |
| Frontend | React 19, Vite, Socket.io-client |
| Styling | Tailwind CSS |
| Build tool | Vite |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer recommended)
- npm (comes with Node.js)

### 1. Clone the repository

```bash
git clone <repository-url>
cd real-time_chat_using_socket.io
```

### 2. Start the backend server

```bash
cd backend
npm install
npm run dev   # or: npm start
```

The server will run on `http://localhost:8000` by default (or the port defined in `PORT` env variable).

### 3. Start the frontend client

```bash
cd frontend
npm install
npm run dev   # runs on http://localhost:5173
```

### 4. Open the app

Visit `http://localhost:5173` in your browser, enter your name, and start chatting. Open the app in multiple browser tabs or devices to test real-time messaging.

---

## Available Scripts

### Backend (`backend/`)

| Script | Description |
|--------|-------------|
| `npm start` | Start the production server |
| `npm run dev` | Start with watch mode (auto-restart on changes) |

### Frontend (`frontend/`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build locally |

---

## Socket Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `join-room` | Client → Server | `username` | User joins the shared room |
| `room-notice` | Server → Client | `username` | Broadcasts when someone joins |
| `chat:msg` | Both directions | `{ id, sender, text, ts }` | Send/receive a chat message |
| `typing` | Both directions | `username` | Notify others a user is typing |
| `stop:typing` | Both directions | `username` | Notify others a user stopped typing |

---

## License

ISC License

---

**Author:** Rubayed Ahmed Foysal