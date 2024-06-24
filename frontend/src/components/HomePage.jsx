import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import SideNav from './SideNav';
import MainContent from './MainContent';
import Explore from './Explore';
import Profile from './Profile';
import UserContext from '../context/userContext';
import Cookie from 'js-cookie';
import axios from 'axios';

const AppContainer = styled.div`
  display: flex;
  height: 100%;
  overflow-y: auto; /* Enable scrolling */
  scroll-behavior: smooth; /* Smooth scrolling */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */

  &::-webkit-scrollbar { 
    display: none;  /* Safari and Chrome */
  }
`;

const HomePage = () => {
  const [state, setState] = useState({});

  //states for toggling between the different components
  const [showHome, setShowHome] = useState(true);
  const [showExplore, setShowExplore] = useState(false);
  const [showProfile, setShowProfile] = useState(false);


  useEffect(() => {
    const token = Cookie.get("accessToken");
    const userid = Cookie.get("userid");

    const fetchUserData = async (token) => {
      try {
        const response = await axios.get("api/profile", { headers: { Authorization: `Bearer ${token}` } });
        if (response.status === 200) {
          setState(response.data);
        }
      } catch (err) {
        console.log(err);
      }
    };

    if (token === undefined || userid === undefined) {
      console.log("redirecting to login");
      window.location.href = "/";  // Redirect to login page
    } else {
      fetchUserData(token);
    }
  }, [setState]);

  

  return (
    <UserContext.Provider value={{ state, setState }}>
      <AppContainer>
        <SideNav />
        <MainContent />
      </AppContainer>
    </UserContext.Provider>
  );
};

export default HomePage;
