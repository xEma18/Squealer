/*Fetch dei canali*/ 
let channel; //Array con i canali

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3001/channels');
        channel = await response.json();
        console.log(channel);
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
    else return false
    }

    for(let i=0; i < channel.length; i++){
            container.innerHTML +=`
            <div class="card ms-1" id="card-${i}">
                <div class="card-body">
                    <!-- Mittente -->
                    <div class="d-flex justify-content-between">
                        <h4 class="card-title fw-bold" id="name">§${channel[i].name}</h5>
                        <span class="justify-content-end" id="popolarity">${isOfficial(channel[i]) ? channel[i].popolarity : ''}</span>
                    </div>
                    <!-- Numero di squeal e follower -->
                    <h6 class="card-subtitle mb-3" id="squealNum"><span class="fw-bold">Squeal:</span> ${channel[i].postNum} <span class="fw-bold">Follower:</span> 21244</h6>                    
                    <!-- Contenuto -->
                    <h6 class="fw-bold">Descrizione canale:</h6>
                    <p id="description">${channel[i].description}</p>
                    <!-- Pulsante Modifica -->
                    <div class="container-fluid">
                    <div class="row d-flex justify-content-center">
                      <div class="col-12 d-flex justify-content-center">
                        <button type="button" class="btn btn-warning" id="modificaBtn">Modify Channel</button>
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
    if (event.target.id == "modificaBtn") {
        // Verifica se l'elemento di destinazione del clic è un pulsante con l'id "modificaBtn"
        const card = event.target.closest(".card"); // Trova la card padre dell'elemento cliccato

        if (card) {
            // Ottieni l'id univoco assegnato direttamente alla card
            const cardId = card.id;
            const cardNumber = getCardNumber(cardId);
            // Chiama la funzione di modifica specifica per la card corrispondente
            console.log("numero card:" + cardNumber);
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



// Aggiungi un gestore di eventi al pulsante "Modifica"
async function ModifyButton(cardId,cardNumber) {
    try {
        const response = await fetch('http://localhost:3001/channels');
        if (!response.ok) {
            // ... (gestione degli errori)
        } else {
            // Aggiorna la lista degli utenti dopo la modifica
            const updatedSquealResponse = await fetch('http://localhost:3001/channels');
            channels = await updatedSquealResponse.json();
            updateChannels(channels);
            console.log("channels:")
            console.log(channels);
        }
    } catch (error) {
        console.error('Errore durante il recupero dei canali:', error);
    }

// Capisco che card è stata selezionata
const card = document.getElementById(cardId);

// Prendo tutti i campi della card
const modificaBtn = card.querySelector("#modificaBtn");
const viewBtn = card.querySelector("#viewBtn");
const type = card.querySelector("#type");
const name = card.querySelector("#name")
const popolarity = card.querySelector("#popolarity");
const squealNum = card.querySelector("#squealNum");
const description = card.querySelector("#description");
 
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



saveChangesBtn.addEventListener('click',async () =>{
    cardBody.removeChild(saveChangesBtn);
    modificaBtn.style.display = 'inline-block';
    // Chiamata POST all'API per aggiornare i valori nel database
    /*
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
    }*/
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


