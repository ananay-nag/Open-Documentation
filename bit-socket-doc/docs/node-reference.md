---
sidebar_position: 3
sidebar_label: Node API
---
# Node.js API Reference

The Node.js implementation of BitSocket provides a high-performance websocket server and client designed to mimic the programming style of Socket.io, transferring raw binary frames over the wire.

---

## Server API

### `BitSocketServer`

The core server class to listen and accept BitSocket connections.

#### Constructor: `new BitSocketServer(config)`
* **`config.port`** (number): Port to create a new HTTP server on and listen.
* **`config.server`** (http.Server): Attach to an existing HTTP server instance instead of creating a new one.
* **`config.cors.origin`** (string | string[]): List of domains allowed to upgrade connections. Defaults to `['*']`.
* **`config.useSchemas`** (boolean): Enable or disable auto-synchronizing schemas to clients on handshake. Defaults to `true`.

#### Methods:
* **`of(namespace)`**: Returns a `Namespace` instance. Creates it if it doesn't exist.
* **`use(middleware)`**: Registers connection middleware on the root namespace `/`.
* **`on(event, callback)`**: Registers event listener on the root namespace `/` (e.g. `'connection'`).
* **`emit(event, payload)`**: Broadcasts to all sockets on the root namespace `/`.
* **`to(room, [namespace])`**: Returns a room emitter scoped to the specified room and namespace (defaults to `/`).
* **`close()`**: Stops the HTTP server and terminates all active WebSocket connections.

---

### `ServerSocket`

Represents a connected client socket instance within a specific server namespace.

#### Methods:
* **`on(event, callback)`**: Registers event handler. The callback receives `(payload, [ackCallback])`.
* **`emit(event, payload)`**: Emits binary message to this socket.
* **`join(room)`**: Adds socket to the specified room.
* **`leave(room)`**: Removes socket from the specified room.

---

## Client API

### `BitSocketClient`

The client class to connect to a BitSocket server.

#### Constructor: `new BitSocketClient(url, [options])`
* **`url`** (string): WebSocket endpoint URL (e.g. `ws://localhost:6001`).
* **`options.nsp`** (string): Namespace scope to connect to. Defaults to `/`.
* **`options.autoReconnect`** (boolean): Auto reconnect after unexpected disconnects. Defaults to `true`.
* **`options.maxAttempts`** (number): Maximum reconnect retry attempts. Defaults to `15`.
* **`options.baseDelay`** (number): Initial backoff reconnect delay in ms. Defaults to `1000`.
* **`options.maxDelay`** (number): Maximum backoff delay in ms. Defaults to `7000`.

#### Methods:
* **`of(namespace)`**: Connects to and returns an additional namespace room tracking instance.
* **`on(event, callback)`**: Registers event callback on the primary namespace connection.
* **`emit(event, payload, [ackCallback])`**: Emits event. Optional callback is executed when server acknowledges.
* **`join(room)`**: Joins the specified room on the server.
* **`leave(room)`**: Leaves the specified room on the server.
* **`close()`**: Closes the connection and disables automatic reconnection.

---

## Schema API

### `Schema`

BitSocket allows defining layout schemas to serialize data strictly without keys for maximum bandwidth savings.

#### Constructor: `new Schema(name, definition)`
* **`name`** (string): Unique name containing letters, numbers, and underscores.
* **`definition`** (object): Structural definition with types. Supported types: `'uint8'`, `'uint16'`, `'uint32'`, `'int32'`, `'float64'`, `'boolean'`, `'string'`, `'bytes'`, `'object'`, `'array'`.

#### Methods:
* **`encodePayload(payload)`**: Serializes payload to binary buffer.
* **`decodePayload(buffer)`**: Deserializes binary buffer back to structured object.

---

## Code Examples

### Server Setup with Middleware & Schema

```javascript
import { BitSocketServer, Schema } from '@msgpack/msgpack';

const io = new BitSocketServer({ port: 6001 });

// 1. Define custom schema
const userSchema = new Schema('USER_CREATE', {
  name: 'string',
  age: 'uint8',
  isAdmin: 'boolean'
});
io.of('/user').schema(userSchema);

// 2. Add namespace connection middleware
io.of('/user').use((socket, next) => {
  const token = socket.handshake.headers['x-auth-token'];
  if (token === 'enterprise-passkey') {
    next();
  } else {
    next(new Error('Unauthorized'));
  }
});

// 3. Register connection listener
io.of('/user').on('connection', (socket) => {
  console.log('Client connected:', socket.id);

  socket.on('USER_CREATE', (payload, ack) => {
    console.log('Received payload:', payload);
    if (ack) ack({ status: 'ok', id: 101 });
  });
});
```

### Client Connection

```javascript
import { BitSocketClient } from '@msgpack/msgpack';

const client = new BitSocketClient('ws://localhost:6001', {
  nsp: '/user',
  headers: { 'x-auth-token': 'enterprise-passkey' }
});

client.on('connect', () => {
  console.log('Connected!');

  // Emit event and receive acknowledgment
  client.emit('USER_CREATE', {
    name: 'Gopher',
    age: 10,
    isAdmin: false
  }, (response) => {
    console.log('Server response:', response);
  });
});
```
