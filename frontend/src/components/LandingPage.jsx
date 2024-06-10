import React from 'react';
import styled from 'styled-components';
import logo from '../assets/images/logo.png';
import AuthButton from './AuthButton';
import { Link } from 'react-router-dom';

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
  font-size: clamp(48px, 5vw, 85px); /* Dynamic size between 48px and 85px */
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

const LandingPage = ({ onShowSignUp }) => {
    return (
        <Container>
            <LeftSide>
                <Logo src={logo} alt="Logo" />
            </LeftSide>
            <RightSide>
                <Heading>Happening now</Heading>
                <Subheading>Join today.</Subheading>
                <FormContainer>
                    <AuthButton redirect={"/signup"} primary>Create account</AuthButton>
                    <Text>Already have an account?</Text>
                    <AuthButton redirect={"/login"}>Sign in</AuthButton>
                </FormContainer>
            </RightSide>
        </Container>
    );
};

export default LandingPage;
