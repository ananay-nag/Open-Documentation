---
sidebar_position: 2
sidebar_label: Go API
---
# Go API Reference [![GitHub](https://img.shields.io/badge/GitHub--181717?logo=github&style=flat-square)](https://github.com/ananay-nag/bit-socket-go)

The Go port of BitSocket is divided into three primary packages: `server`, `client`, and `protocol`. It is designed to offer the same conceptual API shape, adapted for standard Go patterns (type safety, explicit handlers, and concurrency).

---

## Server API (`bitsocket/server`)

### `Server`

The root orchestrator handling HTTP upgrades and clients multiplexing.

#### Constructor: `server.New(server.Config)`
* **`Config.Port`** (int): If $> 0$, starts a background HTTP server listening on this port. If `0`, call `.Handler()` to bind to your own router.
* **`Config.UseSchemas`** (*bool): Toggle schema-sync handshakes.
* **`Config.CORSOrigins`** ([]string): List of domains permitted to initiate WebSocket connections.

#### Methods:
* **`Of(nsp)`**: Returns the `Namespace` pointer. Creates it if not present.
* **`Use(middleware)`**: Registers connection middleware on the root `/` namespace.
* **`OnConnection(handler)`**: Binds connection listener function on the root namespace.
* **`Emit(event, payload)`**: Broadcasts a message to all sockets connected to `/`.
* **`To(room, [nsp])`**: Scopes broadcasts to a room and namespace.
* **`Handler()`**: Returns an `http.HandlerFunc` for mounting.
* **`Close()`**: Stops background listeners.

---

### `Namespace`

An isolated routing context on the server.

#### Methods:
* **`Schema(schema)`**: Registers schema definition for binary compression.
* **`Use(middleware)`**: Appends a connection middleware pipeline.
* **`OnConnection(handler)`**: Binds connection listener function.
* **`Emit(event, payload)`**: Broadcasts to all sockets in this namespace.

---

### `Socket`

Represents a connected websocket connection instance inside a namespace.

#### Methods:
* **`On(event, handler)`**: Binds listener for event. Handler signature: `func(payload interface{}, ack server.AckFunc)`.
* **`OnSchema(schema, handler)`**: Utility to bind schema payload listener.
* **`Emit(event, payload)`**: Sends event to this socket.
* **`EmitSchema(schema, payload)`**: Utility to send schema-compressed payload.
* **`Join(room)`**: Joins socket to the room.
* **`Leave(room)`**: Leaves the room.

---

## Client API (`bitsocket/client`)

### `Client`

Represents a connected client WebSocket session.

#### Constructor: `client.New(url, client.Options)`
* **`url`** (string): WebSocket server URL.
* **`opts.Nsp`** (string): Namespace scope to connect to.
* **`opts.AutoReconnect`** (*bool): Enable or disable auto reconnect.
* **`opts.Headers`** (http.Header): HTTP headers sent during connection handshake (useful for auth middleware).

#### Methods:
* **`Of(nsp)`**: Returns a `Namespace` instance and connects to it in the background.
* **`On(event, handler)`**: Binds listener on the root `/` namespace. Handler signature: `func(payload interface{})`.
* **`Emit(event, payload)`**: Fire-and-forget event emission.
* **`EmitAck(event, payload, callback)`**: Emit event and execute callback with server ack.
* **`Close()`**: Closes connection session.

---

## Schema API (`bitsocket/protocol`)

### `Schema`

Compile structural schemas to allow keyless serialization.

#### Constructor: `protocol.NewSchema(name, definition)`
* **`name`** (string): Unique word containing letters, numbers, and underscores.
* **`definition`** (interface{}): Structure template. Slices `[]any` and maps `map[string]any` define array and object formats.

#### Methods:
* **`EncodePayload(payload)`**: Serializes Go payload maps/slices into schema bytes.
* **`DecodePayload(buffer)`**: Deserializes raw bytes into Go values.

---

## Code Examples

### Server

```go
package main

import (
	"fmt"
	"net/http"

	"github.com/ananay-nag/bit-socket-go/protocol"
	"github.com/ananay-nag/bit-socket-go/server"
)

func main() {
	io := server.New(server.Config{Port: 6001})

	// 1. Setup schema
	schema := protocol.MustNewSchema("USER_TEST", map[string]interface{}{
		"name": "string",
		"age":  "uint8",
	})
	io.Of("/user").Schema(schema)

	// 2. Middleware authentication
	io.Of("/user").Use(func(socket *server.Socket, next func(error)) {
		token := socket.Handshake.Headers.Get("X-Auth-Token")
		if token == "enterprise-passkey" {
			next(nil)
		} else {
			next(fmt.Errorf("unauthorized"))
		}
	})

	// 3. Connection and Event listeners
	io.Of("/user").OnConnection(func(socket *server.Socket) {
		socket.On("USER_TEST", func(payload interface{}, ack server.AckFunc) {
			fmt.Println("Received payload:", payload)
			if ack != nil {
				ack(map[string]interface{}{"status": "ok"})
			}
		})
	})

	select {}
}
```

### Client

```go
package main

import (
	"fmt"
	"net/http"
	"time"

	"github.com/ananay-nag/bit-socket-go/client"
)

func main() {
	headers := http.Header{}
	headers.Set("X-Auth-Token", "enterprise-passkey")

	c := client.New("ws://localhost:6001", client.Options{
		Nsp:     "/user",
		Headers: headers,
	})

	c.On("connect", func(data interface{}) {
		fmt.Println("Connected to server!")
		c.EmitAck("USER_TEST", map[string]interface{}{
			"name": "GolangGopher",
			"age":  uint8(10),
		}, func(response interface{}) {
			fmt.Println("Server ACK:", response)
		})
	})

	time.Sleep(5 * time.Second)
	c.Close()
}
```
