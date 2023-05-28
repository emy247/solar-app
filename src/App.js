import React, { useState } from 'react';
import {ReactComponent as Romania} from './romania.svg';
import './App.css';
import solar_panel from './media/solar-panel.png';
import './results.css';
import sun from './media/sun.png';




function App() {
  
const [show, setShow]= useState(false);
const [city,setCity]=useState('');
const [lastCityId, setLastCityId] =useState('SatuMare')
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
const [total,setTotal]=useState('0');
const [maxMonth,setMaxMonth]=useState();

const url = `https://jelly-iced-parallelogram.glitch.me/api/data/${city}/${peakpower}/${optimalInclination}/${optimalAngles}/${angle}/${aspect}`;

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
   const total_loss=data.outputs.totals.fixed.l_total;
   
   setAnnual(annual_energy);
   setAngle(slope);
   setAspect(azimuth);
   setMonthly(monthlyList);
   setTotal(total_loss*(-1))
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

const handleBack=()=>{
  setCity('')
  setLastCityId('SatuMare')
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
  setMonthly([]);
  setAnnual('');
  setTotal('0');
  setMaxMonth();
}




const Results=()=>{

  const monthNames= ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  
  const panelInclination=90+angle;
  const barInclination={'--bar-inclination':`rotate(${panelInclination}deg)`};
  
  setMaxMonth(Math.max(...monthly.map(obj => obj.E_m)));

  return(

  <div className="results">
    
    <div className="results-title">Results analysis</div>
    <button className="show-results back" onClick={handleBack}>Back</button>

    <div className="location-output">
        <i className='fas fa-map-marker-alt out' style={{ fontSize: '32px' }}></i>
        <div className="city-output">Location: {city}, Romania</div>
    </div>

    <div className="system-output">
        <i className='fa fa-bolt' style={{ fontSize: '40px' }}></i>
        <div className="peak-output">System capacity:<span className="peak-value">{peakpower}kW</span></div>
    </div>
    
     
    <div className="info">

     <div className="annual-energy-title">Annual PV energy production</div>
     <div className="annual-energy">
        
        <div className="annual-energy-output">{annual} kWh</div>
        <div className="annual-energy-circle">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="9rem" height="9rem">
            <defs>
                <linearGradient id="GradientColor">
                  <stop offset="0%" stop-color="#FF4500" />
                  <stop offset="100%" stop-color="#f0811a" />
                </linearGradient>
            </defs>
            <circle id="loadingCircle" cx="70" cy="70" r="60" stroke-linecap="round" />
          </svg>
        </div>       
    </div>
      
    
    
    <div className="panel-animation">
        <img className="sun" alt="" src={sun}></img>
        <div className="blue-bar" style={barInclination}></div>
        <div className="gray-bar"></div>
        <div className="brown-bar"></div>
        <div className="support-bar"></div>
    </div>  

    <ul className="outputs">
        <li className="inclination1:">Inclination: <span className="output-angle inc">{angle}°</span></li>
        <li className="azimuth1:">Azimuth: <span className="output-angle azi">{aspect}°</span></li>
        <li className="total-loss1:">Total system loss: <span className="output-angle tot">{total}%</span></li>
    </ul>

    </div>
    
    <div className="monthly-results">
    
        {monthly.map(item => {
          
          const barHeight=25-item.E_m/maxMonth*25;
          const bar={'--bar-height':`${barHeight}rem`};
          
          return( 
          <div  key={item.month}>
           
          <div className="month-outputs" style={{'color':'rgba(255, 255, 255, 0)'}}>{item.E_m}kW</div>
          <div className="month-diagram-empty"><div className="month-output">{item.E_m}kWh</div></div>
          <div className="month-diagram" style={bar}><p className="month-name">{monthNames[item.month-1]} </p></div>
          
          
          </div>)      
         })}
    </div>
  </div>
  )
}

const Loading=()=>{
  return <span className="loader"></span>
}


  return (
    <>
        
        {show&&!loading?<Results/>:
        (<div className="App" >

          <Romania className="map" onClick={handleSelect}/>

           <div className="data-panel">
              <div>
                <i className='fas fa-map-marker-alt' style={{ fontSize: '32px' }}></i>
                <span className="location">Location</span>
              </div>

              {city?<span className="city">{city}, Romania</span>:<span className="pick-message"> Pick a location on map!</span>}
              <span className="description">The location will be used to estimate the annual sun exposure (solar radiation).</span>

              <div className="optimal-custom">
                  <button className={`option-button ${!optimal?'active':''}`} onClick={handleCustom}>Custom</button>
                  <button className={`option-button ${optimal?'active':''}`}  onClick={handleOptimal}>Optimal</button>
              </div>

              <span className="peakpower">Installed peak PV power [kW]: <input className="user-input" type="text"
                  name="peakpower"
                  value={peakpower}
                  onChange={handleInputs} onClick={handleRemoveValue}></input>
              </span>
              
              <img src={solar_panel} alt=""></img> 

                {
                  custom?(
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
