import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../assets/images/logo.png';
import { useNavigate } from 'react-router-dom';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(91, 112, 131, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
`;


const Popover = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 75vw;
  height: 82vh;
  max-width: 400px;
  background-color: black;
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const H2 = styled.h2`
  color: white;
  font-size: 35px;
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  width: 75%;
  color: white;
  background-color: black;
  border: none;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 15px 20px;
  &:active {
    border: 1px solid #1a89d4;
  }
  &:focus {
    border: 1px solid #1a89d4;
  }
`;

const LoginButton = styled.button`
  color: black;
  border: none;
  border-radius: 30px;
  background-color: #d7dbdc;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  margin: 10px 0;
  width: 80%;
  border-radius: 25px;
  &:hover {
    opacity: 0.9;
  }
`;

const SignUpMessage = styled.p`
  font-size: 12px;
  color: grey;
  margin-top: 10px;
`;

const SignUpLink = styled.span`
  color: #1a89d4;
  cursor: pointer;
`;

const LoginPopover = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleLogin = () => {
        // Handle login logic
    };

    return (
        <Overlay>
            <Popover>
                <Container>
                    <img src={logo} alt="" width={50} />
                    <H2>Enter your password</H2>
                    <Input
                        type="text"
                        name="username"
                        value={formData.username}
                        placeholder="Username"
                        onChange={handleChange}
                    />
                    <Input
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="Password"
                        onChange={handleChange}
                    />
                    <LoginButton onClick={handleLogin}>Log in</LoginButton>
                    <SignUpMessage>
                        Don’t have an account?{' '}
                        <SignUpLink onClick={() => navigate('/signup')}>Sign up</SignUpLink>
                    </SignUpMessage>
                </Container>
            </Popover>
        </Overlay>
    );
};

export default LoginPopover;
