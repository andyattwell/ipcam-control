require('dotenv').config()
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const CameraRoutes = require('./routes/CameraRoutes')
const ConfigRoutes = require('./routes/ConfigRoutes')
const SiteRoutes = require('./routes/SiteRoutes')

// const WebSocket = require('ws');
// const wss = new WebSocket.Server({port: 3030});
// const { handleConnection } = require('./websocketHandlers')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static('../../dist'));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
/**
 * CACHE
*/
// app.use(function (req, res) {
//   res.set('Cache-control', 'public, no-cache')
// })

/**
 * CORS
*/
app.use(cors());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

/**
 * ROUTES
 */

app.use(CameraRoutes)
app.use(ConfigRoutes)
app.use(SiteRoutes)

app.listen(process.env.SERVER_PORT | 3000, () => {
  console.log(`Server running at http://localhost:${process.env.SERVER_PORT | 3000}`)
})

/**
 * WEBSOCKET
 */
// wss.on('connection', handleConnection)
