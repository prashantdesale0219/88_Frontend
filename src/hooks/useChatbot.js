import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080/api';

// Language selection removed as AI detects language automatically
// Default language is still defined for internal use
const DEFAULT_LANGUAGE = 'en';

export const useChatbot = () => {
  const [messages, setMessages] = useState([]);
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [userName, setUserName] = useState('');
  const [showPropertyInfo, setShowPropertyInfo] = useState(false);
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE); // Default language is still used internally
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  // Fetch properties from API
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get(`${API_URL}/properties`);
        if (response.data.success && response.data.data) {
          // Handle the new JSON file format
          const propertyData = response.data.data;
          const formattedProperty = {
            title: propertyData.title,
            location: {
              city: propertyData.location,
              area: '',
              address: propertyData.location
            },
            details: {
              configuration: '',
              area: propertyData.area,
              price: propertyData.price,
              availability: propertyData.status
            },
            amenities: propertyData.amenities,
            isExclusiveToJain: propertyData.isForJain,
            description: {
              en: propertyData.description || ''
            },
            images: propertyData.images || []
          };
          
          setProperties([formattedProperty]);
          setSelectedProperty(formattedProperty);
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    
    fetchProperties();
  }, []);
  
  // Initialize chatbot with welcome message and questions
  useEffect(() => {
    const welcomeMessage = {
      role: 'assistant',
      content: language === 'en' 
        ? 'Hi there! 👋 I am your property assistant. Please tell me your name so I can assist you better.'
        : 'नमस्ते! 👋 मैं आपका प्रॉपर्टी सहायक हूं। कृपया मुझे अपना नाम बताएं ताकि मैं आपकी बेहतर सहायता कर सकूं।'
    };
    setMessages([welcomeMessage]);
    setChatHistory([welcomeMessage]);
  }, [language]);

  // Send message to backend API
  const sendMessage = async (message) => {
    if (!message.trim()) return;
    
    // Add user message to chat
    const userMessage = { role: 'user', content: message };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    // Check if this is the first user message (name)
    if (messages.length === 1) {
      // Check if the message is a greeting or casual message rather than a name
      const commonGreetings = ['hello', 'hi', 'hey', 'namaste', 'नमस्ते', 'हेलो', 'हाय', 'नमस्कार', 'प्रणाम'];
      const isGreeting = commonGreetings.some(greeting => 
        message.toLowerCase().includes(greeting.toLowerCase()));
      
      // If it's not just a greeting, set it as the username
      if (!isGreeting) {
        setUserName(message);
      } else {
        // If it's a greeting, we'll wait for the next message for the name
        // We can add a special flag or just continue the conversation
        const namePrompt = language === 'en' 
          ? 'Nice to meet you! What should I call you?'
          : 'आपसे मिलकर अच्छा लगा! मैं आपको क्या नाम से पुकारूं?';
        
        // Add AI response to chat asking for name again
        const aiMessage = { role: 'assistant', content: namePrompt };
        setMessages(prev => [...prev, aiMessage]);
        setChatHistory(prev => [...prev, userMessage, aiMessage]);
        setIsLoading(false);
        return;
      }
    }
    
    // Process lead collection answers if in lead collection mode
    if (collectingLeadInfo) {
      const answered = processLeadAnswer(message);
      if (answered) return;
    }
    
    try {
      // Call backend API with all context
      const response = await axios.post(`${API_URL}/chat`, {
        message,
        language,
        property: selectedProperty, // Include property context
        userName: userName || message, // Use current message as name if first message
        previousMessages: messages, // Send all messages for context instead of just last 5
        oneQuestionAtTime: true // Signal to backend to return only one question at a time
      });
      
      // Process the response to ensure only one question is displayed
      let responseMessage = response.data.message;
      
      // Split response by question marks and only take the first question if multiple exist
      // This is a simple approach - for production, a more sophisticated NLP approach would be better
      const questionParts = responseMessage.split(/\?|\।|\॥/);
      if (questionParts.length > 1) {
        // Take only the first question and add back the question mark
        responseMessage = questionParts[0] + '?';
        
        // If it's Hindi, use the appropriate punctuation
        if (language === 'hi') {
          responseMessage = questionParts[0] + '?';
        }
      }
      
      // Add AI response to chat
      const aiMessage = { role: 'assistant', content: responseMessage };
      setMessages(prev => [...prev, aiMessage]);
      
      // Always update chat history with current messages
      setChatHistory(prev => [...prev, userMessage, aiMessage]);
      
      // Also update with server chat history if provided
      if (response.data.chatHistory) {
        setChatHistory(response.data.chatHistory);
      }
      
      // Check for special commands in the response
      const responseText = responseMessage.toLowerCase();
      
      // Show property info if requested by AI
      if (responseText.includes('show property details') || 
          responseText.includes('property information') || 
          responseText.includes('प्रॉपर्टी विवरण दिखाएं') ||
          responseText.includes('प्रॉपर्टी जानकारी')) {
        setShowPropertyInfo(true);
      }
      
      // Start lead collection if AI detects interest
      if ((responseText.includes('collect your contact') || 
          responseText.includes('need your details') || 
          responseText.includes('आपका संपर्क एकत्र') ||
          responseText.includes('आपका विवरण चाहिए')) && 
          !collectingLeadInfo && !leadSubmitted) {
        startLeadCollection();
      }
      
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      const fallbackResponse = getFallbackResponse(message, language);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: fallbackResponse
      }]);
    } finally {
      setIsLoading(false);
    }
  };


  // Lead collection state
  const [collectingLeadInfo, setCollectingLeadInfo] = useState(false);
  const [leadInfo, setLeadInfo] = useState({
    name: '',
    phone: '',
    family_background: '',
    occupation: '',
    location: '',
    budget: '',
    timeline: ''
  });
  const [currentQuestion, setCurrentQuestion] = useState('');
  
  // Lead questions sequence - Notion-style format with icons and descriptions
  const leadQuestions = [
    { 
      field: 'phone', 
      icon: '📱',
      title: () => language === 'en' ? 'Mobile Number' : 'मोबाइल नंबर',
      description: () => language === 'en' 
        ? 'Our property expert will contact you on this number'
        : 'हमारा प्रॉपर्टी विशेषज्ञ आपसे इस नंबर पर संपर्क करेगा',
      question: (name) => language === 'en'
        ? `${name}, your contact number please?`
        : `${name}, आपका संपर्क नंबर?`
    },
    { 
      field: 'family_background', 
      icon: '👨‍👩‍👧‍👦',
      title: () => language === 'en' ? 'Family Structure' : 'परिवार संरचना',
      description: () => language === 'en'
        ? 'Helps us recommend the right property size for you'
        : 'हमें आपके लिए सही प्रॉपर्टी आकार की सिफारिश करने में मदद करता है',
      question: () => language === 'en'
        ? 'How many family members will live here?'
        : 'यहां कितने परिवार के सदस्य रहेंगे?'
    },
    { 
      field: 'occupation', 
      icon: '💼',
      title: () => language === 'en' ? 'Occupation' : 'व्यवसाय',
      description: () => language === 'en'
        ? 'Helps us understand your lifestyle needs'
        : 'हमें आपकी जीवनशैली की जरूरतों को समझने में मदद करता है',
      question: () => language === 'en'
        ? 'What work do you do?'
        : 'आप क्या काम करते हैं?'
    },
    { 
      field: 'location', 
      icon: '📍',
      title: () => language === 'en' ? 'Preferred Location' : 'पसंदीदा स्थान',
      description: () => language === 'en'
        ? 'Specific areas you prefer in Surat'
        : 'सूरत में आपके पसंदीदा विशिष्ट क्षेत्र',
      question: () => language === 'en'
        ? 'Which area do you like most?'
        : 'आपको कौन सा इलाका सबसे ज्यादा पसंद है?'
    },
    { 
      field: 'budget', 
      icon: '💰',
      title: () => language === 'en' ? 'Budget Range' : 'बजट सीमा',
      description: () => language === 'en'
        ? 'Your investment range for this property'
        : 'इस प्रॉपर्टी के लिए आपकी निवेश सीमा',
      question: () => language === 'en'
        ? 'Your budget?'
        : 'आपका बजट?'
    },
    { 
      field: 'timeline', 
      icon: '🗓️',
      title: () => language === 'en' ? 'Purchase Timeline' : 'खरीद समयसीमा',
      description: () => language === 'en'
        ? 'When you plan to make this purchase'
        : 'आप यह खरीद कब करने की योजना बनाते हैं',
      question: () => language === 'en'
        ? 'When do you want to buy?'
        : 'आप कब खरीदना चाहते हैं?'
    }
  ];
  
  // Start lead collection process
  const startLeadCollection = () => {
    setCollectingLeadInfo(true);
    setLeadInfo(prev => ({ ...prev, name: userName }));
    setIsLoading(true);
    
    // Add a small delay before asking the first question
    // This makes the conversation feel more natural
    setTimeout(() => {
      // Ask first question
      const firstQuestion = leadQuestions[0].question(userName);
      setCurrentQuestion(firstQuestion);
      
      // Add question to messages
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: firstQuestion
      }]);
      setIsLoading(false);
    }, 1000);
  };
  
  // Process lead info answers
  const processLeadAnswer = (answer) => {
    if (!collectingLeadInfo) return false;
    
    // Find current question index
    const currentIndex = leadQuestions.findIndex(q => 
      q.question(userName) === currentQuestion || 
      q.question() === currentQuestion
    );
    
    if (currentIndex === -1) return false;
    
    // Update lead info with answer
    const field = leadQuestions[currentIndex].field;
    setLeadInfo(prev => ({ ...prev, [field]: answer }));
    
    // Check if we have more questions
    if (currentIndex < leadQuestions.length - 1) {
      // Ask next question - but with a delay to make it feel more natural
      // and to ensure we're only asking one question at a time
      setIsLoading(true);
      
      setTimeout(() => {
        // Get the next question
        const nextQuestion = leadQuestions[currentIndex + 1].question(userName);
        setCurrentQuestion(nextQuestion);
        
        // Add question to messages
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: nextQuestion
        }]);
        setIsLoading(false);
      }, 1500); // Slightly longer delay to make it feel more natural
      
      return true;
    } else {
      // All questions answered, submit lead
      submitLead(leadInfo);
      setCollectingLeadInfo(false);
      setCurrentQuestion('');
      return true;
    }
  };
  
  // Submit lead information
  const submitLead = async (leadData) => {
    try {
      setIsLoading(true);
      
      // Add language preference and property info to lead info
      const enrichedLeadData = {
        ...leadData,
        chat_history: messages, // Use full messages array instead of chatHistory
        preferredLanguage: language,
        property: selectedProperty ? {
          title: selectedProperty.title,
          location: selectedProperty.location.city,
          price: selectedProperty.details.price,
          area: selectedProperty.details.area
        } : null
      };
      
      // Send lead to backend
      const response = await axios.post(`${API_URL}/leads`, enrichedLeadData);
      
      setLeadSubmitted(true);
      
      // Add personalized thank you message in selected language
      const thankYouMessage = language === 'en'
        ? `Thank you ${leadData.name} for sharing your information with us! I've recorded all your preferences and requirements. Our property expert will contact you soon at ${leadData.phone} to discuss the next steps, including arranging a property visit if you'd like. We're excited to help you find your perfect home!`
        : `${leadData.name}, हमारे साथ अपनी जानकारी साझा करने के लिए धन्यवाद! मैंने आपकी सभी प्राथमिकताओं और आवश्यकताओं को रिकॉर्ड कर लिया है। हमारा प्रॉपर्टी विशेषज्ञ जल्द ही आपसे ${leadData.phone} पर संपर्क करेगा ताकि अगले चरणों पर चर्चा की जा सके, जिसमें यदि आप चाहें तो प्रॉपर्टी विजिट की व्यवस्था भी शामिल है। हम आपको आपका सही घर खोजने में मदद करने के लिए उत्साहित हैं!`;
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: thankYouMessage
      }]);
      
    } catch (error) {
      console.error('Error submitting lead:', error);
      // Add error message in selected language
      const errorMessage = language === 'en'
        ? 'Sorry, there was an error submitting your information. Please try again later.'
        : 'क्षमा करें, आपकी जानकारी सबमिट करने में त्रुटि हुई। कृपया बाद में पुनः प्रयास करें।';
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: errorMessage
      }]);
    } finally {
      setIsLoading(false);
      setCollectingLeadInfo(false);
    }
  };

  // Language is now automatically detected by the backend
  
  // Fallback responses when API fails
  const getFallbackResponse = (message, lang) => {
    return lang === 'en'
      ? "I'm sorry, I'm having trouble connecting to our servers right now. Please try again in a moment."
      : "मुझे खेद है, मुझे अभी हमारे सर्वर से कनेक्ट करने में समस्या हो रही है। कृपया कुछ देर बाद फिर से प्रयास करें।";
  };

  return {
    messages,
    setMessages,
    isLoading,
    sendMessage,
    showLeadForm,
    setShowLeadForm,
    leadSubmitted,
    setLeadSubmitted,
    submitLead,
    userName,
    showPropertyInfo,
    setShowPropertyInfo,
    collectingLeadInfo,
    leadInfo,
    language
  };
};
