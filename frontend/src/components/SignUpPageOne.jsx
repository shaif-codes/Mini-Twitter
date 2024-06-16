import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../assets/images/logo.png';
import { SlCalender } from "react-icons/sl";
import { RxCross1 } from "react-icons/rx";

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
`;


const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  width: 75%;
  color: white;
  background-color: black;
  border:none;
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






const Label = styled.label`
  margin: 10px 0;
  align-self: flex-start;
  margin-left: 4.5vw;
`;

const Message = styled.p`
  font-size: 12px;
  algin-self: center;
  width: 75%;
  color: grey;
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
    backckgroud-color: #d7dbdc;
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


const SignUpPageOne = ({ onNext, onClose, pageData }) => {
  
  console.log("data from page 1", pageData);
  const [formData, setFormData] = useState({
    name: pageData.name? pageData.name : '',
    email: pageData.email? pageData.email : '',
    phone: pageData.phone? pageData.phone : '',
    dob: pageData.dob? pageData.dob : '',
  });

  if(pageData.length > 0){
    setFormData(pageData);
  }

  const [useEmail, setUseEmail] = useState(true);

  const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
          ...prevData,
          [name]: value,
          }));
        // console.log(formData)
  };

  const isFormValid = () => {
    return formData.name && (formData.email || formData.phone) && formData.dob;
  };

  return (
    <Container>
        <Group>
          <img src={logo} alt="" width={50}/>
          <h2 onClick={onClose} style={{position: "relative", left: "40%", top: "10%"}}><RxCross1/></h2>
        </Group>
      <H2>Create your account</H2>
      {/* <Label>Name</Label> */}
      <Input type="text" name="name" value={formData.name} placeholder="enter your name" onChange={handleChange} />
      <Input type="email" name="email" value={formData.email} placeholder="enter your email" onChange={handleChange} />
        <Input type="tel" name="phone" value={formData.phone} placeholder="enter your phone number" onChange={handleChange} />
      <Label>Date of Birth</Label>
      <Message>
        This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or something else.
      </Message>
      <Input type="date" name="dob" style={{"background-color": "white", "color": "black"}} value={formData.dob} placeholder='enter you date of birth' onChange={handleChange}/>
      <NextButton disabled={!isFormValid()} onClick={() => onNext(formData)}>
        Next
      </NextButton>
    </Container>
  );
};

export default SignUpPageOne;
