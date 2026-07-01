import { LuSendHorizontal } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import "./Chatbot.css";
import { useState } from "react";

import { RiRobot2Line } from "react-icons/ri";
import { useSSE } from "./ChatbotHook";
export default function Chatbot({ isBotOpen = () => {} }) {
  const [chat, setChat] = useState("");
  const { messages, sendMessage } = useSSE();
  const handleSend = () => {
    if (!chat) return;
    sendMessage(chat);
    setChat("");
  };
  return (
    <div className="absolute bottom-10 right-10  h-[450px] w-[400px] shadow-xl flex flex-col bg-transparent z-1">
      <div className="bot-header">
        <div className="bg-black bg-transparent w-9 h-9">
          <RiRobot2Line size={20} className="text-black" />
        </div>
        <span className="font-bold text-base text-black">Lumina AI</span>
        <button onClick={isBotOpen} className="text-black ">
          <IoClose size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="bot-message-box">
        {messages.map((message, index) => (
          <div
            key={index}
            className={message.role === "assistant" ? "botchat" : "userchat"}
          >
            <p>
              {message.role === "assistant" ? (
                <>{message.text == "" ? "Thinking.." : message.text}</>
              ) : (
                message.text
              )}
            </p>
          </div>
        ))}
      </div>

      <div className="bot-input">
        <input
          type="text"
          value={chat}
          placeholder="Type a message..."
          onChange={(e) => setChat(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border-none text-base text-teritiary-700 placeholder-teritiary outline-none"
        />
        <button
          onClick={handleSend}
          className="text-primary hover:opacity-70 flex items-center "
        >
          <LuSendHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}
