import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoArrowBackOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import AuthButton from './AuthButton';
import logo from '../assets/images/logo.png';
import axios from 'axios';
import useDebounce from '../hooks/useDebounce';  // Import the debounce hook

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  width: 75vw;
  height: 85vh;
  max-width: 600px;
  padding: 20px;
  background-color: black;
`;
const Group = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
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
  &:hover, &:focus, &:active {
    border: none;
    outline: none;
  }
`;

const PasswordContainer = styled.div`
  display: flex;
  border: 2px solid #ccc;
  border-radius: 5px;
  width: 75%;
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

const SignUpButton = styled.button`
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
  &:disabled {
    background-color: #787a7a;
  }
`;

const Message = styled.p`
  font-size: 12px;
  color: grey;
  margin-top: 10px;
`;

const SignUpPageTwo = ({ formData, onSubmit, onBack }) => {
    const getUserid = formData.userId ? formData.userId : "";
    const getPassword = formData.password ? formData.password : "";

    const [password, setPassword] = useState(getPassword);
    const [userId, setUserId] = useState(getUserid);
    const [showPassword, setShowPassword] = useState(false);
    const [usernameError, setUsernameError] = useState('');

    const debouncedUserId = useDebounce(userId, 500); // 500ms debounce delay

    useEffect(() => {
        const checkAvailableUserId = async (debouncedUserId) => {
            try {
                const response = await axios.post("/api/debounce/userid", { userid: debouncedUserId });
                console.log(response.data?.userid);
                if (response.data?.userid) {
                    setUsernameError('Username is not available');
                } else {
                    setUsernameError('');
                    
                }
            } catch (error) {
                console.error(error);
                setUsernameError('Error checking username');
            }
        };

        if (debouncedUserId) {
            checkAvailableUserId(debouncedUserId);
        }
    }, [debouncedUserId]);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        formData.password = e.target.value;
    };

    const handleUserIdChange = (e) => {
        setUserId(e.target.value);
        formData.userId = e.target.value;
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const isValid = () => {
        const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])');
        const usernameRegex = new RegExp('^[a-zA-Z0-9_]*$');
        return password.length >= 8 && passwordRegex.test(password) && usernameRegex.test(userId) && usernameError === '';
    };

    return (
        <Container>
            <Group>
                <Group style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <h2 onClick={onBack} style={{ alignSelf: "flex-start" }}><IoArrowBackOutline /></h2>
                    <img src={logo} height={50} alt="logo" />
                    <h2 onClick={() => window.location.href = "/"}><RxCross1 /></h2>
                </Group>
                <h2>Set your password</h2>
                <PasswordContainer>
                    <Input type="text" value={userId} onChange={handleUserIdChange} placeholder="Enter Your UserId" />
                </PasswordContainer>
                {formData.userId ? (usernameError && <Message>{usernameError}</Message>) : 
                <Message>
                    Username should be unique and should not contain any special characters
                </Message>}

                <PasswordContainer>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder="Password"
                    />
                    <ToggleButton onClick={handleTogglePassword}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </ToggleButton>
                </PasswordContainer>
                <Message>
                    Passwords must be at least 8 characters long. <br />
                    Passwords must have at least one special character. <br />
                    Passwords must have at least one uppercase ('A'-'Z'). <br />
                    Passwords must have at least one lowercase ('a'-'z').<br />
                    Passwords must have at least one digit ('0'-'9').
                </Message>
            </Group>
            <Group>
                <Message>
                    By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use. X may use your contact information, including your email address and phone number for purposes outlined in our Privacy Policy, such as keeping your account secure and personalising our services, including ads. Learn more. Others will be able to find you by email address or phone number, when provided, unless you choose otherwise here.
                </Message>
                <SignUpButton $primary onClick={() => onSubmit({ ...formData, password, userId })} disabled={!isValid()}>
                    Sign up
                </SignUpButton>
            </Group>
        </Container>
    );
};

export default SignUpPageTwo;
