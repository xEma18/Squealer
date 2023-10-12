import React, { useState } from 'react';
import axios from 'axios';

const RegistrationForm = () => {
  // Stati per memorizzare i valori dei campi del form
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');


 
  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      // Effettua la richiesta POST all'endpoint /signin con i dati del form
      const response = await axios.post('http://localhost:3001/signin', {
        name: name,
        lastname: lastname,
      });
  
      // Ottieni la risposta dal server (in questo caso, il nuovo utente appena registrato)
      const newUser = response.data;
  
      // Puoi fare qualcosa con la risposta se necessario
      console.log('Nuovo utente registrato:', newUser);
    } catch (error) {
      // Gestisci gli errori qui
      console.error('Errore durante la registrazione:', error);
    }
  };

  return (
    <div>
      <h2>Registrazione</h2>
      <form onSubmit={handleSignIn}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <br />
        <label>
          Lastname:
          <input
            type="text"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
          />
        </label>
        <br />
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default RegistrationForm;