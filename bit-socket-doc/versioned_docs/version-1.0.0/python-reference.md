---
sidebar_position: 4
sidebar_label: Python API Reference
---
# Python API Reference

The Python implementation of BitSocket is built on the `websockets` library and utilizes Python's `asyncio` framework for asynchronous networking.

---

## Server API (`bitsocket.server`)

### `BitSocketServer`

The core server instance class.

#### Constructor: `BitSocketServer(port=None, host="0.0.0.0", use_schemas=True, cors_origins=None)`
* **`port`** (int): Port to bind to.
* **`host`** (str): IP address to bind to. Defaults to `"0.0.0.0"`.
* **`use_schemas`** (bool): Toggle client schema-sync handshakes. Defaults to `True`.
* **`cors_origins`** (list): Allowed origin headers. Defaults to `["*"]`.

#### Methods:
* **`of(namespace)`**: Returns or creates a server `Namespace` instance.
* **`use(fn)`**: Registers connection middleware on the root `/` namespace.
* **`on_connection(handler)`**: Binds connection handler on the root `/` namespace.
* **`emit(event, [payload])`**: Broadcasts event to all sockets on `/`.
* **`to(room, [nsp])`**: Scopes broadcast to room.
* **`start()`**: Coroutine that starts listening and returns the server.
* **`serve_forever()`**: Coroutine that starts (if not started) and blocks.
* **`run()`**: Synchronous helper blocking call (wraps `serve_forever`).
* **`close()`**: Coroutine that closes active WebSocket loops.

---

### `Namespace`

#### Methods:
* **`schema(schema_obj_or_dict)`**: Registers schemas for client sync.
* **`use(fn)`**: Adds connection middleware.
* **`on_connection(handler)`**: Registers client connection handler.

---

### `Socket`

Represents a connected client session within a namespace.

#### Methods:
* **`on(event, handler)`**: Binds listener for event. The handler signature is `async def handler(payload, ack_fn)`.
* **`emit(event, payload)`**: Sends message payload.
* **`join(room)`**: Joins socket to the room.
* **`leave(room)`**: Removes socket from the room.

---

## Client API (`bitsocket.client`)

### `BitSocketClient`

The client websocket connection manager.

#### Constructor: `BitSocketClient(url, nsp="/", auto_reconnect=True, max_attempts=15, base_delay=1.0, max_delay=7.0, headers=None)`
* **`url`** (str): Server WebSocket URL.
* **`nsp`** (str): Namespace path. Defaults to `/`.
* **`auto_reconnect`** (bool): Attempt reconnection on signal drops. Defaults to `True`.
* **`headers`** (dict): Dictionary of HTTP headers sent during upgrade (useful for token authentication).

#### Methods:
* **`connect()`**: Coroutine to dial websocket server and start background loops.
* **`of(nsp)`**: Joins and returns an additional namespace room instance.
* **`on(event, callback)`**: Binds event callback on primary namespace.
* **`emit(event, payload, [callback])`**: Coroutine to send message event, with optional callback for acknowledgments.
* **`join(room)`**: Joins the room on the server.
* **`leave(room)`**: Leaves the room on the server.
* **`close()`**: Coroutine that stops reconnection schedules and closes connection.

---

## Schema API (`bitsocket.protocol`)

### `Schema`

Compile binary layouts to encode messages strictly.

#### Constructor: `Schema(name, definition)`
* **`name`** (str): Unique schema name (alphanumeric and underscores).
* **`definition`** (dict): Key-type mappings. Supported types: `'uint8'`, `'uint16'`, `'uint32'`, `'int32'`, `'float64'`, `'boolean'`, `'string'`, `'bytes'`, `'object'`, `'array'`.

#### Methods:
* **`encode_payload(payload)`**: Serializes Python dict into bytes.
* **`decode_payload(buffer)`**: Deserializes bytes back to Python objects.

---

## Code Examples

### Server

```python
import asyncio
from bitsocket.server import BitSocketServer

async def main():
    print("[Python Server] Starting...")
    io = BitSocketServer(port=6002)

    # 1. Register schemas
    io.of("/user").schema({
        "USER_TEST": {
            "name": "string",
            "age": "uint8"
        }
    })

    # 2. Connection middleware
    async def auth_middleware(socket, next_fn):
        token = socket.handshake.headers.get("X-Auth-Token")
        if token == "enterprise-passkey":
            await next_fn()
        else:
            await next_fn(Exception("Unauthorized"))
            
    io.of("/user").use(auth_middleware)

    # 3. Connection and event listeners
    async def on_connection(sock):
        print(f"Client connected: {sock.id}")

        async def on_user_test(payload, ack):
            print("Received user payload:", payload)
            if ack:
                await ack({"status": "ok"})
                
        sock.on("USER_TEST", on_user_test)

    io.of("/user").on_connection(on_connection)
    
    await io.serve_forever()

if __name__ == "__main__":
    asyncio.run(main())
```

### Client

```python
import asyncio
from bitsocket.client import BitSocketClient

async def main():
    headers = {"X-Auth-Token": "enterprise-passkey"}
    client = BitSocketClient("ws://localhost:6002", nsp="/user", headers=headers)

    async def on_connect(data):
        print("Connected!")
        
        async def on_ack(response):
            print("Server ACK:", response)
            
        await client.emit("USER_TEST", {
            "name": "PythonClient",
            "age": 10
        }, callback=on_ack)

    client.on("connect", on_connect)
    await client.connect()

    # Sleep to allow messages to traverse
    await asyncio.sleep(5)
    await client.close()

if __name__ == "__main__":
    asyncio.run(main())
```
