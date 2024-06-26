import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../assets/images/logo.png';
import AuthButton from './AuthButton';
import SignUpPopover from './SignUpPopover';
import LoginPopover from './loginPopover';
import UserState from '../context/UserState';

const Container = styled.div`
  display: flex;
  height: 100vh;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const LeftSide = styled.div`
  flex: 1;
  background-color: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    flex: none;
    width: 100%;
  }
`;

const RightSide = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000;
  position: relative;
  @media (max-width: 768px) {
    flex: none;
    width: 100%;
  }
`;

const Logo = styled.img`
  width: 50%;
  @media (max-width: 768px) {
    width: 20%;
  }
`;

const Heading = styled.h1`
  font-size: clamp(48px, 5vw, 85px);
  margin-bottom: 20px;
  @media (max-width: 768px) {
    font-size: 48px;
  }
`;

const Subheading = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 300px;
`;

const Text = styled.p`
  margin: 10px 0;
`;

const Message = styled.p`
  font-size: 12px;
  align-self: center;
  width: 100%;
  color: grey;
  margin-top: -10px;
`;

const Blue = styled.a`
  color: #1a89d4;
  cursor: pointer;
`;

const LandingPage = () => {
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleShowSignUp = () => {
    setShowSignUp(!showSignUp);
  };
  
  const handleShowLogin = () => {
    setShowLogin(!showLogin);
  };
  
  const handleCloseSignUp = () => {
    setShowSignUp(false);
  };
  
  const handleCloseLogin = () => {
    setShowLogin(false);
  };

  const handleTogglePopover = () => {
    setShowSignUp(!showSignUp);
    setShowLogin(!showLogin);
  };

  return (
    <UserState>
      <Container>
        <LeftSide>
          <Logo src={logo} alt="Logo" />
        </LeftSide>
        <RightSide>
          <Heading>Happening now</Heading>
          <Subheading>Join today.</Subheading>
          <FormContainer>
            <AuthButton onClick={handleShowSignUp} primary>Create account</AuthButton>
            <Message>
              By signing up, you agree to the <Blue href="https://x.com/en/tos">Terms of Service</Blue> and <Blue href="https://x.com/en/privacy">Privacy Policy</Blue>, including <Blue href="https://help.x.com/en/rules-and-policies/x-cookies">Cookie Use.</Blue>
            </Message>
            <Text>Already have an account?</Text>
            <AuthButton onClick={handleShowLogin}>Sign in</AuthButton>
          </FormContainer>
          {showSignUp && <SignUpPopover onClose={handleCloseSignUp} />}
          {showLogin && <LoginPopover onClose={handleCloseLogin} onToggle={handleTogglePopover} />}
        </RightSide>
      </Container>
    </UserState>
  );
};

export default LandingPage;
