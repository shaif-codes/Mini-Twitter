import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import logo from '../assets/images/logo.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { RxCross1 } from 'react-icons/rx';
import axios from 'axios';
import Cookie from 'js-cookie';
import UserContext from '../context/userContext';
const API_URL = import.meta.env.VITE_API_URL;

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
const PasswordContainer = styled.div`
  display: flex;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 80%;
  margin: 10px 0;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  &:focus {
    outline: none;
  }
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  width: 75%;
  color: white;
  background-color: black;
  border: none;
  border-radius: 5px;
  margin: 0px 20px;
  &:active {
    border: 1px solid #1a89d4;
  }
  &:focus {
    // border: none;
    outline: none;
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

const LoginPopover = ({ onClose, onToggle }) => {
  const [formData, setFormData] = useState({
    userid: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { state, setState } = useContext(UserContext);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleLogin = async () => {
    console.log(formData.userid, formData.password);
    try {
      const response = await axios.post(`${API_URL}/login`, { userid: formData.userid, password: formData.password });
      console.log(response.data);
      if (response.data?.accessToken) {
        Cookie.set('accessToken', response.data.accessToken);
        Cookie.set('userid', formData.userid);
        window.location.href = '/home';
        // setState(response.data.user);
        // console.log(state);
        // rest logic we have to implement
      } else {
        console.log('Invalid credentials');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Overlay>
      <Popover>
        <Container>
          <Group>
            <img src={logo} alt="" width={50} />
            <h2 onClick={onClose} title="close" style={{ position: 'relative', left: '40%', top: '10%' }}>
              <RxCross1 />
            </h2>
          </Group>
          <H2>Enter your password</H2>
          <PasswordContainer>
          <Input
            type="text"
            name="userid"
            value={formData.userid}
            placeholder="userid"
            onChange={handleChange}
          />
          </PasswordContainer>
          <PasswordContainer>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              placeholder="Password"
              onChange={handleChange}
              style={{border: "none",
                      margin: "0px 20px"}}
            />
            <ToggleButton onClick={handleTogglePassword}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
            </ToggleButton>
          </PasswordContainer>
          <LoginButton onClick={handleLogin}>Log in</LoginButton>
          <SignUpMessage>
            Don’t have an account? <SignUpLink onClick={onToggle}>Sign up</SignUpLink>
          </SignUpMessage>
        </Container>
      </Popover>
    </Overlay>
  );
};

export default LoginPopover;
