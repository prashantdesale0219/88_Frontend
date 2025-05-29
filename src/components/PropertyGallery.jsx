import React, { useState } from 'react';
import styled from 'styled-components';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/api';

const GalleryContainer = styled.div`
  margin-bottom: 1.5rem;
  background-color: #252525;
  border-radius: 8px;
  padding: 1.25rem;
  border: 1px solid #333;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: #4a6fa5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 3px;
    height: 100%;
    background: linear-gradient(180deg, #4a6fa5, #6a8fc5);
    border-radius: 3px 0 0 3px;
  }
`;

const GalleryTitle = styled.h3`
  color: #f5f5f5;
  margin-bottom: 1rem;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  font-weight: 500;
  letter-spacing: -0.3px;
  padding-bottom: 0.5rem;
  border-bottom: 1px dashed #444;
  
  svg {
    margin-right: 10px;
    background-color: #4a6fa5;
    padding: 6px;
    border-radius: 6px;
    color: white;
  }
`;

const ImagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
`;

const ImageContainer = styled.div`
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  height: 150px;
  border: 2px solid #333;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.03);
    border-color: #4a6fa5;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }
`;

const PropertyImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
`;

const FullScreenOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  cursor: pointer;
`;

const FullScreenImage = styled.img`
  max-width: 90%;
  max-height: 90%;
  object-fit: contain;
  border: 3px solid #4a6fa5;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #6a8fc5;
    transform: scale(1.1);
  }
`;

const PropertyGallery = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(null);

  const openFullScreen = (imagePath) => {
    setSelectedImage(imagePath);
  };

  const closeFullScreen = () => {
    setSelectedImage(null);
  };

  return (
    <GalleryContainer>
      <GalleryTitle>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        प्रॉपर्टी इमेज गैलरी
      </GalleryTitle>
      
      <ImagesGrid>
        {images && images.length > 0 ? (
          images.map((image, index) => (
            <ImageContainer key={index} onClick={() => openFullScreen(`${API_URL}/${image}`)}>
              <PropertyImage src={`${API_URL}/${image}`} alt={`Property Image ${index + 1}`} />
            </ImageContainer>
          ))
        ) : (
          <p style={{ color: '#aaa', textAlign: 'center', gridColumn: '1 / -1' }}>
            कोई इमेज उपलब्ध नहीं है
          </p>
        )}
      </ImagesGrid>

      {selectedImage && (
        <FullScreenOverlay onClick={closeFullScreen}>
          <FullScreenImage src={selectedImage} alt="Full size property image" onClick={(e) => e.stopPropagation()} />
          <CloseButton onClick={closeFullScreen}>×</CloseButton>
        </FullScreenOverlay>
      )}
    </GalleryContainer>
  );
};

export default PropertyGallery;