// Gen random data
// const N = 30;
// const gData = [...Array(N).keys()].map(() => ({
//   lat: (Math.random() - 0.5) * 180,
//   lng: (Math.random() - 0.5) * 360,
//   size: Math.random() / 3,
//   color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)],
// }));

//get earthquake data

//get data
async function getData(startTime, endTime) {
  const res = await fetch(
    'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2020-12-25&endtime=2021-01-21'
  );
  const data = await res.json();
  console.log(data);
  return data;
}
//fill out the state with this data =>

const dataObject = [];

async function stateFill() {
  const data = await getData();
  for (let i = 0; i < data.features.length; i++) {
    const element = data.features[i];
    dataObject.push({
      lng: element.geometry.coordinates[0],
      lat: element.geometry.coordinates[1],
      magnitude: element.properties.mag,
      title: element.properties.place,
      time: element.properties.time,
      size: element.properties.mag / 10,
      color: [
        'rgb(21, 255, 0)',
        'rgb(10, 119, 0)',
        'rgb(168, 0, 0)',
        'rgb(88, 0, 0)',
        'rgb(0, 0, 0)',
      ][getNumber(element.properties.mag)],
    });
  }
  console.log(dataObject);
  return dataObject;
}

async function occupyTheGlobe() {
  const dataObject = await stateFill();
  Globe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
    .pointsData(dataObject)
    .pointAltitude('size')
    .pointColor('color')(document.getElementById('globeViz'));
}

function init() {
  occupyTheGlobe();
}
init();

//color line based on equations
// mag from 1-10
// 1-3 => rgb  rgb(250, 174, 174)
// 3-5 => rgb  rgb(255, 132, 132)
// 5-7 => rgb   rgb(255, 0, 0);
// 7-9 => rgb  rgb(155, 0, 0);
// 9 => rgb  rgb(0, 0, 0);
function getNumber(size) {
  if (size < 3) {
    return 0;
  } else if (size >= 3 && size < 5) {
    return 1;
  } else if (size >= 5 && size < 7) {
    return 2;
  } else if (size >= 7 && size < 9) {
    return 3;
  } else if (size > 9) {
    return 4;
  }
}

//generate the predisposed
