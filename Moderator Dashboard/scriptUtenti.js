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














/*Gestione modifica e salvataggio parametri utente*/

// Prendo il box che contiene i bottoni
const parentElement = document.getElementById("BtnBox");

// Array di utenti
var arrayUtenti = [];

// Funzione per ottenere il numero della card dalla sua id
function getCardNumber(cardId) {
    // L'id della card è nella forma "card-X", quindi possiamo estrarre il numero dalla fine dell'id
    const cardNumber = cardId.split('-')[1];
    return parseInt(cardNumber);
}



// Aggiungi un gestore di eventi al pulsante "Modifica"
function ModifyButton(cardId,cardNumber) {
    console.log(arrayUtenti)
    // Capisco che card è stata selezionata
    const card = document.getElementById(cardId);

    // Prendo tutti i campi della card
    const modificaBtn = card.querySelector("#modificaBtn");

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
    caratteriGiornalieriField.innerHTML = `<span class="fw-bold">Caratteri Giornalieri:</span> <input type="number" id="caratteriGiornalieriInput">`
    caratteriSettimanaliField.innerHTML = `<span class="fw-bold">Caratteri Settimanali:</span> <input type="number" id="caratteriSettimanaliInput">`;
    caratteriMensiliField.innerHTML = `<span class="fw-bold">Caratteri Mensili:</span> <input type="number" id="caratteriMensiliInput">`;

    let utenteModificato = arrayUtenti[cardNumber - 1];
    if (!utenteModificato) {
        // Se l'utente non è presente, crea un nuovo oggetto utente
        utenteModificato = {
            //capire come mettere il campo nome
            tipoUtente: tipoUtenteField.value,
            popolarita: popolaritaField.value,
            caratteriGiornalieri: parseInt(caratteriGiornalieriField.textContent),
            caratteriSettimanali: parseInt(caratteriSettimanaliField.textContent),
            caratteriMensili: parseInt(caratteriMensiliField.textContent)
        };
        arrayUtenti[cardNumber - 1] = utenteModificato;

    }
    else {
    // Aggiorno i valori dei campi
    if((arrayUtenti[cardNumber-1].tipoUtente) == "VIP"){
        tipoUtenteField.innerHTML = `<span class="fw-bold">Tipo utente:</span>
        <select id="tipoUtenteInput">
        <option value="VIP" selected="selected">VIP</option>
        <option value="Normale">Normale</option>
        <option value="Premium">Premium</option>
        </select>`;
        } 
        else if((arrayUtenti[cardNumber-1].tipoUtente) == "Normale"){
            tipoUtenteField.innerHTML = `<span class="fw-bold">Tipo utente:</span>
            <select id="tipoUtenteInput">
            <option value="VIP">VIP</option>
            <option value="Normale" selected="selected">Normale</option>
            <option value="Premium">Premium</option>
            </select>`;
        }
            else {
                tipoUtenteField.innerHTML = `<span class="fw-bold">Tipo utente:</span>
                <select id="tipoUtenteInput">
                <option value="VIP">VIP</option>
                <option value="Normale">Normale</option>
                <option value="Premium" selected="selected">Premium</option>
                </select>`;
            }
    if((arrayUtenti[cardNumber-1].popolarita) == "Alta"){
    popolaritaField.innerHTML =  `<span class="fw-bold">Popolarità:</span>
    <select id="popolaritaInput">
        <option value="Alta" selected="selected">Alta</option>
        <option value="Media">Media</option>
        <option value="Bassa">Bassa</option>
    </select>`; 
    } 
    else if((arrayUtenti[cardNumber-1].popolarita) == "Media"){
        popolaritaField.innerHTML =  `<span class="fw-bold">Popolarità:</span>
        <select id="popolaritaInput">
            <option value="Alta">Alta</option>
            <option value="Media" selected="selected">Media</option>
            <option value="Bassa">Bassa</option>
        </select>`; 
    }
        else {
            popolaritaField.innerHTML =  `<span class="fw-bold">Popolarità:</span>
        <select id="popolaritaInput">
            <option value="Alta">Alta</option>
            <option value="Media"</option>
            <option value="Bassa" selected="selected">Bassa</option>
        </select>`; 
        }
    caratteriGiornalieriField.innerHTML = `<span class="fw-bold">Caratteri Giornalieri:</span> <input type="number" id="caratteriGiornalieriInput" value="${arrayUtenti[cardNumber-1].caratteriGiornalieri}">`;
    caratteriSettimanaliField.innerHTML = `<span class="fw-bold">Caratteri Settimanali:</span> <input type="number" id="caratteriSettimanaliInput" value="${arrayUtenti[cardNumber-1].caratteriSettimanali}">`;
    caratteriMensiliField.innerHTML = `<span class="fw-bold">Caratteri Mensili:</span> <input type="number" id="caratteriMensiliInput" value="${arrayUtenti[cardNumber-1].caratteriMensili}">`;


    }

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

        // Aggiorna l'oggetto utenteModificato con i nuovi valori
        utenteModificato.tipoUtente = nuovoTipoUtente;
        utenteModificato.popolarita = nuovaPopolarita;
        utenteModificato.caratteriGiornalieri = parseInt(nuoviCaratteriGiornalieri);
        utenteModificato.caratteriSettimanali = parseInt(nuoviCaratteriSettimanali);
        utenteModificato.caratteriMensili = parseInt(nuoviCaratteriMensili);
        
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
                    cognome:cognome,
                    popolarita: utenteModificato.popolarita,
                    tipoUtente: utenteModificato.tipoUtente,
                    caratteriGiornalieri: utenteModificato.caratteriGiornalieri,
                    caratteriSettimanali: utenteModificato.caratteriSettimanali,
                    caratteriMensili: utenteModificato.caratteriMensili,
                }),
            });
    
            if (!response.ok) {
                throw new Error('Errore durante la chiamata POST all\'API');
            }
    
            console.log('Dati aggiornati con successo nel database');
        } catch (error) {
            console.error('Errore durante la chiamata POST all\'API:', error);
        }






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
        console.log(arrayUtenti)
    });
};



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


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('http://localhost:3001/users');
        const users = await response.json();
        
        // Aggiorna le card con i dati degli utenti
        updateCards(users);
    } catch (error) {
        console.error('Errore durante il recupero degli utenti:', error);
    }
});


function updateCards(users) {
    const cards = document.querySelectorAll('.card');

    cards.forEach((card, index) => {
        const cardBody = card.querySelector('.card-body');
        const nameElement = cardBody.querySelector('.card-title');
        const statusElement=cardBody.querySelector('.status');
        const tipoUtenteElement = cardBody.querySelector('.tipoUtente');
        const popolaritaElement=cardBody.querySelector('.popolarita')
        const caratteriGiornalieriElement=cardBody.querySelector('.caratteriGiornalieri');
        const caratteriSettimanaliElement=cardBody.querySelector('.caratteriSettimanali');
        const caratteriMensiliElement=cardBody.querySelector('.caratteriMensili');

        // Mi assicuro che l'indice sia valido nell' array di utenti
        if (index < users.length) {
            const user = users[index];
            
            // Aggiorno gli elementi della card con i dati dell'utente corrente
            nameElement.textContent = `${user.name} ${user.lastname}`;

            statusElement.textContent=`${user.status}`;
            if (user.status === "Attivo") {
                statusElement.style.color = "green";
            } else {
                statusElement.style.color = "rgb(128, 0, 0)";
            }

            tipoUtenteElement.textContent = ` ${user.tipoUtente}`;

            popolaritaElement.textContent=` ${user.popolarità}`;

            caratteriGiornalieriElement.textContent=` ${user.caratteriGiornalieri}`;
            caratteriSettimanaliElement.textContent=` ${user.caratteriSettimanali}`;
            caratteriMensiliElement.textContent=` ${user.caratteriMensili}`;

            
        }
    });
}

