/*Fetch degli squeal*/
let squeal = []; //Array con gli squeal

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3001/squeals');
        squeal = await response.json();
        console.log(squeal);
        // Aggiorna le card con i dati degli utenti
        updateSqueal(squeal);
    } catch (error) {
        console.error('Errore durante il recupero degli squeal:', error);
    }
});

/* Gestione filtraggio risultati */

document.getElementById("apply-filter").addEventListener("click", function () {
    // Ottiengo i valori dai campi di filtro
    const senderF = document.getElementById("sender-filter").value;
    const receiverF = document.getElementById("receiver-filter").value;
    const dateF = document.getElementById("date-filter").value;

    // Eseguo la funzione di filtro
    filtraSqueal(senderF, receiverF, dateF);
});
function filtraSqueal(sender, receiver, date) {
    const cards = document.querySelectorAll(".card"); // Seleziona tutte le carte degli utenti

    cards.forEach(card => {
        const senderCard = card.querySelector(".card-title").innerText;
        // Creo un array con i destinatari divisi da una virgola
        const receiverCard = card.querySelector('#destinatari').innerText.split(",");

        const dateCard = card.querySelector('#date').innerText;
        console.log(dateCard)
        console.log(date);
        // Controllo se l'utente soddisfa i criteri di filtro
        const senderMatch = sender === "" || senderCard.toLowerCase().includes(sender.toLowerCase());
        let receiverMatch = "";
        let isMatched = false;
        //Controllo se esiste almeno un match con i destinatari 
        for (let i = 0; i < receiverCard.length; i++) {
            receiverMatch = receiver === "" || receiverCard[i].toLowerCase().includes(receiver.toLowerCase());
            if (receiverMatch) {
                isMatched = true;
            }
        }
        const dateMatch = date === "" || dateCard.includes(date);
        console.log(dateMatch)
        // Nascondo o mostro la carta in base ai criteri di filtro
        if (senderMatch && isMatched && dateMatch) {
            card.style.display = "block"; // Mostra la carta
        } else {
            card.style.display = "none"; // Nascondi la carta
        }
    });
}

function updateSqueal(squeal) {
    const container = document.querySelector('#wrapper');
    container.innerHTML = ""; // Resetto il wrapper

    const aggiungiSpazio = () => {
        return squeal.map(squealItem => {
            const destinatari = squealItem.destinatari.join(", "); // Unisco i destinatari con una virgola
            const MAX_LENGTH = 30; // Numero massimo di caratteri
            return squealItem;
        });
    };

    const squealConSpazi = aggiungiSpazio();

    for (let i = 0; i < squeal.length; i++) {
        const squealDate = squeal[i].date.split('T')[0]; // Estrai solo la parte della data

        let textToShow = squeal[i].text;

        // Verifica se il testo supera i 330 caratteri e troncalo se necessario
        if (textToShow.length > 200) {
            textToShow = textToShow.substring(0, 200) + "..."; // Tronca il testo e aggiungi i tre puntini
        }
        container.innerHTML += `
       <div class="card ms-1" id="card-${i}"> <!-- Assumi una altezza fissa per la card -->
        <div class="card-body d-flex flex-column">
          <div class="mb-auto"> <!-- Contenuto della card spinge i bottoni verso il basso -->
            <div class="d-flex justify-content-between">
              <h4 class="card-title fw-bold">${squeal[i].mittente}</h4>
              <span class="justify-content-end">${squealDate}</span>
            </div>
            <h6 class="fw-bold">Receivers:</h6>
            <div class="d-flex align-items-center mb-3">
              <h6 class="card-subtitle" id="destinatari">${squealConSpazi[i].destinatari}</h6>
            </div>
            <p id="squealText-${i}">${squeal[i].bodyImage ? `<img src="${squeal[i].bodyImage}" alt="Squeal Image">` : textToShow}</p>
            ${squeal[i].mapLocation ? `<div id="geolocation-${i}" style="width:100%; height:200px;"></div>` : ''}
          </div>
          <div>
          <p id="squealCategory-${i}">${squeal[i].category}</p>
          </div>
          <!-- I bottoni sono posizionati qui, mantenendo la loro posizione fissa dal basso -->
          <div>
            <div class="d-flex justify-content-between" id="emoticons">
              <div class="d-flex">
                <span class="material-symbols-outlined" >thumb_up</span> <span id="likeSpan-${i}">${squeal[i].emoticonNum.good}</span>
                <span class="ms-2 material-symbols-outlined" >thumb_down</span> <span id="dislikeSpan-${i}">${squeal[i].emoticonNum.bad}</span>
                <span id="impressionSpan-${i}" class="ms-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path
                        d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-.199.02-.393.057-.581 1.474.541 2.927-.882 2.405-2.371.174-.03.354-.048.538-.048 1.657 0 3 1.344 3 3zm-2.985-7c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 12c-2.761 0-5-2.238-5-5 0-2.761 2.239-5 5-5 2.762 0 5 2.239 5 5 0 2.762-2.238 5-5 5z">
                        </path>
                    </svg> ${squeal[i].impression}
                </span>
              </div>
              <div class="d-flex justify-content-between" id="modifyBtnFather">
                <button type="button" class="btn btn-dark" id="modificaBtn">Modify Squeal</button>
              </div>
            </div>
          </div>
        </div>
      </div>
        `
    }
    squeal.forEach((item, index) => {
        if (item.mapLocation) {
          createGeoMap(item.mapLocation, 'geolocation-' + index);
        }
      });
}


// Prendo il box che contiene i bottoni
const parentElement = document.getElementById("BtnBox");

parentElement.addEventListener("click", function (event) {
    if (event.target.id == "modificaBtn") {
        // Verifica se l'elemento di destinazione del clic è un pulsante con l'id "modificaBtn"
        const card = event.target.closest(".card"); // Trova la card padre dell'elemento cliccato

        if (card) {
            // Ottieni l'id univoco assegnato direttamente alla card
            const cardId = card.id;
            const cardNumber = getCardNumber(cardId);
            // Chiama la funzione di modifica specifica per la card corrispondente
            console.log(cardNumber)
            ModifyButton(cardId, cardNumber);
        }
    }
});

// Funzione per ottenere il numero della card dalla sua id
function getCardNumber(cardId) {
    // L'id della card è nella forma "card-X", quindi possiamo estrarre il numero dalla fine dell'id
    const cardNumber = cardId.split('-')[1];
    return parseInt(cardNumber);
}

// Funzione per mostrare mappe, mapId è l'id devl div dove si mette la geolocazione
function createGeoMap(geolocation, mapId = null) {
    //check if geolocation.latitude and geolocation.longituted are null
    if (geolocation.lat === null || geolocation.lng === null || mapId === null) {
        return '';
    }

    let map = L.map(mapId, {
        center: [geolocation.lat, geolocation.lng],
        zoom: 13,
        layers: [
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 20,
                attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }),
            L.marker([geolocation.lat, geolocation.lng])
        ]
    }).setView([geolocation.lat, geolocation.lng], 13);



    return map;
}
// Aggiungi un gestore di eventi al pulsante "Modifica"
async function ModifyButton(cardId, cardNumber) {
    
    // Fondamentale per evitare di poter modificare due card contemporaneamente 
    try {
        const response = await fetch('http://localhost:3001/squeals');
        if (!response.ok) {
            // ... (gestione degli errori)
        } else {
            // Aggiorna la lista degli squeal dopo la modifica
            const updatedSquealResponse = await fetch('http://localhost:3001/squeals');
            squeal = await updatedSquealResponse.json();
            updateSqueal(squeal);
            console.log(squeal);
        }
    } catch (error) {
        console.error('Errore durante il recupero degli squeal:', error);
    }
    

    // Seleziono il testo della card che sto modificando e lo mostro per intero 
    let textAll = document.querySelector(`#squealText-${cardNumber}`);
    textAll.innerText = `${squeal[cardNumber].text}`

    // Capisco che card è stata selezionata
    const card = document.getElementById(cardId);

    // Prendo tutti i campi della card
    const modificaBtn = card.querySelector("#modificaBtn");
    let destinatari = card.querySelector("#destinatari");
    const modifyBtnFather = card.querySelector("#modifyBtnFather")
    const mittente = squeal[cardNumber].mittente;

    // Rendi invisibile il pulsante modifica
    modifyBtnFather.removeChild(modificaBtn);

    // Mostra il pulsante "salva modifiche"
    const cardBody = card.querySelector(".card-body");
    const saveChangesBtn = document.createElement("button");
    saveChangesBtn.classList.add("btn");
    saveChangesBtn.classList.add("btn-success");
    saveChangesBtn.innerText = "Save";
    modifyBtnFather.appendChild(saveChangesBtn);

    // Mostra il pulsante "annulla" per annullare le modifiche
    const annullaBtn = document.createElement("button");
    annullaBtn.classList.add("btn");
    annullaBtn.classList.add("btn-warning");
    annullaBtn.classList.add("ms-3");
    annullaBtn.innerText = "Annulla";
    modifyBtnFather.appendChild(annullaBtn);

    // Disabilita impression per fare spazio (tanto non è modificabile)
    impressionSpan = document.getElementById(`impressionSpan-${cardNumber}`);
    impressionSpan.innerHTML = "";

    /*Abilita la modifica dei campi*/

    // Aggiungi un pulsante "+" dinamicamente

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.classList.add('btn', 'add-button', 'fw-bold', 'text-success', 'p-0');
    addButton.innerText = '+';

    // Aggiungi un pulsante "-" dimamicamente 

    const remButton = document.createElement('button');
    remButton.type = 'button';
    remButton.classList.add('btn', 'rem-button', 'fw-bold', 'text-danger', 'p-0', 'ms-4');
    remButton.innerText = '-';

    // Modifica delle reazioni 
    const likeSpan = document.getElementById(`likeSpan-${cardNumber}`)
    const dislikeSpan = document.getElementById(`dislikeSpan-${cardNumber}`)
    const dislike = dislikeSpan.innerHTML;
    let likes = likeSpan.innerHTML;
    likeSpan.innerHTML = `<input id='likeInput' type="number" class="form-control" value="${likes}" min="0">`
    dislikeSpan.innerHTML = `<input id='dislikeInput' type="number" class="form-control" value="${dislike}" min="0">`
    emoticonFlag = true;

    //Array dei destinatari che si vogliono aggiungere 
    const arrayNuoviUtenti = [];

    //Array con gli utenti che verranno aggiungi nel database
    const readytoAdd = [];

    //Array dei destinatari che si vogliono rimuovere
    const arrayUsersToRemove = [];

    //Array con gli utenti che verranno rimossi dal database
    let readytoRemove = [];

    //Booleani per capire se ho aggiunto e/o rimosso utenti dal database
    let addFlag = false;
    let remFlag = false;

    destinatari.parentElement.appendChild(addButton);
    destinatari.parentElement.appendChild(remButton);

    let destinatariAll = squeal[cardNumber].destinatari;
    let modifyR = false;

    // Aggiungi un gestore di eventi al pulsante -
    remButton.addEventListener('click', () => {
        //Rimuovo i bottoni - e + dal div destinatari

        destinatari.parentElement.removeChild(remButton);
        destinatari.parentElement.removeChild(addButton);

        remFlag = true;

        //
        window.addEventListener('keydown', handleEscapeKey);

        // Creo la finestra di sovraimpressione
        const overlay = document.createElement('div');
        overlay.classList.add('overlay-rem');

        // Aggiungo il contenuto della finestra di sovraimpressione
        overlay.innerHTML = `
        <div class="popup">
            <span id="closeNewChannelOverlay" class="close">&times;</span>
            <div class="row-3">
                <div class="fw-bold">Receivers already in:</div>
                <span class="text-break">${destinatariAll}</span>
            </div>
            <div class="row mb-4">
                <div class="mt-2 fw-bold">Receivers you want remove:</div>
                <span id="destinatariRimossi"></span>
            </div>
            <div class="row-3">
                <label for="nuovoDestinatario">Receivers to remove:</label>
                <input class="form-control" type="text" id="nuovoDestinatario">
            </div>
            <div class="text-center">
                <button class="mt-4 btn btn-danger"id="rimuoviDestinatario">Rimuovi</button>
            </div>
        </div>
        `;

        // Aggiungo la finestra di sovraimpressione al body
        document.body.appendChild(overlay);

        const rimuoviDestinatarioButton = overlay.querySelector("#rimuoviDestinatario");
        const chiudiFinestraButton = overlay.querySelector("#closeNewChannelOverlay");
        const destinatariRimossiDiv = overlay.querySelector("#destinatariRimossi");

        // Aggiungo un gestore di eventi al pulsante "Aggiungi" della finestra pop-up
        rimuoviDestinatarioButton.addEventListener('click', async () => {
            // Ottengo il nuovo destinatario da rimuovere
            nuovoDestinatario = overlay.querySelector("#nuovoDestinatario").value;

            // Pulisco il campo input
            overlay.querySelector("#nuovoDestinatario").value = "";

            // Chiamata API per ottenere la lista degli utenti
            try {
                const response = await fetch('http://localhost:3001/users');
                if (!response.ok) {
                    console.log("Errore nella risposta da parte del database")
                } else {
                    // Verifica se il nuovo destinatario è presente nella lista degli utenti
                    if (destinatari.innerHTML.includes(nuovoDestinatario)) {
                        arrayUsersToRemove.push(nuovoDestinatario);
                        destinatariRimossiDiv.innerHTML += `${nuovoDestinatario}`;
                        modifyR = true;
                    }
                    else {
                        alert("L'utente non è presente fra i destinatari")
                    }
                }
            } catch (error) {
                console.error('Errore durante il recupero degli utenti:', error);
            }

            if (modifyR) {
                let toRemove = nuovoDestinatario;
                destinatariAll = destinatariAll.filter(destinatario => destinatario !== toRemove);
            }
           
        });

        //Chiudi la scheda con il tasto esc
        function handleEscapeKey(event) {
            if (event.key === "Escape") {
                //Converto il div destinatari in array 
                let nomi = destinatari.textContent.split(',');

                //nomi.map toglie gli spazi davanti ai nomi mentre il filter seleziona solo gli utenti non rimossi 
                nomi = nomi.map(nome => nome.trim()).filter(nome => !arrayUsersToRemove.includes(nome));

                // Aggiorno il contenuto del div 'destinatari'
                destinatari.textContent = nomi.join(', ');

                for (let i = 0; i < arrayUsersToRemove.length; i++) {
                    readytoRemove[i] = arrayUsersToRemove[i];
                }
                // Azzero arrayUsersToRemove per ulteriori modifiche
                arrayUsersToRemove.length = 0;
                destinatari.parentElement.appendChild(remButton);
                destinatari.parentElement.appendChild(addButton);
                document.body.removeChild(overlay);
                window.removeEventListener('keydown', handleEscapeKey);
            }
        }
        //Chiudi la scheda con il pulsante x
        chiudiFinestraButton.addEventListener('click', () => {
            //Converto il div destinatari in array 
            let nomi = destinatari.textContent.split(',');

            //nomi.map toglie gli spazi davanti ai nomi mentre il filter seleziona solo gli utenti non rimossi 
            nomi = nomi.map(nome => nome.trim()).filter(nome => !arrayUsersToRemove.includes(nome));
            for (let i = 0; i < arrayUsersToRemove.length; i++) {
                readytoRemove[i] = arrayUsersToRemove[i];
            }
            // Aggiorno il contenuto del div 'destinatari'
            destinatari.textContent = nomi.join(', ');
            console.log("readytoremve",readytoRemove);
            // Azzera arrayNuoviUtenti per ulteriori modifiche
            arrayUsersToRemove.length = 0;
            destinatari.parentElement.appendChild(remButton);
            destinatari.parentElement.appendChild(addButton);
            document.body.removeChild(overlay);
            window.removeEventListener('keydown', handleEscapeKey);
        });
    });

    let destinatariAdd = squeal[cardNumber].destinatari;
    let modifyA = false;
 

    // Aggiungi un gestore di eventi al pulsante +
    addButton.addEventListener('click', () => {
        //Rimuovo i bottoni - e + dal div destinatari
        destinatari.parentElement.removeChild(addButton);
        destinatari.parentElement.removeChild(remButton);
        addFlag = true;

        //
        window.addEventListener('keydown', handleEscapeKey);

        // Crea la finestra di sovraimpressione
        const overlay = document.createElement('div');
        overlay.classList.add('overlay-add');


        // Aggiungi il contenuto della finestra di sovraimpressione
        overlay.innerHTML = `
        <div class="popup">
            <span id="closeNewChannelOverlay" class="close">&times;</span>
            <div class="row-3 mb-3">
                <div class="fw-bold">Receivers:</div>
                <span class="text-break" id="destinatariPopup">${destinatariAdd}</span>
            </div>
            <div class="row-3">
                <label for="nuovoDestinatario" aria-label="Username">New Receiver:</label>
                <input class="form-control" type="text" id="nuovoDestinatario">
            </div>
            <div class="text-center">
            <button class="mt-4 btn btn-success" id="aggiungiDestinatario">Add</button>
            </div>
        </div>
        `;

        // Aggiungo la finestra di sovraimpressione al body
        document.body.appendChild(overlay);

        // Aggiungo un gestore di eventi al pulsante "Add" della finestra pop-up
        const aggiungiDestinatarioButton = overlay.querySelector("#aggiungiDestinatario");
        const chiudiFinestraButton = overlay.querySelector("#closeNewChannelOverlay");
        const destinatariDiv = overlay.querySelector("#destinatariPopup");
        console.log(destinatari.innerHTML);
        aggiungiDestinatarioButton.addEventListener('click', async () => {
            // Ottengo il nuovo destinatario
            nuovoDestinatario = overlay.querySelector("#nuovoDestinatario").value;

            // Pulisco il campo input
            overlay.querySelector("#nuovoDestinatario").value = "";

            try {
                // Chiamata API per ottenere la lista degli utenti
                const responseUsers = await fetch('http://localhost:3001/users');
                const userList = responseUsers.ok ? await responseUsers.json() : null;

                // Chiamata API per ottenere la lista dei canali
                const responseChannels = await fetch('http://localhost:3001/channels');
                const channelList = responseChannels.ok ? await responseChannels.json() : null;

                // Verifica se il nuovo destinatario è presente nella lista degli utenti e nei canali
                const isUserValid = userList.some(user => user.username === nuovoDestinatario);
                const isChannelValid = channelList.some(channel => channel.name === nuovoDestinatario);

                if (isUserValid || isChannelValid) {
                    if (nuovoDestinatario !== mittente) {
                        if (!destinatari.innerHTML.includes(nuovoDestinatario)) {
                            arrayNuoviUtenti.push(nuovoDestinatario);
                            destinatariDiv.innerHTML += `, ${nuovoDestinatario} `;
                            modifyA= true;
                            // Se è un canale valido, invia una richiesta all'API per aggiungere lo squeal al canale
                            if (isChannelValid) {
                                const squealId = squeal[cardNumber]._id;
                                await fetch('http://localhost:3001/editChannelSqueal', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        name: nuovoDestinatario,
                                        newSquealId: squealId,
                                    }),
                                });
                            }
                        } else {
                            alert("L'utente è già presente fra i destinatari");
                        }
                    } else {
                        alert("Non puoi inserire come destinatario l'utente stesso");
                    }
                } else {
                    alert("Destinatario non trovato nel database!");
                }
            } catch (error) {
                console.error('Errore durante il recupero dei dati:', error);
            }
            if(modifyA){
                destinatariAdd += ` ${nuovoDestinatario}`;
            }
        });


        //Chiudi la scheda con il tasto esc
        function handleEscapeKey(event) {
            if (event.key === "Escape") {
                window.removeEventListener('keydown', handleEscapeKey);
                for (let i = 0; i < arrayNuoviUtenti.length; i++) {
                    //destinatari.textContent += `, ${arrayNuoviUtenti[i]},`
                    readytoAdd[i] = arrayNuoviUtenti[i];
                }
                // Azzera arrayNuoviUtenti per ulteriori modifiche
                arrayNuoviUtenti.length = 0;
                destinatari.parentElement.appendChild(addButton);
                destinatari.parentElement.appendChild(remButton);
                document.body.removeChild(overlay);
            }
        }
        //Chiudi la scheda con il pulsante chiudi
        chiudiFinestraButton.addEventListener('click', () => {
            for (let i = 0; i < arrayNuoviUtenti.length; i++) {
                destinatari.textContent += `, ${arrayNuoviUtenti[i]},`
                readytoAdd[i] = arrayNuoviUtenti[i];
            }
            // Azzera arrayNuoviUtenti per ulteriori modifiche
            arrayNuoviUtenti.length = 0;
            destinatari.parentElement.appendChild(addButton);
            destinatari.parentElement.appendChild(remButton);
            document.body.removeChild(overlay);
            window.removeEventListener('keydown', handleEscapeKey);
        });
    });

    // Funzione quando clicco il tasto salva modifiche
    saveChangesBtn.addEventListener('click', async () => {
        console.log("readytoremve",readytoRemove);
        // Rimuovo i pulsanti 
        modifyBtnFather.removeChild(saveChangesBtn);
        modifyBtnFather.removeChild(annullaBtn);
        destinatari.parentElement.removeChild(addButton);
        destinatari.parentElement.removeChild(remButton);

        good = document.getElementById('likeInput').value;
        bad = document.getElementById('dislikeInput').value;

        likeSpan.outerHTML = `<span id="likeSpan-${cardNumber}">${good}</span> `
        dislikeSpan.innerHTML =`<span id="dislikeSpan-${cardNumber}">${bad}</span>`

        // Riattivo le impressions 
        impressionSpan = document.getElementById(`impressionSpan-${cardNumber}`);
        impressionSpan.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <path d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-.199.02-.393.057-.581 1.474.541 2.927-.882 2.405-2.371.174-.03.354-.048.538-.048 1.657 0 3 1.344 3 3zm-2.985-7c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 12c-2.761 0-5-2.238-5-5 0-2.761 2.239-5 5-5 2.762 0 5 2.239 5 5 0 2.762-2.238 5-5 5z"></path>
        </svg> ${squeal[cardNumber].impression}`

        // Aggiungo il pulsante modifica
        modifyBtnFather.appendChild(modificaBtn);
        
        // Controllo se ho modificato le emoticon
        if (emoticonFlag) {
            // Chiamata POST all'API per aggiornare i valori nel database
            const   data = {
                    mittente: mittente,
                    idSqueal: squeal[cardNumber]._id,
                    emoticonNum: [good,bad],
            }
            try {
                const response = await fetch('http://localhost:3001/editEmoticonMD', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error(`Errore durante la chiamata POST all'API: ${errorData.message}`);
                }
                else {
                    const responseData = await response.json();
                    console.log(responseData.message);
                    console.log(responseData.newCategory);
                    const categorySpan = document.getElementById(`squealCategory-${cardNumber}`);
                    console.log(categorySpan)
                    categorySpan.outerHTML = `<p id="dislikeSpan-${cardNumber}">${responseData.newCategory}</p>`
                    console.log(categorySpan)
                }
            }
            catch (error) {
                console.error('Errore durante la chiamata POST all\'API:', error);
            }
        }


        // Verifico il flag per vedere se ho aggiunto oppure rimosso destinatari    
        if (addFlag) {
            console.log(readytoAdd);
            addFlag = false;
            // Chiamata POST all'API per aggiornare i valori nel database
            const   data = {
                    mittente: mittente,
                    destinatari: readytoAdd,
                    idSqueal: squeal[cardNumber]._id,
            }

            try {
                const response = await fetch('http://localhost:3001/addRecv', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error(`Errore durante la chiamata POST all'API: ${errorData.message}`);
                }
                else {
                    const responseData = await response.json();
                    console.log(responseData.message);
                }
            }
            catch (error) {
                console.error('Errore durante la chiamata POST all\'API:', error);
            }
        } else if (remFlag) {
            remFlag = false;
            console.log("removing receiver",readytoRemove)
                const  data = {
                    mittente: mittente,
                    destinatari: readytoRemove,
                    idSqueal: squeal[cardNumber]._id,
                }

            try {
                const response = await fetch('http://localhost:3001/remRecv', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    console.error(`Errore durante la chiamata POST all'API: ${errorData.message}`);
                }
                else {
                    const responseData = await response.json();
                    console.log(responseData.message);
                }
            }
            catch (error) {
                console.error('Errore durante la chiamata POST all\'API:', error);
            }
        }
    });

    // Funzione quando clicco il tasto annulla
    annullaBtn.addEventListener('click', async () => {

        // Annullo le modifiche apportate al campo destinatari
        // Faccio una richiesta API a squeals per ricaricare lo squeal senza le modifiche provvisorie
        try {
            const response = await fetch('http://localhost:3001/squeals');
            if (!response.ok) {
                // ... (gestione degli errori)
            } else {
                // Aggiorna la lista degli squeal dopo la modifica
                const updatedSquealResponse = await fetch('http://localhost:3001/squeals');
                squeal = await updatedSquealResponse.json();
                updateSqueal(squeal);
                console.log(squeal);
            }
        } catch (error) {
            console.error('Errore durante il recupero degli squeal:', error);
        }
    })

}




/*
// Attach click event listeners to each emoticon
document.getElementById('verygood').addEventListener('click', function () {
    selectEmoticon('verygood');
});

document.getElementById('good').addEventListener('click', function () {
    selectEmoticon('good');
});

document.getElementById('bad').addEventListener('click', function () {
    selectEmoticon('bad');
});

document.getElementById('verybad').addEventListener('click', function () {
    selectEmoticon('verybad');
});
*/


