import React, { Component } from 'react';
import './App.css';
import InfoComponent from "./InfoComponent.js";

function ShellyCard (props) { 
  return ( 
    <div className="card" key={props.name}>
    <button className="card-header">
      #{props.name}
    </button>
    <InfoComponent value={props}/>    
    </div>    
    );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state =  {
      data: [{"addresses ":'[Info]',"name":'Shelly Device'}],
      items:[]
    }    
  }

  getBackendData = async () => {
    const response = await fetch('/express_backend');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message) 
    }
    return body;
  };  

  RefreshShellyList()  {  
    this.getBackendData()
    .then(res => this.setState({ data: res.express }))
    .catch(err => console.log(err));
  }

  componentDidMount() {
    this.RefreshShellyList();
  }

  handleClick(e) {
    this.RefreshShellyList();
  }

  render() {
    return (
      <div className="container">
        <div className="jumbotron">
          <h1 className="display-4">Shelly summer challenge</h1>
        </div>
        {this.state.items.map.call(this.state.data,ShellyCard)}
        <button onClick={this.handleClick.bind(this)}>
          Refresh list
        </button>
        </div>
    );
  }
}
export default App;