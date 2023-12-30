/*Fetch degli squeal*/ 
let squeal; //Array con gli squeal

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
        for(let i = 0; i < receiverCard.length; i++){
            receiverMatch = receiver === "" || receiverCard[i].toLowerCase().includes(receiver.toLowerCase());
            if(receiverMatch){
                isMatched = true;
            }
        }
        const dateMatch = date ===  "" || dateCard.includes(date);
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
    // Prendo l'elemento con le card
    const container = document.querySelector('#wrapper');
    // Resetto il wrapper da eventuali card rimaste
    container.innerHTML = "";
    // Itero sugli squeal creando una card per squeal
    const dest = []; 
    const aggiungiSpazio = () => {
        for (let i = 0; i < squeal.length; i++) {
            const squealCopy = { ...squeal[i] }; // Creo una copia dell'oggetto squeal[i]
            squealCopy.destinatari = squealCopy.destinatari.map(dest => "&nbsp;" + dest );
            dest.push(squealCopy);
        }
        return dest;
    };
    const squealConSpazi = aggiungiSpazio();

    console.log(squeal[0].destinatari.length);
    for(let i=0; i<squeal.length; i++){
            // Converti in stringa ISO la data dello squeal
            const date = squeal[i].date
            // Estrai solo la parte della data
            const squealDate = date.split('T')[0];
            container.innerHTML +=`
            <div class="card ms-1" id="card-${i}">
                <div class="card-body">
                    <!-- Mittente -->
                    <div class="d-flex justify-content-between">
                        <h4 class="card-title fw-bold" id="mittente">@${squeal[i].mittente}</h5>
                        <span class="justify-content-end" id="date">${squealDate}</span>
                    </div>
                    <!-- Destinatari -->
                    <h6 class="fw-bold">Destinatari:</h6>
                    <h6 class="card-subtitle mb-2" id="destinatari">${squealConSpazi[i].destinatari} </h6>                    
                    <!-- Contenuto -->
                    <p id="text">${squeal[i].text}</p>
                    <!-- Pulsante Modifica -->
                    <div class="container-fluid">
                    <div class="row">
                      <div class="col-6 d-flex justify-content-center">
                        <button type="button" class="btn btn-primary" id="modificaBtn">Modifica Squeal</button>
                      </div>
                      <div class="col-6 d-flex justify-content-center" id="emoticons">
                      <!-- Emoticons for reazioni -->
                      <div class="text-center">
                        <span class="material-icons reaction" id="verygood">
                            sentiment_very_satisfied
                        </span>
                        <span class="material-icons reaction" id="good">
                            sentiment_satisfied_alt
                        </span>
                        <span class="material-icons reaction" id="bad">
                            sentiment_dissatisfied
                        </span>
                        <span class="material-icons reaction" id="verybad">
                            sentiment_very_dissatisfied
                        </span>
                        <span>Impression: ${squeal[i].impression}</span>
                      </div>
                      </div>
                    </div>
                  </div>
                </div>
            </div>`
    }
}

// Prendo il box che contiene i bottoni
const parentElement = document.getElementById("BtnBox");

parentElement.addEventListener("click", function(event) {
    if (event.target.id == "modificaBtn") {
        // Verifica se l'elemento di destinazione del clic è un pulsante con l'id "modificaBtn"
        const card = event.target.closest(".card"); // Trova la card padre dell'elemento cliccato

        if (card) {
            // Ottieni l'id univoco assegnato direttamente alla card
            const cardId = card.id;
            const cardNumber = getCardNumber(cardId);
            // Chiama la funzione di modifica specifica per la card corrispondente
            console.log(cardNumber)
            ModifyButton(cardId,cardNumber);
        }
    }
});

// Funzione per ottenere il numero della card dalla sua id
function getCardNumber(cardId) {
    // L'id della card è nella forma "card-X", quindi possiamo estrarre il numero dalla fine dell'id
    const cardNumber = cardId.split('-')[1];
    return parseInt(cardNumber);
}


/*Gestione emoticon*/
function selectEmoticon(emoticonId) {
    // Get the clicked emoticon
    var clickedEmoticon = document.getElementById(emoticonId);

    // Check if the clicked emoticon is already selected
    var isAlreadySelected = clickedEmoticon.classList.contains('selected');

    // Deselect all emoticons
    document.querySelectorAll('.material-icons').forEach(function (icon) {
        icon.classList.remove('selected', 'verygood', 'good', 'bad', 'verybad');
    });

    // If the clicked emoticon was not already selected, select it
    if (!isAlreadySelected) {
        clickedEmoticon.classList.add('selected');
    }
}

// Aggiungi un gestore di eventi al pulsante "Modifica"
async function ModifyButton(cardId,cardNumber) {
    try {
        const response = await fetch('http://localhost:3001/squeals');
        if (!response.ok) {
            // ... (gestione degli errori)
        } else {
            // Aggiorna la lista degli squeal dopo la modifica
            const updatedSquealResponse = await fetch('http://localhost:3001/squeals');
            squeals = await updatedSquealResponse.json();
            updateSqueal(squeals);
            console.log(squeals);
        }
    } catch (error) {
        console.error('Errore durante il recupero degli squeal:', error);
    }

// Capisco che card è stata selezionata
const card = document.getElementById(cardId);

// Prendo tutti i campi della card
const modificaBtn = card.querySelector("#modificaBtn");
const destinatari = card.querySelector("#destinatari");
const mittente = squeal[cardNumber].mittente;
console.log(destinatari);
 
// Rendi invisibile il pulsante modifica
 modificaBtn.style.display = "none";

// Mostra il pulsante "salva modifiche"
const cardBody = card.querySelector(".card-body");
const saveChangesBtn = document.createElement("button");
saveChangesBtn.classList.add("btn");
saveChangesBtn.classList.add("btn-primary");
saveChangesBtn.innerText = "Salva Modifiche";
cardBody.appendChild(saveChangesBtn);

/*Abilita la modifica dei campi*/

// Aggiungi un pulsante "+" dinamicamente

const addButton = document.createElement('button');
addButton.type = 'button';
addButton.classList.add('btn', 'add-button', 'fw-bold');
addButton.innerText = '+';

// Aggiungi un pulsante "-" dimamicamente 

const remButton = document.createElement('button');
remButton.type = 'button';
remButton.classList.add('btn', 'rem-button', 'fw-bold');
remButton.innerText = '-';

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

destinatari.appendChild(addButton);
destinatari.appendChild(remButton);

// Aggiungi un gestore di eventi al pulsante -
remButton.addEventListener('click', () => {
    //Rimuovo i bottoni - e + dal div destinatari
    destinatari.removeChild(remButton);
    destinatari.removeChild(addButton);
    remFlag = true;

    //
    window.addEventListener('keydown', handleEscapeKey);

    // Creo la finestra di sovraimpressione
    const overlay = document.createElement('div');
    overlay.classList.add('overlay-rem');
    console.log(overlay);

    // Aggiungo il contenuto della finestra di sovraimpressione
    overlay.innerHTML = `
    <div class="popup">
        <div class="row-3">
            <div class="fw-bold">Destinatari già presenti:</div>
            <span>${destinatari.innerText}</span>
        </div>
        <div class="row mb-4">
            <div class="fw-bold">Destinatari che vuoi rimuovere:</div>
            <span id="destinatariRimossi"></span>
        </div>
        <div class="row-3">
            <label for="nuovoDestinatario">Destinatario da rimuovere:</label>
            <input type="text" id="nuovoDestinatario">
            <button id="rimuoviDestinatario">Rimuovi</button>
            <button id="chiudiFinestra">Chiudi</button>
        </div>
    </div>
    `;

    // Aggiungo la finestra di sovraimpressione al body
    document.body.appendChild(overlay);

   
    const rimuoviDestinatarioButton = overlay.querySelector("#rimuoviDestinatario");
    const chiudiFinestraButton = overlay.querySelector("#chiudiFinestra");
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
                // Verifica se il nuovo destinatario  presente nella lista degli utenti
                if (destinatari.innerHTML.includes(nuovoDestinatario)) {
                    arrayUsersToRemove.push(nuovoDestinatario);
                    destinatariRimossiDiv.innerHTML += `${nuovoDestinatario}`;
                }
                else {
                    alert("L'utente non è presente fra i destinatari")
                }
            }
        } catch (error) {
            console.error('Errore durante il recupero degli utenti:', error);
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

            for(let i = 0; i < arrayUsersToRemove.length; i++){
                readytoRemove[i] = arrayUsersToRemove[i];
            }
            // Azzero arrayUsersToRemove per ulteriori modifiche
            arrayUsersToRemove.length = 0;
            destinatari.appendChild(remButton);
            destinatari.appendChild(addButton);
            document.body.removeChild(overlay);
            window.removeEventListener('keydown', handleEscapeKey);
        }
    }
    //Chiudi la scheda con il pulsante chiudi
    chiudiFinestraButton.addEventListener('click', () => {
         //Converto il div destinatari in array 
         let nomi = destinatari.textContent.split(',');
        
         //nomi.map toglie gli spazi davanti ai nomi mentre il filter seleziona solo gli utenti non rimossi 
         nomi = nomi.map(nome => nome.trim()).filter(nome => !arrayUsersToRemove.includes(nome));
         for(let i = 0; i < arrayUsersToRemove.length; i++){
            readytoRemove[i] = arrayUsersToRemove[i];
        }
         // Aggiorno il contenuto del div 'destinatari'
         destinatari.textContent = nomi.join(', ');
         console.log(readytoRemove);
        // Azzera arrayNuoviUtenti per ulteriori modifiche
        arrayUsersToRemove.length = 0;
        destinatari.appendChild(remButton);
        destinatari.appendChild(addButton);
        document.body.removeChild(overlay);
        window.removeEventListener('keydown', handleEscapeKey);
    });
});


// Aggiungi un gestore di eventi al pulsante +
addButton.addEventListener('click', () => {
    //Rimuovo i bottoni - e + dal div destinatari
    destinatari.removeChild(addButton);
    destinatari.removeChild(remButton);
    addFlag = true;

    //
    window.addEventListener('keydown', handleEscapeKey);

    // Crea la finestra di sovraimpressione
    const overlay = document.createElement('div');
    overlay.classList.add('overlay-add');

    // Aggiungi il contenuto della finestra di sovraimpressione
    overlay.innerHTML = `
    <div class="popup">
        <div class="row-3">
            <div class="fw-bold">Destinatari già presenti:</div>
            <span>${destinatari.innerText}</span>
        </div>
        <div class="row mb-4">
            <div class="fw-bold">Destinatari che vuoi aggiungere:</div>
            <span id="destinatariAggiunti"></span>
        </div>
        <div class="row-3">
            <label for="nuovoDestinatario">Nuovo Destinatario:</label>
            <input type="text" id="nuovoDestinatario">
            <button id="aggiungiDestinatario">Aggiungi</button>
            <button id="chiudiFinestra">Chiudi</button>
        </div>
    </div>
    `;

    // Aggiungo la finestra di sovraimpressione al body
    document.body.appendChild(overlay);

    // Aggiungo un gestore di eventi al pulsante "Aggiungi" della finestra pop-up
    const aggiungiDestinatarioButton = overlay.querySelector("#aggiungiDestinatario");
    const chiudiFinestraButton = overlay.querySelector("#chiudiFinestra");
    const destinatariAggiuntiDiv = overlay.querySelector("#destinatariAggiunti");

    
    aggiungiDestinatarioButton.addEventListener('click', async () => {
        // Ottengo il nuovo destinatario
        nuovoDestinatario = overlay.querySelector("#nuovoDestinatario").value;

        // Pulisco il campo input
        overlay.querySelector("#nuovoDestinatario").value = "";

        // Chiamata API per ottenere la lista degli utenti
        try {
            const response = await fetch('http://localhost:3001/users');
            if (!response.ok) {
                console.log("Errore nella risposta da parte del database")
            } else {
                const userList = await response.json();
                // Verifica se il nuovo destinatario è presente nella lista degli utenti e se non è l'utente stesso
                if (userList.some(user => user.username === nuovoDestinatario)) {
                    if (nuovoDestinatario != mittente){
                        if (!destinatari.innerHTML.includes(nuovoDestinatario)) {
                            arrayNuoviUtenti.push(nuovoDestinatario);
                            destinatariAggiuntiDiv.innerHTML += `${nuovoDestinatario}`;
                        }
                        else {
                            alert("L'utente è già presente fra i destinatari")
                        }
                    }
                    else {
                        alert("Non puoi inserire come destinatario l'utente stesso");
                    }
                } else {
                    alert("Utente non trovato nel database!");
                }
            }
        } catch (error) {
            console.error('Errore durante il recupero degli utenti:', error);
        }
    });

    //Chiudi la scheda con il tasto esc
    function handleEscapeKey(event) {
        if (event.key === "Escape") {
            window.removeEventListener('keydown', handleEscapeKey);
            for(let i = 0; i<arrayNuoviUtenti.length; i++){
                destinatari.textContent += `${arrayNuoviUtenti[i]},`
                readytoAdd[i] = arrayNuoviUtenti[i];
            }
            // Azzera arrayNuoviUtenti per ulteriori modifiche
            arrayNuoviUtenti.length = 0;
            destinatari.appendChild(addButton);
            destinatari.appendChild(remButton);
            document.body.removeChild(overlay);
        }
    }
    //Chiudi la scheda con il pulsante chiudi
    chiudiFinestraButton.addEventListener('click', () => {
        for(let i = 0; i<arrayNuoviUtenti.length; i++){
            destinatari.textContent += `${arrayNuoviUtenti[i]},`
            readytoAdd[i] = arrayNuoviUtenti[i];
        }
        // Azzera arrayNuoviUtenti per ulteriori modifiche
        arrayNuoviUtenti.length = 0;
        destinatari.appendChild(addButton);
        destinatari.appendChild(remButton);
        document.body.removeChild(overlay);
        window.removeEventListener('keydown', handleEscapeKey);
    });
});

saveChangesBtn.addEventListener('click',async () =>{
    cardBody.removeChild(saveChangesBtn);
    destinatari.removeChild(addButton);
    modificaBtn.style.display = 'inline-block'
    if(addFlag){
    console.log(readytoAdd);
    addFlag = false;
    // Chiamata POST all'API per aggiornare i valori nel database
    try {
        const response = await fetch('http://localhost:3001/addRecv', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                mittente: mittente,
                destinatari: readytoRemove,
            }),
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
    } else if(remFlag){
        remFlag = false;
        try {
            const response = await fetch('http://localhost:3001/remRecv', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    mittente: mittente,
                    destinatari: readytoRemove,
                }),
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


