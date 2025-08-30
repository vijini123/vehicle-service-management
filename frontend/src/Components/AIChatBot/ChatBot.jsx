import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faRobot, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
const ChatbotContainer = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 300px;
  height: 400px;
  border: 1px solid #ccc;
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #ece5dd;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
`;

const ChatHeader = styled.div`
  background-color: #075e54;
  color: white;
  padding: 10px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChatMessages = styled.div`
  flex: 2;
  overflow-y: auto;
  padding: 10px;
`;

const UserMessage = styled.div`
  background-color: #ffff;
  padding: 8px 12px;
  border-radius: 0px 18px 18px 18px;
  margin-bottom: 10px;
  max-width: 100%;
  align-self: flex-end;
  word-wrap: break-word;
`;

const BotMessage = styled.div`
  background-color: #dcf8c6;
  padding: 8px 12px;
  border-radius: 18px 0px 18px 18px;
  margin-bottom: 10px;
  max-width: 100%;
  align-self: flex-start;
  word-wrap: break-word;
`;

const InputArea = styled.div`
  display: flex;
  padding: 10px;
  background-color: white;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 20px;
  outline: none;
`;

const SendButton = styled.button`
  background-color: #128c7e;
  color: white;
  border: none;
  padding: 8px 15px;
  margin-left: 10px;
  border-radius: 80px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MessageIcon = styled.span`
  margin-right: 8px;
`;



const qaData = [
    { 
      question: "Hello",
      answer: "Hello👋! How can I assist you today?"
    },
    { 
      question: "How do I book a appoinment?",
      answer: "Make a appoinment is easy! 📅 You can visit our booking page and there is a form to add  your details. We will contact you to confirm the appoinment. Make sure to login to your account to book an appoinment."


    },
    { 
      question: "How do I contact you?",
      answer: "You can contact us through our website(Go to contact us page), by phone, or by visiting our service center. We're here to help! 📞"
    },
    { 
        question: "What services do you offer?",
        answer: "We offer a wide range of vehicle services including: 🔧 Oil changes, 🚗 Brake repairs, 🛞 Tire rotations, 🔋 Battery replacements, and much more! How can we assist you today?"
    },
    { 
        question: "How do I book a service?",
        answer: "Booking a service is easy! 📅 You can either call us directly, use our online booking system on our website, or visit our service center in person. Which method would you prefer?"
    },
];

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;

    setMessages([...messages, { text: input, user: true }]);
    setInput('');

    // Simple matching algorithm
    const matchedQA = qaData.find(qa => 
      qa.question.toLowerCase().includes(input.toLowerCase())
    );

    setTimeout(() => {
      if (matchedQA) {
        setMessages(msgs => [...msgs, { text: matchedQA.answer, user: false }]);
      } else {
        setMessages(msgs => [...msgs, { text: "I'm sorry, I don't have an answer for that. Can you please rephrase your question or ask something else? 🤔", user: false }]);
      }
    }, 1000);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <ChatbotContainer>
      <ChatHeader>
        <span>SAVONTA 🚗....</span>
      </ChatHeader>
        <ChatMessages>
            {messages.map((message, index) => (
                message.user ? 
                <UserMessage key={index}>
                    <MessageIcon>
                    <FontAwesomeIcon icon={faUser} />
                    </MessageIcon>
                    {message.text}
                </UserMessage> :
                <BotMessage key={index}>
                    <MessageIcon>
                    <FontAwesomeIcon icon={faRobot} />
                    </MessageIcon>
                    {message.text}
                </BotMessage>
            ))}
            <div ref={messagesEndRef} />
        </ChatMessages>
      <InputArea>
        <Input 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your message..."
        />
        <SendButton onClick={handleSend}>
            <FontAwesomeIcon icon={faPaperPlane} />
        </SendButton>
      </InputArea>
    </ChatbotContainer>
  );
};

export default ChatBot;