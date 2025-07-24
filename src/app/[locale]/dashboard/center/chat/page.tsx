import { ChatProvider } from "@/components/chat/ChatProvider";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMainArea from "@/components/chat/ChatMainArea";

export default function CenterChatPage() {
  return (
    <ChatProvider>
      <div
        style={{
          display: "flex",
          height: "70vh",
          background: "#f9f9fb",
          borderRadius: 16,
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          margin: "24px 0",
        }}
      >
        <ChatSidebar />
        <div style={{ 
          flex: 1, 
          minWidth: 0, 
          display: 'flex', 
          flexDirection: 'column',
          backgroundColor: '#fff',
          borderRadius: '0 16px 16px 0'
        }}>
          <ChatMainArea />
        </div>
      </div>
    </ChatProvider>
  );
}
