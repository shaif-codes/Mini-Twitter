import { useState, useEffect } from 'react';
import styled from 'styled-components';
import SignUpPageOne from './SignUpPageOne';
import SignUpPageTwo from './SignUpPageTwo';
import axios from 'axios';
import Cookie from "js-cookie";
import PropTypes from 'prop-types';
const API_URL = import.meta.env.VITE_API_URL;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(91, 112, 131, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Popover = styled.div`
  background: black; // Keep background black as per previous changes
  border-radius: 10px;
  overflow: hidden;
`;

const SignUpPopover = ({ onClose, isEditMode = false, userData = null }) => {
  console.log("SignUpPopover rendered. Edit Mode:", isEditMode, "User Data:", userData);

  // Initialize state directly based on props for edit mode
  const initialPageOneData = isEditMode && userData ? {
    name: userData.name || '',
    email: userData.email || '',
    phone: userData.phone || '',
    // Ensure dob is formatted correctly if needed, otherwise pass directly
    dob: userData.dob ? new Date(userData.dob).toISOString().split('T')[0] : '' 
  } : {};

  const initialPageTwoData = isEditMode && userData ? {
    userId: userData.userid || '',
    password: '' // Never prefill password
  } : {};

  const [page, setPage] = useState(1);
  // Use initial data for state initialization
  const [pageOneData, setPageOneData] = useState(initialPageOneData);
  const [pageTwoData, setPageTwoData] = useState(initialPageTwoData);
  // This formData will accumulate changes from page 1
  const [formData, setFormData] = useState(initialPageOneData);

  // Optional: Log state updates if needed for debugging
  useEffect(() => {
    console.log("Page One Data State Updated:", pageOneData);
  }, [pageOneData]);

  useEffect(() => {
    console.log("Page Two Data State Updated:", pageTwoData);
  }, [pageTwoData]);

  const handleNext = (data) => {
    console.log("Next clicked. Data from Page 1:", data);
    // Merge data from page 1 into the accumulating formData
    setFormData(prev => ({...prev, ...data})); 
    setPage(2);
  };
  
  const handleBack = () => {
    console.log("Back clicked. Current accumulated data:", formData);
    // When going back, pageOneData should reflect the latest state
    // No need to setPageOneData here, as it's mainly for initial state
    setPage(1);
  };

  const handleSubmit = async (pageTwoSubmitData) => {
    // Combine the initially loaded/accumulated data with page 2 specific data
    const finalData = {
      ...formData, // Contains initial data + page 1 edits
      ...pageTwoSubmitData // Contains page 2 specific fields (userId, password, confirmPassword)
    };
    
    // Ensure required fields are present from the combined data
    finalData.name = finalData.name || initialPageOneData.name;
    finalData.email = finalData.email || initialPageOneData.email; // Keep original email for edit
    finalData.phone = finalData.phone || initialPageOneData.phone;
    finalData.dob = finalData.dob || initialPageOneData.dob;
    finalData.userId = finalData.userId || initialPageTwoData.userId;

    console.log('Submitting Final Form Data:', finalData);
    
    const token = Cookie.get("accessToken");

    if (isEditMode) {
      try {
        // Construct payload for edit - exclude password if blank
        const editPayload = { ...finalData };
        if (!editPayload.password) {
          delete editPayload.password;
          delete editPayload.confirmPassword;
        }
        delete editPayload.email; // Don't allow email update

        const response = await axios.put(`${API_URL}/profile`, editPayload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log('Profile update response:', response.data);
        window.location.reload(); // Reload to see changes
      } catch (error) { 
        console.error('Error updating profile:', error.response?.data || error.message);
      }
    } else {
      // Regular signup
      try {
        const registerPayload = {
          userid: finalData.userId,
          password: finalData.password,
          name: finalData.name,
          email: finalData.email,
          phone: finalData.phone,
          dob: finalData.dob ? new Date(finalData.dob) : null,
          confirmPassword: finalData.confirmPassword,
        };
        const response = await axios.post(`${API_URL}/register`, registerPayload);
        console.log('Registration response:', response.data);
      } catch (error) {
        console.error('Error during registration:', error.response?.data || error.message);
      }
    }
    
    onClose();
  };

  return (
    <Overlay>
      <Popover>
        {page === 1 && (
          <SignUpPageOne 
            onNext={handleNext} 
            // Pass initial data + any subsequent updates if user goes back/forth
            pageData={formData} 
            onClose={onClose}
            isEditMode={isEditMode} 
          />
        )}
        {page === 2 && (
          <SignUpPageTwo 
            onBack={handleBack} 
            // Pass accumulated data + initial page two data (like userId)
            formData={{...formData, ...pageTwoData}} 
            onSubmit={handleSubmit}
            isEditMode={isEditMode}
          />
        )}
        {/* Add Page Three handling if needed */}
      </Popover>
    </Overlay>
  );
};

SignUpPopover.propTypes = {
  onClose: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool,
  userData: PropTypes.object // Could be more specific if context structure is known
};

export default SignUpPopover;
