const express = require('express');
const fetch = require('isomorphic-fetch');
const cors=require('cors')
const app = express();
const cities = require('./cities');

app.use(cors());

const params={
    peakpower: 3.5,
    loss: 14,
    optimalinclination: 1,
    optimalangles: 1,
    outputformat: 'json',
    raddatabase: 'PVGIS-SARAH',
    pvtechchoice: 'crystSi',
    mountingplace: 'free',
    fixed: 1
}


function getData(city){
app.get(`/api/data/${city}/:peakpower/:optimalInclination/:optimalAngles/:angle/:aspect`, async (req, res) => {
  try {
    const { lat, lon } = cities[city];
    const peakpower = req.params.peakpower;
    const angle = req.params.angle;
    const aspect = req.params.aspect;
    const optimalInclination=req.params.optimalInclination;
    const optimalAngles=req.params.optimalAngles;

    const response = await fetch(`https://re.jrc.ec.europa.eu/api/v5_3/PVcalc?lat=${lat}&lon=${lon}&peakpower=${peakpower}&loss=14&optimalinclination=${optimalInclination}&optimalangles=${optimalAngles}&outputformat=json&raddatabase=PVGIS-SARAH3&pvtechchoice=crystSi&mountingplace=free&fixed=1&angle=${angle}&aspect=${aspect}`);
    if (!response.ok) {
      throw new Error('Network response was not OK');
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred' });
  }
})
}

Object.keys(cities, params).forEach(city => {
    getData(city);
  });
  
  app.listen(5000, () => {
    console.log(`Server running at http://192.168.56.1:5000/`);
  });