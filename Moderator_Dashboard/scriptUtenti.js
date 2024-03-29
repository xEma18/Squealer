/*Funzione per il cambio pagina*/
function cambiaPagina(url) {
    window.location.href = url;
}

/* Gestione filtraggio risultati */

document.getElementById("apply-filter").addEventListener("click", function () {
    // Ottiengo i valori dai campi di filtro
    const nomeFiltro = document.getElementById("name-filter").value;
    const tipoFiltro = document.getElementById("type-filter").value;
    const popolaritaFiltro = document.getElementById("popolarita-filter").value;

    // Eseguo la funzione di filtro
    filtraUtenti(nomeFiltro, tipoFiltro, popolaritaFiltro);
});
function filtraUtenti(nome, tipo, popolarita) {
    const cards = document.querySelectorAll(".card"); // Seleziona tutte le card degli utenti

    cards.forEach(card => {
        const nomeUtente = card.querySelector(".card-title").innerText;
        //Prendo l'elemento User Type: tipoutente(contenuto nell'h6) creo un array del tipo ["User Type","tipoutente"] con [1] prendo il tipoutente e grazie a .trim() rimuovo lo spazio bianco iniziale
        const tipoUtente = card.querySelector('h6:nth-child(3)').innerText.split(":")[1].trim();
        const popolaritaUtente = card.querySelector('h6:nth-child(4)').innerText.split(":")[1].trim();

        // Controllo se l'utente soddisfa i criteri di filtro
        const nomeMatch = nome === "" || nomeUtente.toLowerCase().includes(nome.toLowerCase());
        const tipoMatch = tipo === "All" || tipoUtente === tipo;
        const popolaritaMatch = popolarita === "Any" || popolaritaUtente === popolarita;

        // Nascondo o mostro la carta in base ai criteri di filtro
        if (nomeMatch && tipoMatch && popolaritaMatch) {
            card.style.display = "block"; // Mostra la carta
        } else {
            card.style.display = "none"; // Nascondi la carta
        }
    });
}

// Array di utenti del database 
let users;

/*Fetch degli utenti*/
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/users');
        users = await response.json();
        
        // Aggiorna le card con i dati degli utenti
        updateCards(users);
    } catch (error) {
        console.error('Errore durante il recupero degli utenti:', error);
    }
});

function updateCards(users) {
    // Prendo l'elemento con le card
    const container = document.querySelector('#wrapper');
    // Resetto il wrapper da eventuali card rimaste
    container.innerHTML = "";
    // Itero sugli utenti creando una card per utente
    for (let i = 0; i < users.length; i++) {
        if (users[i].status === "Active") {
            container.innerHTML += `
            <div class="card ms-1" id="card-${i}">
                <div class="card-body">
                    <h4 class="nomeECognome card-title fw-bold ">${users[i].name} ${users[i].lastname} <span class="fw-light small">(${users[i].username})<span></h4>
                    <h5 class="card-subtitle mb-3 text-success" id="status">${users[i].status}</h5>
                    <h6><span class="fw-bold">User Type:</span><span class="tipoUtente"> ${users[i].tipoUtente}</span></h6>
                    <h6><span class="fw-bold">Popolarity:</span><span class="popolarita"> ${users[i].popolarita}</span></h6>
                    <h6><span class="fw-bold">Daily Characters Used:</span><span class="caratteriGiornalieri"> ${users[i].caratteriGiornalieriUsati} / ${users[i].caratteriGiornalieri} </span></h6>
                    <h6><span class="fw-bold">Weekly Characters Used:</span><span class="caratteriSettimanali"> ${users[i].caratteriSettimanaliUsati} / ${users[i].caratteriSettimanali} </span></h6>
                    <h6><span class="fw-bold">Montly Characters Used:</span><span class="caratteriMensili"> ${users[i].caratteriMensiliUsati} / ${users[i].caratteriMensili}</span></h6>
                    <button class="btn btn-dark" id="modificaBtn">Modify</button>
                </div>
            </div>`
        } else if (users[i].status === "Blocked") {
            users[i].caratteriGiornalieriUsati = users[i].caratteriGiornalieri;
            users[i].caratteriSettimanaliUsati = users[i].caratteriSettimanali;
            users[i].caratteriMensiliUsati = users[i].caratteriMensili;

            container.innerHTML += `
            <div class="card ms-1" id="card-${i}">
                <div class="card-body">
                    <h4 class="nomeECognome card-title fw-bold ">${users[i].name} ${users[i].lastname} <span class="fw-light small">(${users[i].username})<span></h4>
                    <h5 class="card-subtitle mb-3 text-danger" id="status">${users[i].status}</h5>
                    <h6><span class="fw-bold">User Type:</span><span class="tipoUtente"> ${users[i].tipoUtente}</span></h6>
                    <h6><span class="fw-bold">Popolarity:</span><span class="popolarita"> ${users[i].popolarita}</span></h6>
                    <h6><span class="fw-bold">Daily Characters Used:</span><span class="caratteriGiornalieri"> ${users[i].caratteriGiornalieriUsati} / ${users[i].caratteriGiornalieri}</span></h6>
                    <h6><span class="fw-bold">Weekly Characters Used:</span><span class="caratteriSettimanali"> ${users[i].caratteriSettimanaliUsati} / ${users[i].caratteriSettimanali}</span></h6>
                    <h6><span class="fw-bold">Montly Characters Used:</span><span class="caratteriMensili"> ${users[i].caratteriMensiliUsati} / ${users[i].caratteriMensili}</span></h6>
                    <button class="btn btn-dark" id="modificaBtn">Modify</button>
                </div>
            </div>`

        }
    }
}


/*Gestione modifica e salvataggio parametri utente*/

// Prendo il box che contiene i bottoni
const parentElement = document.getElementById("BtnBox");

parentElement.addEventListener("click", function (event) {
    if (event.target.id == "modificaBtn") {
        // Verifica se l'elemento di destinazione del clic è un pulsante con l'id "modificaBtn" (closest restituisce l'elemento genitore più vicino dell'elemento su cui è avvenuto il clic)
        const card = event.target.closest(".card"); // Trova la card padre dell'elemento cliccato

        if (card) {
            // Ottieni l'id univoco assegnato direttamente alla card
            const cardId = card.id;
            const cardNumber = getCardNumber(cardId);
            // Chiama la funzione di modifica specifica per la card corrispondente
            ModifyButton(cardId, cardNumber);
        }
    }
});

// Funzione per ottenere il numero della card dal suo id
function getCardNumber(cardId) {
    // L'id della card è nella forma "card-X", quindi possiamo estrarre il numero dalla fine dell'id
    const cardNumber = cardId.split('-')[1];
    return parseInt(cardNumber);
}

// Aggiungi un gestore di eventi al pulsante "Modifica"
async function ModifyButton(cardId, cardNumber) {
    try {
        const response = await fetch('/users');
        if (!response.ok) {
            throw new Error('Errore durante la richiesta HTTP');
        } else {
            const responseData = await response.json();
            // Aggiorna la lista degli utenti dopo la modifica
            const updatedUsersResponse = await fetch('/users');
            users = await updatedUsersResponse.json();
            updateCards(users);
            console.log(users);
        }
    } catch (error) {
        console.error('Errore durante il recupero degli utenti:', error);
    }

    // Capisco che card è stata selezionata
    const card = document.getElementById(cardId);

    // Prendo tutti i campi della card
    const modificaBtn = card.querySelector("#modificaBtn");

    const statusUtente = card.querySelector('#status');
    const nomeECognomeElemento = card.querySelector(".nomeECognome")
    const nomeECognomeTesto = nomeECognomeElemento.textContent || nomeECognomeElemento.innerText;
    const [nome, cognome] = nomeECognomeTesto.split(' ');

    const tipoUtenteField = card.querySelector('h6:nth-child(3)');
    const popolaritaField = card.querySelector('h6:nth-child(4)');
    const caratteriGiornalieriField = card.querySelector("h6:nth-child(5)");
    const caratteriSettimanaliField = card.querySelector("h6:nth-child(6)");
    const caratteriMensiliField = card.querySelector("h6:nth-child(7)");

    // Rendi invisibile il pulsante modifica
    modificaBtn.style.display = "none";

    // Abilita la modifica dei campi

    if ((users[cardNumber].status) === "Active") {
        statusUtente.classList.remove("text-success");
        statusUtente.innerHTML = `<span>Status:</span>
        <select class="form-select" id="status-choice">
            <option value="Active" selected="selected">Active</option>
            <option value="Blocked">Blocked</option>
        </select>`;
    }
    else if ((users[cardNumber].status === "Blocked")) {
        statusUtente.classList.remove("text-danger");
        statusUtente.innerHTML = `<span>Status:</span>
        <select class="form-select" id="status-choice">
            <option value="Active">Active</option>
            <option value="Blocked" selected="selected">Blocked</option>
        </select>`;
    }

    if ((users[cardNumber].tipoUtente) == "VIP") {
        tipoUtenteField.innerHTML = `<span class="fw-bold">User Type:</span>
        <select class="form-select" aria-label="VIP selected" id="tipoUtenteInput">
        <option value="Standard">Standard</option>
        <option value="VIP" selected="selected">VIP</option>
        <option value="SMM">SMM</option>
        </select>`;
    }
    else if ((users[cardNumber].tipoUtente) == "Standard") {
        tipoUtenteField.innerHTML = `<span class="fw-bold">User Type:</span>
            <select class="form-select" aria-label="Standard Selected" id="tipoUtenteInput">
            <option value="Standard" selected="selected">Standard</option>
            <option value="VIP">VIP</option>
            <option value="SMM">SMM</option>
            </select>`;
    }
    else {
        tipoUtenteField.innerHTML = `<span class="fw-bold">User Type:</span>
            <select class="form-select" aria-label="SMM selected" id="tipoUtenteInput">
            <option value="Standard">Standard</option>
            <option value="VIP">VIP</option>
            <option value="SMM" selected="selected">SMM</option>
            </select>`;
    }

    if ((users[cardNumber].popolarita) == "High") {
        popolaritaField.innerHTML = `<span class="fw-bold">Popolarity:</span>
    <select class="form-select" aria-label="Popolarity high selected" id="popolaritaInput">
        <option value="High" selected="selected">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
    </select>`;
    }
    else if ((users[cardNumber].popolarita) == "Medium") {
        popolaritaField.innerHTML = `<span class="fw-bold">Popolarity:</span>
        <select class="form-select" aria-label="Popolarity medium selected" id="popolaritaInput">
            <option value="High">High</option>
            <option value="Medium" selected="selected">Medium</option>
            <option value="Low">Low</option>
        </select>`;
    }
    else {
        popolaritaField.innerHTML = `<span class="fw-bold">Popolarity:</span>
        <select class="form-select" aria-label="Popolarity low selected" id="popolaritaInput">
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low" selected="selected">Low</option>
        </select>`;
    }
    caratteriGiornalieriField.innerHTML = `<span class="fw-bold">Daily Characters Used:</span> <input class="form-control" type="number" id="caratteriGiornalieriInput" value="${users[cardNumber].caratteriGiornalieriUsati}">`;
    caratteriSettimanaliField.innerHTML = `<span class="fw-bold">Weekly Characters Used:</span> <input class="form-control"type="number" id="caratteriSettimanaliInput" value="${users[cardNumber].caratteriSettimanaliUsati}">`;
    caratteriMensiliField.innerHTML = `<span class="fw-bold">Montly Characters Used:</span> <input class="form-control" type="number" id="caratteriMensiliInput" value="${users[cardNumber].caratteriMensiliUsati}">`;


    // Aggiungi il pulsante "Salva Modifiche"
    const cardBody = card.querySelector(".card-body");
    const saveChangesBtn = document.createElement("button");
    saveChangesBtn.classList.add("btn");
    saveChangesBtn.classList.add("btn-primary");
    saveChangesBtn.innerText = "Salva Modifiche";
    cardBody.appendChild(saveChangesBtn);

    // Gestisci il salvataggio delle modifiche
    saveChangesBtn.addEventListener("click", async function () {
        // Ottieni i nuovi valori dai campi di input
        const nuovoTipoUtente = card.querySelector("#tipoUtenteInput").value;
        const nuovaPopolarita = card.querySelector("#popolaritaInput").value;
        const nuoviCaratteriGiornalieri = card.querySelector("#caratteriGiornalieriInput").value;
        const nuoviCaratteriSettimanali = card.querySelector("#caratteriSettimanaliInput").value;
        const nuoviCaratteriMensili = card.querySelector("#caratteriMensiliInput").value;
        const nuovoStatus = card.querySelector("#status-choice").value;

        // Chiamata POST all'API per aggiornare i valori nel database
        try {
            const response = await fetch('/editUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    nome: nome,
                    cognome: cognome,
                    popolarita: nuovaPopolarita,
                    tipoUtente: nuovoTipoUtente,
                    caratteriGiornalieri: nuoviCaratteriGiornalieri,
                    caratteriSettimanali: nuoviCaratteriSettimanali,
                    caratteriMensili: nuoviCaratteriMensili,
                    status: nuovoStatus,
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

        // Aggiorna i campi con i nuovi valori
        if (nuovoStatus === "Active") {
            console.log("entro nell'active")
            console.log("caratteriGiornalieriNuovi", nuoviCaratteriGiornalieri);
            statusUtente.innerHTML = `<h5 class="card-subtitle text-success mb-3" id="status">${nuovoStatus}</h5>`
            caratteriGiornalieriField.innerHTML = `<span class="fw-bold">Daily Characters Usedi:</span> ${nuoviCaratteriGiornalieri} / ${users[cardNumber].caratteriGiornalieri} `;
            caratteriSettimanaliField.innerHTML = `<span class="fw-bold">Daily Montly Weekly Used:</span> ${nuoviCaratteriSettimanali} / ${users[cardNumber].caratteriSettimanali} `;
            caratteriMensiliField.innerHTML = `<span class="fw-bold">Daily Montly Characters Used:</span>  ${nuoviCaratteriMensili} / ${users[cardNumber].caratteriMensili}`;
        
        }
        else {
            console.log("entro nel blocked");
            statusUtente.innerHTML = `<h5 class="card-subtitle text-danger mb-3" id="status">${nuovoStatus}</h5>`
            users[cardNumber].caratteriGiornalieriUsati = users[cardNumber].caratteriGiornalieri;
            users[cardNumber].caratteriSettimanaliUsati = users[cardNumber].caratteriSettimanali;
            users[cardNumber].caratteriMensiliUsati = users[cardNumber].caratteriMensili;

            caratteriGiornalieriField.innerHTML = `<span class="fw-bold">Daily Characters Usedi:</span> ${users[cardNumber].caratteriGiornalieriUsati} / ${users[cardNumber].caratteriGiornalieri} `;
            caratteriSettimanaliField.innerHTML = `<span class="fw-bold">Daily Montly Weekly Used:</span> ${users[cardNumber].caratteriSettimanaliUsati} / ${users[cardNumber].caratteriSettimanali} `;
            caratteriMensiliField.innerHTML = `<span class="fw-bold">Daily Montly Characters Used:</span>  ${users[cardNumber].caratteriMensiliUsati} / ${users[cardNumber].caratteriMensili}`;

                // Chiamata POST all'API per bloccare l'utente e impostare quindi i suoi caratteri  al massimo consentito
        try {
            const response = await fetch('/editUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    nome: nome,
                    cognome: cognome,
                    popolarita: nuovaPopolarita,
                    tipoUtente: nuovoTipoUtente,
                    caratteriGiornalieri: users[cardNumber].caratteriGiornalieri,
                    caratteriSettimanali: users[cardNumber].caratteriSettimanali,
                    caratteriMensili: users[cardNumber].caratteriMensili,
                    status: nuovoStatus,
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
        tipoUtenteField.innerHTML = `<span class="fw-bold">User Type:</span> ${nuovoTipoUtente}`;
        popolaritaField.innerHTML = `<span class="fw-bold">Popolarity:</span> ${nuovaPopolarita}`;

        // Rimuovi il pulsante "Salva Modifiche"
        cardBody.removeChild(saveChangesBtn);

        // Mostra nuovamente il pulsante "Modifica"
        modificaBtn.style.display = "inline-block";
    });
};

