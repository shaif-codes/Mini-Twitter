/** @jsxImportSource react */
import { useRef } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { AiOutlineClose } from 'react-icons/ai';
import { IoMdCreate } from 'react-icons/io';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1200; /* Ensure it's above other potential popovers */
`;

const Container = styled.div`
  position: relative;
  background-color: #1a1a1a; /* Dark background */
  padding: 20px;
  border-radius: 15px;
  max-width: 90%;
  max-height: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ProfileImageLarge = styled.img`
  max-width: 80vw; /* Limit width */
  max-height: 70vh; /* Limit height */
  width: auto;
  height: auto;
  object-fit: contain;
  border-radius: 10px; /* Optional: slight rounding */
  margin-bottom: 20px;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  padding: 0px;
  z-index: 10;
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`;

const EditBtn = styled.button`
  position: absolute;
  bottom: 25px; /* Adjust positioning as needed */
  right: 25px;
  background: rgba(26, 137, 212, 0.8);
  color: white;
  border: none;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 10;
  padding: 0px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  &:hover {
    background: rgba(26, 137, 212, 1);
  }
`;

const ProfileImagePopover = ({ imageUrl, onClose, isCurrentUserProfile, onUpload }) => {
  const fileInputRef = useRef(null);

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleFileSelected = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Basic validation (can enhance later)
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size should be less than 5MB.');
      return;
    }

    onUpload(file); // Pass the file to the parent's upload function
    // Optional: Reset file input value to allow re-uploading the same file
    e.target.value = null; 
  };

  if (!imageUrl) return null; // Don't render if no image URL

  return (
    <Overlay onClick={onClose}> {/* Close on overlay click */}
      <Container onClick={(e) => e.stopPropagation()}> {/* Prevent closing when clicking inside container */}
        <CloseBtn onClick={onClose}>
          <AiOutlineClose color="white" size={20} style={{ display: 'block' }} />
        </CloseBtn>
        <ProfileImageLarge src={imageUrl} alt="Profile Preview" />
        {isCurrentUserProfile && (
          <>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*"
              onChange={handleFileSelected}
            />
            <EditBtn onClick={handleEditClick}>
              <IoMdCreate color="white" size={24} style={{ display: 'block' }} />
            </EditBtn>
          </>
        )}
      </Container>
    </Overlay>
  );
};

ProfileImagePopover.propTypes = {
  imageUrl: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  isCurrentUserProfile: PropTypes.bool.isRequired,
  onUpload: PropTypes.func.isRequired,
};

export default ProfileImagePopover; 