import { useState } from "react";
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
import UserProfile from "./Feed/Search/UserProfile.jsx";
import ChannelProfile from "./Feed/Search/ChannelProfile.jsx";
import Keyword from "./Feed/Search/Keyword.jsx";
import UserSettings from "./UserSettings/UserSettings.jsx"
import SmmList from "./SmmList/SmmList.jsx";
import CreateChannel from "./CreateChannel/CreateChannel.jsx";


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
    status: "Active",
    tipoUtente: "",
    popolarita: "Low",
    caratteriGiornalieri: 500,
    caratteriSettimanali: 3500,
    caratteriMensili: 14000,
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
        <Route path="/App/" element={<InitialPage />} />
        <Route
          path="/App/SignUpPage1"
          element={<SignUp1 updateRegistrationData={updateRegistrationData} />}
        />
        <Route
          path="/App/SignUp2"
          element={<SignUp2 updateRegistrationData={updateRegistrationData} />}
        />
        <Route
          path="/App/SignUp3"
          element={<SignUp3 updateRegistrationData={updateRegistrationData} />}
        />
        <Route
          path="/App/SignUp4"
          element={
            <SignUp4
              updateRegistrationData={updateRegistrationData}
              registrationData={registrationData}
            />
          }
        />
        <Route path="/App/LogIn" element={<Login />} />
        <Route path="/App/Feed" element={<Feed />} />
        <Route path="/App/Feed/WriteSqueal" element={<WriteSqueal />} />
        <Route path="/App/Feed/comments" element={<CommentsList />} />
        <Route path="/App/Feed/Search" element={<Search />} />
        <Route path="/App/user/:username" element={<UserProfile />} />
        <Route path="/App/channel/:channelName" element={<ChannelProfile />} />
        <Route path="/App/keyword/:keyword" element={<Keyword />} />
        <Route path="/App/UserSettings" element={<UserSettings />}/>
        <Route path="/App/ManageSMM" element={<SmmList />} />
        <Route path="/App/Feed/createChannel" element={<CreateChannel/>} />
        
      </Routes>
    </Router>
  );
};

export default App;
