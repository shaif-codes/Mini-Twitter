import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import logo from '../assets/images/logo.png';
import { SlCalender } from "react-icons/sl";
import { RxCross1 } from "react-icons/rx";
import useDebounce from '../hooks/useDebounce';
import axios from 'axios';
const API_URL = import.meta.env.VITE_API_URL;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  width: 75vw;
  height: 85vh;
  max-width: 600px;
  padding: 20px;
  background-color: black;
  @media (max-width: 480px) {
    height: 75vh;
  }
`;

const Group = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

const H2 = styled.h2`
  color: white;
  font-size: 35px;
  @media (max-width: 480px) {
    font-size: 25px;
  }
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
  &:-webkit-autofill,
  &:-webkit-autofill:hover,
  &:-webkit-autofill:focus,
  &:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 30px black inset !important;
      -webkit-text-fill-color: white !important;
      transition: background-color 5000s ease-in-out 0s;
    }
  &:active {
    border: 1px solid #1a89d4;
    background-color: transparent;
  }
  &:focus {
    border: 1px solid #1a89d4;
    background-color: transparent;
  }
`;

const Label = styled.label`
  margin: 10px 0;
  align-self: flex-start;
  margin-left: 4.5vw;
`;

const Message = styled.p`
  font-size: 12px;
  align-self: center;
  width: 75%;
  color: grey;
  margin-top: -10px
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #1a89d4;
  align-self: flex-end;
  margin-right: 4.5vw;
  cursor: pointer;
`;

const NextButton = styled.button`
  color: black;
  border: none;
  border-radius: 30px;
  background-color: #fdfdfd;
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



// useEffect(async () => {
//   if (debounceEmail) {
//     const response = await axios('/api/debounce/email', {email: debounceEmail});
//     if (response.ok) {
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         email: 'Email already exists',
//       }));
//     }
//   }
// }, [debounceEmail]);

const SignUpPageOne = ({ onNext, onClose, pageData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    ...pageData,
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    dob: '',
    phone: '',
  });

const debounceEmail = useDebounce(formData.email, 500);

useEffect(() =>{
  const checkAvailableEmail = async (debounceEmail) =>{
    if(debounceEmail){
      const response = await axios.post(`${API_URL}/debounce/email`, {email: debounceEmail});
      if(response.data?.email){
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'Email already exists',
        }));
      }
      else{
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: '',
        }));
      }
    }
  }

  checkAvailableEmail(debounceEmail);
  
}, [debounceEmail])

const debouncePhone = useDebounce(formData.phone, 500);
useEffect(() => {
  const checkAvailablePhone = async (debouncePhone) => {
    if(debouncePhone){
      const response = await axios.post(`${API_URL}/debounce/phone`, {phone: debouncePhone});
      if(response.data?.phone){
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone: 'Phone number already exists',
        }));
      }
      else{
        setErrors((prevErrors) => ({
          ...prevErrors,
          phone: '',
        }));
      }
    }
  };
  checkAvailablePhone(debouncePhone);
}, [debouncePhone]);

// useEffect(async()=>{
//   if(debounceEmail){
//     const response = await axios('/api/debounce/email', {email: debounceEmail});
//     if(response.ok){
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         email: 'Email already exists',
//       }));
//     }
//     else{
//       setErrors((prevErrors) => ({
//         ...prevErrors,
//         email: '',
//       }));
//     }
//   }
// }, [debounceEmail]);

  const validate = () => {
    const newErrors = {
      name: '',
      email: '',
      dob: '',
    };

    if (!formData.name) {
      newErrors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      newErrors.name = 'Name can only contain letters and spaces';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.dob) {
      newErrors.dob = 'Date of birth is required';
    } else if (new Date(formData.dob) >= new Date()) {
      newErrors.dob = 'Date of birth must be in the past';
    }
    if(formData.phone && !/^[0-9]{10}$/.test(formData.phone)){
      newErrors.phone = 'Phone number is invalid';
    }
    setErrors(newErrors);
    return !newErrors.name && !newErrors.email && !newErrors.dob;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleNext = () => {
    if (validate()) {
      onNext(formData);
    }
  };

  return (
    <Container>
      <Group>
        <img src={logo} alt="" width={50} />
        <h2 onClick={onClose} style={{ position: "relative", left: "40%", top: "10%" }}>
          <RxCross1 />
        </h2>
      </Group>
      <H2>Create your account</H2>
      <Input
        type="text"
        name="name"
        value={formData.name}
        placeholder="Enter your name"
        onChange={handleChange}
        style={{ borderColor: errors.name ? 'red' : '#ccc' }}
      />
      {errors.name && <Message style={{ color: 'red'}}>{errors.name}</Message>}
      <Input
        type="email"
        name="email"
        value={formData.email}
        placeholder="Enter your email"
        onChange={handleChange}
        style={{ borderColor: errors.email ? 'red' : '#ccc' }}
      />
      {errors.email && <Message style={{ color: 'red'}}>{errors.email}</Message>}
      <Input
        type="tel"
        name="phone"
        value={formData.phone}
        placeholder="Enter your phone number"
        onChange={handleChange}
      />
      {errors.phone && <Message style={{ color: 'red'}}>{errors.phone}</Message>}
      <Label>Date of Birth</Label>
      <Message>
        This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.
      </Message>
      <Input
        type="date"
        name="dob"
        style={{ backgroundColor: "white", color: "black", borderColor: errors.dob ? 'red' : '#ccc' }}
        value={formData.dob}
        placeholder='Enter your date of birth'
        onChange={handleChange}
      />
      {errors.dob && <Message style={{ color: 'red' }}>{errors.dob}</Message>}
      <NextButton disabled={errors.name && errors.email && errors.phone && errors.dob} onClick={handleNext}>
        Next
      </NextButton>
    </Container>
  );
};

export default SignUpPageOne;
