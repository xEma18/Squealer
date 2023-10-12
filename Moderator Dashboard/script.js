    
/*Funzione per il cambio pagina*/
function cambiaPagina(url){
    window.location.href = url;
}
   


/*Gestione modifica e salvataggio parametri utente*/

        // Ottengo il riferimento al pulsante "Modifica" e ai campi dati
        const modificaBtn = document.getElementById("modificaBtn");
        const tipoUtenteField = document.querySelector("h6:nth-child(3)");
        const popolaritaField = document.querySelector("h6:nth-child(4)");
        const caratteriGiornalieriField = document.querySelector("h6:nth-child(5)");
        const caratteriSettimanaliField = document.querySelector("h6:nth-child(6)");
        const caratteriMensiliField = document.querySelector("h6:nth-child(7)");

        // Aggiungo un gestore di eventi al pulsante "Modifica"
        modificaBtn.addEventListener("click", function () {
            // Rendo invisibile il pulsante modifica
            modificaBtn.style.display = "none";

            // Abilita la modifica dei campi
            tipoUtenteField.innerHTML = `<span class="fw-bold">Tipo utente:</span> <select id="tipoUtenteInput">
                <option value="VIP">VIP</option>
                <option value="Normale">Normale</option>
                <option value="Premium">Premium</option>
            </select>`;
            popolaritaField.innerHTML = `<span class="fw-bold">Popolarità:</span> <select id="popolaritaInput">
                <option value="Alta">Alta</option>
                <option value="Media">Media</option>
                <option value="Bassa">Bassa</option>
            </select>`;
            caratteriGiornalieriField.innerHTML = `<span class="fw-bold">Caratteri Giornalieri:</span> <input type="number" id="caratteriGiornalieriInput" value="100">`;
            caratteriSettimanaliField.innerHTML = `<span class="fw-bold">Caratteri Settimanali:</span> <input type="number" id="caratteriSettimanaliInput" value="100">`;
            caratteriMensiliField.innerHTML = `<span class="fw-bold">Caratteri Mensili:</span> <input type="number" id="caratteriMensiliInput" value="100">`;

            // Aggiungo pulsante "Salva Modifiche"
            const cardBody = document.querySelector(".card-body");
            const saveChangesBtn = document.createElement("button");
            saveChangesBtn.classList.add("btn");
            saveChangesBtn.classList.add("btn-primary");
            saveChangesBtn.innerText = "Salva Modifiche";
            cardBody.appendChild(saveChangesBtn);

            // Gestisco il salvataggio delle modifiche
            saveChangesBtn.addEventListener("click", function () {
                // Ottengo i nuovi valori dai campi di input
                const nuovoTipoUtente = document.getElementById("tipoUtenteInput").value;
                const nuovaPopolarita = document.getElementById("popolaritaInput").value;
                const nuoviCaratteriGiornalieri = document.getElementById("caratteriGiornalieriInput").value;
                const nuoviCaratteriSettimanali = document.getElementById("caratteriSettimanaliInput").value;
                const nuoviCaratteriMensili = document.getElementById("caratteriMensiliInput").value;

                // Aggiorno i campi con i nuovi valori
                tipoUtenteField.innerHTML = `<span class="fw-bold">Tipo utente:</span> ${nuovoTipoUtente}`;
                popolaritaField.innerHTML = `<span class="fw-bold">Popolarità:</span> ${nuovaPopolarita}`;
                caratteriGiornalieriField.innerHTML = `<span class="fw-bold">Caratteri Giornalieri:</span> ${nuoviCaratteriGiornalieri}`;
                caratteriSettimanaliField.innerHTML = `<span class="fw-bold">Caratteri Settimanali:</span> ${nuoviCaratteriSettimanali}`;
                caratteriMensiliField.innerHTML = `<span class="fw-bold">Caratteri Mensili:</span> ${nuoviCaratteriMensili}`;

                // Rimuovo il pulsante "Salva Modifiche"
                cardBody.removeChild(saveChangesBtn);

                // Mostro nuovamente il pulsante "Modifica"
                modificaBtn.style.display = "inline-block";
            });
            
        });
