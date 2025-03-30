import { useEffect, useContext } from 'react';
import styled from 'styled-components';
import SideNav from './SideNav';
import UserContext from '../context/userContext';
import Cookie from 'js-cookie';
import axios from 'axios';
import PropTypes from 'prop-types';

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

const MainArea = styled.div`
  flex-grow: 1;
  height: 100vh;
  overflow-y: auto;
  scroll-behavior: smooth;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { 
    display: none;
  }
`;

const HomePage = ({ Component }) => {
  const { dispatch } = useContext(UserContext);

  useEffect(() => {
    const token = Cookie.get("accessToken");

    const fetchUserData = async (token) => {
      try {
        const response = await axios.get(`${API_URL}/profile`, { headers: { Authorization: `Bearer ${token}` } });
        if (response.status === 200 && response.data) {
          dispatch({ type: 'LOGIN', payload: response.data });
        } else {
          console.error("Login Error: Failed to fetch user data or invalid response format", response);
          window.location.href = "/";
        }
      } catch (err) {
        console.error("Login Error: Error fetching user data:", err);
        window.location.href = "/";
      }
    };

    if (!token) {
      window.location.href = "/";
    } else {
      fetchUserData(token);
    }
  }, [dispatch]);

  return (
    <AppContainer>
      <SideNav />
      <MainArea>
        {Component ? <Component /> : <div>Loading...</div>}
      </MainArea>
    </AppContainer>
  );
};

HomePage.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default HomePage;
