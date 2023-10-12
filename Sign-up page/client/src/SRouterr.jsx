import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import InitialPage from './InitialPageComponent.jsx';
import SignUpPage1 from './SignUpPage1.jsx';

function SRouterr() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<InitialPage />} />
          <Route path="/sign_up1" element={<SignUpPage1 />} />
        </Routes>
      </Router>
    );
  }
  
  export default SRouterr;