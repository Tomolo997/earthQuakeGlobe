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
const lastUpdate = document.querySelector('.lastUpdateSpan');
const date = new Date();
const year = date.getFullYear();
const month = date.getMonth();
const day = date.getDay();
var utc = new Date().toJSON().slice(0, 10);

async function getData(startTime, endTime) {
  const res = await fetch(
    `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2021-1-21&endtime=${utc}`
  );
  const data = await res.json();
  return data;
}
//fill out the state with this data =>
const state = {
  currentPage: 1,
  cardsPerPage: 7,
  dataObject: [],
  pages: 1,
  lastPage: 1,
};
const cardsInObject = 7;
async function stateFill() {
  const data = await getData();
  lastUpdate.textContent = formatTime(data.features[0].properties.updated);
  for (let i = 0; i < data.features.length; i++) {
    const element = data.features[i];
    state.dataObject.push({
      lng: element.geometry.coordinates[0],
      lat: element.geometry.coordinates[1],
      magnitude: Math.abs(element.properties.mag).toFixed(1),
      title: element.properties.place,
      time: formatTime(element.properties.time),
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
  state.pages = Math.floor(state.dataObject.length / state.cardsPerPage);
  return state.dataObject;
}
let latn = 50;
let lngt = 50;
let altitude = 2;
const globeDiv = document.querySelector('#globeViz');
const myGlobe = Globe();
let yea = '';
async function occupyTheGlobe() {
  const dataObject = await stateFill();
  //get todays eqarthquake data-
  const dailyObject = state.dataObject;
  yea = myGlobe(globeDiv)
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
    .pointsData(dailyObject)
    .pointAltitude('size')
    .pointColor('color')(document.getElementById('globeViz'))
    .enablePointerInteraction(true);
}
function init() {
  occupyTheGlobe();
  generateCards(0, 7);
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
const navigation = document.querySelector('.cardsNavigator');
//generate the predisposed
async function generateCards(from, to) {
  const dataObject = await stateFill();

  const DataObject = state.dataObject.slice(0, 7);
  let html = DataObject.map((el) => {
    return `<div class="card">
    <div class="card__where">Where: <span class="span__where">${el.title}</span></div>
    <div class="card__when">When: <span class="span__when">${el.time}</span></div>
    <div class="card__mag">Magnitude: <span class="span__mag">${el.magnitude}</span></div>
    <span class="card__lat">${el.lat}</span>
    <span class="card__lng">${el.lng}</span>
  </div>`;
  }).join('');
  navigation.insertAdjacentHTML('beforeend', html);
  getClicked();

  //setup the 7 cards per page

  //setup the pagination , which page and next and prev
}
async function getClicked() {
  const cards = document.querySelectorAll('.card');
  cards.forEach((el) =>
    el.addEventListener('click', function (e) {
      const cardDiv = e.target.closest('.card');
      const children = Array.from(cardDiv.children);
      let lat123 = children[children.length - 2];
      let lng123 = children[children.length - 1];
      myGlobe.pointOfView(
        {
          lat: Number(lat123.textContent),
          lng: Number(lng123.textContent),
          altitude: 1,
        },
        [1000]
      );
    })
  );
}

function formatTime(timeStamp) {
  var s = new Date(timeStamp).toLocaleDateString('en-US');
  return s;
}

function SelectProperDate(timeStamp) {
  const todaysDate = utc.split('-').reverse();
  let month = todaysDate[0];
  todaysDate[0] = todaysDate[1][1];
  todaysDate[1] = month;
  const finalDate = todaysDate.join('/');
  return finalDate;
}

function showCards(array) {
  navigation.innerHTML = '';
  //generate the array  that defines
  generateProperCards();
}

function getLengthOfTheArray() {
  const finalDate = SelectProperDate();

  const finalArr = [];
  for (let i = 0; i < state.dataObject.length; i++) {
    const element = state.dataObject[i];
    if (element.time === finalDate) {
      finalArr.push(element);
    }
  }
  //render the pages
  return finalArr.length;
}

function generateProperCards(from, to, array) {
  const DataObject = array.slice(from, to);
  let html = DataObject.map((el) => {
    return `<div class="card">
    <div class="card__where">Where: <span class="span__where">${el.title}</span></div>
    <div class="card__when">When: <span class="span__when">${el.time}</span></div>
    <div class="card__mag">Magnitude: <span class="span__mag">${el.magnitude}</span></div>
    <span class="card__lat">${el.lat}</span>
    <span class="card__lng">${el.lng}</span>
  </div>`;
  }).join('');
  navigation.insertAdjacentHTML('beforeend', html);
  getClicked();
}

const nextPage = document.querySelector('.nextPage');
const prevPage = document.querySelector('.previousePage');
const currentPageOnScreen = document.querySelector('.currentPage');

nextPage.addEventListener('click', function (e) {
  navigation.innerHTML = '';
  state.currentPage++;
  currentPageOnScreen.textContent = state.currentPage;
  if (state.currentPage === 1) {
    generateProperCards(0, 7, state.dataObject);
  } else if (state.currentPage === 0) {
    state.currentPage = state.pages;
    generateProperCards(
      state.currentPage * 7,
      state.currentPage * 7 + 7,
      state.dataObject
    );
  } else if (state.currentPage > state.pages) {
    // če je večje kot pages => se spremeni v 1 in se izriše 1
    state.currentPage = 1;
    currentPageOnScreen.textContent = state.currentPage;
    generateProperCards(0, 7, state.dataObject);
  } else {
    generateProperCards(
      state.currentPage * 7,
      state.currentPage * 7 + 7,
      state.dataObject
    );
  }

  getClicked();
});

prevPage.addEventListener('click', function (e) {
  navigation.innerHTML = '';
  state.currentPage--;
  currentPageOnScreen.textContent = state.currentPage;

  if (state.currentPage === 1) {
    generateProperCards(0, 7, state.dataObject);
  } else if (state.currentPage === 0) {
    state.currentPage = state.pages;
    currentPageOnScreen.textContent = state.currentPage;

    generateProperCards(
      state.currentPage * 7,
      state.currentPage * 7 + 7,
      state.dataObject
    );
  } else if (state.currentPage >= state.pages) {
    //mislim da ni potrebno tega pogoja postaviti
    state.currentPage = 0;
    generateProperCards(
      state.currentPage * 7,
      state.currentPage * 7 + 7,
      state.dataObject
    );
  } else {
    generateProperCards(
      state.currentPage * 7,
      state.currentPage * 7 + 7,
      state.dataObject
    );
  }

  getClicked();
});

const sortMagnitude = document.querySelector('.sortByMagnitude');

sortMagnitude.addEventListener('click', function (e) {
  console.log(e);
  navigation.innerHTML = '';
  state.dataObject = state.dataObject.sort((a, b) => b.magnitude - a.magnitude);
  generateProperCards(0, 7, state.dataObject);
});
