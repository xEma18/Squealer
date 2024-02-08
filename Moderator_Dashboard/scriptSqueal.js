/*Fetch degli squeal*/ 
let squeal = []; //Array con gli squeal
let OriginalDest = [];//Campo dei destinatari originale

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
    const container = document.querySelector('#wrapper');
    container.innerHTML = ""; // Resetto il wrapper

    const aggiungiSpazio = () => {
        return squeal.map(squealItem => {
            const destinatari = squealItem.destinatari.join(", "); // Unisco i destinatari con una virgola
            const MAX_LENGTH = 30; // Numero massimo di caratteri
            // Se la lunghezza dei destinatari supera il massimo consentito, tronca e aggiungi ellissi
            if (destinatari.length > MAX_LENGTH) {
                let shortened = destinatari.substring(0, MAX_LENGTH - 3); // Tronca la stringa per fare spazio ai puntini
                const lastComma = shortened.lastIndexOf(","); // Trova l'ultima virgola per evitare di tagliare a metà un nome
                if (lastComma > 0) {
                    shortened = shortened.substring(0, lastComma);
                }
                squealItem.destinatariTruncated = shortened + "..."; // Aggiunge i puntini
            } else {
                squealItem.destinatariTruncated = destinatari; // Usa la stringa completa se non supera il limite
            }
            return squealItem;
        });
    };

    const squealConSpazi = aggiungiSpazio();

    for(let i = 0; i < squeal.length; i++){
        const squealDate = squeal[i].date.split('T')[0]; // Estrai solo la parte della data
        OriginalDest[i] = squeal[i].destinatari; // Salvo il campo destinatari originale da usare nell'overlay
        container.innerHTML += `
            <div class="card ms-1" id="card-${i}">
                <div class="card-body">
                    <div class="d-flex justify-content-between">
                        <h4 class="card-title fw-bold">${squeal[i].mittente}</h4>
                        <span class="justify-content-end">${squealDate}</span>
                    </div>
                    <h6 class="fw-bold">Receivers:</h6>
                    <h6 class="card-subtitle mb-2" id="destinatari">${squealConSpazi[i].destinatariTruncated}</h6>
                    <p>${squeal[i].text}</p>
                    <div class="container-fluid">
                        <div class="row-6">
                            <div class="col-12 d-flex justify-content-start" id="emoticons">
                                <div class="text-center">
                                    <span class="material-symbols-outlined">thumb_up</span>
                                    <span class="ms-2 material-symbols-outlined">thumb_down</span>
                                    <span class="ms-3">Impression: ${squeal[i].impression}</span>
                                </div>
                            </div>
                        </div>
                        <div class="row-6">
                            <div class="col-12 d-flex justify-content-center" id="modifyBtnFather">
                                <button type="button" class="btn btn-dark" id="modificaBtn" style="height:40%;">Modify Squeal</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
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
const modifyBtnFather = card.querySelector("#modifyBtnFather")

const mittente = squeal[cardNumber].mittente;

// Rendi invisibile il pulsante modifica
modifyBtnFather.removeChild(modificaBtn);

// Mostra il pulsante "salva modifiche"
const cardBody = card.querySelector(".card-body");
const saveChangesBtn = document.createElement("button");
saveChangesBtn.classList.add("btn");
saveChangesBtn.classList.add("btn-success");
saveChangesBtn.innerText = "Salva Modifiche";
saveChangesBtn.style = "height:70%;"
modifyBtnFather.appendChild(saveChangesBtn);

// Mostra il pulsante "annulla" per annullare le modifiche
const annullaBtn = document.createElement("button");
annullaBtn.classList.add("btn");
annullaBtn.classList.add("btn-warning");
annullaBtn.classList.add("ms-3");
annullaBtn.innerText = "Annulla";
annullaBtn.style = "height:70%;"
modifyBtnFather.appendChild(annullaBtn); 

/*Abilita la modifica dei campi*/

// Aggiungi un pulsante "+" dinamicamente

const addButton = document.createElement('button');
addButton.type = 'button';
addButton.classList.add('btn', 'add-button', 'fw-bold', 'text-success');
addButton.innerText = '+';

// Aggiungi un pulsante "-" dimamicamente 

const remButton = document.createElement('button');
remButton.type = 'button';
remButton.classList.add('btn', 'rem-button', 'fw-bold', 'text-danger');
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

    // Aggiungo il contenuto della finestra di sovraimpressione
    overlay.innerHTML = `
    <div class="popup">
        <span id="closeNewChannelOverlay" class="close">&times;</span>
        <div class="row-3">
            <div class="fw-bold">Receivers already in:</div>
            <span>${squeal[cardNumber].destinatari}</span>
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
    //Chiudi la scheda con il pulsante x
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
    console.log(OriginalDest[cardNumber])
    // Aggiungi il contenuto della finestra di sovraimpressione
    overlay.innerHTML = `
    <div class="popup">
        <span id="closeNewChannelOverlay" class="close">&times;</span>
        <div class="row-3">
            <div class="fw-bold">Receivers already in:</div>
            <span>${squeal[cardNumber].destinatari}</span>
        </div>
        <div class="row mb-4">
            <div class="mt-2 fw-bold">Receivers to add:</div>
            <span id="destinatariAggiunti"></span>
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

    // Aggiungo un gestore di eventi al pulsante "Aggiungi" della finestra pop-up
    const aggiungiDestinatarioButton = overlay.querySelector("#aggiungiDestinatario");
    const chiudiFinestraButton = overlay.querySelector("#closeNewChannelOverlay");
    const destinatariAggiuntiDiv = overlay.querySelector("#destinatariAggiunti");

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
    
            if (userList && channelList) {
                // Verifica se il nuovo destinatario è presente nella lista degli utenti e nei canali
                const isUserValid = userList.some(user => user.username === nuovoDestinatario);
                const isChannelValid = channelList.some(channel => channel.name === nuovoDestinatario);
    
                if (isUserValid || isChannelValid) {
                    if (nuovoDestinatario !== mittente) {
                        if (!destinatari.innerHTML.includes(nuovoDestinatario)) {
                            arrayNuoviUtenti.push(nuovoDestinatario);
                            destinatariAggiuntiDiv.innerHTML += `${nuovoDestinatario} `;
                        } else {
                            alert("L'utente è già presente fra i destinatari");
                        }
                    } else {
                        alert("Non puoi inserire come destinatario l'utente stesso");
                    }
                } else {
                    alert("Destinatario non trovato nel database!");
                }
            } else {
                console.log("Errore nella risposta da parte del database");
            }
        } catch (error) {
            console.error('Errore durante il recupero dei dati:', error);
        }
    });
    

    //Chiudi la scheda con il tasto esc
    function handleEscapeKey(event) {
        if (event.key === "Escape") {
            window.removeEventListener('keydown', handleEscapeKey);
            for(let i = 0; i<arrayNuoviUtenti.length; i++){
                //destinatari.textContent += `${arrayNuoviUtenti[i]},`
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
            //destinatari.textContent += `${arrayNuoviUtenti[i]},`
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

// Funzione quando clicco il tasto salva modifiche
saveChangesBtn.addEventListener('click',async () =>{

    // Rimuovo i pulsanti 
    modifyBtnFather.removeChild(saveChangesBtn);
    modifyBtnFather.removeChild(annullaBtn);
    destinatari.removeChild(addButton);
    destinatari.removeChild(remButton);

    // Aggiungo il pulsante modifica
    modifyBtnFather.appendChild(modificaBtn);

    // Controllo il flag per capire che API chiamare 
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
                destinatari: readytoAdd,
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

// Funzione quando clicco il tasto annulla
annullaBtn.addEventListener('click',async () =>{

    // Rimuovo i pulsanti 
    modifyBtnFather.removeChild(saveChangesBtn);
    modifyBtnFather.removeChild(annullaBtn);
    destinatari.removeChild(addButton);
    destinatari.removeChild(remButton);

    // Aggiungo il pulsante modifica
    modifyBtnFather.appendChild(modificaBtn);

    // Annullo le modifiche apportate al campo destinatari
    // Faccio una richiesta API a squeals per ricaricare lo squeal senza le modifiche provvisorie
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


