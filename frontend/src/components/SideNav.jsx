import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { FaHome, FaUser, FaSearch } from 'react-icons/fa';
import { IoMdCreate } from 'react-icons/io';
import logo from '../assets/images/logo.png';
import profile from '../assets/images/sampleProfile.png';
import UserContext from '../context/userContext';

const NavContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
  padding-bottom: 4%;
  width: 250px;
  background-color: black;
  color: white;

  @media (max-width: 768px) {
    width: 80px;
    align-items: center;
    padding: 23px 5px;
  }
`;

const NavItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 10px 0;
  font-size: 23px;
  cursor: pointer;
  background-color: ${({ isactive }) => (isactive ? '#1a1a1a' : 'transparent')};
  border-radius: ${({ isactive }) => (isactive ? '30px' : '0')};

  &:hover {
    background-color: #1a1a1a;
    border-radius: 30px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    font-size: 20px;
  }
`;

const NavIcon = styled.div`
  margin-right: 20px;

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const NavText = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

const PostButton = styled.button`
  background-color: #1a89d4;
  color: white;
  width: 100%;
  border: none;
  border-radius: 30px;
  padding: 15px;
  font-size: 23px;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
    padding: 0;
    border-radius: 50%;
    display: flex;
    padding-left: 6px;
    font-size: 23px;
    align-items: center;
    justify-content: center;
  }
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 5px;
  }

  &:hover {
    background-color: #1a1a1a;
  }
`;

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 5px;
  }
`;

const ProfileDetails = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    display: none;
  }
`;

const ProfileName = styled.div`
  font-weight: bold;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ProfileId = styled.div`
  color: grey;

  @media (max-width: 768px) {
    font-size: 12px;
  }
`;

const SideNav = ({ toggleCtrl }) => {
  const { state } = useContext(UserContext);
  const [activeItem, setActiveItem] = useState('/home');

  const handleToggleComponent = (ele) => {
    setActiveItem(ele);

    if (ele === '/home') {
      toggleCtrl.home[1](true);
      toggleCtrl.explore[1](false);
      toggleCtrl.profile[1](false);
    } else if (ele === '/explore') {
      toggleCtrl.home[1](false);
      toggleCtrl.explore[1](true);
      toggleCtrl.profile[1](false);
    } else {
      toggleCtrl.home[1](false);
      toggleCtrl.explore[1](false);
      toggleCtrl.profile[1](true);
    }
  };

  return (
    <NavContainer>
      <div>
        <NavItem onClick={() => handleToggleComponent('/home')}>
          <NavIcon>
            <img src={logo} alt="logo" width={50} />
          </NavIcon>
        </NavItem>
        <NavItem onClick={() => handleToggleComponent('/home')} isactive={activeItem === '/home'}>
          <NavIcon>
            <FaHome />
          </NavIcon>
          <NavText>Home</NavText>
        </NavItem>
        <NavItem onClick={() => handleToggleComponent('/explore')} isactive={activeItem === '/explore'}>
          <NavIcon>
            <FaSearch />
          </NavIcon>
          <NavText>Explore</NavText>
        </NavItem>
        <NavItem onClick={() => handleToggleComponent('/profile')} isactive={activeItem === '/profile'}>
          <NavIcon>
            <FaUser />
          </NavIcon>
          <NavText>Profile</NavText>
        </NavItem>
        <PostButton onClick={() => window.location.href = '/createPost'}>
          <IoMdCreate style={{ marginRight: '10px', fontSize: '23px' }} />
          <NavText>Post</NavText>
        </PostButton>
      </div>
      <ProfileSection>
        <ProfileImage src={profile} alt="profile" />
        <ProfileDetails>
          <ProfileName>{state.name}</ProfileName>
          <ProfileId>@{state.userid}</ProfileId>
        </ProfileDetails>
        <p style={{ fontWeight: '35px', fontSize: '25px', margin: '0px', marginLeft: '30px' }}>...</p>
      </ProfileSection>
    </NavContainer>
  );
};

export default SideNav;
