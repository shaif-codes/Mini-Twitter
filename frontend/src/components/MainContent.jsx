import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import profilePlaceholder from '../assets/images/sampleProfile.png';
import PostComponent from './PostComponent';
import UserContext from '../context/userContext';
import Cookie from 'js-cookie';
import axios from 'axios';
import formatDate from '../hooks/formatDate';
// import UserContext from '../context/userContext';
import { FaCheckCircle } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
const API_URL = import.meta.env.VITE_API_URL;



// const GlobalStyle = styled.div`
//   .custom-progress-bar {
//     background-color: #1a89d4 !important;
//   }
// `;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  border: 1px solid #253341;
  color: white;
  padding: 20px;
  width: 75vw;
  height: 100vh;
  overflow-y: auto; /* Enable scrolling */
  scroll-behavior: smooth; /* Smooth scrolling */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */

  &::-webkit-scrollbar { 
    display: none;  /* Safari and Chrome */
  }

  @media (max-width: 768px) {
    width: 80vw;
    padding: 10px;
  }
`;

const PostSection = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  padding: 25px;
  border: 1px solid #253341;
  // border-bottom: none;

  @media (max-width: 768px) {
    padding: 15px;
  }
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

  @media (max-width: 768px) {
    padding-top: 10px;
    margin-bottom: 10px;
    width: 72%;
  }
`;

const InputAndButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;


const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
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

  @media (max-width: 768px) {
    font-size: 14px;
    padding: 8px;
  }
`;

const PostButton = styled.button`
  background-color: #1a89d4;
  color: white;
  border: none;
  align-self: flex-end;
  width: 100px;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    width: 80px;
    padding: 8px 16px;
    font-size: 14px;
  }
`;

const MainContent = () => {
  const [text, setText] = useState('');
  const textAreaRef = React.useRef(null);
  const { state, setTweetState } = useContext(UserContext);

  const userProfileImage = state?.profilePictureUrl || profilePlaceholder;

  useEffect(() => {
    const textArea = textAreaRef.current;
    if (textArea) {
      textArea.style.height = 'auto';
      textArea.style.height = textArea.scrollHeight + 'px';
    }
  }, [text]);

  const [tweets, setTweets] = useState([]);
  const token = Cookie.get('accessToken');

  const handlePostButton = async ()=>{
    try{
      const response = await axios.post(`${API_URL}/tweet/create`, { tweet: text }, { headers: { Authorization: `Bearer ${token}` } });
      if(response){
        toast.success("tweet posted!!", {
          icon: <FaCheckCircle style={{ color: '#1a89d4' }} />,
          style : {backgroundColor: "#1a1a1a", color: "#1a89d4"}, 
          progressClassName: 'GlobalStyle'
        });
        setText("");
      }
    }
    catch(error){
      console.log(error)
    }
    // if(response)

  }

  useEffect(() => {
    const fetchTweets = async () => {
      if (!token) return;
      try {
        const response = await axios.get(`${API_URL}/tweet`, { headers: { Authorization: `Bearer ${token}` } });
        if (response.data) {
          setTweets(response.data);
          setTweetState(response.data);
        }
      } catch (error) {
        console.error("Error fetching tweets:", error);
      }
    };
    fetchTweets();
  }, [token, setTweetState]);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <ContentContainer>
      <PostSection>
        <ProfileAndInputContainer>
          <ProfileImage src={userProfileImage} alt="Profile" />
          <InputAndButtonContainer>
          <PostInput
            ref={textAreaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="What is happening?!"
            rows={1} // Set initial rows
          />
          <PostButton onClick={handlePostButton}>Post</PostButton>
          </InputAndButtonContainer>
        </ProfileAndInputContainer>
      </PostSection>
      {tweets.map((post) => (
        <PostComponent
          key={post._id}
          post={{
            id: post._id,
            name: post.tweetBy?.name || 'Unknown User',
            username: post.tweetBy?.userid || 'unknown',
            date: formatDate(post.createdAt?.toString() || new Date().toISOString()),
            content: post.tweet,
            tweetBy: {
                profilePictureUrl: post.tweetBy?.profilePictureUrl
            }
          }}
        />
      ))}
      <ToastContainer/>
    </ContentContainer>
  );
};

export default MainContent;
