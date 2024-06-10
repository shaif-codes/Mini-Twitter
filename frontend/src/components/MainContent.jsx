import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import profile from '../assets/images/sampleProfile.png';
import PostComponent from './PostComponent';
import { redirect } from 'react-router-dom';

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
`;

const PostSection = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  padding: 25px;
  border: 1px solid #253341;
  // border-bottom: none;
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
  align-self: flex-end;
  width: 100px;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const Post = styled.div`
  background-color: black;
  padding: 15px;
  border: 1px solid #253341;
`;

const MainContent = () => {
  const [text, setText] = useState('');
  const textAreaRef = React.useRef(null);

  useEffect(() => {
    const textArea = textAreaRef.current;
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 'px';
  }, [text]);

  const posts = [
    {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      date: 'June 7, 2024',
      content: 'This is a sample post content.',
    },
    {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        date: 'June 7, 2024',
        content: 'This is a sample post content.',
      },
      {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        date: 'June 7, 2024',
        content: 'This is a sample post content.',
      },
      {
        id: 1,
        name: 'John Doe',
        username: 'johndoe',
        date: 'June 7, 2024',
        content: 'This is a sample post content.',
      },
    // Add more posts here
  ];
  
  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  return (
    <ContentContainer>
      <PostSection>
        <ProfileAndInputContainer>
          <ProfileImage src={profile} />
          <PostInput
            ref={textAreaRef}
            value={text}
            onChange={handleTextChange}
            placeholder="What is happening?!"
            rows={1} // Set initial rows
          />
          <PostButton>Post</PostButton>
        </ProfileAndInputContainer>
      </PostSection>
      {posts.map((post) => (
        <PostComponent key={post.id} post={post} />
      ))}
    </ContentContainer>
  );
};

export default MainContent;
