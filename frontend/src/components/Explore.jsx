import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import profile from '../assets/images/sampleProfile.png';
import UserContext from '../context/userContext';

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

const UsersContainer = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
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

const FollowerCount = styled.span`
  margin-left: auto;
  display: flex;
  align-items: center;
  color: white;

  @media (max-width: 768px) {
    display: none;
  } 
`;

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const { state } = useContext(UserContext);
  // console.log(state);

  useEffect(() => {
    // Fetch most followed users initially
    fetchMostFollowedUsers();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(users);
    } else {
      const results = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.handle.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(results);
    }
  }, [searchTerm, users]);

  const fetchMostFollowedUsers = () => {
    const mostFollowedUsers = state.following.map(following => {
      return {
        id: following._id,
        name: following.name,
        handle: following.userid,
        followers: following.followers.length,
        profileImage: profile,
      };
    });

    mostFollowedUsers.sort((a, b) => b.followers - a.followers);
    setUsers(mostFollowedUsers);
    setFilteredUsers(mostFollowedUsers);
  };

  

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <ExploreContainer>
      <SearchBarContainer>
        <SearchInput
          type="text"
          placeholder="Try searching for people, lists, or keywords"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchBarContainer>
      <UsersContainer>
        {filteredUsers.map(user => (
          <UserCard key={user.id}>
            <ProfileImage src={user.profileImage} alt="Profile" />
            <UserDetails>
              <UserName>{user.name}</UserName>
              <UserHandle>{user.handle}</UserHandle>
            </UserDetails>
            <FollowerCount>
              {user.followers} <p style={{marginLeft: "10px"}}> Followers</p>
            </FollowerCount>
            <FollowButton style={{marginLeft: "10px"}}>Follow</FollowButton>
          </UserCard>
        ))}
      </UsersContainer>
    </ExploreContainer>
  );
};

export default Explore;
