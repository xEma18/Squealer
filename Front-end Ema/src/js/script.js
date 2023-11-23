"use strict";

// Script temporaneo che serve per andare avanti cliccando il pulsante. Questo codice verrà poi
// rimpiazzato completamente da react.

const pathEma = `http://127.0.0.1:5500/Front-end%20Ema`;
const pathManuel = `C:/Users/manue/Desktop/Squealer`;

if (document.location.href == `${pathEma}/index.html`) {
  const signUpBtn = document.querySelector("#btn-registrati");
  const signInBtn = document.querySelector("#btn-accedi");

  signUpBtn.addEventListener("click", () => {
    document.location.href = "sign_up.html";
  });

  signInBtn.addEventListener("click", () => {
    document.location.href = "sign_in.html";
  });
}

if (document.location.href == `${pathEma}/sign_up.html`) {
  const avantiBtn = document.querySelector("#btn-signup-1");

  avantiBtn.addEventListener("click", () => {
    document.location.href = "sign_up_2.html";
  });
}

if (document.location.href == `${pathEma}/sign_up_2.html`) {
  const avantiBtn = document.querySelector("#btn-signup-2");

  avantiBtn.addEventListener("click", () => {
    document.location.href = "sign_up_3.html";
  });
}

if (document.location.href == `${pathEma}/sign_up_3.html`) {
  const avantiBtn = document.querySelector("#btn-signup-3");

  avantiBtn.addEventListener("click", () => {
    document.location.href = "sign_up_4.html";
  });
}

if (document.location.href == `${pathEma}/sign_up_4.html`) {
  const avantiBtn = document.querySelector("#btn-signup-4");

  // Questa parte di codice serve per aggiornare il counter delle parole. Se vuoi puoi riutilizzarla.
  // Inizia qui
  const txtArea = document.querySelector("#description-box");
  const wordCounter = document.querySelector(".word-counter");

  const maxChar = 150;

  txtArea.addEventListener("input", (e) => {
    e.preventDefault();

    const charCounter = txtArea.value.length;

    wordCounter.innerHTML = `${charCounter}/${maxChar}`;
    if (charCounter > 150) wordCounter.style.color = "red";
    else if (charCounter <= 150) wordCounter.style.color = "black";
  });
  // Finisce qui

  avantiBtn.addEventListener("click", () => {
    document.location.href = "index.html";
  });
}
