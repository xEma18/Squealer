import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import InitialPage from "./InitialPageComponent.jsx";
import SignUp1 from "./SignUp/SignUp1.jsx";
import SignUp2 from "./SignUp/SignUp2.jsx";
import SignUp3 from "./SignUp/SignUp3.jsx";
import SignUp4 from "./SignUp/SignUp4.jsx";
import Login from "./Login/Login.jsx";
import Feed from "./Feed/Feed.jsx";
import WriteSqueal from "./Feed/writeSqueal/writeSqueal.jsx";
import CommentsList from "./Feed/comments/CommentsList.jsx";
import Search from "./Feed/Search/Search.jsx";
import UserProfile from './Feed/Search/UserProfile.jsx';
import ChannelProfile from './Feed/Search/ChannelProfile.jsx';
import Keyword from './Feed/Search/Keyword.jsx';

const App = () => {
  // Stati per memorizzare i dati della registrazione raccolti in SignUp1, SignUp2, SignUp3
  const [registrationData, setRegistrationData] = useState({
    username: "",
    name: "",
    lastname: "",
    day: "",
    month: "",
    year: "",
    email: "",
    password: "",
    image: "",
    description: "",
    statoAccount: "Attivo",
    tipoUtente: "",
    popolarita: "Bassa",
    caratteriGiornalieri: 200,
    caratteriSettimanali: 1400,
    caratteriMensili: 5600,
    caratteriGiornalieriUsati: 0,
    caratteriSettimanaliUsati: 0,
    caratteriMensiliUsati: 0,
  });

  // Funzione per aggiornare i dati della registrazione (mantiene i dati già scritti e scrive in nuovi dati che passo come parametro)
  const updateRegistrationData = (newData) => {
    setRegistrationData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialPage />} />
        <Route
          path="/SignUpPage1"
          element={<SignUp1 updateRegistrationData={updateRegistrationData} />}
        />
        <Route
          path="/SignUp2"
          element={<SignUp2 updateRegistrationData={updateRegistrationData} />}
        />
        <Route
          path="/SignUp3"
          element={<SignUp3 updateRegistrationData={updateRegistrationData} />}
        />
        <Route
          path="/SignUp4"
          element={
            <SignUp4
              updateRegistrationData={updateRegistrationData}
              registrationData={registrationData}
            />
          }
        />
        <Route path="/LogIn" element={<Login />} />
        <Route path="/Feed" element={<Feed />} />
        <Route path="/Feed/WriteSqueal" element={<WriteSqueal />} />
        <Route path="/Feed/comments/CommentsList" element={<CommentsList />} />
        <Route path="/Feed/Search" element={<Search />} />
        <Route path="/user/:username" element={<UserProfile />} />
        <Route path="/channel/:channelName" element={<ChannelProfile />} />
        <Route path="/keyword/:keyword" element={<Keyword />} />

        <Route path="*" element={<Login/>} />

        


      </Routes>
    </Router>
  );
};

export default App;
