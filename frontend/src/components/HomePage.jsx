import React from 'react';
import styled from 'styled-components';
import SideNav from './SideNav';
import MainContent from './MainContent';

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

const App = () => {
  return (
    <AppContainer>
      <SideNav />
      <MainContent />
    </AppContainer>
  );
};

export default App;
