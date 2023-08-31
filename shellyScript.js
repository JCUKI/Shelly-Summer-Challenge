const RGBMAX = 255;

ENTSOE_Token = "TOKEN";
GEOAPIFY_Token = "TOKEN";

function getLocation() {
  let sysConfig = Shelly.getComponentConfig("sys");
  return sysConfig.location;
}

function normalizeArray(inputArray, maxValue, newMaxValue) {
    outputArray = [];
    for (let i = 0; i < inputArray.length; i++) { 
        outputArray.push((inputArray[i]/maxValue) * newMaxValue);
    }
    return outputArray;
}

function ShellyChangeLEDColor(RGBArray, brightness, state) {
  let config = {
    "config": {
      "leds": {
        "colors": {
            "switch:0": {}
        }
      }
    }
  };    
  config["config"]["leds"]["colors"]["switch:0"][state] = {"rgb":0, "brightness":0,}
  config["config"]["leds"]["colors"]["switch:0"][state]["rgb"] = RGBArray;
  config["config"]["leds"]["colors"]["switch:0"][state]["brightness"] = brightness;
    
  Shelly.call("PLUGS_UI.SetConfig", config);
}

function loadingBar(percentage) {
  if (percentage === 100) {
    console.log("100% complete", "Shelly initialized!");
  } else {
    console.log(percentage + "% Still loading...");
  }
}

function setInitalLEDColors() {
  RGBArray = [84,13,13];
  RGBArray = normalizeArray(RGBArray ,RGBMAX,100);
  ShellyChangeLEDColor(RGBArray ,100,"off");
  Shelly.call("Switch.set",{'id':0,'on':false});
}

function turnShellyOn() {
  setInitalLEDColors();
  
  let counter = 0;
  let timerHandle = Timer.set(500, true, function() {
    let red = Math.round(Math.random() * RGBMAX );
    let green = Math.round(Math.random() * RGBMAX );
    let blue = Math.round(Math.random() * RGBMAX );
    RGBArray = normalizeArray([red, green, blue],RGBMAX,100);
    ShellyChangeLEDColor(RGBArray, 100,"on");
    
    loadingBar(counter*20);
     
    counter += 1;    
    if (counter > 5) {
      console.log("\n");
      Timer.clear(timerHandle);
      Shelly.call("Switch.set",{'id':0,'on':true});
      printCurrentPrices();
      mainLoop();
    }  
  });
} 

function handleLEDColor(watts) {
  RGBArray = [];

  if (watts > 2000) {
    console.log("Danger!");
    RGBArray = [204,0,0];
  } else if(watts > 1000){
    RGBArray = [204,0,0];
  } else {
    RGBArray = [0,255,255];
  }
  
  RGBArray = normalizeArray(RGBArray,255,100);
  ShellyChangeLEDColor(RGBArray ,100,"on");
}  

function mainLoop() {
  Timer.set(1000, true, function() {
  console.log("main loop");
  
  Shelly.call("Shelly.getstatus", {id: 0},
    function (result, error_code, error_message) {
      let plugPower = result["switch:0"]["apower"];
      handleLEDColor(plugPower);
    });  
     
  });
} 

function printCurrentPrices() {
  //TAKEN FROM https://github.com/Open-Power-System-Data/time_series/blob/master/input/areas.csv
  function CountryToDomain(country) {
    switch(country) {
    case "Bulgaria":
      return "10YCA-BULGARIA-R";
    case "Germany":
      return "10Y1001A1001A83F";
    case "Slovenia":
      return "10YSI-ELES-----O";
    default:
      return "";
    } 
  }
  
  function formatDate(date) {
    let year = date.getUTCFullYear().toString();
    let month = (date.getUTCMonth() +1).toString();
    if (month.length == 1) {
      month = "0" + month;
    }

    let day = date.getUTCMonth().toString();
    if (day.length == 1) {
      day = "0" + day;
    }
    return year + month + day + "0000";
  }

  let locationInfo = getLocation();  
  Shelly.call( //getCurrentCountry
    "HTTP.GET", {
    "url": "https://api.geoapify.com/v1/geocode/reverse?lat=" + locationInfo.lat + 
            "&lon=" + locationInfo.lon + "&type=country&apiKey=" + GEOAPIFY_Token
    }, function getCountry(result) {
        let response = JSON.parse(result.body);
        let country = response["features"][0]["properties"]["country"];
        let domain =  CountryToDomain(country);
        console.log("Country: ", country );
        console.log("Domain: ", CountryToDomain(country), "\n");         
        
        Shelly.call( //getDate
        "HTTP.GET", {
        "url": "https://www.timeapi.io/api/Time/current/zone?timeZone=" + locationInfo.tz
        }, function getDateTime(result) {
             let response = JSON.parse(result.body);
             
             let DateTime = response["dateTime"];
             DateTime = new Date(DateTime .slice(0, 10));
             DateTime = formatDate(DateTime);
             getPriceDocument(Domain, DateTime, DateTime);   
        });
  });
}

let info = Shelly.getDeviceInfo();
console.log("Shelly device info:\n",info,"\n");

turnShellyOn();

function getPriceDocument(Domain, startTime, endTime)
{
  let url = "https://web-api.tp.entsoe.eu/api?";
  let documentType = "A44";
  let periodStart = startTime;//"202308280000";
  let periodEnd = endTime;//"202308290000";
  let In_Domain = Domain;//"10YCZ-CEPS-----N";//DOMAIN
  let Out_Domain = Domain;//"10YCZ-CEPS-----N";  
  
  let fullUrl = url + "securityToken=" + ENTSOE_Token + 
                      "&documentType=" + documentType + 
                      "&periodStart=" + periodStart + "&periodEnd=" + periodEnd + 
                      "&In_Domain=" + In_Domain + "&Out_Domain=" + Out_Domain;

  Shelly.call("HTTP.GET", {"url": fullUrl }, function(result) {
    console.log(result.body)
  });
}