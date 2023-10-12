import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InitialPage from './InitialPageComponent.jsx';
import SignUpPage1 from './SignUpPage1.jsx';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InitialPage />} />
        <Route path="/SignUpPage1" element={<SignUpPage1 />} />
      </Routes>
    </Router>
  );
  };
  
  export default App;