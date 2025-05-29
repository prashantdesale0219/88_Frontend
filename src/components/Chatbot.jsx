import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiSend, FiUser, FiMessageSquare } from 'react-icons/fi';
import { useChatbot } from '../hooks/useChatbot';
import ThankYou from './ThankYou';
import PropertyInfo from './PropertyInfo';
import FormattedMessage from './FormattedMessage';

const ChatbotContainer = styled.div`
  width: 100%;
  max-width: 1000px;
  height: 600px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  margin-bottom: 2rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    height: 100vh;
    border-radius: 0;
    margin-bottom: 0;
  }
`;

const ChatHeader = styled.div`
  color: white;
  padding: 1rem;
  text-align: center;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  
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

const ChatMessages = styled.div`
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (max-width: 768px) {
    padding-bottom: 80px; /* Add space for the fixed input bar */
  }
`;

const Message = styled.div`
  max-width: 80%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  line-height: 1.4;
  word-wrap: break-word;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  ${props => props['data-isuser'] === 'true' ? `
    align-self: flex-end;
    background-color: #4a6fa5;
    color: white;
    border-bottom-right-radius: 4px;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(120deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
      border-radius: 8px;
      border-bottom-right-radius: 4px;
    }
  ` : `
    align-self: flex-start;
    background-color: #2d2d2d;
    color: #f5f5f5;
    border-bottom-left-radius: 4px;
    border: 1px solid #444;
    position: relative;
    
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
  `}
`;

const ChatInput = styled.form`
  display: flex;
  padding: 1rem;
  border-top: 1px solid #444;
  
  @media (max-width: 768px) {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #121212;
    z-index: 100;
    padding: 0.75rem;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid #444;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  background-color: #1e1e1e;
  color: #f5f5f5;
  
  &:focus {
    border-color: #4a6fa5;
    box-shadow: 0 0 0 2px rgba(74, 111, 165, 0.2);
  }
  
  &::placeholder {
    color: #888;
  }
  
  &:hover:not(:disabled) {
    border-color: #6a8fc5;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SendButton = styled.button`
  background-color: #4a6fa5;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-left: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  
  &:hover {
    background-color: #3a5a8f;
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
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
`;

// Language button removed as AI detects language automatically


// Language selector removed as AI detects language automatically


// Language option removed as AI detects language automatically


const Typing = styled.div`
  align-self: flex-start;
  background-color: #2d2d2d;
  color: #f5f5f5;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border-bottom-left-radius: 4px;
  border: 1px solid #444;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  
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
  
  &:after {
    content: '.';
    animation: dots 1.5s steps(5, end) infinite;
  }
  
  @keyframes dots {
    0%, 20% { content: '.'; }
    40% { content: '..'; }
    60% { content: '...'; }
    80%, 100% { content: ''; }
  }
`;

const Chatbot = () => {
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { 
    messages, 
    isLoading, 
    sendMessage, 
    leadSubmitted,
    setLeadSubmitted,
    submitLead,
    userName,
    showPropertyInfo,
    setShowPropertyInfo,
    collectingLeadInfo,
    language,
    selectedProperty
  } = useChatbot();

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);
  
  // Auto focus and select input text after messages update
  useEffect(() => {
    if (!isLoading && !leadSubmitted && !showPropertyInfo && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [messages, isLoading, leadSubmitted, showPropertyInfo]);
  
  // Language selector code removed as AI detects language automatically

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputMessage.trim() && !isLoading) {
      sendMessage(inputMessage);
      setInputMessage('');
      // Focus on input field after sending message
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  const handleInterestConfirm = () => {
    // Use sendMessage instead of directly manipulating messages
    sendMessage('I am interested in this property');
    
    // The rest will be handled by the sendMessage function in useChatbot.js
    // which already has logic for handling interest confirmation
    setShowPropertyInfo(false);
  };
  
  // Language selection handler removed as AI detects language automatically

  return (
    <ChatbotContainer>
     
      
      <ChatMessages>
        {messages.map((msg, index) => (
          <Message key={index} data-isuser={(msg.role === 'user').toString()}>
            {msg.role === 'user' ? (
              msg.content
            ) : (
              <FormattedMessage content={msg.content} />
            )}
          </Message>
        ))}
        
        {isLoading && <Typing>Typing</Typing>}
        
        {showPropertyInfo && (
          <PropertyInfo 
            userName={userName} 
            language={language}
            selectedProperty={selectedProperty}
            onInterestConfirm={handleInterestConfirm} 
          />
        )}
        
        <div ref={messagesEndRef} />
      </ChatMessages>
      
      <ChatInput onSubmit={handleSubmit}>
        <Input
          type="text"
          ref={inputRef}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message here..."
          disabled={isLoading || leadSubmitted || showPropertyInfo}
          autoFocus
          onFocus={(e) => e.target.select()}
        />
        <SendButton 
          type="submit" 
          disabled={!inputMessage.trim() || isLoading || leadSubmitted}
        >
          <FiSend />
        </SendButton>
      </ChatInput>
      
      {leadSubmitted && <ThankYou />}
    </ChatbotContainer>
  );
};

export default Chatbot;