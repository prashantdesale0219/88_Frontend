import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { FiMapPin, FiHome, FiCheckSquare, FiStar, FiInfo, FiDollarSign, FiCalendar, FiMaximize, FiLayout, FiImage } from 'react-icons/fi';
import PropertyGallery from './PropertyGallery';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/api';

const Container = styled.div`
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  margin: 1rem auto;
  border: 1px solid #444;
  color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #4a6fa5, #6a8fc5, #4a6fa5);
    z-index: 1;
  }
`;

const Title = styled.h2`
  color: #f5f5f5;
  margin-bottom: 1.5rem;
  text-align: center;
  border-bottom: 1px solid #444;
  padding-bottom: 1rem;
  font-size: 1.8rem;
  font-weight: 600;
  letter-spacing: -0.5px;
  position: relative;
  display: inline-block;
  width: 100%;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, #4a6fa5, #6a8fc5, #4a6fa5);
    border-radius: 3px;
  }
`;

const Section = styled.div`
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

const SectionTitle = styled.h3`
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

const List = styled.ul`
  list-style-type: none;
  padding-left: 0.5rem;
  margin-bottom: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0.75rem;
`;

const ListItem = styled.li`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  background-color: #2d2d2d;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  border: 1px solid #333;
  transition: all 0.3s ease;
  cursor: default;
  
  &:hover {
    background-color: #333;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-color: #4a6fa5;
  }
  
  svg {
    color: white;
    margin-right: 0.75rem;
    flex-shrink: 0;
    background-color: #4a6fa5;
    padding: 4px;
    border-radius: 4px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  margin-bottom: 0.75rem;
  border-bottom: 1px dashed #333;
  padding: 0.5rem 0 0.75rem;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #2a2a2a;
    border-radius: 6px;
    padding: 0.5rem 0.75rem 0.75rem;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  &:last-child {
    margin-bottom: 0;
    border-bottom: none;
  }
`;

const InfoLabel = styled.div`
  font-weight: 500;
  width: 40%;
  color: #aaa;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: 0.75rem;
    color: white;
    background-color: #4a6fa5;
    padding: 4px;
    border-radius: 4px;
    flex-shrink: 0;
  }
`;

const InfoValue = styled.div`
  width: 60%;
  font-weight: 400;
  color: #f5f5f5;
  position: relative;
  padding-left: 0.5rem;
  
  &::before {
    content: '';
    position: absolute;
    left: -5px;
    top: 50%;
    transform: translateY(-50%);
    width: 2px;
    height: 70%;
    background-color: #333;
    border-radius: 1px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
`;

const Button = styled.button`
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  
  &:hover {
    background-color: #3a5a8f;
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    transition: all 0.6s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  svg {
    margin-right: 0.75rem;
  }
`;

const PropertyInfo = ({ userName, onInterestConfirm, language = 'en', selectedProperty = null }) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        
        // If a property is already selected, use it
        if (selectedProperty) {
          setProperty(selectedProperty);
          setLoading(false);
          return;
        }
        
        // Otherwise fetch from API
        const response = await axios.get(`${API_URL}/properties`);
        if (response.data.success && response.data.data) {
          // Handle the new JSON file format
          setProperty({
            title: response.data.data.title,
            location: {
              city: response.data.data.location,
              area: '',
              address: response.data.data.location
            },
            details: {
              configuration: '',
              area: response.data.data.area,
              price: response.data.data.price,
              availability: response.data.data.status
            },
            amenities: response.data.data.amenities,
            isExclusiveToJain: response.data.data.isForJain,
            description: {
              en: response.data.data.description || ''
            }
          });
        } else {
          setError('No properties found');
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Failed to load property details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, [selectedProperty]);
  
  if (loading) {
    return (
      <Container>
        <Title>{language === 'en' ? 'Loading property details...' : 'प्रॉपर्टी विवरण लोड हो रहा है...'}</Title>
      </Container>
    );
  }
  
  if (error || !property) {
    return (
      <Container>
        <Title>{language === 'en' ? 'Error loading property' : 'प्रॉपर्टी लोड करने में त्रुटि'}</Title>
        <p>{error || (language === 'en' ? 'Property not found' : 'प्रॉपर्टी नहीं मिली')}</p>
      </Container>
    );
  }
  
  return (
    <Container>
      <Title>
        {language === 'en' ? '📋 PROPERTY DETAILS' : '📋 प्रॉपर्टी विवरण'}
        <div style={{ fontSize: '1rem', fontWeight: 'normal', marginTop: '0.5rem', color: '#6a8fc5' }}>
          {property.title || '88Royals Premium Property'}
        </div>
      </Title>
      
      <Section>
        <SectionTitle><FiMapPin size={18} />{language === 'en' ? '📍 LOCATION' : '📍 स्थान'}</SectionTitle>
        <InfoRow>
          <InfoLabel><FiMapPin size={14} />{language === 'en' ? 'City:' : 'शहर:'}</InfoLabel>
          <InfoValue>{property.location?.city || 'Surat, Gujarat'}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel><FiMapPin size={14} />{language === 'en' ? 'Area:' : 'क्षेत्र:'}</InfoLabel>
          <InfoValue>{property.location?.area || 'Vesu'}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel><FiMapPin size={14} />{language === 'en' ? 'Address:' : 'पता:'}</InfoLabel>
          <InfoValue>{property.location?.address || '88Royals Luxury Apartments, Vesu Main Road, Surat'}</InfoValue>
        </InfoRow>
      </Section>
      
      <Section>
        <SectionTitle><FiHome size={18} />{language === 'en' ? '🏢 FLAT SPECIFICATIONS' : '🏢 फ्लैट स्पेसिफिकेशन'}</SectionTitle>
        <InfoRow>
          <InfoLabel><FiLayout size={14} />{language === 'en' ? 'Configuration:' : 'कॉन्फ़िगरेशन:'}</InfoLabel>
          <InfoValue>{property.details?.configuration || '3/4 BHK Luxury Apartments'}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel><FiMaximize size={14} />{language === 'en' ? 'Area:' : 'क्षेत्रफल:'}</InfoLabel>
          <InfoValue>{property.details?.area || '1800-2500 sq ft'}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel><FiDollarSign size={14} />{language === 'en' ? 'Price:' : 'कीमत:'}</InfoLabel>
          <InfoValue>{property.details?.price || 'Starting from ₹1.2 Crore'}</InfoValue>
        </InfoRow>
        <InfoRow>
          <InfoLabel><FiCalendar size={14} />{language === 'en' ? 'Availability:' : 'उपलब्धता:'}</InfoLabel>
          <InfoValue>{property.details?.availability || 'Ready to move in'}</InfoValue>
        </InfoRow>
      </Section>
      
      <Section>
        <SectionTitle><FiCheckSquare size={18} />{language === 'en' ? '✅ AMENITIES & FACILITIES' : '✅ सुविधाएँ'}</SectionTitle>
        <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>
          {language === 'en' ? 'Luxury living with premium facilities:' : 'प्रीमियम सुविधाओं के साथ लक्जरी लिविंग:'}
        </div>
        <List>
          {property.amenities && property.amenities.length > 0 ? (
            property.amenities.map((amenity, index) => (
              <ListItem key={index}><FiCheckSquare size={14} />{amenity}</ListItem>
            ))
          ) : (
            <>
              <ListItem><FiCheckSquare size={14} />Panoramic City View</ListItem>
              <ListItem><FiCheckSquare size={14} />Smart Home Automation</ListItem>
              <ListItem><FiCheckSquare size={14} />24x7 Security</ListItem>
              <ListItem><FiCheckSquare size={14} />Club House and Swimming Pool</ListItem>
              <ListItem><FiCheckSquare size={14} />Fitness Center</ListItem>
              <ListItem><FiCheckSquare size={14} />Covered Parking</ListItem>
              <ListItem><FiCheckSquare size={14} />Power Backup</ListItem>
              <ListItem><FiCheckSquare size={14} />Elevator</ListItem>
            </>
          )}
        </List>
      </Section>
      
      {property.images && property.images.length > 0 && (
        <PropertyGallery images={property.images} />
      )}

      <Section>
        <SectionTitle><FiStar size={18} />{language === 'en' ? '⭐ EXCLUSIVE FEATURES' : '⭐ विशेष सुविधाएँ'}</SectionTitle>
        <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem', color: '#aaa' }}>
          {language === 'en' ? 'Specially designed for Jain community:' : 'जैन समुदाय के लिए विशेष रूप से डिज़ाइन किया गया:'}
        </div>
        <List>
          {property.specialFeatures && property.specialFeatures.length > 0 ? (
            property.specialFeatures.map((feature, index) => (
              <ListItem key={index}><FiStar size={14} />{feature}</ListItem>
            ))
          ) : (
            <>
              <ListItem><FiStar size={14} />{language === 'en' ? 'Exclusively for Jain Community' : 'विशेष रूप से जैन समुदाय के लिए'}</ListItem>
              <ListItem><FiStar size={14} />{language === 'en' ? 'Near Jain Temple' : 'जैन मंदिर के पास'}</ListItem>
              <ListItem><FiStar size={14} />{language === 'en' ? 'Pure Vegetarian Complex' : 'शुद्ध शाकाहारी परिसर'}</ListItem>
            </>
          )}
        </List>
      </Section>
      
      <ButtonContainer>
        <Button onClick={onInterestConfirm}>
          <FiInfo size={16} />
          {language === 'en' ? 'I am interested in this property' : 'मुझे इस प्रॉपर्टी में रुचि है'}
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default PropertyInfo;