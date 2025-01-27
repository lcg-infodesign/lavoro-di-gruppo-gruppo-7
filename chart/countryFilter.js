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
      // rappresentazione dei dati f(x) = sqrt(2) --> rende più simili i valori più grandi (https://it.wikipedia.org/wiki/Radice_quadrata)
      // utile per migliorare la visualizzazione dei dati della nua 
      // in quanto presenta una distribuzione molto sbilanciata con la maggior parte dei valori molto piccoli (mediana di 0.6) e alcuni estremamente grandi (massimo di 854.9)

      const dGlyph = Math.sqrt(map(iNua, minNua, maxNua, 50, 8000));
      if ((yr === year) && (iCohd != 0) && (iPua != 0) && (iNua != 0)) { // Se l'anno corrisponde a quello richiesto
        filteredCountries.push({
          name: tableObj[i].country,
          cohd: tableObj[i].cohd,
          pua: tableObj[i].pua,
          nua: tableObj[i].nua,
          income: tableObj[i].income,
          x: xGlyph,
          y: yGlyph,
          d: dGlyph,
        }); // Aggiungi l'intero oggetto

      }
    }

    return filteredCountries;
  }

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

  //ritornare per il paese selezionato i dati di tutti gli anni 

  focusData() {
    let focusedCountryData = [];
    // cercare nel dataset totale gli elementi che hanno come nome = focusedCountry.name
    // salvare in una variabile che si chiama focusedCountryData
    // Chad {
    //   2019 {cohd nua pua}
    //   2020 {cohd nua pua}
    //   2021 {cohd nua pua}
    //   2022 {cohd nua pua}
    //   }

    //dati per il paese selezionato di tutti e 4 gli anni
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


