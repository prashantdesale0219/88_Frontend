import React from 'react';
import styled from 'styled-components';

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

const Container = styled.div`
  background-color: #1e1e1e;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  text-align: center;
  border: 1px solid #444;
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    width: 95%;
  }
  
  @media (max-width: 480px) {
    padding: 1rem;
    width: 100%;
    border-radius: 8px;
  }
`;

const Title = styled.h2`
  color: #4a6fa5;
  margin-bottom: 1rem;
  border-bottom: 1px solid #444;
  padding-bottom: 0.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
  
  @media (max-width: 480px) {
    font-size: 1.4rem;
    margin-bottom: 0.75rem;
  }
`;

const Message = styled.p`
  color: #f5f5f5;
  margin-bottom: 1.5rem;
  line-height: 1.5;
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }
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
  transition: background-color 0.2s;
  
  @media (max-width: 480px) {
    padding: 0.6rem 1.25rem;
    font-size: 0.9rem;
    border-radius: 6px;
  }
  
  &:hover {
    background-color: #3a5a8f;
  }
`;

const ThankYou = () => {
  return (
    <Overlay>
      <Container>
        <Title>Thank You!</Title>
        <Message>
          Your information has been successfully submitted. Our team will contact you soon to discuss the property details and arrange a visit if you wish.
        </Message>
        <Button onClick={() => window.location.reload()}>Close</Button>
      </Container>
    </Overlay>
  );
};

export default ThankYou;