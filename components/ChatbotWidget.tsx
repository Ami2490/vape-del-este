import React, { useState, useEffect, useRef } from 'react';
import type { Chat } from '@google/genai';
import { startChat } from '../services/geminiService';
import type { ChatMessage, Product } from '../types';
import { XIcon, WhatsAppIcon } from './IconComponents';

interface ChatbotWidgetProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

const TypingIndicator = () => (
    <div className="flex items-center space-x-1 p-2">
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
    </div>
);

export const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ isOpen, onClose, products }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showHandoff, setShowHandoff] = useState(false);
    const [handoffMessage, setHandoffMessage] = useState('');
    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if (isOpen && products.length > 0) {
            chatRef.current = startChat(products);
            setMessages([{ sender: 'bot', text: '¡Hola! 👋 Soy EsteBot, tu asistente virtual. ¿En qué puedo ayudarte hoy?' }]);
            setIsLoading(false);
            setShowHandoff(false);
            setInput('');
        }
    }, [isOpen, products]);

    const handleSend = async () => {
        if (!input.trim() || !chatRef.current) return;

        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);
        setShowHandoff(false);

        try {
            const result = await chatRef.current.sendMessageStream({ message: userMessage.text });
            let botResponseText = '';
            
            setMessages(prev => [...prev, { sender: 'bot', text: '' }]);

            for await (const chunk of result) {
                botResponseText += chunk.text;
                
                if (botResponseText.includes('[HANDOFF]')) {
                    const handoffText = botResponseText.replace('[HANDOFF]', '').trim();
                    setHandoffMessage(handoffText);
                    setMessages(prev => {
                        const newMessages = [...prev];
                        newMessages[newMessages.length - 1] = { sender: 'bot', text: handoffText };
                        return newMessages;
                    });
                    setShowHandoff(true);
                    break; 
                }
                
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { sender: 'bot', text: botResponseText };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Chatbot error:", error);
            setMessages(prev => [...prev, { sender: 'bot', text: 'Lo siento, estoy teniendo problemas para conectarme. Por favor, intenta de nuevo más tarde.' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const whatsAppNumber = "59800000000"; // Placeholder number
    const finalWhatsAppMessage = `Hola Vape del Este, necesesito ayuda con lo siguiente: ${handoffMessage}`;

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-24 right-6 w-full max-w-sm z-[100] font-sans">
            <div className="bg-dark-secondary rounded-xl shadow-2xl flex flex-col h-[60vh] border border-gray-700">
                <header className="flex items-center justify-between p-4 bg-dark-primary rounded-t-xl border-b border-gray-700">
                    <div className="flex items-center gap-3">
                        <img src="https://firebasestorage.googleapis.com/v0/b/zona-clic-admin.firebasestorage.app/o/vape%20del%20este%2FWhatsApp_Image_2025-09-07_at_12.56.29_PM-removebg-preview.png?alt=media&token=ee1cd9e3-7bf7-448c-a418-3b3133ef1097" alt="Vape del Este" className="h-8 w-auto" />
                        <div>
                            <h3 className="font-bold text-white">Vape del Este</h3>
                            <p className="text-xs text-green-400">● Online</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <XIcon className="h-6 w-6" />
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-brand-purple text-white rounded-br-none' : 'bg-gray-700 text-dark-text rounded-bl-none'}`}>
                                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                         <div className="flex justify-start">
                             <div className="bg-gray-700 rounded-2xl rounded-bl-none">
                                <TypingIndicator />
                             </div>
                         </div>
                    )}
                    {showHandoff && (
                        <a 
                            href={`https://wa.me/${whatsAppNumber}?text=${encodeURIComponent(finalWhatsAppMessage)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full mt-2 bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center text-sm"
                        >
                            <WhatsAppIcon className="h-5 w-5 mr-2" />
                            Chatear con un experto en WhatsApp
                        </a>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 border-t border-gray-700">
                    <div className="flex items-center bg-dark-primary rounded-lg">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                            placeholder="Escribe tu mensaje..."
                            className="flex-1 bg-transparent p-3 text-white placeholder-gray-500 focus:outline-none"
                            disabled={isLoading}
                        />
                        <button onClick={handleSend} disabled={isLoading || !input.trim()} className="p-3 text-brand-blue-light disabled:text-gray-600 hover:text-white disabled:cursor-not-allowed">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};