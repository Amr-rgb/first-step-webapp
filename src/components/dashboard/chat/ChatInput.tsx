"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { dashboardIcons } from "@/components/general/icons";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState("");
  const t = useTranslations("chat.interface");

  const handleSendMessage = () => {
    if (inputValue.trim() !== "") {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white p-3 md:p-6 border-t border-gray-200">
      <div className="flex items-end space-x-2 md:space-x-4">
        <div className="flex-1">
          <textarea
            rows={1}
            placeholder={t("typeMessage")}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            className="w-full resize-none border border-gray-300 rounded-xl px-3 md:px-4 py-2 md:py-3 focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-sm placeholder-gray-500"
            style={{
              minHeight: "40px",
              maxHeight: "120px",
            }}
          />
        </div>
        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          className={`p-2 md:p-3 rounded-xl transition-all duration-200 shadow-md ${
            inputValue.trim()
              ? "bg-primary hover:bg-primary-dark text-white hover:shadow-lg transform hover:scale-105"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <svg
            className="w-4 h-4 md:w-5 md:h-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M22 2L11 13" />
            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
          </svg>
        </button>
      </div>
      <div className="mt-2 text-xs text-gray-500 hidden md:block">
        {t("pressEnter")}
      </div>
    </div>
  );
};

export default ChatInput;
