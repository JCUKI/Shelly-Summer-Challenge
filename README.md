# Shelly-Summer-Challenge

## Usage
Open a command prompt and navigate to the Shelly-Summer-Challenge directory.

Type this command to install the dependencies for the server:
```
npm install
```

Start Express server at port 5000:
```
node server.js
```
Available at:
```
http://localhost:5000/express_backend
```
Open a command prompt and navigate to the client directory.
Type this command to install the dependencies for the client application:
```
npm install
```

Start client application:
```
cd client
npm start
```
Available at
```
http://localhost:3000/
```

## Script for Shelly devices
1. Gets device info using RPC method *Shelly.getDeviceInfo*
1. Sets initial LED colors of the Shelly device (method *Shelly.getDeviceInfo*)
1. Waits for the Shelly device to fully "initialize" and displaying this via random colors (first timer in method *turnShellyOn*)
1. Printing current Electricity prices by using External Services:
* [geoapify](https://www.geoapify.com/)
* [timeapi](https://timeapi.io/)
* [entsoe api](https://www.entsoe.eu/)
5. Checking power and changing LED color accordingly (*handleLEDColor*)

## Web Interface

### Server application
1. Using Bonjour mDNS discovery service to find Shelly devices in the local network
1. Serving found data to the client by using Expres server
![Screenshot of server.](/Images/ServerScreenshot.JPG "Screenshot of server")

### Client application
1. Fetching device info from Expres server (*getBackendData* in *App.js*)
1. Refreshing list of devices (*RefreshShellyList* in *App.js*)
1. Obtaining device status by using Shelly Cloud service (*ShellyStatus.js*)
1. Using custom component (*InfoComponent*) to hide or show status for selected Shelly device
1. Refreshing status by using *setInterval* function

![Screenshot of client app.](/Images/ClientScreenShot.JPG "Screenshot of client app")