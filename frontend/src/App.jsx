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
import MainContent from './components/MainContent';
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
          {/* Route for logged-in user's own profile */}
          <Route path="/profile" element={<HomePage Component={Profile}/>} />
          {/* Dynamic route for viewing specific user profiles */}
          <Route path="/profile/:userId" element={<HomePage Component={Profile}/>} /> 
          <Route path="/home" element={<HomePage Component={MainContent}/>}/>
          <Route path="/createPost" element={<CreatePostPopover />}/> 
          <Route path="/explore" element={<HomePage Component={Explore}/>}/> 
          {/* Ensure HomePage handles rendering the passed Component */}
        </Routes>
      </Router>
    </UserContext.Provider>
  );
};

export default App;
