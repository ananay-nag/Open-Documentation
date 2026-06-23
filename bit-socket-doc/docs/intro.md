---
sidebar_position: 1
sidebar_label: Intro
---
# Introduction

**BitSocket** is an enterprise-grade, high-throughput, real-time bidirectional transport framework. It replaces standard plain-text JSON communication layers (such as default Socket.io configurations) with an optimized, schema-less, compressed binary wire format.

The framework delivers the exact fluid, event-driven programming model (Developer Experience / DX) of Socket.io—supporting **Rooms**, **Namespaces**, **Middleware pipelines**, **Connection Resumption**, and **Async Callbacks (Acknowledgments)**—while automatically converting all network layer transfers into a compressed binary footprint natively in the background.

---

## Technical & Wire Specification

Every frame traversing the WebSocket channel follows this exact memory block layout:

```text
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|   Frame Type  |  Nsp Length   |    Namespace String Bytes...  |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+                               +
|                              ....                             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|  Event Length |             Event Name String Bytes...        |
+-+-+-+-+-+-+-+-+                                               +
|                              ....                             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                         Correlation ID                        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                  Variable Length Payload Body                 |
|             (Deflate Packed MessagePack Array)                |
|                              ....                             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

### Header Registry Table

| Field Name | Data Type | Offset (Bytes) | Size | Functional Mandate |
| :--- | :--- | :--- | :--- | :--- |
| **Frame Type** | `uint8` | 0 | 1 Byte | Determines internal routing behavior (`0x01`=Connect, `0x02`=Event, `0x03`=Ack, `0x04`=Ping, `0x05`=Pong, `0x06`=Join, `0x07`=Leave). |
| **Nsp Length** | `uint8` | 1 | 1 Byte | Explicit byte length specification for the namespace indicator string. |
| **Namespace** | `bytes` | 2 | Variable | UTF-8 encoded array containing the target isolation routing partition path (e.g., `/admin`). |
| **Event Length**| `uint8` | 2 + NspLen | 1 Byte | Explicit byte length specification for the event name payload key. |
| **Event Name** | `bytes` | 3 + NspLen | Variable | UTF-8 encoded string array map identifier target (e.g., `user:update`). |
| **Correlation ID**| `uint32`| Variable | 4 Bytes | Big-endian tracking index required to match asynchronous remote execution handlers back to their matching client promises. |
| **Payload Body**| `bytes` | Variable | Variable | The core data payload block encoded via MessagePack algorithms and wrapped in a Zlib Deflate binary pipeline. |

---

## Language Ports & Packages

BitSocket is implemented natively in three major languages. Each port is hosted in its own repository and can be installed via its respective package manager:

| Language | Package / Installation | GitHub Repository |
| :--- | :--- | :--- |
| **Node.js** | [`@ananay-nag/bit-socket-node`](https://www.npmjs.com/package/@ananay-nag/bit-socket-node) <br/>`npm install @ananay-nag/bit-socket-node` | [ananay-nag/bit-socket-node](https://github.com/ananay-nag/bit-socket-node) |
| **Go** | [`github.com/ananay-nag/bit-socket-go`](https://pkg.go.dev/github.com/ananay-nag/bit-socket-go) <br/>`go get github.com/ananay-nag/bit-socket-go` | [ananay-nag/bit-socket-go](https://github.com/ananay-nag/bit-socket-go) |
| **Python** | [`bit-socket-python`](https://pypi.org/project/bit-socket-python/) <br/>`pip install bit-socket-python` | [ananay-nag/bit-socket-python](https://github.com/ananay-nag/bit-socket-python) |
