# Chat System API Documentation

## Base URL
`http://localhost:8080` (REST)
`ws://localhost:8080/ws` (WebSocket)

## Authentication
### Register
- **URL**: `/api/v1/auth/register`
- **Method**: `POST`
- **Body**: `{ "username": "...", "password": "..." }`
- **Response**: `{ "token": "JWT_TOKEN" }`

### Login
- **URL**: `/api/v1/auth/login`
- **Method**: `POST`
- **Body**: `{ "username": "...", "password": "..." }`
- **Response**: `{ "token": "JWT_TOKEN" }`

---

## Chat Rooms
### Create Room
- **URL**: `/api/v1/rooms`
- **Method**: `POST`
- **Auth**: Required (Bearer Token)
- **Body**: `{ "name": "...", "description": "..." }`

### List Rooms
- **URL**: `/api/v1/rooms`
- **Method**: `GET`
- **Auth**: Required (Bearer Token)

---

## Message History
### Private History
- **URL**: `/api/v1/messages/private/{otherUsername}`
- **Method**: `GET`
- **Params**: `page`, `size` (defaults: 0, 20)

### Room History
- **URL**: `/api/v1/messages/room/{roomId}`
- **Method**: `GET`
- **Params**: `page`, `size`

---

## WebSocket (STOMP)
- **Endpoint**: `/ws` (supports SockJS)
- **Headers**: `Authorization: Bearer <TOKEN>` (Required for CONNECT)

### Subscriptions
- `/topic/public`: Global broadcast
- `/topic/room.{roomId}`: Group chat messages
- `/user/queue/messages`: Private messages
- `/user/queue/status`: Message status updates (Read Receipts)

### Destinations (@MessageMapping)
- `/app/chat.sendMessage`: Public broadcast
- `/app/chat.privateMessage`: Sending to specific user
- `/app/chat.groupMessage`: Sending to specific room
- `/app/chat.updateStatus`: Marking message as READ
