# Cost and Unaffordability of a Healthy Diet

Il progetto _Cost and Unaffordability of a Healthy Diet_ ha l’obiettivo di evidenziare le difficoltà, sia economiche che pratiche, nell’accesso a una dieta sana, un fenomeno spesso invisibile.  

Perché fare luce su questa problematica è fondamentale?  
Una dieta sana è essenziale per la salute globale, la prevenzione di malattie e la riduzione delle disuguaglianze sociali. Sensibilizzare e rendere visibile questo fenomeno permette di agire in modo mirato per un futuro più equo e sostenibile, nel rispetto degli Obiettivi di Sviluppo Sostenibile dell’Agenda 2030.  

La visualizzazione prende in considerazione gli anni dal 2019 al 2022, periodo in cui la pandemia di Covid-19 ha aggravato la situazione economica a livello mondiale, con conseguenze sull’accessibilità ad un’alimentazione sana.  

### Modalità di visualizzazione  

Al fine di rendere possibile un confronto visivo immediato tra i valori associati ai paesi presi in considerazione, è stata scelta una tipologia di rappresentazione _bubble chart_. In questo modo ogni elemento visivo inserito nel piano cartesiano comunica le seguenti informazioni:  
- la posizione rispetto all’asse delle ascisse rivela il costo associato ad una dieta sana per persona al giorno (CoHD) convertito in dollari internazionali per parità di potere d’acquisto  
- la posizione rispetto all’asse delle ordinate mostra il valore della percentuale di inaccessibilità (PUA) della popolazione di un dato paese ad una dieta sana  
- la dimensione permette di visualizzare il numero di persone, espresso in milioni, senza accesso a una dieta sana (NUA)  
- il colore raggruppa i paesi presenti nel dataset in quattro categorie in base livello di reddito (income).

Nella schermata di dettaglio di ogni paese, a cui si accede selezionando il paese dal grafico principale, sono mostrati i dati in modo da rendere possibile il paragone tra CoHD, PUA, NUA nel corso dei quattro anni presi in analisi, al fine di valutarne l’andamento nel tempo.  

### Scelte progettuali  

- Narrazione iniziale per introdurre il tema scelto e comunicare il contesto in cui opera la visualizzazione.  
- Ogni paese è rappresentato come una “macchia” di colore sfumata, a cui è applicata una texture (grana) per richiamare la tematica alimentare in modo evocativo.  
- La legenda evidenzia la relazione tra colori e livelli di reddito, in modo da agevolare la comprensione del grafico da parte dell’utente.  
- I paesi con dati mancanti (No Data) sono rappresentati da un elemento visivo di colore grigio e posizionati esternamente al grafico principale.  
- Per rendere la visualizzazione accessibile e fruibile a più persone, è stata scelta la lingua inglese, utilizzata anche nel dataset di riferimento.  
- Il nome del progetto fa riferimento al titolo del dataset _Cost and Affordability of a Healthy Diet (CoAHD)_ realizzato da FAOSTAT, ma sostituisce il termine affordability, ovvero accessibilità, con unaffordability: inaccessibilità. Infatti, la visualizzazione proposta vuole mettere in evidenza la reale difficoltà nell’accesso ad un’alimentazione sana.  

### Fonti  

La _Food and Agriculture Organization_ (FAO) è un’agenzia specializzata delle Nazioni Unite che guida gli sforzi internazionali per garantire un accesso regolare ad una quantità di cibo sufficiente per condurre una vita sana e attiva. La visualizzazione si basa sul dataset _Cost and Affordability of a Health Diet_ (CoAHD) realizzato da FAOSTAT, il database statistico globale della FAO, accessibile attraverso questo link: [https://www.fao.org/faostat/en/#data/CAHD](https://www.fao.org/faostat/en/#data/CAHD)  

### Metodologia progettuale  

In seguito alla selezione del dataset di riferimento, sono stati individuati i parametri più rilevanti per rappresentare in modo efficace il fenomeno scelto per i paesi presenti all’interno della fonte originale.  

Grazie alle funzionalità offerte dal sito Faostat, sono stati scaricati i dati filtrati in base ai valori di interesse, e successivamente unificate le varie tabelle in un unico foglio di calcolo. Il dataset rielaborato risulta essere composto da 6 colonne e 821 righe per un totale di 4926 dati.  

Non è stato possibile rappresentare i paesi con parametri inferiori a 0.1, il cui valore nel dataset originale non è puntuale, ma rappresentato come un intervallo pari a: <0.1.  

Ogni riga del relativo file csv rappresenta un paese, un determinato anno e i relativi valori dei parametri, insieme alla fascia di reddito di appartenenza. La struttura del dataset finale risulta così composta:  
- colonna 1: lista dei paesi (ripetuta quattro volte, una per anno)  
- colonna 2: anno di riferimento (2019, 2020, 2021, 2022)  
- colonna 3: valori del parametro CoHD  
- colonna 4: valori del parametro PUA  
- colonna 5: valori del parametro NUA  
- colonna 6: fascia di reddito assegnata ad ogni paese (low income, lower middle income, upper middle income, high income), indicata nel dataset rielaborato con valori da 1 (low) a 4 (high)  

### Organizzazione del lavoro

Per agevolare la realizzazione del progetto, il team si è così suddiviso i seguenti compiti:  
