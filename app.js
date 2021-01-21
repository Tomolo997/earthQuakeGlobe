// Gen random data
const N = 30;
const gData = [...Array(N).keys()].map(() => ({
  lat: (Math.random() - 0.5) * 180,
  lng: (Math.random() - 0.5) * 360,
  size: Math.random() / 3,
  color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)],
}));

console.log(gData);

//get earthquake data

//get data
async function getData(startTime, endTime) {
  const res = await fetch(
    'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-12-25&endtime=2021-01-21'
  );
  const data = await res.json();
  return data;
}
//fill out the state with this data =>
async function stateFill() {
  const data = await getData();
  const dataObject = [];
  for (let i = 0; i < data.features.length; i++) {
    const element = data.features[i];
    dataObject.push({
      lng: element.geometry.coordinates[0],
      lat: element.geometry.coordinates[1],
      magnitude: element.properties.mag,
      title: element.properties.titlem,
      time: element.properties.time,
      size: element.properties.mag / 10,
      color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)],
    });
  }
  return dataObject;
}

async function occupyTheGlobe() {
  const dataObject = await stateFill();
  Globe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    .pointsData(dataObject)
    .pointAltitude('size')
    .pointColor('color')(document.getElementById('globeViz'));
}

function init() {
  occupyTheGlobe();
}
init();
