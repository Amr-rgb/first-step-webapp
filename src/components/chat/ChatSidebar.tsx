"use client"
import React from "react";
import { useChat } from "./ChatProvider";
import { useAuthUser } from "../../store/authStore"; // Adjust path if needed
import { motion } from "../motion-components";

// -----------------------------
// ChatSidebar Component
// -----------------------------
const ChatSidebar: React.FC = () => {
  // Get current user role from store
  const role = useAuthUser()?.role;
  const { chats, selectChat, selectedChatId, currentUser } = useChat();

  // Sidebar animation variants
  const sidebarVariants = {
    hidden: { x: 300, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  // Render sidebar content based on role
  let content: React.ReactNode = null;

  if (role === "parent") {
    // For parent: show enrolled centers (mocked as chat participants except self)
    const enrolledCenters = chats
      .flatMap((chat) => chat.participants)
      .filter((p) => p.role === "center");
    content = (
      <div>
        <h3>المراكز المسجلة</h3>
        <ul>
          {enrolledCenters.map((center) => (
            <li key={center.id}>{center.name}</li>
          ))}
        </ul>
      </div>
    );
  } else if (role === "center") {
    // For center: show chat history and add chat button
    content = (
      <div>
        <h3>سجل الدردشات</h3>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              style={{
                fontWeight: chat.id === selectedChatId ? "bold" : "normal",
                cursor: "pointer",
              }}
              onClick={() => selectChat(chat.id)}
            >
              {chat.participants
                .filter((p) => p.role === "parent")
                .map((p) => p.name)
                .join(", ")}
            </li>
          ))}
        </ul>
        <button style={{ marginTop: 16 }}>+ دردشة جديدة</button>
        {/* TODO: Add popup for searching parents */}
      </div>
    );
  } else if (role === "admin") {
    // For admin: show all chats
    content = (
      <div>
        <h3>كل الدردشات</h3>
        <ul>
          {chats.map((chat) => (
            <li
              key={chat.id}
              style={{
                fontWeight: chat.id === selectedChatId ? "bold" : "normal",
                cursor: "pointer",
              }}
              onClick={() => selectChat(chat.id)}
            >
              {chat.participants.map((p) => p.name).join(" - ")}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <motion.aside
      initial="hidden"
      animate="visible"
      variants={sidebarVariants}
      style={{
        width: 300,
        background: "#fff",
        borderLeft: "1px solid #eee",
        padding: 16,
      }}
    >
      {content}
    </motion.aside>
  );
};

export default ChatSidebar;
