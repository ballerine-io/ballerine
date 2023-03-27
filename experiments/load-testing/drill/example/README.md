# How to play with drill

Compile drill:

```
cargo build --release
```

### Example 1 (Delayed responses)

Start a Node HTTP server from `server` directory in another terminal:

```
cd example/server
DELAY_MS=100 node server.js
```

and then run:

```
cd example
../target/release/drill --benchmark benchmark.yml
```

### Example 2 (Cookies)

Start a Node HTTP server from `server` directory in another terminal:

```
cd example/server
npm install
node server.js
```

and then run:

```
cd example
../target/release/drill --benchmark cookies.yml
```

### Example 3 (Custom headers)

Start a Node HTTP server from `server` directory in another terminal:

```
cd example/server
npm install
node server.js
```

and then run:

```
cd example
../target/release/drill --benchmark headers.yml
