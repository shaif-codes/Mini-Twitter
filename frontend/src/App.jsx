import React, { useReducer } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import GlobalStyles from './styles/GlobalStyles';
import LandingPage from './components/LandingPage';
// import SignUpPopover from './components/SignUpPopover';
// import LoginPopover from './components/loginPopover';
import HomePage from './components/HomePage';
import CreatePostPopover from './components/CreatePostComponent';
import Explore from './components/Explore';
import Profile from './components/Profile';
// import PracticeForm from './components/practiceForm';
import UserContext from './context/userContext';
import userReducer from './userReducer';

const App = () => {
  // Define initial state including followers and following
  const initialUserState = {
    followers: [],
    following: [],
    // Add other initial state properties if needed (e.g., null user, etc.)
  };
  const [state, dispatch] = useReducer(userReducer, initialUserState);
  
  const [tweetState, setTweetState] = React.useState([]);

  return (
    <UserContext.Provider value={{ state, dispatch, tweetState, setTweetState }}>
      <Router>
        <GlobalStyles />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomePage />}/>
          <Route path="/createPost" element={<CreatePostPopover />}/>
          <Route path="/explore" element={<Explore />}/>
          <Route path="/profile" element={<Profile/>} />
        </Routes>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
