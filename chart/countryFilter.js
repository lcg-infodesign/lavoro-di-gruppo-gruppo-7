// classe creata per gestire i valori del singolo paese 
class countryFilter {
  constructor(tableObj, minCohd, maxCohd, minNua, maxNua, x0, xAxes, y0, yAxes) {
    this.tableObj = tableObj;
    this.minCohd = minCohd;
    this.maxCohd = maxCohd;
    this.minNua = minNua;
    this.maxNua = maxNua;
    this.x0 = x0;
    this.xAxes = xAxes;
    this.y0 = y0;
    this.yAxes = yAxes;
  }
  // funzione che ritorna dati di tutti i paesi per l'anno selezionato/visualizzato
  // senza i paesi No Data
  filterCountriesByYear(year) {
    let filteredCountries = [];
    for (let i = 0; i < Object.keys(tableObj).length; i++) {
      const yr = this.tableObj[i].year;
      const iCohd = this.tableObj[i].cohd;
      const iPua = this.tableObj[i].pua;
      // si mappa i valori del cohd dei paesi dallo 0$ al valore 7$ == xAxes
      const iNua = this.tableObj[i].nua;
      const xGlyph = map(iCohd, 0, 7, x0, xAxes);
      const yGlyph = map(iPua, 0, 100, y0, yAxes);
      // rappresentazione dei dati f(x) = sqrt(x) --> rende più uniformi le dimensiondelle "macchie" dei paesi 
      // utile per migliorare la visualizzazione dei dati della NUA (parametro da cui dipende diametro delle "macchie")
      // NUA presenta una distribuzione molto sbilanciata 
      // con la maggior parte dei valori molto piccoli (mediana di 0.6) e alcuni estremamente grandi (massimo di 854.9)
      const dGlyph = Math.sqrt(map(iNua, minNua, maxNua, 50, 8000));
      if ((yr === year) && (iCohd != 0) && (iPua != 0) && (iNua != 0)) {
        filteredCountries.push({
          name: tableObj[i].country,
          cohd: tableObj[i].cohd,
          pua: tableObj[i].pua,
          nua: tableObj[i].nua,
          income: tableObj[i].income,
          x: xGlyph,
          y: yGlyph,
          d: dGlyph,
        });
      }
    }
    return filteredCountries;
  }
  
  // conteggio paesi No Data per l'anno selezionato/visualizzato
  getCountOfCountriesWithoutData(year) {
    let count = 0;
    for (let i = 0; i < Object.keys(tableObj).length; i++) {
      const yr = this.tableObj[i].year;
      const iCohd = this.tableObj[i].cohd;
      const iPua = this.tableObj[i].pua;
      const iNua = this.tableObj[i].nua;
      if ((yr === year) && (iCohd == 0 || iPua == 0 || iNua == 0)) {
        count++;
      }
    }
    return count;
  }
  // ritorna i dati del singolo paese per tutti gli anni 
  focusData() {
    let focusedCountryData = [];
    for (let i = 0; i < Object.keys(tableObj).length; i++) {
      const country = this.tableObj[i].country;
      const yr = this.tableObj[i].year;
      if (selectedCountry != null && country == selectedCountry.name) {
        focusedCountryData.push({
          focusedCountry: country,
          year: yr,
          cohd: tableObj[i].cohd,
          pua: tableObj[i].pua,
          nua: tableObj[i].nua,
          income: tableObj[i].income
        })
      }
    }
    return focusedCountryData;
  }
}


