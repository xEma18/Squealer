/*Fetch dei canali*/
let channel; //Array con i canali

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/channels');
        channel = await response.json();
        // Aggiorna le card con i dati degli utenti
        updateChannels(channel);
    } catch (error) {
        console.error('Errore durante il recupero dei canali:', error);
    }
});

/* Filtri canali*/
// Event listener per il pulsante "Applica"
document.getElementById("apply-filter").addEventListener("click", function () {
    // Ottieni i valori dai campi di filtro
    const nameFilter = document.getElementById("sender-filter").value;
    const typeFilter = document.getElementById("type-filter").value;

    // Esegui la funzione di filtro
    filterChannels(nameFilter, typeFilter);
});

function filterChannels(name, type) {
    const cards = document.querySelectorAll(".card");

    cards.forEach(card => {
        const channelName = card.querySelector("#name").innerText;
        const channelType = card.getAttribute('data-type');

        const nameMatch = name === "" || channelName.toLowerCase().includes(name.toLowerCase());
        const typeMatch = type === "Tutti" || channelType === type;

        if (nameMatch && typeMatch) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

// Verifica se il canale è ufficiale
function isOfficial(channel) {
    if (channel.type == "official") {
        return true
    }
    else {
        return false
    }
}

// Funzione che mostra i canali a schermo
function updateChannels(channel) {
    // Prendo l'elemento con le card
    const container = document.querySelector('#wrapper');
    // Resetto il wrapper da eventuali card rimaste
    container.innerHTML = "";

    for (let i = 0; i < channel.length; i++) {
        const channelType = isOfficial(channel[i]) ? 'official' : 'unofficial';
        container.innerHTML += `
            <div class="card ms-1" id="card-${i}" data-type="${channelType}">
                <div class="card-body d-flex flex-column">
                <div class="mb-auto">
                    <!-- Mittente -->
                    <div class="d-flex justify-content-between">
                        <h4 class="card-title fw-bold" id="name">${channel[i].name}</h5>
                    </div>
                    <!-- Numero di squeal e follower -->
                    <span class="justify-content-end fw-bold" id="popolarity">Type:</span> ${channel[i].type}                  
                    <!-- Contenuto -->
                    <h6 class="mt-4 fw-bold">Channel description:</h6>
                    <p id="description">${channel[i].description}</p>
                </div>
                    <!-- Pulsante Modifica -->
                    <div class="container-fluid">
                    <div class="row d-flex justify-content-center">
                      <div class="col-12 d-flex justify-content-center">
                        <button type="button" class="btn btn-dark" id="modifyBtn">Modify Channel</button>
                        <button type="button" class="ms-4 btn btn-secondary" id="viewBtn">View Squeals</button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>`
    }
}

// Prendo il box che contiene i bottoni
const parentElement = document.getElementById("BtnBox");
let cardNumber;

parentElement.addEventListener("click", function (event) {
    if (event.target.id == "modifyBtn") {
        // Verifica se l'elemento di destinazione del clic è un pulsante con l'id "modifyBtn"
        const card = event.target.closest(".card"); // Trova la card padre dell'elemento cliccato

        if (card) {
            // Ottieni l'id univoco assegnato direttamente alla card
            const cardId = card.id;
            const cardNumber = getCardNumber(cardId);
            // Chiama la funzione di modifica specifica per la card corrispondente
            console.log("numero card:" + cardNumber);
            ModifyButton(cardId, cardNumber);
        }
    } else if (event.target.id == "viewBtn") {
        // Verifica se l'elemento di destinazione del clic è un pulsante con l'id "viewBtn"
        const card = event.target.closest(".card"); // Trova la card padre dell'elemento cliccato

        if (card) {
            // Ottieni l'id univoco assegnato direttamente alla card
            const cardId = card.id;
            cardNumber = getCardNumber(cardId);
            // Chiama la funzione di modifica specifica per la card corrispondente
            console.log("numero card:" + cardNumber);
            ViewButton(cardId, cardNumber);
        }
    }
});

// Funzione per ottenere il numero della card dalla sua id
function getCardNumber(cardId) {
    // L'id della card è nella forma "card-X", quindi possiamo estrarre il numero dalla fine dell'id
    const cardNumber = cardId.split('-')[1];
    return parseInt(cardNumber);
}
function updateSqueal(squeal) {
    // Prendo l'elemento con le card
    const container = document.querySelector('#wrapper-overlay');

    // Resetto il wrapper da eventuali card rimaste
    container.innerHTML = "";

    // Itero sugli squeal creando una card per squeal
    const dest = [];
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
        <div class="card ms-1" id="card-${squeal[i]._id}"> <!-- Assumi una altezza fissa per la card -->
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
             <p id="squealText-${i}">${textToShow}</p>
           </div>
           <!-- I bottoni sono posizionati qui, mantenendo la loro posizione fissa dal basso -->
           <div>
             <div class="d-flex justify-content-between" id="emoticons">
               <div class="d-flex">
                 <span class="material-symbols-outlined" >thumb_up</span> <span id="likeSpan-${i}">${squeal[i].emoticonNum.good}</span>
                 <span class="ms-2 material-symbols-outlined" >thumb_down</span> <span id="dislikeSpan-${i}">${squeal[i].emoticonNum.bad}</span>
                 <span id="impressionSpan" class="ms-3">
                     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                         <path
                         d="M15 12c0 1.657-1.343 3-3 3s-3-1.343-3-3c0-.199.02-.393.057-.581 1.474.541 2.927-.882 2.405-2.371.174-.03.354-.048.538-.048 1.657 0 3 1.344 3 3zm-2.985-7c-7.569 0-12.015 6.551-12.015 6.551s4.835 7.449 12.015 7.449c7.733 0 11.985-7.449 11.985-7.449s-4.291-6.551-11.985-6.551zm-.015 12c-2.761 0-5-2.238-5-5 0-2.761 2.239-5 5-5 2.762 0 5 2.239 5 5 0 2.762-2.238 5-5 5z">
                         </path>
                     </svg> ${squeal[i].impression}
                 </span>
               </div>
               <div class="d-flex justify-content-between" id="removeSquealBtn-${i}">
                 <button type="button" class="btn btn-danger" id="modificaBtn">Remove Squeal</button>
               </div>
             </div>
           </div>
         </div>
       </div>
         `
        // Dopo aver aggiunto tutte le card, impostiamo gli event listener sui pulsanti
        let buttonSelected = document.querySelector(`#removeSquealBtn-${i}`);
        buttonSelected.addEventListener('click', function () {
            const squealId = squeal[i]._id;
            console.log("i", i, "squealId", squealId, "channel name", channel[cardNumber].name);
            removeSqueal(squealId, channel[cardNumber].name);
        });

    }

}

// Rimozione squeal dal canale (tasto remove squeal)
async function removeSqueal(squealId, channelName) {
    console.log("Sto per eliminare lo squeal:", squealId)
    try {
        const response = await fetch('/removeSqueal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ _id: squealId }),
        });

        if (response.ok) {
            document.getElementById(`card-${squealId}`).remove();
        } else {
            console.error('Errore durante la rimozione dello squeal');
        }
    } catch (error) {
        console.error('Errore:', error);
    }

    try {
        const responseChannel = await fetch('/removeSquealFromChannel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ channelName, squealId }),
        });

        if (!responseChannel.ok) {
            throw new Error('Errore durante la rimozione dello squeal dal canale');
        }
    } catch (error) {
        console.error('Errore:', error);
    }
}

async function addSquealToChannel(squealId, channelName) {
    try {
        console.log("entro in addSquealToChannel")
        const response = await fetch('/editChannelSqueal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: channelName, newSquealId: squealId }),
        });

        if (!response.ok) {
            throw new Error('Errore durante l\'aggiornamento del canale');
        }
    } catch (error) {
        console.error('Errore durante l\'aggiunta dello squeal al canale', error);
    }
}

// Creazione nuovo squeal per il canale
async function handlePostClick(overlay, cardNumber, channelId) {
    // Prendo i campi che mi servono per il nuovo squeal f
    let postText = overlay.querySelector("#postText").value;
    let actualDate = new Date();

    const squealData = {
        mittente: "fvMod",
        destinatari: [`${channel[cardNumber].name}`],
        text: `${postText}`,
        date: actualDate,
        impression: 0,
        profilePic: "",
        bodyImage: "",
        commentsNum: 0,
        comments: [{
            mittente: "",
            text: "",
            date: "",
            profilePic: "",
        }],
        emoticonNum: {
            good: 0,
            bad: 0,
        },
        emoticonGivenBy: {
            good: [""],
            bad: [""],
        },
        impressionGivenBy: [""],
        mapLocation: {
            lat: "",
            lng: "",
            zoom: "",
        },
        category: "Public"
    };

    //Aggiunta nuovo squeal al database
    try {
        console.log("Aggiungo nuovo squeal")
        const response = await fetch('/newSqueal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(squealData),
        });

        if (!response.ok) {
            console.error('Risposta non valida dal server:', response.status);
            throw new Error('Risposta non valida dal server');
        }
        console.log("stato", response.status)
        const newSqueal = await response.json();
        console.log("squeal aggiunto", newSqueal);

        // Azzero la textarea
        overlay.querySelector("#postText").value = "";

        console.log("Cambio l'id nel canale")
        // Aggiungi il nuovo ID dello squeal all'elenco degli squeal del canale
        await addSquealToChannel(newSqueal._id, channel[cardNumber].name);
        console.log("Canale aggiornato", channel[cardNumber].name)

        // Creazione del toast
        const toastHtml = `
        <div class="toast-container position-fixed top-0 start-50 translate-middle-x p-3">
            <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-dark-subtle">
                    <img src="./icon_condor.png" class="rounded me-2" alt="icon condor" style="width: 20px; height: 20px;>
                    <strong class="me-auto">Squealer</strong>
                    <div class="container d-flex justify-content-end">
                    <small class="text-body-secondary">just now</small>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                    </div>
                </div>
                <div class="toast-body bg-success" style="--bs-bg-opacity: .5;">
                    Squeal successfully added to the channel!
                </div>
            </div>
        </div>`;

        // Aggiunta del toast al DOM
        const toastContainer = document.getElementById('toastContainer');
        toastContainer.innerHTML = toastHtml;

        // Inizializzazione e visualizzazione del toast
        const toastElement = document.getElementById('liveToast');
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
    } catch (error) {
        console.error('Errore durante l\'aggiunta dello squeal nel db', error);
    }
    // Refresh degli squeal dopo la modifica
    try {
        const response = await fetch(`/squealsByChannel?channelId=${channelId}`);
        const squealsForChannel = await response.json();
        console.log(squealsForChannel);

        // Aggiorna le card con i dati degli utenti
        updateSqueal(squealsForChannel);
    } catch (error) {
        console.error('Errore durante il recupero degli squeal del canale:', error);
    }
    console.log("Fine funzione post")
};

let currentPostHandler; // Variabile globale per tenere traccia del gestore attuale

// Mostrare gli squeal del canale
async function ViewButton(cardId, cardNumber) {
    console.log("ViewButton")
    // Capisco che card è stata selezioinata 
    const card = document.getElementById(cardId);

    // Capisco che canale ho selezionato
    const selectedChannel = channel[cardNumber];
    console.log("canale selezionato: ", selectedChannel)

    // Prendo l'id del canale
    const channelId = selectedChannel._id;
    console.log("id canale: ", channel[cardNumber]._id)

    // Mostra l'overlay
    const overlay = document.getElementById('squealOverlay');
    overlay.style.display = 'block';

    const postNewSqueal = overlay.querySelector("#postNewSqueal");
    console.log(postNewSqueal)

    // Aggiungi il gestore dell'evento per chiudere l'overlay
    document.getElementById('closeOverlay').addEventListener('click', function () {
        overlay.style.display = 'none';

        if (currentPostHandler) {
            postNewSqueal.removeEventListener('click', currentPostHandler);
            currentPostHandler = null; // Resetta la variabile di riferimento
        }
    });

    try {
        console.log("Prendo gli squeal del canale")
        const response = await fetch(`/squealsByChannel?channelId=${channelId}`);
        const squealsForChannel = await response.json();
        // Aggiorna le card con gli squeal del canale
        updateSqueal(squealsForChannel);
    } catch (error) {
        console.error('Errore durante il recupero degli squeal del canale:', error);
    }

    // Assicurati che non ci siano listener precedenti attivi
    if (currentPostHandler) {
        postNewSqueal.removeEventListener('click', currentPostHandler);
    }

    // Crea un nuovo listener e tieni traccia di esso
    currentPostHandler = () => handlePostClick(overlay, cardNumber, channelId);
    postNewSqueal.addEventListener('click', currentPostHandler);
}

// Mostro l'overlay del nuovo canale
document.getElementById("addChannelButton").addEventListener("click", function () {
    document.getElementById("newChannelOverlay").style.display = "block";
});

// Gestore di eventi del pulsante "Modifica"
async function ModifyButton(cardId, cardNumber) {
    try {
        const response = await fetch('/channels');
        if (!response.ok) {

        } else {
            // Aggiorna la lista degli utenti dopo la modifica
            const updatedSquealResponse = await fetch('/channels');
            channels = await updatedSquealResponse.json();
            updateChannels(channels);
        }
    } catch (error) {
        console.error('Errore durante il recupero dei canali:', error);
    }

    // Capisco che card è stata selezionata
    const card = document.getElementById(cardId);
    const cardBody = card.querySelector(".card-body");
    // Prendo tutti i campi della card
    const modifyBtn = card.querySelector("#modifyBtn");
    const viewBtn = card.querySelector("#viewBtn");
    const description = card.querySelector("#description");

    // Rendi invisibile il pulsante modifica
    modifyBtn.style.display = "none";
    viewBtn.style.display = "none";

    // Creazione di un contenitore per i pulsanti
    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("row");
    buttonsContainer.classList.add("d-flex");
    buttonsContainer.classList.add("justify-content-between");

    // Mostra il pulsante "salva modifiche"
    const saveChangesBtn = document.createElement("button");
    saveChangesBtn.classList.add("btn", "btn-success");
    saveChangesBtn.innerText = "Save changes";
    saveChangesBtn.style.width = "49%"; 
    buttonsContainer.appendChild(saveChangesBtn);

    /*Abilita la modifica dei campi*/
    description.innerHTML = `<div class="row d-flex mt-4 post-area">
                            <div class="col d-flex justify-content-center">
                                <textarea id="textarea">${channel[cardNumber].description}</textarea>
                            </div>
                        </div>`

    // Mostra il pulsante "Rimuovi Canale"
    const removeChannelBtn = document.createElement("button");
    removeChannelBtn.classList.add("btn", "btn-danger");
    removeChannelBtn.innerText = "Remove Channel";
    removeChannelBtn.style.width = "49%"; 
    buttonsContainer.appendChild(removeChannelBtn);

    // Aggiunta del contenitore dei pulsanti al cardBody
    cardBody.appendChild(buttonsContainer);

    // Aggiungi l'ascoltatore di eventi per la rimozione del canale
    removeChannelBtn.addEventListener('click', () => {
        RemoveChannel(cardId, cardNumber);
    });

    saveChangesBtn.addEventListener('click', async () => {
        // Gestione pulsanti
        buttonsContainer.removeChild(saveChangesBtn);
        buttonsContainer.removeChild(removeChannelBtn);
        modifyBtn.style.display = 'inline-block';
        viewBtn.style.display = 'inline-block';

        //Prendo la descrizione nuova
        const newDesc = textarea.value;

        // Elimino la textarea
        description.innerHTML = `<p id="description">${newDesc}</p>`

        // Chiamata POST all'API per aggiornare i valori nel database

        try {
            const response = await fetch('/editChannelDescription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: channel[cardNumber].name,
                    description: newDesc,
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

    })

}

// Creazione nuovo canale
document.getElementById("newChannelForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.getElementById("newChannelName").value;
    const type = document.getElementById("newChannelType").value;
    const description = document.getElementById("newChannelDescription").value;
    const creators = ["fvMod"];
    const listofSqueals = [];
    const postNum = 0;
    const profilePic = "";


    // Chiamata API per salvare il nuovo canale
    try {
        const response = await fetch('/addChannel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, type, description, creators, listofSqueals, postNum, profilePic }),
        });

        if (response.ok) {
            // Aggiungi il nuovo canale all'interfaccia utente...
            document.getElementById("newChannelOverlay").style.display = "none";
        } else {
            throw new Error('Errore nella creazione del canale');
        }
    } catch (error) {
        console.error('Errore:', error);
    }

    // Refresha i canali
    try {
        const response = await fetch('/channels');
        channel = await response.json();
        // Aggiorna le card con i dati degli utenti
        updateChannels(channel);
    } catch (error) {
        console.error('Errore durante il recupero dei canali:', error);
    }
});

// Funzione di chiusura overlay nuovo canale  
document.getElementById("closeNewChannelOverlay").addEventListener("click", function () {
    document.getElementById("newChannelOverlay").style.display = "none";
});

// Funzione per rimuovere i canali
async function RemoveChannel(cardId, cardNumber) {
    try {
        const response = await fetch('/removeChannel', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: channel[cardNumber].name }),
        });
        if (!response.ok) {
            throw new Error('Errore durante la rimozione del canale');
        } else {
            // Rimuovi la card dalla UI...
            document.getElementById(cardId).remove();
        }
    } catch (error) {
        console.error('Errore durante la rimozione del canale:', error);
    }
}



