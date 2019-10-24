# globe
Experimenting with OpenGL

## Prerequsits

- Node (tested on v10)

## Run it

Add a file `./config.js` with contents:

```js
export const accessToken = 'your.cesium.ion.access.token'
export const realtimeEndpoints = ['url.to.websocket.endpoint1', 'endpoint2', ... ]
```

- `npm install`
- `npm start`
- Open your browser on http://localhost:8080/
