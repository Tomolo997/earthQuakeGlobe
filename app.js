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

const canvas = document.querySelector('canvas');
canvas.style.width = '10px';
console.log(canvas);
