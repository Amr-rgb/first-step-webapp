"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useChat } from "./ChatProvider";
import { useAuthUser } from "../../store/authStore";
import { motion, AnimatePresence } from "framer-motion";
import {
  Paperclip,
  Send,
  Smile,
  X,
  Image as ImageIcon,
  File,
  XCircle,
  Search,
  MoreVertical,
} from "lucide-react";
import { Chat, Message } from "@/types";
import dynamic from "next/dynamic";

// Dynamically import the emoji picker with no SSR and proper typing
const Picker = dynamic<
  React.ComponentProps<typeof import("emoji-picker-react")> & {
    onEmojiClick: (emoji: any) => void;
  }
>(() => import("emoji-picker-react").then((mod) => mod.default), {
  ssr: false,
  loading: () => <div>Loading emoji picker...</div>,
});

// -----------------------------
// ChatMainArea Component
// -----------------------------
const ChatMainArea: React.FC = () => {
  const { chats, selectedChatId, sendMessage } = useChat();
  const user = useAuthUser();
  const chat = chats.find((c) => c.id === selectedChatId);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages]);

  // Handle emoji selection
  const onEmojiClick = (emojiObject: any) => {
    setMessage((prev) => prev + emojiObject.emoji);
    // Keep the picker open after selection
    // setShowEmojiPicker(false); // Uncomment this if you want to close after selection
    // Focus back on the input
    inputRef.current?.focus();
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Set the selected file
    setSelectedFile(file);

    // Create a preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    // Reset the input value to allow selecting the same file again
    e.target.value = "";
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
  };

  // Handle click outside to close emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSend = () => {
    if ((!message.trim() && !selectedFile) || !chat || !user) return;

    // Create a message content string that includes file info if present
    let messageContent = message;
    if (selectedFile) {
      const fileInfo = {
        type: "file",
        name: selectedFile.name,
        size: selectedFile.size,
        mimeType: selectedFile.type,
        url: filePreview || "",
      };
      messageContent = message
        ? `${message} [FILE:${JSON.stringify(fileInfo)}]`
        : `[FILE:${JSON.stringify(fileInfo)}]`;
    }

    // Send the message using the context's sendMessage function
    sendMessage(messageContent);

    // Clear the input field and reset file
    setMessage("");
    setSelectedFile(null);
    setFilePreview(null);

    // Close emoji picker if open
    setShowEmojiPicker(false);
  };

  // Get user's profile picture or return null if not available
  const getUserLogo = (user: any): string | null => {
    // Check for different possible properties where the logo/avatar might be stored
    if (user?.logoUrl) return user.logoUrl;
    if (user?.avatar) return user.avatar;
    if (user?.profilePicture) return user.profilePicture;
    return null;
  };

  // Get user's initials from their name
  const getUserInitials = (user: any): string => {
    if (!user?.name) return "U";

    const names = user.name.split(" ");
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
      initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
  };

  // Render avatar (logo or initials)
  const renderAvatar = (sender: any, isCurrentUser: boolean = false) => {
    if (!sender) return null;

    const logo = getUserLogo(sender);
    const avatarSize = isCurrentUser ? 32 : 40; // Larger avatar for received messages

    if (logo) {
      return (
        <div className={`relative ${isCurrentUser ? "ml-2" : "mr-2"}`}>
          <img
            src={logo}
            alt={sender.name || "User"}
            className="rounded-full object-cover border-2 border-white shadow-sm"
            style={{
              width: avatarSize,
              height: avatarSize,
              minWidth: avatarSize,
              minHeight: avatarSize,
            }}
            onError={(e) => {
              // Fallback to initials if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              // The parent will render the initials fallback
            }}
          />
          {!isCurrentUser && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
      );
    }

    // Fallback to initials if no logo
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 font-medium ${
          isCurrentUser ? "ml-2" : "mr-2"
        }`}
        style={{
          width: avatarSize,
          height: avatarSize,
          minWidth: avatarSize,
          minHeight: avatarSize,
          fontSize: avatarSize * 0.4,
        }}
      >
        {getUserInitials(sender)}
      </div>
    );
  };

  // Render welcome screen when no chat is selected
  const renderWelcomeScreen = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6 text-center">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            ></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Welcome to Messages
        </h2>
        <p className="text-gray-500 max-w-md">
          Select a conversation or start a new chat to begin messaging.
        </p>
      </div>
    );
  };

  // Render top bar with user info and actions
  const renderTopBar = () => {
    if (!chat) return null;

    // Get other participants (not current user)
    const others = chat.participants.filter(
      (p) => String(p.id) !== String(user?.id)
    );
    const otherUser = others[0]; // Assuming 1:1 chat for now

    return (
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white">
        <div className="flex items-center space-x-3 rtl:space-x-reverse">
          {renderAvatar(otherUser, false)}
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {otherUser?.name || "User"}
            </h3>
            <p className="text-xs text-green-500 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
              Active now
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <button className="text-gray-500 hover:text-gray-700">
            <Search className="w-5 h-5" />
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  // Memoize the messages to prevent unnecessary re-renders
  const memoizedMessages = React.useMemo(() => {
    if (!chat) return [];
    // Use a Set to ensure unique messages by ID
    const uniqueMessages = Array.from(
      new Map(chat.messages.map((msg) => [msg.id, msg])).values()
    );
    return uniqueMessages;
  }, [chat?.messages]);

  // Render message list
  const renderMessages = () => {
    if (!chat) return null;

    return (
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto w-full space-y-3">
          <AnimatePresence initial={false}>
            {memoizedMessages.map((msg) => {
              const isCurrentUser = String(msg.sender.id) === String(user?.id);
              const isArabic = /[\u0600-\u06FF]/.test(msg.content);

              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-[85%] ${
                      isCurrentUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    {!isCurrentUser && (
                      <div className="flex-shrink-0 self-end mb-1">
                        {renderAvatar(msg.sender, isCurrentUser)}
                      </div>
                    )}

                    <div
                      className={`mx-2 ${
                        isCurrentUser ? "text-right" : "text-left"
                      }`}
                    >
                      {!isCurrentUser && (
                        <div className="text-xs font-medium text-gray-500 mb-1 px-2">
                          {msg.sender.name}
                        </div>
                      )}

                      <div
                        className={`inline-block px-4 py-2 rounded-2xl ${
                          isCurrentUser
                            ? "bg-blue-500 text-white rounded-br-sm"
                            : "bg-gray-100 text-gray-800 rounded-bl-sm"
                        }`}
                        dir={isArabic ? "rtl" : "ltr"}
                      >
                        <div className="text-sm">{msg.content}</div>
                        <div
                          className={`text-xs mt-1 opacity-70 flex items-center ${
                            isCurrentUser ? "justify-end" : "justify-start"
                          }`}
                        >
                          <span className="text-[10px]">
                            {new Date(msg.timestamp).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          {isCurrentUser && (
                            <span className="ml-1 inline-block">
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 15"
                                fill="none"
                                className="text-white"
                              >
                                <path
                                  d="M10.5 5.5L13 8L10.5 10.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <path
                                  d="M7 5.5L9.5 8L7 10.5"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {isCurrentUser && (
                      <div className="flex-shrink-0 self-end mb-1">
                        {renderAvatar(msg.sender, isCurrentUser)}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      </div>
    );
  };

  // Render message input
  const renderInput = () => {
    if (!chat) return null;

    return (
      <div className="border-t border-gray-100 bg-white relative">
        {/* File preview */}
        {selectedFile && (
          <div className="relative p-3 border-b border-gray-100">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="flex items-center space-x-3 rtl:space-x-reverse">
                {filePreview ? (
                  <div className="w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-blue-500">
                    <File className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB •{" "}
                    {selectedFile.type.split("/")[1]?.toUpperCase() || "FILE"}
                  </p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="text-gray-400 hover:text-red-500 p-1"
                aria-label="Remove file"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Emoji picker container - positioned absolutely within the chat area */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed z-[9999] shadow-2xl rounded-xl overflow-hidden border border-gray-200 bg-white"
              style={{
                bottom: "80px",
                right: "20px",
                width: "320px",
                height: "400px",
                maxHeight: "calc(100vh - 100px)",
              }}
              ref={emojiPickerRef}
            >
              <div className="w-full h-10 bg-gray-50 border-b border-gray-100 flex items-center justify-between px-4">
                <span className="text-sm font-medium text-gray-700">Emoji</span>
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="text-gray-400 hover:text-gray-600"
                  aria-label="Close emoji picker"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="w-full h-[400px] overflow-y-auto">
                <Picker
                  onEmojiClick={onEmojiClick}
                  theme="light"
                  searchPlaceHolder="Search emojis..."
                  previewConfig={{
                    defaultEmoji: "1f60a",
                    defaultCaption: "How are you feeling?",
                    showPreview: false,
                  }}
                  height={400}
                  width={320}
                  native={false}
                  disableSearchBar={false}
                  disableSkinTonePicker={true}
                  groupVisibility={{
                    flags: false,
                    search: true,
                  }}
                  lazyLoadEmojis={false}
                  previewPosition="none"
                  skinTonesDisabled
                  searchPlaceholder="Search emojis..."
                  groupNames={{
                    smileys_people: "Smileys",
                    animals_nature: "Animals & Nature",
                    food_drink: "Food & Drink",
                    travel_places: "Travel",
                    activities: "Activities",
                    objects: "Objects",
                    symbols: "Symbols",
                    flags: "Flags",
                    recently_used: "Recent",
                  }}
                  pickerStyle={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    boxShadow: "none",
                  }}
                  emojiStyle={
                    {
                      width: 24,
                      height: 24,
                      margin: "6px",
                      fontSize: "24px",
                    } as any
                  }
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Message input */}
        <div className="p-3">
          <div className="flex items-center bg-gray-50 rounded-xl px-4 py-2">
            <div className="flex items-center space-x-1 rtl:space-x-reverse">
              <button
                type="button"
                className="text-gray-400 hover:text-blue-500 p-1.5 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Paperclip className="w-5 h-5" />
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                />
              </button>
              <button
                type="button"
                className={`p-1.5 rounded-full transition-colors ${
                  showEmojiPicker
                    ? "text-blue-500 bg-blue-50"
                    : "text-gray-400 hover:text-blue-500 hover:bg-gray-100"
                }`}
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile className="w-5 h-5" />
              </button>
            </div>

            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="اكتب رسالة..."
              className="flex-1 bg-transparent border-0 focus:ring-0 text-sm text-gray-700 placeholder-gray-400 px-3 py-1.5 rtl:text-right"
              dir="auto"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={!message.trim() && !selectedFile}
              className={`p-1.5 rounded-full transition-colors ${
                message.trim() || selectedFile
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "text-gray-300"
              }`}
              aria-label="إرسال"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render welcome screen when no chat is selected
  if (!chat) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-50 p-6 text-center">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-12 h-12 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            ></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          Welcome to Messages
        </h2>
        <p className="text-gray-500 max-w-md">
          Select a conversation or start a new chat to begin messaging.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {renderTopBar()}
      <div className="flex-1 p-4 overflow-y-auto">
        {renderMessages()}
        <div ref={messagesEndRef} />
      </div>
      {renderInput()}
    </div>
  );
};

export default ChatMainArea;
