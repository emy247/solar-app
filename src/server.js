const express = require('express');
const fetch = require('isomorphic-fetch');
const cors=require('cors')
const app = express();

app.use(cors());

const cities = {
    Alba: { lat: 46.0711, lon: 23.5806 },
    Arad: { lat: 46.1667, lon: 21.3167 },
    Arges: { lat: 44.8600, lon: 24.8672 },
    Bacau: { lat: 46.5710, lon: 26.9132 },
    Bihor: { lat: 47.0667, lon: 21.9333 },
    BistritaNasaud: { lat: 47.1333, lon: 24.4833 },
    Botosani: { lat: 47.7486, lon: 26.6592 },
    Brasov: { lat: 45.6555, lon: 25.6108 },
    Braila: { lat: 45.2719, lon: 27.9576 },
    Buzau: { lat: 45.1564, lon: 26.8065 },
    CarasSeverin: { lat: 45.3000, lon: 22.3667 },
    Calarasi: { lat: 44.2000, lon: 27.3333 },
    Cluj: { lat: 46.7833, lon: 23.6167 },
    Constanta: { lat: 44.1769, lon: 28.6532 },
    Covasna: { lat: 45.8564, lon: 26.0742 },
    Dambovita: { lat: 44.9333, lon: 25.4500 },
    Dolj: { lat: 44.3167, lon: 23.8000 },
    Galati: { lat: 45.4257, lon: 28.0319 },
    Giurgiu: { lat: 43.9000, lon: 25.9667 },
    Gorj: { lat: 45.0000, lon: 23.0000 },
    Harghita: { lat: 46.5000, lon: 25.0000 },
    Hunedoara: { lat: 45.7500, lon: 22.9000 },
    Ialomita: { lat: 44.5000, lon: 27.4167 },
    Iasi: { lat: 47.1667, lon: 27.6000 },
    Ilfov: { lat: 44.5000, lon: 26.0000 },
    Maramures: { lat: 47.6667, lon: 24.0000 },
    Mehedinti: { lat: 44.6258, lon: 22.6586 },
    Mures: { lat: 46.5496, lon: 24.5609 },
    Neamt: { lat: 47.2500, lon: 26.5000 },
    Olt: { lat: 44.4333, lon: 24.3667 },
    Prahova: { lat: 44.9500, lon: 26.0167 },
    SatuMare: { lat: 47.8000, lon: 22.8833 },
    Salaj: { lat: 47.2000, lon: 23.0500 },
    Sibiu: { lat: 45.8000, lon: 24},
    Sibiu: { lat: 45.8000, lon: 24.1500 },
    Suceava: { lat: 47.6500, lon: 26.2500 },
    Teleorman: { lat: 43.8000, lon: 24.9500 },
    Timis: { lat: 45.7500, lon: 21.2000 },
    Tulcea: { lat: 45.1667, lon: 28.8000 },
    Vaslui: { lat: 46.6333, lon: 27.7333 },
    Valcea: { lat: 45.1000, lon: 24.3667 },
    Vrancea: { lat: 45.7000, lon: 27.2000 }
};

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

    const response = await fetch(`https://re.jrc.ec.europa.eu/api/v5_2/PVcalc?lat=${lat}&lon=${lon}&peakpower=${peakpower}&loss=14&optimalinclination=${optimalInclination}&optimalangles=${optimalAngles}&outputformat=json&raddatabase=PVGIS-SARAH&pvtechchoice=crystSi&mountingplace=free&fixed=1&angle=${angle}&aspect=${aspect}`);
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
  
  app.listen(port, serverIP, () => {
    console.log(`Server running at http://192.168.56.1:5000/`);
  });