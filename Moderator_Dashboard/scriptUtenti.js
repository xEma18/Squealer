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
    const cards = document.querySelectorAll(".card"); // Seleziona tutte le carte degli utenti

    cards.forEach(card => {
        const nomeUtente = card.querySelector(".card-title").innerText;
        //Prendo l'elemento Tipo utente: tipoutente creo un array del tipo ["Tipo utente","tipoutente"] con [1] prendo il tipoutente e grazie a .trim() rimuovo lo spazio bianco iniziale
        const tipoUtente = card.querySelector('h6:nth-child(3)').innerText.split(":")[1].trim();
        const popolaritaUtente = card.querySelector('h6:nth-child(4)').innerText.split(":")[1].trim();

        // Controllo se l'utente soddisfa i criteri di filtro
        const nomeMatch = nome === "" || nomeUtente.toLowerCase().includes(nome.toLowerCase());
        const tipoMatch = tipo === "Tutti" || tipoUtente === tipo;
        const popolaritaMatch = popolarita === "Qualsiasi" || popolaritaUtente === popolarita;

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
        const response = await fetch('http://localhost:3001/users');
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
    for(let i=0; i<users.length; i++){
        if (users[i].status === "Attivo") {
            container.innerHTML +=`
            <div class="card ms-1" id="card-${i}">
                <div class="card-body">
                    <h4 class="nomeECognome card-title fw-bold ">${users[i].name} ${users[i].lastname} <span class="fw-light small">(${users[i].username})<span></h4>
                    <h5 class="card-subtitle mb-3 text-success" id="status">${users[i].status}</h5>
                    <h6><span class="fw-bold">Tipo utente:</span><span class="tipoUtente"> ${users[i].tipoUtente}</span></h6>
                    <h6><span class="fw-bold">Popolarità:</span><span class="popolarita"> ${users[i].popolarita}</span></h6>
                    <h6><span class="fw-bold">Caratteri Giornalieri:</span><span class="caratteriGiornalieri"> ${users[i].caratteriGiornalieri}</span></h6>
                    <h6><span class="fw-bold">Caratteri Settimanali:</span><span class="caratteriSettimanali"> ${users[i].caratteriSettimanali}</span></h6>
                    <h6><span class="fw-bold">Caratteri Mensili:</span><span class="caratteriMensili"> ${users[i].caratteriMensili}</span></h6>
                    <button class="btn btn-primary" id="modificaBtn">Modifica</button>
                </div>
            </div>`
        } else if(users[i].status === "Bloccato"){
            container.innerHTML +=`
            <div class="card ms-1" id="card-${i}">
                <div class="card-body">
                    <h4 class="nomeECognome card-title fw-bold ">${users[i].name} ${users[i].lastname} <span class="fw-light small">(${users[i].username})<span></h4>
                    <h5 class="card-subtitle mb-3 text-danger" id="status">${users[i].status}</h5>
                    <h6><span class="fw-bold">Tipo utente:</span><span class="tipoUtente"> ${users[i].tipoUtente}</span></h6>
                    <h6><span class="fw-bold">Popolarità:</span><span class="popolarita"> ${users[i].popolarita}</span></h6>
                    <h6><span class="fw-bold">Caratteri Giornalieri:</span><span class="caratteriGiornalieri"> ${users[i].caratteriGiornalieri}</span></h6>
                    <h6><span class="fw-bold">Caratteri Settimanali:</span><span class="caratteriSettimanali"> ${users[i].caratteriSettimanali}</span></h6>
                    <h6><span class="fw-bold">Caratteri Mensili:</span><span class="caratteriMensili"> ${users[i].caratteriMensili}</span></h6>
                    <button class="btn btn-primary" id="modificaBtn">Modifica</button>
                </div>
            </div>`
            
        } 
    }
}


/*Gestione modifica e salvataggio parametri utente*/

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
            ModifyButton(cardId,cardNumber);
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
async function ModifyButton(cardId,cardNumber) {
        try {
            const response = await fetch('http://localhost:3001/users');
            if (!response.ok) {
                // ... (gestione degli errori)
            } else {
                const responseData = await response.json();
                // Aggiorna la lista degli utenti dopo la modifica
                const updatedUsersResponse = await fetch('http://localhost:3001/users');
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
    const nomeECognomeElemento=card.querySelector(".nomeECognome")
    const nomeECognomeTesto=nomeECognomeElemento.textContent || nomeECognomeElemento.innerText;
    const [nome, cognome] = nomeECognomeTesto.split(' ');

    const tipoUtenteField = card.querySelector('h6:nth-child(3)');
    const popolaritaField = card.querySelector('h6:nth-child(4)');
    const caratteriGiornalieriField = card.querySelector("h6:nth-child(5)");
    const caratteriSettimanaliField = card.querySelector("h6:nth-child(6)");
    const caratteriMensiliField = card.querySelector("h6:nth-child(7)");

    // Rendi invisibile il pulsante modifica
    modificaBtn.style.display = "none";
    
    // Abilita la modifica dei campi
    
    if((users[cardNumber].status) === "Attivo"){
        statusUtente.classList.remove("text-success");
        statusUtente.innerHTML = `<span>Status:</span>
        <select class="form-select" id="status-choice">
            <option value="Attivo" selected="selected">Attivo</option>
            <option value="Bloccato">Bloccato</option>
        </select>`; 
        } 
    else if((users[cardNumber].status === "Bloccato")) {
         statusUtente.classList.remove("text-danger");
         statusUtente.innerHTML =`<span>Status:</span>
        <select class="form-select" id="status-choice">
            <option value="Attivo">Attivo</option>
            <option value="Bloccato" selected="selected">Bloccato</option>
        </select>`; 
        }

    if((users[cardNumber].tipoUtente) == "VIP"){
        tipoUtenteField.innerHTML = `<span class="fw-bold">Tipo utente:</span>
        <select class="form-select" aria-label="VIP selected" id="tipoUtenteInput">
        <option value="Standard">Standard</option>
        <option value="VIP" selected="selected">VIP</option>
        <option value="SMM">SMM</option>
        </select>`;
        } 
        else if((users[cardNumber].tipoUtente) == "Standard"){
            tipoUtenteField.innerHTML = `<span class="fw-bold">Tipo utente:</span>
            <select class="form-select" aria-label="Standard Selected" id="tipoUtenteInput">
            <option value="Standard" selected="selected">Standard</option>
            <option value="VIP">VIP</option>
            <option value="SMM">SMM</option>
            </select>`;
        }
        else{
            tipoUtenteField.innerHTML = `<span class="fw-bold">Tipo utente:</span>
            <select class="form-select" aria-label="SMM selected" id="tipoUtenteInput">
            <option value="Standard">Standard</option>
            <option value="VIP">VIP</option>
            <option value="SMM" selected="selected">SMM</option>
            </select>`;
        }

    if((users[cardNumber].popolarita) == "Alta"){
    popolaritaField.innerHTML =  `<span class="fw-bold">Popolarità:</span>
    <select class="form-select" aria-label="Popolarity high selected" id="popolaritaInput">
        <option value="Alta" selected="selected">Alta</option>
        <option value="Media">Media</option>
        <option value="Bassa">Bassa</option>
    </select>`; 
    } 
    else if((users[cardNumber].popolarita) == "Media"){
        popolaritaField.innerHTML =  `<span class="fw-bold">Popolarità:</span>
        <select class="form-select" aria-label="Popolarity medium selected" id="popolaritaInput">
            <option value="Alta">Alta</option>
            <option value="Media" selected="selected">Media</option>
            <option value="Bassa">Bassa</option>
        </select>`; 
    }
        else {
            popolaritaField.innerHTML =  `<span class="fw-bold">Popolarità:</span>
        <select class="form-select" aria-label="Popolarity low selected" id="popolaritaInput">
            <option value="Alta">Alta</option>
            <option value="Media"</option>
            <option value="Bassa" selected="selected">Bassa</option>
        </select>`; 
        }
    caratteriGiornalieriField.innerHTML = `<span class="fw-bold">Caratteri Giornalieri:</span> <input class="form-control" type="number" id="caratteriGiornalieriInput" value="${users[cardNumber].caratteriGiornalieri}">`;
    caratteriSettimanaliField.innerHTML = `<span class="fw-bold">Caratteri Settimanali:</span> <input class="form-control"type="number" id="caratteriSettimanaliInput" value="${users[cardNumber].caratteriSettimanali}">`;
    caratteriMensiliField.innerHTML = `<span class="fw-bold">Caratteri Mensili:</span> <input class="form-control" type="number" id="caratteriMensiliInput" value="${users[cardNumber].caratteriMensili}">`;


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
            const response = await fetch('http://localhost:3001/editUser', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ //Da definire l'username 
                    //mi servono nome e cognome per trovare e modificare l'user corretto nel database
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
        if(nuovoStatus === "Attivo"){
            statusUtente.innerHTML =  `<h5 class="card-subtitle text-success mb-3" id="status">${nuovoStatus}</h5>`
        }
        else {
            statusUtente.innerHTML =  `<h5 class="card-subtitle text-danger mb-3" id="status">${nuovoStatus}</h5>`

        }
        tipoUtenteField.innerHTML = `<span class="fw-bold">Tipo utente:</span> ${nuovoTipoUtente}`;
        popolaritaField.innerHTML = `<span class="fw-bold">Popolarità:</span> ${nuovaPopolarita}`;
        caratteriGiornalieriField.innerHTML = `<span class="fw-bold">Caratteri Giornalieri:</span> ${nuoviCaratteriGiornalieri}`;
        caratteriSettimanaliField.innerHTML = `<span class="fw-bold">Caratteri Settimanali:</span> ${nuoviCaratteriSettimanali}`;
        caratteriMensiliField.innerHTML = `<span class="fw-bold">Caratteri Mensili:</span> ${nuoviCaratteriMensili}`;

        // Rimuovi il pulsante "Salva Modifiche"
        cardBody.removeChild(saveChangesBtn);

        // Mostra nuovamente il pulsante "Modifica"
        modificaBtn.style.display = "inline-block";
    });
};

