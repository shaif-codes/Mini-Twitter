import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoArrowBackOutline } from "react-icons/io5";
import { RxCross1 } from "react-icons/rx";
import logo from '../assets/images/logo.png';
import axios from 'axios';
import useDebounce from '../hooks/useDebounce';  // Import the debounce hook
import PropTypes from 'prop-types';
const API_URL = import.meta.env.VITE_API_URL;

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
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px black inset !important;
      -webkit-text-fill-color: white !important;
      transition: background-color 5000s ease-in-out 0s;
    }
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

const SignUpPageTwo = ({ formData, onSubmit, onBack, isEditMode = false }) => {
    const getUserid = formData.userId ? formData.userId : "";
    const getPassword = formData.password ? formData.password : "";

    const [password, setPassword] = useState(getPassword);
    const [confirmPassword, setConfirmPassword] = useState(getPassword);
    const [userId, setUserId] = useState(getUserid);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const debouncedUserId = useDebounce(userId, 500); // 500ms debounce delay

    useEffect(() => {
        const checkAvailableUserId = async (debouncedUserId) => {
            // If in edit mode and userId is the same as original, don't check
            if (isEditMode && debouncedUserId === formData.userId) {
                return;
            }
            
            try {
                const response = await axios.post(`${API_URL}/debounce/userid`, { userid: debouncedUserId });
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
    }, [debouncedUserId, isEditMode, formData.userId]);

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        validatePassword(e.target.value, confirmPassword);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        validatePassword(password, e.target.value);
    };

    const validatePassword = (pwd, confirmPwd) => {
        if (pwd !== confirmPwd) {
            setPasswordError('Passwords do not match');
            return false;
        }
        
        if (pwd && !isEditMode) {
            const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])');
            if (pwd.length < 8 || !passwordRegex.test(pwd)) {
                setPasswordError('Password does not meet requirements');
                return false;
            }
        }
        
        setPasswordError('');
        return true;
    };

    const handleUserIdChange = (e) => {
        setUserId(e.target.value);
    };

    const handleTogglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleToggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const isValid = () => {
        // In edit mode, passwords are optional
        if (isEditMode) {
            // If passwords are provided, they must be valid
            if (password || confirmPassword) {
                return password === confirmPassword && 
                       (password.length === 0 || 
                        (password.length >= 8 && 
                         /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])/.test(password))) && 
                       usernameError === '';
            }
            // If no passwords, just check userId
            return usernameError === '';
        }
        
        // Regular signup validation
        const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])');
        const usernameRegex = new RegExp('^[a-zA-Z0-9_]*$');
        return password.length >= 8 && 
               passwordRegex.test(password) && 
               password === confirmPassword &&
               usernameRegex.test(userId) && 
               usernameError === '';
    };

    const handleSubmit = () => {
        onSubmit({ 
            ...formData, 
            userId, 
            password, 
            confirmPassword 
        });
    };

    return (
        <Container>
            <Group>
                <Group style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <h2 onClick={onBack} style={{ alignSelf: "flex-start" }}><IoArrowBackOutline /></h2>
                    <img src={logo} height={50} alt="logo" />
                    <h2 onClick={() => window.location.href = "/"}><RxCross1 /></h2>
                </Group>
                <h2>{isEditMode ? 'Update password' : 'Set your password'}</h2>
                <PasswordContainer>
                    <Input 
                        type="text" 
                        value={userId} 
                        onChange={handleUserIdChange} 
                        placeholder="Enter Your UserId" 
                        disabled={isEditMode}
                    />
                </PasswordContainer>
                {userId ? (usernameError && <Message style={{ color: 'red' }}>{usernameError}</Message>) : 
                <Message>
                    Username should be unique and should not contain any special characters
                </Message>}

                <PasswordContainer>
                    <Input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder={isEditMode ? "New password (optional)" : "Password"}
                    />
                    <ToggleButton onClick={handleTogglePassword}>
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </ToggleButton>
                </PasswordContainer>
                
                <PasswordContainer>
                    <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        placeholder={isEditMode ? "Confirm new password" : "Confirm password"}
                    />
                    <ToggleButton onClick={handleToggleConfirmPassword}>
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </ToggleButton>
                </PasswordContainer>
                
                {passwordError && <Message style={{ color: 'red' }}>{passwordError}</Message>}
                
                <Message>
                    {isEditMode ? 'Leave blank to keep current password' : 'Passwords must be at least 8 characters long.'} <br />
                    Passwords must have at least one special character. <br />
                    Passwords must have at least one uppercase (&apos;A&apos;-&apos;Z&apos;). <br />
                    Passwords must have at least one lowercase (&apos;a&apos;-&apos;z&apos;).<br />
                    Passwords must have at least one digit (&apos;0&apos;-&apos;9&apos;).
                </Message>
            </Group>
            <Group>
                <Message>
                    {isEditMode ? 
                      'By updating your profile, you agree to our updated Terms of Service.' :
                      'By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.'}
                </Message>
                <SignUpButton onClick={handleSubmit} disabled={!isValid()}>
                    {isEditMode ? 'Update' : 'Sign up'}
                </SignUpButton>
            </Group>
        </Container>
    );
};

SignUpPageTwo.propTypes = {
    formData: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    isEditMode: PropTypes.bool
};

export default SignUpPageTwo;
