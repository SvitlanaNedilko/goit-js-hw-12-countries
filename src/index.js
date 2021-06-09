import './sass/main.scss';
import debounce from 'lodash.debounce';
import { alert } from '@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import CountryInfoMarkUp from './templates/country-info-markup.hbs';
import ListItemMarksup from './templates/countries-list-marksup.hbs';
import fetchCountries from './fetch-countries';

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

  fetchCountries(searchQuery)
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
  return countries.map(ListItemMarksup);
}

function renderInfo(list) {
  if (list.length === 1) {
    const listMarksUp = CountryInfoMarkUp(list[0]);
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
