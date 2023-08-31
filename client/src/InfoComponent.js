import React, { useState, useEffect } from "react";
import ShellyStatus from "./ShellyStatus.js";

export default function InfoComponent(props, { children }) {
  let ShellyStatusObject = new ShellyStatus(props.value);
  
  const [visible, setVisibility] = useState();

  function toggleVisibility() {
    setVisibility(!visible);
  }
  var buttonText = visible ? "Hide info" : "Info";
  const [statusItem, initStatus] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
    ShellyStatusObject.getDeviceStatus()
      .then((res) => {
        initStatus(res.data.device_status["switch:0"])
      })
      .catch((e) => {
        console.log(e.message)
      })
    }, 1000);


    return () => clearInterval(interval);
  }, [])

  return (
    <div className="component-container">
      {visible && (
        <div className="card-body">
          <p className="card-text">{"Power: " + JSON.stringify(statusItem["apower"]) + " W"}</p>
          <p className="card-text">{"Voltage: " + JSON.stringify(statusItem["voltage"]) + " V"}</p>
          <p className="card-text">{"Current: " + JSON.stringify(statusItem["current"]) + " A"}</p>

          <p className="card-text">{"Temperature: " + JSON.stringify(statusItem["temperature"]["tC"]) + " °C"}</p>
        </div>        
      )}
      <button onClick={toggleVisibility}>{buttonText}</button>
    </div>
  );
}