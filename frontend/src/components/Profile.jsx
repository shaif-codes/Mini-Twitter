import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IoMdCreate } from 'react-icons/io';
import { IoLocationOutline } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import profilePic from '../assets/images/sampleProfile.png';
import bannerPic from '../assets/images/banner-placeholder.png';
import Post from './PostComponent';
import Explore  from './Explore'; // Reuse Explore styles for followers/following

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  color: white;
  padding: 20px;
  padding-top: 0px;
  width: 95vw;
  min-height: 100vh;
  overflow-y: auto;
`;

const Banner = styled.div`
  background-image: url(${bannerPic});
  background-size: cover;
  background-position: center;
  height: 200px;
  width: 100%;
  border-bottom: 1px solid #253341;
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: -50px;
  border: 3px solid black;
`;

const UserName = styled.h1`
  font-size: 24px;
  margin: 10px 0;
`;

const UserHandle = styled.p`
  color: gray;
  margin: 5px 0;
`;

const UserBio = styled.p`
  margin: 10px 0;
`;

const UserStats = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

const Stat = styled.div`
  margin: 0 10px;
  display: flex;
  align-items: center;
  color: gray;
`;

const TabContainer = styled.div`
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #253341;
  margin-top: 20px;
`;

const Tab = styled.button`
  background: none;
  border: none;
  color: white;
  padding: 15px;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    background-color: #253341;
  }
  &:focus {
    outline: none;
    border-bottom: 2px solid #1a89d4;
  }
`;

const ContentSection = styled.div`
  margin-top: 20px;
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #253341;
  margin-bottom: 10px;
  background-color: #1a1a1a;
  border-radius: 10px;
`;

const UserCardDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const FollowButton = styled.button`
  margin-left: auto;
  background-color: #1a89d4;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  &:hover {
    opacity: 0.9;
  }
`;

const UnfollowButton = styled(FollowButton)`
  background-color: red;
`;

const Profile = () => {
  const [activeTab, setActiveTab] = useState('posts');

  const posts = [
    {
      id: 1,
      content: 'This is a post',
      createdAt: '2024-06-01',
        name: 'John Doe',
        username: 'johndoe',
        profileImage: profilePic,
    },
  ];

  const followers = [
    {
      id: 1,
      name: 'Jane Doe',
      handle: '@janedoe',
      followers: 150,
      profileImage: profilePic,
    },
    {
        id: 2,
        name: 'Jane Doe',
        handle: '@janedoe',
        followers: 150,
        profileImage: profilePic,
      },
      {
        id: 3,
        name: 'Jane Doe',
        handle: '@janedoe',
        followers: 150,
        profileImage: profilePic,
      },
  ];

  const following = [
    {
      id: 1,
      name: 'Jack Smith',
      handle: '@jacksmith',
      followers: 200,
      profileImage: profilePic,
    },
    {
        id: 1,
        name: 'Jack Smith',
        handle: '@jacksmith',
        followers: 200,
        profileImage: profilePic,
      },
      {
        id: 1,
        name: 'Jack Smith',
        handle: '@jacksmith',
        followers: 200,
        profileImage: profilePic,
      },
  ];


  return (
    <ProfileContainer>
      <Banner />
      <ProfileDetails>
        <ProfileImage src={profilePic} alt="Profile" />
        <UserName>faylor Swift</UserName>
        <UserHandle>@FSwift20260</UserHandle>
        <UserBio>Life is a lesson, but what beyond death?</UserBio>
        <UserStats>
          <Stat>
            <IoLocationOutline/> <pre> Earth </pre>
          </Stat>
          <Stat>
            <SlCalender/><pre> Joined June 2024 </pre> 
          </Stat>
          <Stat>
            <strong>2 </strong><pre> Following </pre>
          </Stat>
          <Stat>
            <strong>0 </strong> <pre> Followers </pre>
          </Stat>
        </UserStats>
        <button>Edit profile</button>
      </ProfileDetails>
      <TabContainer>
        <Tab onClick={() => setActiveTab('posts')}>Posts</Tab>
        <Tab onClick={() => setActiveTab('followers')}>Followers</Tab>
        <Tab onClick={() => setActiveTab('following')}>Following</Tab>
      </TabContainer>
      <ContentSection>
        {activeTab === 'posts' && posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
        {activeTab === 'followers' && followers.map(user => (
          <UserCard key={user.id}>
            <ProfileImage src={user.profileImage} alt="Profile" />
            <UserCardDetails>
              <UserName>{user.name}</UserName>
              <UserHandle>{user.handle}</UserHandle>
            </UserCardDetails>
            <UnfollowButton>Unfollow</UnfollowButton>
          </UserCard>
        ))}
        {activeTab === 'following' && following.map(user => (
          <UserCard key={user.id}>
            <ProfileImage src={user.profileImage} alt="Profile" />
            <UserCardDetails>
              <UserName>{user.name}</UserName>
              <UserHandle>{user.handle}</UserHandle>
            </UserCardDetails>
            {!user.isFollowing && <FollowButton>Follow</FollowButton>}
          </UserCard>
        ))}
      </ContentSection>
    </ProfileContainer>
  );
};

export default Profile;
