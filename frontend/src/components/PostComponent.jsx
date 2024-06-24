import React, { useState } from 'react';
import styled from 'styled-components';
import { FaHeart, FaComment } from 'react-icons/fa';
import profile from '../assets/images/sampleProfile.png';

const PostContainer = styled.div`
  background-color: #1a1a1a;
//   border: 1px solid #253341;
    border-radius: 10px;
  padding: 20px;
  margin-bottom: 10px;
  margin-top: 10px;
  color: white;
  width: 97%;
`;

const ProfileDetails = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: row;
`;

const UserName = styled.span`
  font-weight: bold;
  color: white;
`;

const UserHandle = styled.span`
  color: gray;
  margin-left: 5px;
`;

const PostDate = styled.span`
  color: gray;
  margin-left: 5px;
`;

const PostContent = styled.div`
  margin: 10px 0;
`;

const PostActions = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100px;
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: ${props => (props.liked ? '#1a89d4' : 'white')};
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
`;

const CommentsSection = styled.div`
  margin-top: 10px;
  border-top: 1px solid #253341;
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
          <UserHandle>@{post.username} .</UserHandle>
          <PostDate>{post.date}</PostDate>
        </UserInfo>
      </ProfileDetails>
      <PostContent>{post.content}</PostContent>
      <PostActions>
        <ActionButton $liked={liked} onClick={toggleLike}>
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
