---
sidebar_position: 5
sidebar_label: Cross Language Interoperability
---
# Cross-Language Interoperability

BitSocket ensures that Node.js, Go, and Python ports are completely interoperable at the byte level. Sockets in one language can connect and communicate with servers of another language seamlessly.

---

## The Interoperability Test Chain

To prove complete wire-format compatibility, we run a combined integration test that streams messages across three languages, acting as alternating servers and clients in a loop.

Here is the flow of the interoperability chain:

```text
+-------------------+      (emit "step1")      +-------------------+
|  Node.js Server   | =======================> |    Go Client A    |
|    (Port 6001)    |                          +-------------------+
+-------------------+                                    |
                                                         | (connect & emit "step2")
                                                         v
+-------------------+      (emit "step3")      +-------------------+
|  Node.js Client   | <======================= |   Python Server   |
+-------------------+                          |    (Port 6002)    |
         |                                     +-------------------+
         | (connect & emit "step4")
         v
+-------------------+      (emit "step5")      +-------------------+
|     Go Server     | =======================> |   Python Client   |
|    (Port 6003)    |                          +-------------------+
+-------------------+
```

### The Communication Steps

1. **Step 1 (Node.js Server A $\rightarrow$ Go Client A)**: Node.js Server A listens on port `6001`. On connection, it emits `"step1"` with payload `{"msg": "hello from node server A"}`.
2. **Step 2 (Go Client A $\rightarrow$ Python Server B)**: Go Client A receives `"step1"`. Upon receipt, it dials Python Server B on port `6002` and emits `"step2"` with payload `{"msg": "hello from golang client A"}`.
3. **Step 3 (Python Server B $\rightarrow$ Node.js Client B)**: Python Server B receives `"step2"` and broadcasts `"step3"` with payload `{"msg": "hello from python server B"}` to Node.js Client B.
4. **Step 4 (Node.js Client B $\rightarrow$ Go Server C)**: Node.js Client B receives `"step3"`, dials Go Server C on port `6003`, and emits `"step4"` with payload `{"msg": "hello from node client B"}`.
5. **Step 5 (Go Server C $\rightarrow$ Python Client C)**: Go Server C receives `"step4"` and broadcasts `"step5"` with payload `{"msg": "hello from golang server C"}` to Python Client C, which asserts the output and logs `"step5_success"`.

---

## Verifying Interoperability

You can execute the combined integration test by running the orchestrator from `/bit-socket-lang/combine`:

```bash
node run_combine_test.js
```

Or run the Go E2E suite inside `/bit-socket-lang/bit-socket-go/`:

```bash
go test -v ./e2e/...
```
