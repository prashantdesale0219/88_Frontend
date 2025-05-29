import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

const MessageContainer = styled.div`
  width: 100%;
  overflow-wrap: break-word;
  
  /* Heading styles */
  h1, h2, h3, h4, h5, h6 {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
    color: #f5f5f5;
  }
  
  /* Paragraph styles */
  p {
    margin-bottom: 0.75rem;
  }
  
  /* Link styles */
  a {
    color: #6a8fc5;
    text-decoration: none;
    transition: color 0.2s;
    
    &:hover {
      color: #4a6fa5;
      text-decoration: underline;
    }
  }
  
  /* List styles */
  ul, ol {
    margin-bottom: 1rem;
    padding-left: 1.5rem;
  }
  
  li {
    margin-bottom: 0.25rem;
  }
  
  /* Code styles */
  code {
    background-color: #333;
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    font-family: monospace;
    font-size: 0.9em;
  }
  
  pre {
    background-color: #333;
    padding: 1rem;
    border-radius: 8px;
    overflow-x: auto;
    margin-bottom: 1rem;
    
    code {
      background-color: transparent;
      padding: 0;
    }
  }
  
  /* Blockquote styles */
  blockquote {
    border-left: 3px solid #4a6fa5;
    padding-left: 1rem;
    margin-left: 0;
    margin-right: 0;
    font-style: italic;
    color: #aaa;
  }
  
  /* Table styles */
  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 1rem;
  }
  
  th, td {
    border: 1px solid #444;
    padding: 0.5rem;
    text-align: left;
  }
  
  th {
    background-color: #2d2d2d;
  }
  
  tr:nth-child(even) {
    background-color: #2a2a2a;
  }
`;

const FormattedMessage = ({ content }) => {
  return (
    <MessageContainer>
      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </MessageContainer>
  );
};

export default FormattedMessage;