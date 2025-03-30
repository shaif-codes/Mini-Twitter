/** @jsxImportSource react */
import { useState, useContext, useEffect, useCallback } from 'react';
import UserContext from '../context/userContext';
import styled from 'styled-components';
import { IoLocationOutline } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import profilePlaceholder from '../assets/images/sampleProfile.png';
import bannerPlaceholder from '../assets/images/banner-placeholder.png';
import PostComponent from './PostComponent';
import Cookie from 'js-cookie';
import formatDate from '../hooks/formatDate';
import SignUpPopover from './SignUpPopover';
import ProfileImagePopover from './ProfileImagePopover';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL;

const ProfileContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  color: white;
  padding: 20px;
  padding-top: 0px;
  width: 75vw;
  height: 100vh;
  overflow-y: auto;
  overflow-y: auto; /* Enable scrolling */
  scroll-behavior: smooth; /* Smooth scrolling */
  -ms-overflow-style: none;  /* Internet Explorer 10+ */
  scrollbar-width: none;  /* Firefox */

  &::-webkit-scrollbar { 
    display: none;  /* Safari and Chrome */
  }
`;

const Banner = styled.div`
  background-image: url(${props => props.src || bannerPlaceholder});
  background-size: cover;
  background-position: center;
  height: 200px;
  min-height: 200px;
  width: 100%;
  border-bottom: 1px solid #253341;
  cursor: pointer;
  position: relative; /* Needed for absolute positioning of ::after */
  
  &:hover {
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%; /* Cover the whole banner */
      background-color: rgba(0, 0, 0, 0.3);
    }
  }
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
  }
  border-bottom: ${(props) => (props.$isActive ? '4px solid #1a89d4' : 'none')};
  border-radius: 0px;
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

const DataNotFound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  color: #1a89d4;
`;

const UnfollowButton = styled(FollowButton)`
  background-color: red;
`;

const EditButton = styled.button`
  background-color: transparent;
  color: white;
  border: 1px solid #1a89d4;
  padding: 8px 16px;
  border-radius: 30px;
  cursor: pointer;
  margin-top: 10px;
  font-weight: bold;
  &:hover {
    background-color: rgba(26, 137, 212, 0.1);
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  color: white;
  font-size: 18px;
`;

const ImageContainer = styled.div`
  position: relative;
  cursor: pointer;
  /* Keep hover effect if desired */
  &:hover::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: ${props => props.$isProfile ? '50%' : '0'};
  }
`;

const Tag = styled.span`
  color: #1a89d4;
  font-weight: bold;
  background-color: #253341;
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
`;

const RemoveButton = styled(FollowButton)`
  background-color: #555;
  border: 1px solid #888;
  &:hover {
    background-color: #777;
    opacity: 1;
  }
`;

const Profile = () => {
  const contextValue = useContext(UserContext);
  console.log('Debug: Raw contextValue in Profile:', contextValue);

  useEffect(() => {
    console.log('Debug - UserContext value in Profile (inside useEffect):', contextValue);
  }, [contextValue]);

  const { state, dispatch, tweetState } = contextValue || {};
  
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showImagePopover, setShowImagePopover] = useState(false);
  const [popoverImageUrl, setPopoverImageUrl] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFollowers = useCallback(async () => {
    try {
      const token = Cookie.get("accessToken");
      if (!token) return;
      const response = await axios.get(`${API_URL}/follow/followers`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data && response.data.data) {
        dispatch({ type: 'SET_FOLLOWERS', payload: response.data.data });
      }
    } catch (error) {
      console.error("Error fetching followers:", error);
      toast.error("Failed to fetch followers.");
    }
  }, [dispatch]);

  const fetchFollowing = useCallback(async () => {
    try {
      const token = Cookie.get("accessToken");
      if (!token) return;
      const response = await axios.get(`${API_URL}/follow/following`, { headers: { Authorization: `Bearer ${token}` } });
      if (response.data && response.data.data) {
        dispatch({ type: 'SET_FOLLOWING', payload: response.data.data });
      }
    } catch (error) {
      console.error("Error fetching following:", error);
      toast.error("Failed to fetch following list.");
    }
  }, [dispatch]);

  useEffect(() => {
    if (state && dispatch) {
      fetchFollowers();
      fetchFollowing();
    }
  }, [dispatch, fetchFollowers, fetchFollowing]);

  const userPosts = state._id ? tweetState.filter(tweet => tweet.tweetBy?._id === state._id) : [];
  
  const profileImage = state.profilePictureUrl || profilePlaceholder;
  const bannerImage = state.bannerPictureUrl || bannerPlaceholder;

  console.log('Debug - Profile State:', { 
    profilePictureUrl: state.profilePictureUrl,
    bannerPictureUrl: state.bannerPictureUrl,
    usingDefault: !state.profilePictureUrl,
    profileImage,
    bannerImage
  });
  console.log("Context 'state.followers' before map:", state?.followers);
  const followersList = Array.isArray(state?.followers) ? state.followers.map(user => ({
    id: user._id,
    name: user.name,
    handle: user.userid,
    profileImage: user.profilePictureUrl || profilePlaceholder,
  })) : [];

  console.log("Context 'state.following' before map:", state?.following);
  const followingList = Array.isArray(state?.following) ? state.following.map(user => ({
    id: user.userid,
    name: user.name,
    handle: user.userid,
    profileImage: user.profilePictureUrl || profilePlaceholder,
  })) : [];

  console.log("Mapped 'followingList':", followingList);
  console.log("Mapped 'followersList':", followersList);

  const handleEditProfile = () => {
    setShowEditProfile(true);
  };

  const handleCloseEditPopover = () => {
    setShowEditProfile(false);
  };
  
  const openImagePopover = (imageUrl, type) => {
    setPopoverImageUrl(imageUrl);
    setImageType(type);
    setShowImagePopover(true);
  };
  
  const closeImagePopover = () => {
    setShowImagePopover(false);
    setPopoverImageUrl(null);
    setImageType(null);
  };
  
  const handleUpload = async (file) => {
    if (!imageType) return;
    
    const endpoint = imageType === 'profile' 
      ? `${API_URL}/profile/upload/profile-picture`
      : `${API_URL}/profile/upload/banner-picture`;
    
    const fieldName = imageType === 'profile' ? 'profilePic' : 'bannerPic';
    
    console.log('Debug - Starting upload from Profile:', { 
      endpoint, fieldName, imageType, fileSize: file.size 
    });
    
    const formData = new FormData();
    formData.append(fieldName, file);
    
    try {
      setIsLoading(true);
      closeImagePopover();
      
      const token = Cookie.get('accessToken');
      if (!token) throw new Error('Authentication token not found');
      
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('Debug - Response received:', response.data);
      
      if (response.data && response.data.data && response.data.data.imageUrl) {
        const newImageUrl = response.data.data.imageUrl;
        console.log('Debug - Upload successful, image URL:', newImageUrl);
        
        dispatch({ 
          type: imageType === 'profile' ? 'UPDATE_PROFILE_PICTURE' : 'UPDATE_BANNER_PICTURE', 
          payload: newImageUrl 
        });
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      let errorMessage = 'Failed to upload image. Please try again.';
      if (error.response) {
        errorMessage = `Upload failed: ${error.response.data.message || error.response.statusText || 'Server error'}`;
      } else if (error.request) {
        errorMessage = 'No response from server.';
      } else {
        errorMessage = error.message;
      }
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnfollow = async (userIdToUnfollow) => {
    console.log("Attempting to unfollow:", userIdToUnfollow);
    const token = Cookie.get("accessToken");
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/unfollow`, 
        { unfollowId: userIdToUnfollow }, 
        { headers: { Authorization: `Bearer ${token}` } } 
      );
      toast.success(response.data || "Unfollowed successfully!");
      fetchFollowing(); 
    } catch (error) {
      console.error("Error unfollowing user:", error);
      const errorMessage = error.response?.data || "Failed to unfollow user.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFollower = async (followerUserId) => {
    console.warn(
      `Attempting to remove follower: ${followerUserId}. `
    );
    const token = Cookie.get("accessToken");
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      return;
    }
    try {
      setIsLoading(true);
      // Use DELETE method for the corrected backend route
      const response = await axios.get(`${API_URL}/follow/remove-follower/${followerUserId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      toast.success(response.data?.message || "Follower removed successfully.");
      // Refetch the followers list to update UI
      fetchFollowers(); 
    } catch (error) {
      console.error("Error removing follower:", error);
      const errorMessage = error.response?.data?.message || "Failed to remove follower.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProfileContainer>
      {showEditProfile && <SignUpPopover onClose={handleCloseEditPopover} isEditMode={true} userData={state} />}
      {showImagePopover && 
        <ProfileImagePopover 
          imageUrl={popoverImageUrl}
          onClose={closeImagePopover}
          isCurrentUserProfile={true} 
          onUpload={handleUpload}
        />
      }
      {isLoading && <LoadingOverlay>Processing...</LoadingOverlay>}
      <ToastContainer theme="dark" />
      <Banner 
        src={bannerImage} 
        onClick={() => openImagePopover(bannerImage, 'banner')} 
      />
      <ProfileDetails>
        <ImageContainer $isProfile onClick={() => openImagePopover(profileImage, 'profile')}>
          <ProfileImage src={profileImage} alt="Profile" />
        </ImageContainer>
        <UserName>{state.name || 'User Name'}</UserName>
        <UserHandle>@{state.userid || 'userid'}</UserHandle>
        <UserBio>{state.bio || 'No bio available.'}</UserBio>
        <UserStats>
          {state.location && (
            <Stat>
              <IoLocationOutline/> <pre> {state.location} </pre>
            </Stat>
          )}
          <Stat>
            <SlCalender/><pre> Joined {state.doj ? formatDate(state.doj.toString()) : 'N/A'} </pre> 
          </Stat>
          <Stat>
            <strong> {state.following?.length || 0} </strong><pre> Following </pre>
          </Stat>
          <Stat>
            <strong>{state.followers?.length || 0} </strong> <pre> Followers </pre>
          </Stat>
        </UserStats>
        <EditButton onClick={handleEditProfile}>Edit profile</EditButton>
      </ProfileDetails>
      <TabContainer>
        <Tab onClick={() => setActiveTab('posts')} $isActive={activeTab === 'posts'}>Posts <Tag>{userPosts?.length || 0}</Tag></Tab>
        <Tab onClick={() => setActiveTab('followers')} $isActive={activeTab === 'followers'}>Followers <Tag>{state.followers?.length || 0}</Tag></Tab>
        <Tab onClick={() => setActiveTab('following')} $isActive={activeTab === 'following'}>Following <Tag>{state.following?.length || 0}</Tag></Tab>
      </TabContainer>
      <ContentSection>
        {activeTab === 'posts' && (userPosts.length > 0 ? userPosts.map(post => (
          <PostComponent key={post._id} post={{
            id: post._id,
            name: post.tweetBy?.name || 'Unknown User',
            username: post.tweetBy?.userid || 'unknown',
            date: formatDate(post.createdAt?.toString() || new Date().toISOString()),
            content: post.tweet,
            tweetBy: {
              profilePictureUrl: post.tweetBy?.profilePictureUrl
            }
          }} />
        )) : <DataNotFound>No posts yet</DataNotFound>)}
        {activeTab === 'followers' && (followersList.length > 0 ? followersList.map(user => (
          <UserCard key={user.id}>
            <ProfileImage src={user.profileImage} alt="Profile" />
            <UserCardDetails>
              <UserName>{user.name}</UserName>
              <UserHandle>@{user.handle}</UserHandle>
            </UserCardDetails>
            <RemoveButton onClick={() => handleRemoveFollower(user.id)}>Remove</RemoveButton>
          </UserCard>
        )) : <DataNotFound>No followers</DataNotFound>)}
        {activeTab === 'following' && (followingList.length > 0 ? followingList.map(user => (
          <UserCard key={user.id}>
            <ProfileImage src={user.profileImage} alt="Profile" />
            <UserCardDetails>
              <UserName>{user.name}</UserName>
              <UserHandle>@{user.handle}</UserHandle>
            </UserCardDetails>
            <UnfollowButton onClick={() => handleUnfollow(user.id)}>Unfollow</UnfollowButton>
          </UserCard>
        )) : <DataNotFound>No following</DataNotFound>)}
      </ContentSection>
    </ProfileContainer>
  );
};

export default Profile;
