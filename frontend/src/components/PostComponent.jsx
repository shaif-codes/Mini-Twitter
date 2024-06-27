import React, { useState } from 'react';
import styled from 'styled-components';
import { FaHeart, FaComment } from 'react-icons/fa';
import profile from '../assets/images/sampleProfile.png';

const PostContainer = styled.div`
  background-color: #1a1a1a;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 10px;
  margin-top: 10px;
  color: white;
  width: 90%;

  @media (max-width: 768px) {
    padding: 15px;
    width: 85%;
  }
`;

const ProfileDetails = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    margin-bottom: 5px;
  }
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    margin-right: 8px;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const UserName = styled.span`
  font-weight: bold;
  color: white;

  @media (max-width: 768px) {
    font-size: 14px;
    margin: 0px 10px;
  }
`;

const UserHandle = styled.span`
  color: gray;
  margin-left: 5px;

  @media (max-width: 768px) {
    margin-left: 0;
    font-size: 12px;
  }
`;

const PostDate = styled.span`
  color: gray;
  margin-left: 5px;

  @media (max-width: 768px) {
    margin-left: 0;
    font-size: 12px;
  }
`;

const PostContent = styled.div`
  margin: 10px 0;

  @media (max-width: 768px) {
    margin: 5px 0;
    font-size: 14px;
  }
`;

const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100px;

  @media (max-width: 768px) {
    width: 80px;
  }
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${(props) => (props.liked ? '#1a89d4' : 'white')};
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
  &:focus {
    outline: none;
  }
  &:active {
    outline: none;
  }

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const CommentsSection = styled.div`
  margin-top: 10px;
  border-top: 1px solid #253341;

  @media (max-width: 768px) {
    margin-top: 5px;
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
    padding: 8px;
    font-size: 14px;
  }
`;

const PostComponent = ({ post }) => {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const toggleLike = () => {
    setLiked(!liked);
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  return (
    <PostContainer>
      <ProfileDetails>
        <ProfileImage src={profile} />
        <UserInfo>
          <UserName>{post.name}</UserName>
          <UserHandle>@{post.username}</UserHandle>
          <PostDate>{post.date}</PostDate>
        </UserInfo>
      </ProfileDetails>
      <PostContent>{post.content}</PostContent>
      <PostActions>
        <ActionButton liked={liked} onClick={toggleLike}>
          <FaHeart />
        </ActionButton>
        <ActionButton onClick={toggleComments}>
          <FaComment />
        </ActionButton>
      </PostActions>
      {showComments && (
        <CommentsSection>
          <PostInput placeholder="Add a comment..." />
        </CommentsSection>
      )}
    </PostContainer>
  );
};

export default PostComponent;
