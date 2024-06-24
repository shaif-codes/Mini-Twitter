import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import LandingPage from './components/LandingPage';
import SignUpPopover from './components/SignUpPopover';
// import LoginPopover from './components/loginPopover';
import HomePage from './components/HomePage';
import CreatePostPopover from './components/CreatePostComponent';
import Explore from './components/Explore';
import Profile from './components/Profile';
import PracticeForm from './components/practiceForm';

const App = () => {
  const [showSignUp, setShowSignUp] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showHomePage, setShowHomePage] = useState(false);
  // const 
  
  const handlePopUp = () => {
    setShowSignUp(true);
  }

  return (
    <Router>
      <GlobalStyles />
      <Routes>
        <Route path="/" element={<LandingPage onShowSignUp={() => setShowSignUp(true)} />} />
        {/* <Route path="/pra" element={<PracticeForm />}/> */}
        {/* <Route path="/login" element={<LoginPopover />}/> */}
        <Route path="/home" element={<HomePage />}/>
        <Route path="/createPost" element={<CreatePostPopover />}/>
        <Route path="/explore" element={<Explore />}/>
        <Route path="/profile" element={<Profile/>} />
      </Routes>
      {/* {showSignUp && <SignUpPopover onClose={() => setShowSignUp(false)} />} */}
    </Router>
  );
};

export default App;
