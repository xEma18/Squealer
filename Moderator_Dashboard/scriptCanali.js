/*Fetch dei canali*/ 
let channel; //Array con i canali

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3001/channels');
        channel = await response.json();
        // Aggiorna le card con i dati degli utenti
        updateChannels(channel);
    } catch (error) {
        console.error('Errore durante il recupero dei canali:', error);
    }
});

/* Gestione filtraggio risultati */
/*
document.getElementById("apply-filter").addEventListener("click", function () {
    // Ottiengo i valori dai campi di filtro
    const senderF = document.getElementById("sender-filter").value;
    const receiverF = document.getElementById("receiver-filter").value;
    const dateF = document.getElementById("date-filter").value;

    // Eseguo la funzione di filtro
    filtraChannels(senderF, receiverF, dateF);
});
function filtraChannels(sender, receiver, date) {
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
*/

// Funzione che mostra i canali a schermo
function updateChannels(channel) {
    // Prendo l'elemento con le card
    const container = document.querySelector('#wrapper');
    // Resetto il wrapper da eventuali card rimaste
    container.innerHTML = "";

function isOfficial(channel){
    if(channel.type == "official"){
        return true
    }
    else {
        return false
        }
    }

    for(let i=0; i < channel.length; i++){
            container.innerHTML +=`
            <div class="card ms-1" id="card-${i}">
                <div class="card-body">
                    <!-- Mittente -->
                    <div class="d-flex justify-content-between">
                        <h4 class="card-title fw-bold" id="name">${channel[i].name}</h5>
                    </div>
                    <!-- Numero di squeal e follower -->
                    <h6 class="card-subtitle mb-3" id="squealNum"><span class="fw-bold">Squeal:</span> </span>${channel[i].postNum} <span class="fw-bold">Follower:</span> 21244 <span class="justify-content-end fw-bold" id="popolarity">Popolarity: </span>${isOfficial(channel[i]) ? 'Nothing' : channel[i].popolarity}</h6>                    
                    <!-- Contenuto -->
                    <h6 class="fw-bold">Descrizione canale:</h6>
                    <p id="description">${channel[i].description}</p>
                    <!-- Pulsante Modifica -->
                    <div class="container-fluid">
                    <div class="row d-flex justify-content-center">
                      <div class="col-12 d-flex justify-content-center">
                        <button type="button" class="btn btn-warning" id="modifyBtn">Modify Channel</button>
                        <button type="button" class="ms-4 btn btn-info" id="viewBtn">View Squeals</button>
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
    if (event.target.id == "modifyBtn") {
        // Verifica se l'elemento di destinazione del clic è un pulsante con l'id "modifyBtn"
        const card = event.target.closest(".card"); // Trova la card padre dell'elemento cliccato

        if (card) {
            // Ottieni l'id univoco assegnato direttamente alla card
            const cardId = card.id;
            const cardNumber = getCardNumber(cardId);
            // Chiama la funzione di modifica specifica per la card corrispondente
            console.log("numero card:" + cardNumber);
            ModifyButton(cardId,cardNumber);
        }
    } else if (event.target.id == "viewBtn") {
        // Verifica se l'elemento di destinazione del clic è un pulsante con l'id "viewBtn"
        const card = event.target.closest(".card"); // Trova la card padre dell'elemento cliccato

        if (card) {
            // Ottieni l'id univoco assegnato direttamente alla card
            const cardId = card.id;
            const cardNumber = getCardNumber(cardId);
            // Chiama la funzione di modifica specifica per la card corrispondente
            console.log("numero card:" + cardNumber);
            ViewButton(cardId,cardNumber);
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
        for (let i = 0; i < squeal.length; i++) {
            const squealCopy = { ...squeal[i] }; // Creo una copia dell'oggetto squeal[i]
            squealCopy.destinatari = squealCopy.destinatari.map(dest => "&nbsp;" + dest );
            dest.push(squealCopy);
        }
        return dest;
    };
    const squealConSpazi = aggiungiSpazio();

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

async function addSquealToChannel(squealId, channelName) {
    try {
        console.log("entro in addSquealToChannel")
        const response = await fetch('http://localhost:3001/editChannelSqueal', {
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

async function handlePostClick(overlay,cardNumber,channelId) {
    // Prendo i campi che mi servono per il nuovo squeal
    let postText = overlay.querySelector("#postText").value;
    let actualDate = new Date();
    
    const squealData = {
        mittente: "Squeal Moderator",
        destinatari: [`${channel[cardNumber].name}`],
        text: `${postText}`,
        date: actualDate,
        impression: 0,
        profilePic: null,
        bodyImage: null,
    };
    //Aggiunta nuovo squeal al database
    try {
        console.log("Aggiungo nuovo squeal")
        const response = await fetch('http://localhost:3001/newSqueal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(squealData),
        });

        if (!response.ok) {
            throw new Error('Errore durante l\'invio dello squeal');
        }

        const newSqueal = await response.json();

        // Azzero la textarea
        overlay.querySelector("#postText").value = "";

        console.log("Cambio l'id nel canale")
        // Aggiungi il nuovo ID dello squeal all'elenco degli squeal del canale
        await addSquealToChannel(newSqueal._id,channel[cardNumber].name);
        console.log("Canale aggiornato",channel[cardNumber].name)

        // Creazione del toast
        const toastHtml = `
        <div class="toast-container position-fixed top-0 start-50 translate-middle-x p-3">
            <div id="liveToast" class="toast" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-dark-subtle">
                    <img src="./icon_condor.png" class="rounded me-2" alt="icon condor" style="width: 20px; height: 20px;>
                    <strong class="me-auto">Squealer</strong>
                    <div class="container d-flex justify-content-end">
                    <small class="text-body-secondary">11 mins ago</small>
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
        const response = await fetch(`http://localhost:3001/squealsByChannel?channelId=${channelId}`);
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

async function ViewButton(cardId,cardNumber) {
    console.log("ViewButton")
    // Capisco che card è stata selezioinata 
    const card = document.getElementById(cardId);
    
    // Capisco che canale ho selezionato
    const selectedChannel = channel[cardNumber];
    console.log("canale selezionato: ",selectedChannel)

    // Prendo l'id del canale
    const channelId = selectedChannel._id;
    console.log("id canale: ",channel[cardNumber].name)

    // Mostra l'overlay
    const overlay = document.getElementById('squealOverlay');
    overlay.style.display = 'block';

    const postNewSqueal = overlay.querySelector("#postNewSqueal");
    console.log(postNewSqueal)

    // Aggiungi il gestore dell'evento per chiudere l'overlay
    document.getElementById('closeOverlay').addEventListener('click', function() {
        overlay.style.display = 'none';

        if (currentPostHandler) {
            postNewSqueal.removeEventListener('click', currentPostHandler);
            currentPostHandler = null; // Resetta la variabile di riferimento
        }
    });

    try {
        console.log("Prendo gli squeal del canale")
        const response = await fetch(`http://localhost:3001/squealsByChannel?channelId=${channelId}`);
        const squealsForChannel = await response.json();
        // Aggiorna le card con i dati degli utenti
        updateSqueal(squealsForChannel);
    } catch (error) {
        console.error('Errore durante il recupero degli squeal del canale:', error);
    }
    
     // Assicurati che non ci siano listener precedenti attivi
    if (currentPostHandler) {
        postNewSqueal.removeEventListener('click', currentPostHandler);
    }

    // Crea un nuovo listener e tieni traccia di esso
    currentPostHandler = () => handlePostClick(overlay, cardNumber,channelId);
    postNewSqueal.addEventListener('click', currentPostHandler);

    console.log("Fine funzione view")
}

// Aggiungi un gestore di eventi al pulsante "Modifica"
async function ModifyButton(cardId,cardNumber) {
    try {
        const response = await fetch('http://localhost:3001/channels');
        if (!response.ok) {

        } else {
            // Aggiorna la lista degli utenti dopo la modifica
            const updatedSquealResponse = await fetch('http://localhost:3001/channels');
            channels = await updatedSquealResponse.json();
            updateChannels(channels);
        }
    } catch (error) {
        console.error('Errore durante il recupero dei canali:', error);
    }

// Capisco che card è stata selezionata
const card = document.getElementById(cardId);

// Prendo tutti i campi della card
const modifyBtn = card.querySelector("#modifyBtn");
const viewBtn = card.querySelector("#viewBtn");
const description = card.querySelector("#description");

// Rendi invisibile il pulsante modifica
modifyBtn.style.display = "none";
viewBtn.style.display = "none";

// Mostra il pulsante "salva modifiche"
const cardBody = card.querySelector(".card-body");
const saveChangesBtn = document.createElement("button");
saveChangesBtn.classList.add("btn");
saveChangesBtn.classList.add("btn-primary");
saveChangesBtn.innerText = "Salva Modifiche";
cardBody.appendChild(saveChangesBtn);

/*Abilita la modifica dei campi*/
description.innerHTML = `<div class="row d-flex mt-4 post-area">
                            <div class="col d-flex justify-content-center">
                                <textarea id="textarea">${channel[cardNumber].description}</textarea>
                            </div>
                        </div>`

saveChangesBtn.addEventListener('click',async () =>{
    // Gestione pulsanti
    cardBody.removeChild(saveChangesBtn);
    modifyBtn.style.display = 'inline-block';
    viewBtn.style.display = 'inline-block';

    //Prendo la descrizione nuova
    const newDesc = textarea.value;
   
    // Elimino la textarea
    description.innerHTML =  `<p id="description">${newDesc}</p>`

    // Chiamata POST all'API per aggiornare i valori nel database

    try {
        const response = await fetch('http://localhost:3001/editChannelDescription', { 
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

document.getElementById("addChannelButton").addEventListener("click", function() {
    document.getElementById("newChannelOverlay").style.display = "block";
});
  
document.getElementById("closeNewChannelOverlay").addEventListener("click", function() {
    document.getElementById("newChannelOverlay").style.display = "none";
});
  

  document.getElementById("newChannelForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const name = document.getElementById("newChannelName").value;
    const type = document.getElementById("newChannelType").value;
    const description = document.getElementById("newChannelDescription").value;
  
    // Chiamata API per salvare il nuovo canale
    try {
      const response = await fetch('http://localhost:3001/addChannel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, type, description }),
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
        const response = await fetch('http://localhost:3001/channels');
        channel = await response.json();
        // Aggiorna le card con i dati degli utenti
        updateChannels(channel);
    } catch (error) {
        console.error('Errore durante il recupero dei canali:', error);
    }
  });
  
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


