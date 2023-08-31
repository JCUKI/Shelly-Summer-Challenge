const express = require('express');
var bonjour = require('bonjour')()

var servedObjects = []

function discoverDevices() {
  bonjour.publish({ name: 'My Web Server', type: 'http', port: 1234 })

  bonjour.find({ type: 'http' }, function (service) {
    if (service["name"].includes("shelly")){
      console.log('Found an HTTP server:', service)
      servedObjects.push(service);
    }
  });
}

function createGetRoute(app) {
  app.get('/express_backend', (req, res) => {
    res.send({ express: servedObjects});
  });  
}

function runExpressServer() {
  const app = express();
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Listening on port ${port}`));
  createGetRoute(app);
}

discoverDevices();
runExpressServer();