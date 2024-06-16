import React, { useState } from 'react';
import styled from 'styled-components';
import SignUpPageOne from './SignUpPageOne';
import SignUpPageTwo from './SignUpPageTwo';

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

  const handleNext = (data) => {
    console.log(page);
    setFormData(data);
    setPage(2);
  };

  const handleSubmit = async (data) => {
    const dummyData = {
      userid: 'testuser',
      password: 'password',
      name: 'Test User',
      email: 'test@gmial.com',
      phone: '1234567890',
      dob: '01/01/2000',
      confirmPassword: 'password',
    };
    console.log('Form Data:', dummyData);
    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dummyData),
      });
  
      if (response.ok) {
        console.log('User registered successfully');
      } else {
        console.error('Failed to register user');
        const text = await response.text();
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
  
    // onClose();
  };
  

  return (
    <Overlay>
      <Popover>
        {page === 1 && <SignUpPageOne onNext={handleNext} onClose={onClose} />}
        {page === 2 && <SignUpPageTwo onBack={()=>setPage(1)} formData={formData} onSubmit={handleSubmit} />}
      </Popover>
    </Overlay>
  );
};

export default SignUpPopover;
