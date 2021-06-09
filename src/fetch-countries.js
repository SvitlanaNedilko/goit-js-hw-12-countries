function fetchCountries(searchQuery) {
  return fetch(`https://restcountries.eu/rest/v2/name/${searchQuery}`)
    .then(r => {
      if (!r.ok) {
        throw Error();
      }
      return r.json();
    })
    .then(list => {
      return list;
    });
}

export default fetchCountries;
