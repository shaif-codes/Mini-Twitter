import React, { useState } from 'react';
import styled from 'styled-components';
import SignUpPageOne from './SignUpPageOne';
import SignUpPageTwo from './SignUpPageTwo';
import axios from 'axios';
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

const SignUpPopover = ({ onClose }) => {
  const [page, setPage] = useState(1);
  const [formData, setFormData] = useState({});
  const [pageOneData, setPageOneData] = useState({});
  const [pageTwoData, setPageTwoData] = useState({});

  const handleNext = (data) => {
    // console.log(page);
    setFormData(data);
    setPage(2);
  };
  const handleBack = () => {
    setPageOneData(formData);

    // console.log("PageOne Data",formData);
    setPage(1);
  };
  const handleSubmit = async (data) => {
    console.log(data);
    const formatedData = {
      userid: data.userId,
      password: data.password,
      name: data.name,
      email: data.email,
      phone: data.phone,
      dob: new Date(data.dob),
      confirmPassword: data.confirmPassword,
    };
    
    console.log('Form Data:', formatedData);
    try {
      const response = await axios.post(`${API_URL}/register`, formatedData);
      console.log('Response:', response);
  
      if (response.status === 201) {
        console.log('User registered successfully');
      } 
      else {
        console.error('Failed to register user');
        const text = await response.text;
        try {
          const errorData = JSON.parse(text);
          console.error('Error details:', errorData);
        } catch (e) {
          console.error('Error details:', text);
        }
      }
    } catch (error) {
      console.error('Error during fetch:', error);
    }
    
    onClose();
  };
  

  return (
    <Overlay>
      <Popover>
        {page === 1 && <SignUpPageOne onNext={handleNext} pageData={pageOneData} onClose={onClose} />}
        {page === 2 && <SignUpPageTwo onBack={handleBack} formData={formData} onSubmit={handleSubmit} />}
      </Popover>
    </Overlay>
  );
};

export default SignUpPopover;
