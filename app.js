// Gen random data
const N = 3000;
const gData = [...Array(N).keys()].map(() => ({
  lat: (Math.random() - 0.5) * 180,
  lng: (Math.random() - 0.5) * 360,
  size: Math.random() / 3,
  color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)],
}));

console.log(gData);
Globe()
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
  .pointsData(gData)
  .pointAltitude('size')
  .pointColor('color')(document.getElementById('globeViz'));

//get earthquake data
