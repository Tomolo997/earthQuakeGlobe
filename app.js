// Gen random data
const N = 30;
const gData = [...Array(N).keys()].map(() => ({
  lat: (Math.random() - 0.5) * 180,
  lng: (Math.random() - 0.5) * 360,
  size: Math.random() / 3,
  color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)],
}));

console.log(gData);
Globe()
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
  .pointsData(gData)
  .pointAltitude('size')
  .pointColor('color')(document.getElementById('globeViz'))
  .showAtmosphere(false);
//get earthquake data

//get data
async function getData() {
  const res = await fetch(
    'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=2014-01-02'
  );
  const data = await res.json();
  console.log(data);
}
getData();
