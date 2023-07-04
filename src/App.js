import React, { useState } from 'react';
import {ReactComponent as Romania} from './romania.svg';
import './App.css';
import solar_panel from './media/solar-panel.png';
import './results.css';
import location from './media/location.png';
import Results from './results';



function App() {
  
const [show, setShow]= useState(false);
const [city,setCity]=useState('');
const [lastCityId, setLastCityId] =useState('SatuMare')
const [peakpower,setPeakpower]=useState(0);
const [angle,setAngle]=useState(0);
const [aspect,setAspect]=useState(0);
const [optimal, setOptimal]=useState(true);
const [showWarning, setShowWarning]=useState(false);
const [showWarning2, setShowWarning2]=useState(false);
const [loading, setLoading]=useState(false);

const [data,setData]=useState({});

const url = `https://jelly-iced-parallelogram.glitch.me/api/data/${city}/${peakpower}/${Number(optimal)}/${Number(optimal)}/${angle}/${aspect}`;

async function fetchData() {
  try {
    setLoading(true);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const dataAPI = await response.json();
    setData({...dataAPI})
   
  } catch (error) {
    console.error(error);
  }
  setLoading(false);
  
}

const handleSelect=(event)=>{

  if(event.target.id){
    setCity(event.target.id);
    const lastElement=document.getElementById(lastCityId);
    const element = document.getElementById(event.target.id);
    element.style.fill = '#fa4b0bfa';
    lastElement.style.fill='rgba(59, 5, 57, 0.164)';
    setLastCityId(event.target.id);
  }
}

const handleRemoveValue=(event)=>{
  if(event.target.value==='0') 
    event.target.value='';
}

const handleInputs = (event) => {
  const { name, value } = event.target;
    if (name === 'peakpower') {
      if (value === '' || isNaN(value)){
        setPeakpower('');
      }
      else
      {
        setPeakpower(value);
      }
    }
    else if (name === 'angle-input') {
      if(value>180)
        setAngle(180)
      else if(value<0)
        setAngle(0)
      else
        setAngle(value);
      
    }else if (name === 'aspect-input') {
       if(value>180)
        setAspect(180)
      else if(value<0)
        setAspect(0)
      else 
        setAspect(value);
    }
    console.log(url)
   
};


const handleOption=(isOptimal)=>{
  setOptimal(isOptimal);
}

const handleShow=async()=>{

  if(peakpower>0&&city!==''){
    setShow(true)
    await fetchData();
  }
  else if(peakpower===0&&city==='')
  {
    setShowWarning(true)
    setShowWarning2(true)
  }
  else if(peakpower===0)
    setShowWarning(true)
  else if(city==='')
    setShowWarning2(true)

}


const Warning = () => {
  
  return <span>Please introduce the system installed peak power.</span>;

};

const Warning2 = () => {

  return <span>Please select a city.</span>;

};

const Loading=()=>{
  return <span className="loader"></span>
}

const handleBack=()=>{
  setCity('')
  setLastCityId('SatuMare')
  setShow(false);
  setPeakpower(0);
  setAngle(0);
  setAspect(0);
  setOptimal(true);
  setShowWarning(false);
  setShowWarning2(false); 
}

  return (
    <>
        {data&&show&&!loading?<Results data={data} 
                                       handleBack={handleBack} 
                                       peakpower={peakpower} 
                                       city={city} 
                                       angle={angle} 
                                       aspect={aspect} 
                                       optimal={optimal}/>:
        (<div className="App" >
      
           <Romania className="map" onClick={handleSelect}/>

           <div className="data-panel">

              <div>
                <img src={location} alt="" className="location-icon"></img>
                <span className="location">Location</span>
              </div>

              {city?<span className="city">{city}, Romania</span>:<span className="pick-message"> Pick a location on map!</span>}

              <span className="description">
                    The location will be used to estimate the annual sun exposure (solar radiation).
              </span>

              <div className="optimal-custom">
                <button className={`option-button ${!optimal ? 'active' : ''}`} onClick={() => handleOption(false)}>
                  Custom
                </button>
                <button className={`option-button ${optimal ? 'active' : ''}`} onClick={() => handleOption(true)}>
                  Optimal
                </button>
              </div>


              <span className="peakpower">Installed peak PV power [kW]: <input className="user-input" type="text"
                  name="peakpower"
                  value={peakpower}
                  onChange={handleInputs} onClick={handleRemoveValue}></input>
              </span>
              
              <img src={solar_panel} alt=""></img> 

                {
                  !optimal?(
                  <div className="custom-inputs">
                      <span>Inclination:<input className="user-input inclination" type="text"
                            name="angle-input"
                            value={angle}
                            onChange={handleInputs} onClick={handleRemoveValue}></input>°</span>
                            
                      
                      <span>Azimuth:<input className="user-input azimuth" type="text"
                            name="aspect-input"
                            value={aspect}
                            onChange={handleInputs} onClick={handleRemoveValue}></input>°</span>              
                  </div>)
                  :
                  ''
                }
                <button className="show-results" onClick={handleShow}>View results</button>
                {showWarning?<Warning/>:''}
                {showWarning2?<Warning2/>:''}
                {loading?<Loading/>:''}
            
             </div>
          </div>)
        }                
    </>
  );
}

export default App;
