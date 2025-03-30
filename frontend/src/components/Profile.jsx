/** @jsxImportSource react */
import { useState, useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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

const ProfileHeaderFollowButton = styled(FollowButton)`
  position: absolute;
  top: 12px;
  right: 15px;
`;

const ProfileHeaderUnfollowButton = styled(UnfollowButton)`
  position: absolute;
  top: 12px;
  right: 15px;
`;

const Profile = () => {
  const { userId: viewedUserHandle } = useParams();
  const { state: currentUserState, dispatch, tweetState } = useContext(UserContext) || {};

  const [profileData, setProfileData] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [profilePosts, setProfilePosts] = useState([]);
  const [viewedFollowers, setViewedFollowers] = useState([]);
  const [viewedFollowing, setViewedFollowing] = useState([]);
  
  const [activeTab, setActiveTab] = useState('posts');
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showImagePopover, setShowImagePopover] = useState(false);
  const [popoverImageUrl, setPopoverImageUrl] = useState(null);
  const [imageType, setImageType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      console.log("Effect Start - Current User State:", currentUserState);
      
      // --- Own Profile (/profile) --- 
      if (!viewedUserHandle) {
        console.log("Viewing own profile (no URL param)");
        // Check if context state has loaded the user ID
        if (currentUserState?._id) { 
          // Use existing context data
          console.log("Setting own profile data from context");
          setIsOwnProfile(true);
          setProfileData(currentUserState);
          setProfilePosts(currentUserState._id && tweetState ? tweetState.filter(tweet => tweet.tweetBy?._id === currentUserState._id) : []);
          setViewedFollowers(currentUserState.followers || []);
          setViewedFollowing(currentUserState.following || []);
          setIsLoading(false); 
        } else {
          // Context not ready, fetch own profile data directly
          console.log("Own profile - context not ready, fetching directly...");
          setIsLoading(true); 
          setProfileData(null); // Ensure no stale data shown
          try {
            const token = Cookie.get("accessToken");
            if (!token) {
              toast.error("Authentication error. Please log in.");
              // Potentially redirect: window.location.href = "/";
              setIsLoading(false);
              return;
            }
            // Fetch own profile data
            const response = await axios.get(`${API_URL}/profile`, { 
              headers: { Authorization: `Bearer ${token}` } 
            });
            
            const fetchedData = response.data.data; // Assuming direct user object
            console.log("Fetched own profile data:", fetchedData);

            if (fetchedData?._id) {
              // Set local state for display
              setProfileData(fetchedData);
              setIsOwnProfile(true);
              // TODO: Ensure fetchedData includes posts/followers/following or fetch separately
              setProfilePosts(fetchedData.posts || []); 
              setViewedFollowers(fetchedData.followers || []);
              setViewedFollowing(fetchedData.following || []);
              
              // ALSO update the global context state
              if (dispatch) {
                console.log("Dispatching LOGIN action with fetched data");
                dispatch({ type: 'LOGIN', payload: fetchedData });
              }
            } else {
              toast.error("Failed to fetch valid profile data.");
              setProfileData(null);
            }
          } catch (error) {
            console.error("Error fetching own profile data:", error);
            toast.error("Failed to load profile.");
            setProfileData(null);
          } finally {
            setIsLoading(false);
          }
        }
      // --- Other User Profile (/profile/:userId) --- 
      } else {
        console.log(`Viewing profile for: ${viewedUserHandle}`);
        setIsLoading(true);
        setProfileData(null); 
        // ... (reset posts/followers/following state) ...
        try {
          const token = Cookie.get("accessToken");
          if (!token) { 
            toast.error("Authentication required to view profiles."); 
            setIsLoading(false);
            return; 
          }
          
          console.log(`Fetching data from: ${API_URL}/profile/${viewedUserHandle}`);
          const response = await axios.get(`${API_URL}/profile/${viewedUserHandle}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          
          const fetchedData = response.data.data; 
          console.log("Received profile data:", fetchedData);
          
          if (!fetchedData || !fetchedData._id) {
            toast.error("User profile not found.");
            setProfileData(null);
          } else {
            setProfileData(fetchedData);
            setIsOwnProfile(fetchedData._id === currentUserState?._id);
            
            setProfilePosts(fetchedData.posts || []);
            setViewedFollowers(fetchedData.followers || []);
            setViewedFollowing(fetchedData.following || []);
          }

        } catch (error) {
          console.error("Error fetching profile data:", error);
          toast.error(error.response?.data?.message || "Failed to load profile.");
          setProfileData(null);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfileData();
    
  // Add dispatch to dependency array
  }, [viewedUserHandle, currentUserState?._id, tweetState, dispatch]); 

  const displayUser = profileData;
  const profileImage = displayUser?.profilePictureUrl || profilePlaceholder;
  const bannerImage = displayUser?.bannerPictureUrl || bannerPlaceholder;

  // Log the raw data just before mapping
  console.log("DEBUG - viewedFollowers before mapping:", JSON.stringify(viewedFollowers, null, 2));
  
  // Filter out falsy values AND ensure necessary properties exist inside map
  const followersList = Array.isArray(viewedFollowers)
    ? viewedFollowers
        .filter(Boolean) // Remove null/undefined entries first
        .map(user => {
          // Check if user object and essential fields exist
          if (user && user._id && user.userid && user.name) {
            return {
              id: user._id,
              name: user.name,
              handle: user.userid,
              profileImage: user.profilePictureUrl || profilePlaceholder,
            };
          } 
          console.warn("DEBUG - Invalid follower entry skipped:", user); // Log invalid entries
          return null; // Map invalid entries to null
        })
        .filter(Boolean) // Filter out the nulls created from invalid entries
    : [];

  // Log the raw data just before mapping
  console.log("DEBUG - viewedFollowing before mapping:", JSON.stringify(viewedFollowing, null, 2));

  // Apply the same robust filtering/mapping to followingList
  const followingList = Array.isArray(viewedFollowing)
    ? viewedFollowing
        .filter(Boolean)
        .map(user => {
          if (user && user._id && user.userid && user.name) {
            return {
              id: user._id, 
              name: user.name,
              handle: user.userid,
              profileImage: user.profilePictureUrl || profilePlaceholder,
            };
          }
          console.warn("DEBUG - Invalid following entry skipped:", user); // Log invalid entries
          return null;
        })
        .filter(Boolean)
    : [];

  const handleEditProfile = () => setShowEditProfile(true);
  const handleCloseEditPopover = () => setShowEditProfile(false);
  
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
    console.log("Attempting to unfollow from list:", userIdToUnfollow);
    const token = Cookie.get("accessToken");
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      return;
    }
    try {
      setIsLoading(true);
      await axios.post(`${API_URL}/unfollow`, 
        { unfollowId: userIdToUnfollow }, 
        { headers: { Authorization: `Bearer ${token}` } } 
      );
      toast.success("Unfollowed successfully!");
    } catch (error) {
      console.error("Error unfollowing user:", error);
      const errorMessage = error.response?.data?.message || "Failed to unfollow user.";
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
      await axios.delete(`${API_URL}/follow/remove-follower/${followerUserId}`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      toast.success("Follower removed successfully.");
    } catch (error) {
      console.error("Error removing follower:", error);
      const errorMessage = error.response?.data?.message || "Failed to remove follower.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeaderFollowToggle = async () => {
    if (!profileData || isOwnProfile) return;
    
    const isCurrentlyFollowing = currentUserState?.following?.some(f => f._id === profileData._id);
    const action = isCurrentlyFollowing ? 'unfollow' : 'follow';
    const endpoint = action === 'follow' ? `${API_URL}/follow` : `${API_URL}/unfollow`;
    const payload = action === 'follow' ? { followId: profileData.userid } : { unfollowId: profileData.userid };
    const successActionType = action === 'follow' ? 'ADD_TO_FOLLOWING' : 'REMOVE_FROM_FOLLOWING';
    const dispatchPayload = action === 'follow' ? profileData : profileData._id;

    setIsLoading(true);
    console.log(`Attempting to ${action}:`, profileData.userid);
    try {
      const token = Cookie.get("accessToken");
      if (!token) { toast.error("Auth error"); return; }

      await axios.post(endpoint, payload, { headers: { Authorization: `Bearer ${token}` } });
      
      if (dispatch) {
        dispatch({ type: successActionType, payload: dispatchPayload });
      }
      toast.success(action === 'follow' ? `Followed ${profileData.name}` : `Unfollowed ${profileData.name}`);

    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
      toast.error(error.response?.data?.message || `Failed to ${action} user.`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !profileData?._id) {
    return <LoadingOverlay>Loading Profile...</LoadingOverlay>;
  }

  if (!isLoading && !profileData?._id) {
    return <ProfileContainer><DataNotFound>Profile not found.</DataNotFound></ProfileContainer>;
  }

  const isViewingProfileFollowedByCurrentUser = currentUserState?.following?.some(f => f?._id === profileData?._id);

  return (
    <ProfileContainer>
      {isOwnProfile && showEditProfile && <SignUpPopover onClose={handleCloseEditPopover} isEditMode={true} userData={currentUserState} />}
      {showImagePopover && 
        <ProfileImagePopover 
          imageUrl={popoverImageUrl}
          onClose={closeImagePopover}
          isCurrentUserProfile={isOwnProfile}
          onUpload={handleUpload}
        />
      }
      {isLoading && <LoadingOverlay>Processing...</LoadingOverlay>}
      <ToastContainer theme="dark" />
      <Banner 
        src={bannerImage} 
        onClick={() => isOwnProfile && openImagePopover(bannerImage, 'banner')}
      />
      {!isOwnProfile && (
          isViewingProfileFollowedByCurrentUser ? 
          <ProfileHeaderUnfollowButton onClick={handleHeaderFollowToggle}>Unfollow</ProfileHeaderUnfollowButton> : 
          <ProfileHeaderFollowButton onClick={handleHeaderFollowToggle}>Follow</ProfileHeaderFollowButton>
      )}
      <ProfileDetails>
        <ImageContainer $isProfile onClick={() => isOwnProfile && openImagePopover(profileImage, 'profile')}>
          <ProfileImage src={profileImage} alt="Profile" />
        </ImageContainer>
        <UserName>{displayUser.name || 'User Name'}</UserName>
        <UserHandle>@{displayUser.userid || 'userid'}</UserHandle>
        <UserBio>{displayUser.bio || 'No bio available.'}</UserBio>
        <UserStats>
          {displayUser.location && (
            <Stat><IoLocationOutline/> <pre> {displayUser.location} </pre></Stat>
          )}
          <Stat><SlCalender/><pre> Joined {displayUser.doj ? formatDate(displayUser.doj.toString()) : 'N/A'} </pre></Stat>
          <Stat><strong> {viewedFollowing?.length || displayUser.following?.length || 0} </strong><pre> Following </pre></Stat>
          <Stat><strong> {viewedFollowers?.length || displayUser.followers?.length || 0} </strong><pre> Followers </pre></Stat>
        </UserStats>
        {isOwnProfile && <EditButton onClick={handleEditProfile}>Edit profile</EditButton>}
      </ProfileDetails>
      <TabContainer>
        <Tab onClick={() => setActiveTab('posts')} $isActive={activeTab === 'posts'}>Posts <Tag>{profilePosts?.length || 0}</Tag></Tab>
        <Tab onClick={() => setActiveTab('followers')} $isActive={activeTab === 'followers'}>Followers <Tag>{viewedFollowers?.length || 0}</Tag></Tab>
        <Tab onClick={() => setActiveTab('following')} $isActive={activeTab === 'following'}>Following <Tag>{viewedFollowing?.length || 0}</Tag></Tab>
      </TabContainer>
      <ContentSection>
        {/* Apply similar filtering and checks for posts */}
        {activeTab === 'posts' && (() => {
          const validPosts = Array.isArray(profilePosts)
            ? profilePosts
                .filter(Boolean)
                .map(post => {
                  // Check post and essential nested properties
                  if (post && post._id && post.tweetBy && post.tweetBy._id && post.tweetBy.userid && post.tweetBy.name) {
                    return (
                      <PostComponent key={post._id} post={{
                        id: post._id,
                        name: post.tweetBy.name,
                        username: post.tweetBy.userid,
                        date: formatDate(post.createdAt?.toString() || new Date().toISOString()),
                        content: post.tweet,
                        tweetBy: {
                          _id: post.tweetBy._id, // Pass ID if needed by PostComponent
                          profilePictureUrl: post.tweetBy.profilePictureUrl
                        }
                      }} />
                    );
                  } 
                  return null; // Map invalid posts to null
                })
                .filter(Boolean)
            : [];
            
          return validPosts.length > 0 ? validPosts : <DataNotFound>No posts yet</DataNotFound>;
        })()}
        
        {/* Use the filtered followersList */} 
        {activeTab === 'followers' && (followersList.length > 0 ? followersList.map(user => (
          <UserCard key={user.id}> 
            <ProfileImage src={user.profileImage} alt="Profile" />
            <UserCardDetails>
              <UserName>{user.name}</UserName>
              <UserHandle>@{user.handle}</UserHandle>
            </UserCardDetails>
            {isOwnProfile && <RemoveButton onClick={() => handleRemoveFollower(user.id)}>Remove</RemoveButton>}
          </UserCard>
        )) : <DataNotFound>No followers</DataNotFound>)}
        
        {/* Use the filtered followingList */} 
        {activeTab === 'following' && (followingList.length > 0 ? followingList.map(user => (
          <UserCard key={user.id}> 
            <ProfileImage src={user.profileImage} alt="Profile" />
            <UserCardDetails>
              <UserName>{user.name}</UserName>
              <UserHandle>@{user.handle}</UserHandle>
            </UserCardDetails>
            {isOwnProfile && <UnfollowButton onClick={() => handleUnfollow(user.id)}>Unfollow</UnfollowButton>}
          </UserCard>
        )) : <DataNotFound>No following</DataNotFound>)}
      </ContentSection>
    </ProfileContainer>
  );
};

export default Profile;
