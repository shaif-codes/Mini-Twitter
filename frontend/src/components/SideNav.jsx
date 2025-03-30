import { useState, useContext } from 'react';
import styled from 'styled-components';
import { FaHome, FaUser, FaSearch } from 'react-icons/fa';
import { IoMdCreate } from 'react-icons/io';
import logo from '../assets/images/logo.png';
import profilePlaceholder from '../assets/images/sampleProfile.png';
import UserContext from '../context/userContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookie from 'js-cookie';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL;

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
    width: 15vw;
    align-items: center;
    padding: 23px 5px;
    height: 100vh;
    height: 85vh;
  }
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px;
  margin: 10px 0;
  font-size: 23px;
  cursor: pointer;
  text-decoration: none;
  color: white;
  background-color: ${({ $isactive }) => ($isactive ? '#1a1a1a' : 'transparent')};
  border-radius: ${({ $isactive }) => ($isactive ? '30px' : '0')};

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
    width: 38px;
    height: 38px;
    padding: 0;
    border-radius: 50%;
    display: flex;
    padding-left: 6px;
    font-size: 23px;
    align-items: center;
    justify-content: center;
    margin-left: 20px;
  }
`;

const ProfileSection = styled(Link)`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 5px;
  border-radius: 30px;
  text-decoration: none;
  color: white;

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

const MoreButton = styled.div`
  font-weight: 35px;
  font-size: 25px, 
  margin: 0px;
  margin-left: 30px; 
  @media (max-width: 768px) {
    display: none;
  }
`;

const ProfileSectionWrapper = styled.div`
  position: relative;
`;

const LogoutButton = styled.button`
  position: absolute;
  bottom: 110%;
  left: 0;
  width: 100%;
  background-color: #1a1a1a;
  color: white;
  border: 1px solid #333;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 16px;
  text-align: left;
  z-index: 10;

  &:hover {
    background-color: #252525;
  }

  @media (max-width: 768px) {
    width: auto;
    left: 50%;
    transform: translateX(-50%);
    bottom: 70px;
  }
`;

const SideNav = () => {
  const { state, dispatch } = useContext(UserContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);

  const userProfileImage = state?.profilePictureUrl || profilePlaceholder;

  const handleLogout = async (e) => {
    e.stopPropagation();
    setShowLogout(false);

    const token = Cookie.get('accessToken');
    if (!token) {
      toast.error("Not logged in.");
      if (dispatch) dispatch({ type: 'LOGOUT' });
      navigate('/');
      return;
    }

    try {
      console.log("Attempting logout...");
      await axios.get(`${API_URL}/logout`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Logged out successfully.");
      console.log("Logout API call successful.");
    } catch (error) {
      console.error("Logout API call failed:", error);
      toast.error("Logout failed on server, clearing session locally.");
    } finally {
      Cookie.remove('accessToken');
      if (dispatch) {
        console.log("Dispatching LOGOUT action.");
        dispatch({ type: 'LOGOUT' });
      }
      console.log("Navigating to /");
      navigate('/');
    }
  };

  const toggleLogout = () => {
    setShowLogout(prev => !prev);
  };

  return (
    <NavContainer>
      <div>
        <NavItem to="/home">
          <NavIcon>
            <img src={logo} alt="logo" width={50} />
          </NavIcon>
        </NavItem>
        <NavItem to="/home" $isactive={location.pathname === '/home' || location.pathname === '/'}>
          <NavIcon>
            <FaHome />
          </NavIcon>
          <NavText>Home</NavText>
        </NavItem>
        <NavItem to="/explore" $isactive={location.pathname === '/explore'}>
          <NavIcon>
            <FaSearch />
          </NavIcon>
          <NavText>Explore</NavText>
        </NavItem>
        <NavItem to="/profile" $isactive={location.pathname.startsWith('/profile')}>
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
      <ProfileSectionWrapper>
        <ProfileSection as="div" onClick={toggleLogout} style={{ cursor: 'pointer' }}>
          <ProfileImage src={userProfileImage} alt="profile" />
          <ProfileDetails>
            <ProfileName>{state?.name || 'User Name'}</ProfileName>
            <ProfileId>@{state?.userid || 'username'}</ProfileId>
          </ProfileDetails>
          <MoreButton>...</MoreButton>
        </ProfileSection>
        {showLogout && (
          <LogoutButton onClick={handleLogout}>
            Log out @{state?.userid || 'username'}
          </LogoutButton>
        )}
      </ProfileSectionWrapper>
    </NavContainer>
  );
};

export default SideNav;
