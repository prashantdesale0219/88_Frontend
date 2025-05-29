import React from 'react';
import Chatbot from './components/Chatbot';
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: #121212;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 800px;
`;

const Title = styled.h1`
  color: #f5f5f5;
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #aaa;
  font-size: 1rem;
`;

const App = () => {
  return (
    <AppContainer>
      <Header>
        <Title>88Royals - Exclusive Property</Title>
        <Subtitle>Premium flat available exclusively for Jain community members</Subtitle>
      </Header>
      <Chatbot />
    </AppContainer>
  );
};

export default App;