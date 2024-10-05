"use client";
import React, { useState, useRef, useEffect } from "react";
import celestialBodies from "./celestialBodies";
import { SendHorizontal } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Image from "next/image";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const LeftPanel = ({ selectedBody, onClose, path }) => {
  const imgsPath = "";
  // const imgsPath = "/orbit";
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef(null);

  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Reset chat state when the selected body changes
  useEffect(() => {
    setIsChatOpen(false);
    setMessages([]);
    setInputMessage("");
  }, [selectedBody]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!selectedBody) return null;

  const bodyData = celestialBodies.find(
    (body) => body.name.toLowerCase() === selectedBody.toLowerCase()
  );

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMessages = [
      ...messages,
      {
        type: "user",
        content: inputMessage,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];

    setMessages(newMessages);
    setInputMessage("");

    // AI Model interaction
    try {
      const prompt = `Provide information about ${bodyData.name}. User asked: "${inputMessage}" without using markdown rules / stars.`;
      const result = await model.generateContent(prompt);

      const aiResponseMessage = {
        type: "ai",
        content: result.response.text(), // Adjust this line according to the API response
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prevMessages) => [...prevMessages, aiResponseMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const handlePanelClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div
      onClick={handlePanelClick}
      className={`absolute top-0 left-0 h-full bg-black bg-opacity-50 text-white overflow-hidden transition-all duration-300 ease-in-out ${
        isChatOpen ? "w-[40%]" : "w-[26.9%]"
      }`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        ✕
      </button>

      <div
        className={`transition-all duration-300 p-6 ${
          isChatOpen ? "h-[45%]" : "h-[calc(100%-80px)]"
        } overflow-y-auto `}
      >
        <h2 className="text-4xl font-bold mb-4 mt-4">{bodyData.name}</h2>
        <p className="text-md mb-4">{bodyData.type}</p>
        <Image
          width={200}
          height={200}
          src={`${imgsPath}/assets/Dimgs/${bodyData.name.toLowerCase()}.jpg`}
          alt={bodyData.name}
          className="w-full h-44 object-cover rounded-lg mb-4"
        />
        <p className="mb-4">{bodyData.description}</p>
        {bodyData.name !== "Sun" && (
          <div className="non-desc-items">
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Length of Year</h3>
              <p>{bodyData.LoY} Earth days</p>
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Distance from Sun</h3>
              <p>{bodyData.DoS} AU</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Moons</h3>
              <p>{bodyData.moons || 0}</p>
            </div>
          </div>
        )}
      </div>

      {!isChatOpen && (
        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsChatOpen(true);
            }}
            className="w-full border-blue-800 border-2 rounded-lg px-4 py-4 text-white hover:bg-blue-900/20 transition-colors"
          >
            Learn More
          </button>
        </div>
      )}

      {isChatOpen && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-0 left-0 right-0 h-[55%] bg-[#151510] opacity-75 backdrop-blur-sm"
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-700">
              <h3 className="text-lg font-semibold">
                Chat with AI about {bodyData.name}
              </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] ${
                      message.type === "user" ? "order-2" : "order-1"
                    }`}
                  >
                    <div
                      className={`
                      relative px-4 py-2 rounded-2xl
                      ${
                        message.type === "user"
                          ? `bg-blue-700 text-white rounded-br-none`
                          : "bg-gray-800 text-white rounded-bl-none"
                      }
                    `}
                    >
                      {message.content}
                      <span className="block text-xs text-gray-400 mt-1">
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-900"
            >
              <div className="flex items-center gap-2 bg-gray-500/35 rounded-lg p-2">
                <textarea
                  value={inputMessage}
                  onChange={(e) => {
                    e.stopPropagation();
                    setInputMessage(e.target.value);
                  }}
                  onKeyPress={handleKeyPress}
                  onClick={(e) => e.stopPropagation()}
                  placeholder={`Ask about ${bodyData.name}...`}
                  className="flex-1 bg-transparent resize-none outline-none max-h-32 min-h-[44px]"
                  rows="1"
                />
                <button
                  type="submit"
                  onClick={(e) => e.stopPropagation()}
                  className="p-2 hover:bg-gray-700 rounded-full transition-colors text-white/80 hover:text-white"
                >
                  <SendHorizontal size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeftPanel;
