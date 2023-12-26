/*Fetch degli utenti*/ 
let squeal; //Array con gli squeal

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3001/squeal');
        squeal = await response.json();
        console.log(squeal);
        // Aggiorna le card con i dati degli utenti
        updateSqueal(squeal);
    } catch (error) {
        console.error('Errore durante il recupero degli squeal:', error);
    }
});



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
            squealCopy.destinatari = squealCopy.destinatari.map(dest => dest + "&nbsp;");
            dest.push(squealCopy);
        }
        return dest;
    };

    const squealConSpazi = aggiungiSpazio();

    console.log(squeal[0].destinatari.length);
    for(let i=0; i<squeal.length; i++){
            container.innerHTML +=`
            <div class="card ms-1" id="card-${i}">
                <div class="card-body">
                    <!-- Mittente -->
                    <h4 class="card-title" id="mittente">@${squeal[i].mittente}</h5>
                    <!-- Destinatari -->
                    <h6 class="fw-bold">Destinatari:</h6>
                    <h6 class="card-subtitle mb-2" id="destinatari">${squealConSpazi[i].destinatari}, </h6>                    
                    <!-- Contenuto -->
                    <p id="text">${squeal[i].text}</p>
                    <!-- Pulsante Modifica -->
                    <div class="container-fluid">
                    <div class="row">
                      <div class="col-6 d-flex justify-content-center">
                        <button type="button" class="btn btn-primary" id="modificaBtn">Modifica Destinatari</button>
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
        const response = await fetch('http://localhost:3001/squeal');
        if (!response.ok) {
            // ... (gestione degli errori)
        } else {
            const responseData = await response.json();
            // Aggiorna la lista degli utenti dopo la modifica
            const updatedSquealResponse = await fetch('http://localhost:3001/users');
            users = await updatedSquealResponse.json();
            updateSqueal(squeal);
            console.log(squeal);
        }
    } catch (error) {
        console.error('Errore durante il recupero degli utenti:', error);
    }

// Capisco che card è stata selezionata
const card = document.getElementById(cardId);

// Prendo tutti i campi della card
const modificaBtn = card.querySelector("#modificaBtn")
const destinatari = card.querySelector("#destinatari");
//Manca la data
 
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

addButton.innerText = '-';
destinatari.appendChild(addButton);
const arrayNuoviUtenti = []; //Array dei nuovi destinatari

// Aggiungi un gestore di eventi al pulsante +
addButton.addEventListener('click', () => {
    // Crea la finestra di sovraimpressione
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');

    // Aggiungi il contenuto della finestra di sovraimpressione
    overlay.innerHTML = `
    <div class="popup">
        <div class="row-3">
            <label for="nuovoDestinatario">Nuovo Destinatario:</label>
            <input type="text" id="nuovoDestinatario">
            <button id="aggiungiDestinatario">Aggiungi</button>
            <button id="chiudiFinestra">Chiudi</button>
        </div>
        <div class="row mt-4">
            <div class="fw-bold">Destinatari che vuoi aggiungere:<br></break></div>
            <div id="destinatariAggiunti"></div>
        </div>
    </div>
    `;

    // Aggiungi la finestra di sovraimpressione al body
    document.body.appendChild(overlay);

    // Aggiungi un gestore di eventi al pulsante "Aggiungi"
    const aggiungiDestinatarioButton = overlay.querySelector("#aggiungiDestinatario");
    const chiudiFinestraButton = overlay.querySelector("#chiudiFinestra");
    const destinatariAggiuntiDiv = overlay.querySelector("#destinatariAggiunti");

    //Manca il controllo se l'utente esiste all'interno del database
    aggiungiDestinatarioButton.addEventListener('click', async () => {
        // Ottieni il nuovo destinatario
        nuovoDestinatario = overlay.querySelector("#nuovoDestinatario").value;

        // Pulisci il campo input
        overlay.querySelector("#nuovoDestinatario").value = "";

        // Chiamata API per ottenere la lista degli utenti
        try {
            const response = await fetch('http://localhost:3001/users');
            if (!response.ok) {
                console.log("Errore nella risposta da parte del database")
            } else {
                const userList = await response.json();
                // Verifica se il nuovo destinatario è presente nella lista degli utenti
                if (userList.some(user => user.username === nuovoDestinatario)) {
                    arrayNuoviUtenti.push(nuovoDestinatario);
                    destinatariAggiuntiDiv.innerHTML += `${nuovoDestinatario}`;
                } else {
                    alert("Utente non trovato nel database!");
                }
            }
        } catch (error) {
            console.error('Errore durante il recupero degli utenti:', error);
        }
    });
    console.log(destinatari.textContent);
    chiudiFinestraButton.addEventListener('click', () => {
        // Chiudi la finestra di sovraimpressione
        for(let i = 0; i<arrayNuoviUtenti.length; i++){
            console.log(destinatari.textContent);
            destinatari.textContent += `${arrayNuoviUtenti[i]},`
        }
        destinatari.appendChild(addButton);
        document.body.removeChild(overlay);

    });
});
console.log(arrayNuoviUtenti);

saveChangesBtn.addEventListener('click',async () =>{
    cardBody.removeChild(saveChangesBtn);
    destinatari.removeChild(addButton);
    modificaBtn.style.display = 'inline-block'
    // Chiamata POST all'API per aggiornare i valori nel database
    try {
        const response = await fetch('http://localhost:3001/editSqueal', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                destinatari: arrayNuoviUtenti,
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


