import { useState, useEffect, useContext, useCallback } from 'react';
import styled from 'styled-components';
import profilePlaceholder from '../assets/images/sampleProfile.png';
import UserContext from '../context/userContext';
import axios from 'axios';
import Cookie from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import PostComponent from './PostComponent';
import formatDate from '../hooks/formatDate';

const API_URL = import.meta.env.VITE_API_URL;

const ExploreContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  color: white;
  padding: 20px;
  width: 75vw;
  height: 100vh;
  overflow-y: auto;
  @min-width 768px {
    width: 70vw;
  }
`;

const SearchBarContainer = styled.div`
  position: sticky;
  top: 0;
  background-color: black;
  z-index: 1;
  padding: 10px 0;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const SearchInput = styled.input`
  width: 50%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  background-color: #253341;
  color: white;
  &:focus {
    outline: none;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border: 1px solid #253341;
  margin-bottom: 10px;
  background-color: #1a1a1a;
  border-radius: 10px;
  @midia (max-width: 768px) {
    justify-content: space-around;
}

`;

const ProfileImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 15px;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: bold;
  color: white;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const UserHandle = styled.span`
  color: gray;
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
  &:hover {
      opacity: 0.9;
  }
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
  flex-grow: 1;
  text-align: center;
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
  display: flex;
  flex-direction: column;
`;

const DataNotFound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 40px;
  width: 100%;
  font-size: 20px;
  font-weight: bold;
  color: #1a89d4;
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
  z-index: 1000;
`;

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('people');
  
  const [allUsers, setAllUsers] = useState([]);
  const [allTweets, setAllTweets] = useState([]);
  
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [filteredTweets, setFilteredTweets] = useState([]);

  const [isLoading, setIsLoading] = useState(false);

  const { state: currentUserState } = useContext(UserContext);

  const isFollowing = (userId) => {
    return currentUserState?.following?.some(followedUser => followedUser.userid === userId);
  };

  const fetchExploreUsers = useCallback(async (currentSearchTerm) => {
    if (!currentSearchTerm) {
      setAllUsers([]);
      setFilteredUsers([]);
      return; 
    }

    setIsLoading(true);
    console.log(`Fetching explore users for term: ${currentSearchTerm}`);
    try {
      const token = Cookie.get("accessToken");
      if (!token) {
        toast.error("Authentication error.");
        setAllUsers([]); setFilteredUsers([]);
        return;
      }
      const response = await axios.get(`${API_URL}/profile/search`, { 
        headers: { Authorization: `Bearer ${token}` },
        params: { searchTerm: currentSearchTerm }
      });
      
      const usersData = response.data?.data?.map(user => ({
        id: user._id,
        name: user.name,
        handle: user.userid,
        profileImage: user.profilePictureUrl || profilePlaceholder,
      })) || [];
      
      setAllUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error fetching explore users:", error);
      toast.error("Failed to search users.");
      setAllUsers([]);
      setFilteredUsers([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchExploreTweets = useCallback(async (currentSearchTerm) => {
    if (!currentSearchTerm) {
      setAllTweets([]);
      setFilteredTweets([]);
      return;
    }
    
    setIsLoading(true);
    console.log(`Fetching explore tweets for term: ${currentSearchTerm}`);
    try {
      const token = Cookie.get('accessToken'); 
      if (!token) { 
        toast.error("Authentication error.");
        setAllTweets([]); setFilteredTweets([]);
        return; 
      }
      
      const response = await axios.get(`${API_URL}/tweet/search`, { 
          headers: { Authorization: `Bearer ${token}` },
          params: { searchTerm: currentSearchTerm }
      });
      
      const tweetsData = response.data || [];
      setAllTweets(tweetsData); 
      setFilteredTweets(tweetsData);
    } catch (error) {
      console.error("Error fetching explore tweets:", error);
      toast.error("Failed to search tweets.");
      setAllTweets([]);
      setFilteredTweets([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'people') {
      fetchExploreUsers(searchTerm);
    } else if (activeTab === 'tweets') {
      fetchExploreTweets(searchTerm);
    }
  }, [activeTab, searchTerm, fetchExploreUsers, fetchExploreTweets]);

  useEffect(() => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    if (searchTerm === '') {
      if (activeTab === 'people') {
        setFilteredUsers(allUsers);
      } else {
        setFilteredTweets(allTweets);
      }
    } else {
      if (activeTab === 'people') {
        const results = allUsers.filter(user =>
          user.name.toLowerCase().includes(lowerSearchTerm) || 
          user.handle.toLowerCase().includes(lowerSearchTerm)
        );
        setFilteredUsers(results);
      } else {
        const results = allTweets.filter(tweet => 
          tweet.tweet.toLowerCase().includes(lowerSearchTerm) || 
          tweet.tweetBy?.name?.toLowerCase().includes(lowerSearchTerm) ||
          tweet.tweetBy?.userid?.toLowerCase().includes(lowerSearchTerm)
        );
        setFilteredTweets(results);
      }
    }
  }, [searchTerm, allUsers, allTweets, activeTab]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFollow = async (userIdToFollow) => {
    setIsLoading(true);
    console.log("Follow user:", userIdToFollow);
    setIsLoading(false);
    toast.info("Follow functionality not yet implemented.");
  };

  const handleUnfollow = async (userIdToUnfollow) => {
    setIsLoading(true);
    console.log("Unfollow user:", userIdToUnfollow);
    setIsLoading(false);
    toast.info("Unfollow functionality not yet implemented.");
  };

  return (
    <ExploreContainer>
      {isLoading && <LoadingOverlay>Loading...</LoadingOverlay>}
      <ToastContainer theme="dark" />

      <SearchBarContainer>
        <SearchInput
          type="text"
          placeholder="Search People or Tweets"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchBarContainer>

      <TabContainer>
        <Tab 
          onClick={() => setActiveTab('people')} 
          $isActive={activeTab === 'people'}
        >
          People
        </Tab>
        <Tab 
          onClick={() => setActiveTab('tweets')} 
          $isActive={activeTab === 'tweets'}
        >
          Tweets
        </Tab>
      </TabContainer>

      <ContentSection>
        {activeTab === 'people' && (
          <> 
            {filteredUsers.length > 0 ? filteredUsers.map(user => (
              <UserCard key={user.id}>
                <ProfileImage src={user.profileImage || profilePlaceholder} alt="Profile" />
                <UserDetails>
                  <UserName>{user.name}</UserName>
                  <UserHandle>@{user.handle}</UserHandle>
                </UserDetails>
                {isFollowing(user.id) ? (
                  <UnfollowButton onClick={() => handleUnfollow(user.id)}>
                    Unfollow
                  </UnfollowButton>
                ) : (
                  <FollowButton onClick={() => handleFollow(user.id)}>
                    Follow
                  </FollowButton>
                )}
              </UserCard>
            )) : (
              <DataNotFound>{searchTerm ? 'No people found' : 'No user suggestions'}</DataNotFound>
            )}
          </>
        )}

        {activeTab === 'tweets' && (
          <> 
            {filteredTweets.length > 0 ? filteredTweets.map(post => (
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
            )) : (
              <DataNotFound>{searchTerm ? 'No tweets found' : 'No tweets to display'}</DataNotFound>
            )}
          </>
        )}
      </ContentSection>
    </ExploreContainer>
  );
};

export default Explore;
