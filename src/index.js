import './sass/main.scss';
import debounce from 'lodash.debounce';
import { alert } from '@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

const searchEl = document.querySelector('[data-attribut=search-area]');
const countryListEl = document.querySelector('.country-list');
const countryInfoEl = document.querySelector('.country-info');

searchEl.addEventListener('input', debounce(onSearchCountries, 500));

function onSearchCountries(event) {
  const searchQuery = event.target.value;
  clearElements();

  if (searchQuery === '') {
    return;
  }

  fetch(`https://restcountries.eu/rest/v2/name/${searchQuery}`)
    .then(r => {
      if (!r.ok) {
        throw Error();
      }
      return r.json();
    })
    .then(renderInfo)
    .catch(error => {
      alert({
        text: 'No countries found!',
        type: 'error',
        delay: 1500,
      });
    });
}

function createListItemMarksup(countries) {
  return countries.map(({ name }) => {
    return `
    <li class="gallery__item">
    ${name}
    </li>
    `;
  });
}

function createCountryInfoMarkUp({ name, capital, population, languages, flag }) {
  return `
  <h1 class="country-item">${name}</h1>
  <div class="info-container">
  <div>
  <p class="country-title"><span>Capital: </span>${capital}</p>
  <p class="country-title"><span>Population: </span>${population}</p>
  <p class="country-title"><span>Languages: </span></p>
  <ul>${languages.map(({ name }) => `<li >${name}</li>`)}</ul>
  </div>
  <img class="country-flag"src='${flag}' alt='${name}'>
  </div>
  `;
}

function renderInfo(list) {
  if (list.length === 1) {
    const listMarksUp = createCountryInfoMarkUp(list[0]);
    countryInfoEl.insertAdjacentHTML('beforeend', listMarksUp);
  } else if (list.length > 1 && list.length <= 10) {
    const listMarksUp = createListItemMarksup(list);
    countryListEl.insertAdjacentHTML('beforeend', listMarksUp.join(''));
  } else {
    alert({
      text: 'Too many matches found, Please enter a more specific query!',
      type: 'error',
      delay: 1500,
    });
  }
}

function clearElements() {
  countryInfoEl.innerHTML = '';
  countryListEl.innerHTML = '';
}
