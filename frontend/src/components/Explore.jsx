import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import profile from '../assets/images/sampleProfile.png';

const ExploreContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: black;
  color: white;
  padding: 20px;
  width: 75vw;
  height: 100vh;
  overflow-y: auto;
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
`;

const Explore = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    // Fetch most followed users initially
    fetchMostFollowedUsers();
  }, []);

  useEffect(() => {
    if (searchTerm === '') {
      setFilteredUsers(users);
    } else {
      const results = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(results);
    }
  }, [searchTerm, users]);

  const fetchMostFollowedUsers = () => {
    // Placeholder for fetching most followed users
    const mostFollowedUsers = [
      {
        id: 1,
        name: 'John Doe',
        handle: '@johndoe',
        followers: 1200,
        profileImage: profile,
      },
      {
        id: 2,
        name: 'Jane Smith',
        handle: '@janesmith',
        followers: 1100,
        profileImage: profile,
      },
    ];
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
              <i className="fas fa-user-friends" style={{ marginRight: '5px' }}></i>
              {user.followers} <p style={{marginLeft: "10px"}}> Followers</p>
              <FollowButton style={{marginLeft: "10px"}}>Follow</FollowButton>
            </FollowerCount>
          </UserCard>
        ))}
      </UsersContainer>
    </ExploreContainer>
  );
};

export default Explore;
