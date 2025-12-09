import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Minimize2, Loader2, Bot, User } from 'lucide-react';
import { Tool } from '../types';
import { UI_TEXT } from '../constants';
import { createToolChatSession } from '../services/geminiService';
import { Chat, GenerateContentResponse } from "@google/genai";

interface ChatWidgetProps {
  tools: Tool[];
  lang: 'en' | 'zh';
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const ChatWidget: React.FC<ChatWidgetProps> = ({ tools, lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const text = UI_TEXT[lang];

  // Initialize chat session
  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      chatSessionRef.current = createToolChatSession(tools);
      // Add welcome message if empty
      if (messages.length === 0) {
        setMessages([{ role: 'model', text: text.chatWelcome }]);
      }
    }
  }, [isOpen, tools, text.chatWelcome, messages.length]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || !chatSessionRef.current || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      // Add a placeholder for the model response
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      const result = await chatSessionRef.current.sendMessageStream({ message: userMessage });
      
      let fullText = '';
      for await (const chunk of result) {
        const c = chunk as GenerateContentResponse;
        const chunkText = c.text || '';
        fullText += chunkText;
        
        // Update the last message (model response) with accumulated text
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = { role: 'model', text: fullText };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: lang === 'zh' ? '抱歉，我遇到了一些问题。' : 'Sorry, I encountered an error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      
      {/* Chat Window */}
      <div 
        className={`
          bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 sm:w-96 mb-4 overflow-hidden pointer-events-auto transition-all duration-300 origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100 translate-y-0' : 'scale-95 opacity-0 translate-y-10 pointer-events-none h-0'}
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <Bot size={18} />
            </div>
            <h3 className="font-bold text-sm">{text.chatTitle}</h3>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded transition-colors"
          >
            <Minimize2 size={16} />
          </button>
        </div>

        {/* Messages */}
        <div className="h-80 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.map((msg, idx) => (
            <div 
              key={idx} 
              className={`flex gap-2 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1
                  ${msg.role === 'user' ? 'bg-gray-200' : 'bg-blue-100 text-blue-600'}
                `}
              >
                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
              </div>
              <div 
                className={`
                  max-w-[80%] px-3 py-2 rounded-2xl text-sm leading-relaxed
                  ${msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none shadow-sm'}
                `}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-gray-100 bg-white flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={text.chatPlaceholder}
            className="flex-1 bg-gray-100 rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all"
            disabled={isLoading}
          />
          <button 
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white p-2 rounded-xl transition-colors flex items-center justify-center"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          pointer-events-auto
          group flex items-center justify-center w-14 h-14 rounded-full shadow-2xl 
          bg-gradient-to-br from-blue-600 to-indigo-700 text-white
          hover:scale-110 active:scale-90 transition-all duration-200
        `}
      >
         {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default ChatWidget;
