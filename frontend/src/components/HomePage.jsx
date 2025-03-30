import React, { useEffect, useState, useContext } from 'react';
import styled from 'styled-components';
import SideNav from './SideNav';
import MainContent from './MainContent';
import Explore from './Explore';
import Profile from './Profile';
import UserContext from '../context/userContext';
import Cookie from 'js-cookie';
import axios from 'axios';
import CreatePostComponent from './CreatePostComponent';

const API_URL = import.meta.env.VITE_API_URL;

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
  const { dispatch, setTweetState } = useContext(UserContext);

  const [showHome, setShowHome] = useState(true);
  const [showExplore, setShowExplore] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    const token = Cookie.get("accessToken");
    const userid = Cookie.get("userid");

    const fetchUserData = async (token) => {
      try {
        const response = await axios.get(`${API_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } });
        if (response.status === 200 && response.data.data) {
          dispatch({ type: 'LOGIN', payload: response.data.data });
        } else {
          // console.error("Failed to fetch user data or invalid response format");
          window.location.href = "/";
        }
      } catch (err) {
        // console.error("Error fetching user data:", err);
        window.location.href = "/";
      }
    };

    if (token === undefined || userid === undefined) {
      window.location.href = "/";
    } else {
      fetchUserData(token);
    }
  }, [dispatch]);

  return (
    <AppContainer>
      <SideNav toggleCtrl={
        {
          home: [showHome, setShowHome], 
          explore:[showExplore, setShowExplore], 
          profile: [showProfile, setShowProfile]
        }} />
        {showHome && <MainContent />}
        {showExplore && <Explore/>}
        {showProfile && <Profile/>}
    </AppContainer>
  );
};

export default HomePage;
