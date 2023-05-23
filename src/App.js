import React, { useState, useEffect } from 'react';
import {ReactComponent as Romania} from './romania.svg';
import './App.css';
import solar_panel from './media/solar-panel.png';


function App() {
  
const [show, setShow]= useState(false);
const [city,setCity]=useState('');
const [lastCityId, setLastCityId] =useState('Ilfov')
const [peakpower,setPeakpower]=useState(0);
const [optimalInclination,setOptimalInclination]=useState('1')
const [optimalAngles,setOptimalAngles]=useState('1')
const [angle,setAngle]=useState('0');
const [aspect,setAspect]=useState('0');
const [optimal, setOptimal]=useState(true);
const [custom, setCustom]=useState(false);
const [showWarning, setShowWarning]=useState(false);
const [showWarning2, setShowWarning2]=useState(false);
const [loading, setLoading]=useState(false);

const [monthly,setMonthly]=useState([]);
const [annual,setAnnual]=useState('');


const url = `http://localhost:5000/api/data/${city}/${peakpower}/${optimalInclination}/${optimalAngles}/${angle}/${aspect}`;

async function fetchData() {
  try {
    setLoading(true);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
   
   console.log(data);
   const annual_energy=data.outputs.totals.fixed.E_y;
   const slope=data.inputs.mounting_system.fixed.slope.value;
   const azimuth=data.inputs.mounting_system.fixed.azimuth.value;
   const monthlyList=data.outputs.monthly.fixed;
    
   setAnnual(annual_energy);
   setAngle(slope);
   setAspect(azimuth);
   setMonthly(monthlyList);

  } catch (error) {
    console.error(error);
  }
  setLoading(false);
}

const handleSelect=(event)=>{
  if(event.target.id)
  {setCity(event.target.id);
  
    const lastElement=document.getElementById(lastCityId);
    const element = document.getElementById(event.target.id);
  
    element.style.fill = '#fa4b0bfa';
    lastElement.style.fill='rgba(59, 5, 57, 0.164)';

    setLastCityId(event.target.id);
  }
    
}

const handleInputs = (event) => {
  const { name, value } = event.target;

  if (name === 'peakpower') {
    if (value === '' || isNaN(value)){
      setPeakpower('');
    }
    else
    {
      setPeakpower(parseFloat(value));
    }
  }
   else if (name === 'angle-input') {
    setAngle(value);
  } else if (name === 'aspect-input') {
    setAspect(value);
  }
};

const handleCustom=()=>{
  setCustom(true);
  setOptimal(false);
  setOptimalInclination('0')
  setOptimalAngles('0')
}

const handleOptimal=()=>{
  setCustom(false);
  setOptimal(true);
  setOptimalInclination('1')
  setOptimalAngles('1')
}

const handleShow=async()=>{

  if(peakpower>0&&city!=''){
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

const handleBack=()=>{
  
  setShow(false);
  setShow(false);
  setPeakpower(0);
  setOptimalInclination('1');
  setOptimalAngles('1');
  setAngle('0');
  setAspect('0');
  setOptimal(true);
  setCustom(false);
  setShowWarning(false);
  setShowWarning2(false);
}



const Results=()=>{

  const monthNames= ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  return(
  <div className="results">
    <div className="summar-results">
      <div className="annual-energy">Annual PV energy production: {annual} kWh</div>
      <div className="Inclination angle:">Optimal inclination angle:{angle}°</div>
      <div className="Azimuth:">Optimal azimuth: {aspect}° (0°  - South)</div>
      <button className="back" onClick={handleBack}>Back</button>
    </div>  
    
    <div className="monthly-results">
        {monthly.map(item => (
        <div key={item.month}>
        <p>{monthNames[item.month-1]}: {item.E_m}</p>
        </div>
        ))}
    </div>
  </div>
  )
}

const Loading=()=>{
  return <span class="loader"></span>
}
 console.log('peak',peakpower)

  return (
    <div className="App">
        <Romania className="map" onClick={handleSelect}/>
        {show&&!loading?<Results/>:
          (<div className="data-panel">
          <div>
          <i class='fas fa-map-marker-alt' style={{ fontSize: '32px' }}></i>
          <span className="location">Location</span>
          </div>
          {city?<span className="city">{city}, Romania</span>:<span className="pick-message"> Pick a location on map!</span>}
          <span className="description">The location will be used to estimate the annual sun exposure (solar radiation).</span>

          <div className="optimal-custom">
              <button className="option-button" onClick={handleCustom}>Custom</button>
              <button className="option-button" onClick={handleOptimal}>Optimal</button>
          </div>

          <span className="peakpower">Installed peak PV power[kW]: <input className="user-input" type="text"
              name="peakpower"
              value={peakpower}
              onChange={handleInputs}></input></span>
          
          <img src={solar_panel}></img> 
            {
              custom?(
              <div className="custom-inputs">
                  <span>Inclination:<input className="user-input inclination" type="text"
                        name="angle-input"
                        value={angle}
                        onChange={handleInputs}></input>°</span>
                        
                  
                  <span>Azimuth:<input className="user-input azimuth" type="text"
                        name="aspect-input"
                        value={aspect}
                        onChange={handleInputs}></input>°</span>
                  
              </div>)
              :
              ''
             }

            <button className="show-results" onClick={handleShow}>View results</button>
            {showWarning?<Warning/>:''}
            {showWarning2?<Warning2/>:''}
            {loading?<Loading/>:''}

          </div>)
        }
                  
        
    </div>
  );
}

export default App;
