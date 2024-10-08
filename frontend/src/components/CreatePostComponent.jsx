import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import profile from '../assets/images/sampleProfile.png';
import { FaTimes } from 'react-icons/fa';
import { redirect } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
const API_URL = import.meta.env.VITE_API_URL;
import Cookie from 'js-cookie';
import axios from 'axios';

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
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: white;
  font-size: 20px;
  cursor: pointer;
    &:hover {
        opacity: 0.9;
    }
    &:focus {
        outline: none;
    }
    &:active {
        outline: none;
    }
`;

const PostSection = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  padding: 25px;
  border-bottom: none;
  width: 100%;
`;

const ProfileAndInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  margin-bottom: 20px;
  position: sticky;
  top: 0;
  background-color: black;
  z-index: 1;
  padding-top: 20px; /* Add padding to compensate for sticky position */
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    margin-bottom: 5px;
  }
`;

const PostInput = styled.textarea`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: none;
  border-radius: 5px;
  background-color: black;
//   height: 400px;
  max-height: 60vh;
  overflow-y: hidden;
  font-size: 16px;
  color: white;
  resize: none; /* Prevent manual resizing */
  overflow: hidden; /* Hide scrollbar */
  &:focus {
    outline: none;
  }
  &:hover {
    outline: none;
  }
`;

const PostButton = styled.button`
  background-color: #1a89d4;
  color: white;
  border: none;
  align-self: center;
  width: 100px;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const CreatePostPopover = ({ onClose }) => {
  const [text, setText] = useState('');
  const textAreaRef = useRef(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }, [text]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const token = Cookie.get('accessToken');
  const handlePost = async () => {
    // Handle post logic
    try{
      const response = await axios.post(`${API_URL}/tweet/create`, { tweet: text }, { headers: { Authorization: `Bearer ${token}` } });
      if(response){
        toast.success("tweet posted!!", {
          icon: <FaCheckCircle style={{ color: '#1a89d4' }} />,
          style : {backgroundColor: "#1a1a1a", color: "#1a89d4"}, 
          progressClassName: 'GlobalStyle'
        });
        setText("");
        setTimeout(()=>{
          window.location.href = "/home"
        }, 1000);
        

      }
    }
    catch(error){
      console.log(error)
    }
  };

  return (
    <Overlay>
      <Popover>
        <Container>
          <CloseButton onClick={()=>window.location.href = "/home"}>
            <FaTimes />
          </CloseButton>
          <PostSection>
            <ProfileAndInputContainer>
              <ProfileImage src={profile} />
              <PostInput
                ref={textAreaRef}
                value={text}
                onChange={handleTextChange}
                placeholder="What is happening?!"
                rows={30} // Set initial rows
              />
            </ProfileAndInputContainer>
            <PostButton onClick={handlePost}>Post</PostButton>
          </PostSection>
        </Container>
      </Popover>
    </Overlay>
  );
};

export default CreatePostPopover;
