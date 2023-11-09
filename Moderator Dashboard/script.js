/*Funzione per il cambio pagina*/
function cambiaPagina(url) {
    window.location.href = url;
}

/*Gestione modifica e salvataggio parametri utente*/

// Prendo il box che contiene i bottoni
const parentElement = document.getElementById("BtnBox");

// Ottieni il riferimento al pulsante "Modifica" e ai campi dati
/*
const modificaBtn = document.getElementById("modificaBtn");
const tipoUtenteField = document.querySelector("h6:nth-child(3)");
const popolaritaField = document.querySelector("h6:nth-child(4)");
const caratteriGiornalieriField = document.querySelector("h6:nth-child(5)");
const caratteriSettimanaliField = document.querySelector("h6:nth-child(6)");
const caratteriMensiliField = document.querySelector("h6:nth-child(7)");
*/



// Aggiungi un gestore di eventi al pulsante "Modifica"
function ModifyButton(cardId) {
    // Capisco che card è stata selezionata
    const card = document.getElementById(cardId);

    // Prendo tutti i campi della card
    const modificaBtn = card.querySelector("#modificaBtn");
    const tipoUtenteField = card.querySelector('h6:nth-child(3)');
    const popolaritaField = card.querySelector('h6:nth-child(4)');
    const caratteriGiornalieriField = document.querySelector("h6:nth-child(5)");
    const caratteriSettimanaliField = document.querySelector("h6:nth-child(6)");
    const caratteriMensiliField = document.querySelector("h6:nth-child(7)");

    // Rendi invisibile il pulsante modifica
    modificaBtn.style.display = "none";

    // Abilita la modifica dei campi
    tipoUtenteField.innerHTML = `<span class="fw-bold">Tipo utente:</span>
    <select id="tipoUtenteInput">
        <option value="VIP">VIP</option>
        <option value="Normale">Normale</option>
        <option value="Premium">Premium</option>
    </select>`;
    popolaritaField.innerHTML = `<span class="fw-bold">Popolarità:</span>
    <select id="popolaritaInput">
        <option value="Alta">Alta</option>
        <option value="Media">Media</option>
        <option value="Bassa">Bassa</option>
    </select>`;

    const utenteModificato = {
        tipoUtente: tipoUtenteField.textContent,
        popolarita: popolaritaField.textContent,
        caratteriGiornalieri: parseInt(caratteriGiornalieriField.textContent),
        caratteriSettimanali: parseInt(caratteriSettimanaliField.textContent),
        caratteriMensili: parseInt(caratteriMensiliField.textContent)
    };

    caratteriGiornalieriField.innerHTML = `<span class="fw-bold">Caratteri Giornalieri:</span> <input type="number" id="caratteriGiornalieriInput" value="${utenteModificato.caratteriGiornalieri}">`;
    caratteriSettimanaliField.innerHTML = `<span class="fw-bold">Caratteri Settimanali:</span> <input type="number" id="caratteriSettimanaliInput" value="${utenteModificato.caratteriSettimanali}">`;
    caratteriMensiliField.innerHTML = `<span class="fw-bold">Caratteri Mensili:</span> <input type="number" id="caratteriMensiliInput" value="${utenteModificato.caratteriMensili}">`;

    // Aggiungi il pulsante "Salva Modifiche"
    const cardBody = document.querySelector(".card-body");
    const saveChangesBtn = document.createElement("button");
    saveChangesBtn.classList.add("btn");
    saveChangesBtn.classList.add("btn-primary");
    saveChangesBtn.innerText = "Salva Modifiche";
    cardBody.appendChild(saveChangesBtn);

    // Gestisci il salvataggio delle modifiche
    saveChangesBtn.addEventListener("click", function () {
        // Ottieni i nuovi valori dai campi di input
        const nuovoTipoUtente = document.getElementById("tipoUtenteInput").value;
        const nuovaPopolarita = document.getElementById("popolaritaInput").value;
        const nuoviCaratteriGiornalieri = document.getElementById("caratteriGiornalieriInput").value;
        const nuoviCaratteriSettimanali = document.getElementById("caratteriSettimanaliInput").value;
        const nuoviCaratteriMensili = document.getElementById("caratteriMensiliInput").value;

        // Aggiorna l'oggetto utenteModificato con i nuovi valori
        utenteModificato.tipoUtente = nuovoTipoUtente;
        utenteModificato.popolarita = nuovaPopolarita;
        utenteModificato.caratteriGiornalieri = parseInt(nuoviCaratteriGiornalieri);
        utenteModificato.caratteriSettimanali = parseInt(nuoviCaratteriSettimanali);
        utenteModificato.caratteriMensili = parseInt(nuoviCaratteriMensili);

        // Aggiorna i campi con i nuovi valori
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


parentElement.addEventListener("click", function(event) {
    if (event.target.id == "modificaBtn") {
        console.log(event)
        // Verifica se l'elemento di destinazione del clic è un pulsante con l'id "modificaBtn"
        const card = event.target.closest(".card"); // Trova la card padre dell'elemento cliccato

        if (card) {
            console.log(card)
            // Ottieni l'id univoco assegnato direttamente alla card
            const cardId = card.id;
            console.log(cardId)
            // Chiama la funzione di modifica specifica per la card corrispondente
            ModifyButton(cardId);
        }
    }
});