import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InitialPage from './InitialPageComponent.jsx';
import SignUp1 from './SignUp1.jsx';
import SignUp2 from './SignUp2.jsx';
import SignUp3 from './SignUp3.jsx';



const App = () => {

   // Stati per memorizzare i dati della registrazione raccolti in SignUp1, SignUp2, SignUp3
  const [registrationData, setRegistrationData] = useState({
    name: '',
    lastname: '',
    day: '',
    month: '',
    year: '',
    proCheck: false,
    email: '',
    password:'',
  });

   // Funzione per aggiornare i dati della registrazione (mantiene i dati già scritti e scrive in nuovi dati che passo come parametro)
   const updateRegistrationData = (newData) => {
    setRegistrationData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialPage />} />
        <Route path="/SignUpPage1" element={<SignUp1 updateRegistrationData={updateRegistrationData} />} />
        <Route path="/SignUp2" element={<SignUp2 updateRegistrationData={updateRegistrationData} />} />
        <Route path="/SignUp3" element={<SignUp3 updateRegistrationData={updateRegistrationData} />} />
        {/*<Route path="/Submit" element={<SignUpPage1 registrationData={registrationData} />} /> */}

      </Routes>
    </Router>
  );
  };
  
  export default App;