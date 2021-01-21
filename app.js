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
    'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-01-20&endtime=2021-01-21'
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
  return dataObject;
}
let latn = 122;
let lngt = 122;
let altitude = 2;
async function occupyTheGlobe() {
  const dataObject = await stateFill();
  Globe()
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-day.jpg')
    .pointsData(dataObject)
    .pointAltitude('size')
    .pointColor('color')(document.getElementById('globeViz'))
    .pointOfView({ latn, lngt, altitude }, [100]);
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
const navigation = document.querySelector('.navigaton');
//generate the predisposed
async function generateCards() {
  const dataObject = await stateFill();
  console.log(dataObject);
  let html = dataObject
    .map((el) => {
      return `<div class="card">
    <div class="card__where">Where: <span class="span__where">${el.title}</span></div>
    <div class="card__when">When: <span class="span__when">${el.time}</span></div>
    <div class="card__mag">Magnitude: <span class="span__mag">${el.magnitude}</span></div>
    <span class="card__lat">${el.lat}</span>
    <span class="card__lng">${el.lng}</span>
  </div>`;
    })
    .join('');
  navigation.insertAdjacentHTML('afterbegin', html);
}
generateCards();

async function getClicked(params) {
  const cardsData = await generateCards();
  const cards = document.querySelectorAll('.card');

  console.log(cards);
  cards.forEach((el) =>
    el.addEventListener('click', function (e) {
      const cardDiv = e.target.closest('.card');
      const children = Array.from(cardDiv.children);
      let lat123 = children[children.length - 2];
      let lng123 = children[children.length - 1];
      console.log(lat123.textContent, lng123.textContent);
    })
  );
}
getClicked();
