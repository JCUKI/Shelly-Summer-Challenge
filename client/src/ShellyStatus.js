class ShellyStatus
{
    constructor(data) {
        this.ip = data["addresses"];        
        this.auth_key = "auth_key";
        let deviceName = data["name"];

        this.id = deviceName.substring(deviceName.indexOf("-")+1,deviceName.length);
        this.server_uri = "server_uri";

        this.deviceStatusURL = this.server_uri + "/device/status?id=" + this.id + "&auth_key=" + this.auth_key;     
     }

    getData = async () => {
          const response = await fetch(this.deviceStatusURL);
          const body = await response.json();
      
          if (response.status !== 200) {
            throw Error(body.message) 
          }
          return body;
        };  

     getDeviceStatus()
     {        
        let res = this.getData()
        return res;
     }
}
export default ShellyStatus;