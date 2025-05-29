import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useChatbot } from '../hooks/useChatbot';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const FormContainer = styled.div`
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  border: 1px solid #444;
`;

const Title = styled.h2`
  color: #4a6fa5;
  margin-bottom: 1.5rem;
  text-align: center;
  border-bottom: 1px solid #444;
  padding-bottom: 1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: #f5f5f5;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #444;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  background-color: #2d2d2d;
  color: #f5f5f5;
  
  &:focus {
    border-color: #4a6fa5;
  }
  
  &::placeholder {
    color: #888;
  }
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #444;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  background-color: #2d2d2d;
  color: #f5f5f5;
  
  &:focus {
    border-color: #4a6fa5;
  }
  
  option {
    background-color: #2d2d2d;
    color: #f5f5f5;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(Button)`
  background-color: #4a6fa5;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #3a5a8f;
  }
`;

const CancelButton = styled(Button)`
  background-color: #2d2d2d;
  color: #f5f5f5;
  border: 1px solid #444;
  
  &:hover {
    background-color: #3d3d3d;
  }
`;

const ErrorMessage = styled.p`
  color: #e53935;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const LeadForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    family_background: '',
    occupation: '',
    location: '',
    budget: '',
    timeline: ''
  });
  
  // Get userName from useChatbot context if available
  const { userName } = useChatbot();
  
  // Set name from userName if available
  useEffect(() => {
    if (userName) {
      setFormData(prev => ({
        ...prev,
        name: userName
      }));
    }
  }, [userName]);
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (!formData.family_background.trim()) {
      newErrors.family_background = 'Family background is required';
    }
    
    if (!formData.occupation.trim()) {
      newErrors.occupation = 'Occupation is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location preference is required';
    }
    
    if (!formData.budget.trim()) {
      newErrors.budget = 'Budget is required';
    }
    
    if (!formData.timeline.trim()) {
      newErrors.timeline = 'Timeline is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSubmit(formData);
      } catch (error) {
        console.error('Error submitting form:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <Overlay>
      <FormContainer>
        <Title>Thank you for your interest in 88Royals Property</Title>
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              disabled={isSubmitting}
            />
            {errors.name && <ErrorMessage>{errors.name}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              disabled={isSubmitting}
            />
            {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="family_background">Family Background</Label>
            <Input
              type="text"
              id="family_background"
              name="family_background"
              value={formData.family_background}
              onChange={handleChange}
              placeholder="Share about your family background"
              disabled={isSubmitting}
            />
            {errors.family_background && <ErrorMessage>{errors.family_background}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="occupation">Occupation/Profession</Label>
            <Input
              type="text"
              id="occupation"
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              placeholder="What do you do for work?"
              disabled={isSubmitting}
            />
            {errors.occupation && <ErrorMessage>{errors.occupation}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="location">Current Location</Label>
            <Input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Where do you currently live?"
              disabled={isSubmitting}
            />
            {errors.location && <ErrorMessage>{errors.location}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="isJain">Are you a member of the Jain community?</Label>
            <Select
              id="isJain"
              name="isJain"
              value={formData.isJain}
              onChange={(e) => handleChange({
                target: {
                  name: 'isJain',
                  value: e.target.value === 'true'
                }
              })}
              disabled={isSubmitting}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Select>
            {errors.isJain && <ErrorMessage>{errors.isJain}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="interestedIn">Which configuration are you interested in?</Label>
            <Select
              id="interestedIn"
              name="interestedIn"
              value={formData.interestedIn}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="Both">Both 3BHK and 4BHK</option>
              <option value="3BHK">3BHK (2500-3000 sq ft)</option>
              <option value="4BHK">4BHK (3500-4000 sq ft)</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="preferredFloor">Preferred Floor</Label>
            <Select
              id="preferredFloor"
              name="preferredFloor"
              value={formData.preferredFloor}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">No specific preference</option>
              <option value="Lower (1-5)">Lower (1-5)</option>
              <option value="Middle (6-10)">Middle (6-10)</option>
              <option value="Higher (10+)">Higher (10+)</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="vastuPreference">Is Vastu compliance important to you?</Label>
            <Select
              id="vastuPreference"
              name="vastuPreference"
              value={formData.vastuPreference}
              onChange={(e) => handleChange({
                target: {
                  name: 'vastuPreference',
                  value: e.target.value === 'true'
                }
              })}
              disabled={isSubmitting}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="budget">What is your budget?</Label>
            <Select
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select your budget</option>
              <option value="₹3 Crore - ₹4 Crore">₹3 Crore - ₹4 Crore</option>
              <option value="₹4 Crore - ₹5 Crore">₹4 Crore - ₹5 Crore</option>
              <option value="Above ₹5 Crore">More than ₹5 Crore</option>
            </Select>
            {errors.budget && <ErrorMessage>{errors.budget}</ErrorMessage>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="timeline">When are you planning to make a purchase?</Label>
            <Select
              id="timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select your timeline</option>
              <option value="Immediately">Immediate</option>
              <option value="Within 3 months">Within 3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6-12 months">6-12 months</option>
              <option value="More than 12 months">More than 12 months</option>
            </Select>
            {errors.timeline && <ErrorMessage>{errors.timeline}</ErrorMessage>}
          </FormGroup>
          
          <ButtonGroup>
            <CancelButton type="button" onClick={onCancel}>Cancel</CancelButton>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </SubmitButton>
          </ButtonGroup>
        </Form>
      </FormContainer>
    </Overlay>
  );
};

export default LeadForm;