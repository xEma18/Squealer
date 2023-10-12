"use strict";

// Script temporaneo che serve per andare avanti cliccando il pulsante. Questo codice verrà poi
// rimpiazzato completamente da react.

if (document.location.href == "http://127.0.0.1:5500/index.html") {
  const signUpBtn = document.querySelector("#btn-registrati");

  signUpBtn.addEventListener("click", () => {
    document.location.href = "sign_up.html";
  });
}

if (document.location.href == "http://127.0.0.1:5500/sign_up.html") {
  const avantiBtn = document.querySelector("#btn-signup-1");

  avantiBtn.addEventListener("click", () => {
    document.location.href = "sign_up_2.html";
  });
}

if (document.location.href == "http://127.0.0.1:5500/sign_up_2.html") {
  const avantiBtn = document.querySelector("#btn-signup-2");

  avantiBtn.addEventListener("click", () => {
    document.location.href = "sign_up_3.html";
  });
}
