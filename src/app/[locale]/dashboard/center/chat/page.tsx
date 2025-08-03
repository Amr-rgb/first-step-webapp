import { ChatProvider } from "@/components/chat/ChatProvider";
import ChatSidebar from "@/components/chat/ChatSidebar";
import ChatMainArea from "@/components/chat/ChatMainArea";

export default function CenterChatPage() {
  return (
    <ChatProvider>
      <div className="h-[calc(100vh-120px)] flex flex-col">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 border-r border-gray-100 flex-shrink-0">
              <ChatSidebar />
            </div>
            
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
              <ChatMainArea />
            </div>
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}
