import React from "react";
import Image from "next/image";
import { dashboardIcons } from "@/components/general/icons";

const ChatSidebar = () => {
  return (
    <aside className="w-64 h-full bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Chats</h2>
        <button className="text-primary hover:text-primary-dark">
          <dashboardIcons.plus />
        </button>
      </div>
      <ul className="space-y-2">
        {/* Example chats */}
        <li className="p-2 bg-white rounded-md shadow-sm">
          <Image src="/assets/logos/center-logo.png" alt="Center Logo" width={40} height={40} className="inline-block" />
          <span className="ml-2">Center Name</span>
        </li>
        <li className="p-2 bg-white rounded-md shadow-sm">
          <Image src="/assets/logos/parent-avatar.png" alt="Parent Avatar" width={40} height={40} className="inline-block" />
          <span className="ml-2">Parent ABC</span>
        </li>
      </ul>
    </aside>
  );
};

export default ChatSidebar;
