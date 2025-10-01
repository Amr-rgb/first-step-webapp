"use client";

import React, { useState, useEffect } from "react";
import { dashboardIcons } from "@/components/general/icons";
import { User } from "./types";
import { chatService } from "@/services/chatService";
import { useAuthStore } from "@/store/authStore";
import { toastSuccess, toastError } from "@/lib/toast";

interface Contact {
  id: string;
  name: string;
  type: "center" | "parent";
  avatar?: string;
  isOnline?: boolean;
  email?: string;
  phone?: string;
  children?: Array<{
    id: number;
    child_name: string;
    parent_name: string;
    mother_name: string;
  }>;
}

interface NewChatModalProps {
  currentUser: User;
  onClose: () => void;
  onStartChat: (participantId: string) => void;
}

const NewChatModal: React.FC<NewChatModalProps> = ({
  currentUser,
  onClose,
  onStartChat,
}) => {
  const { token } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!token) return;

      try {
        setIsLoading(true);

        if (currentUser.type === "center") {
          // Fetch parents for center
          const parents = await chatService.getCenterParents(token);
          const parentContacts: Contact[] = parents.map((parent) => ({
            id: parent.id.toString(),
            name: parent.name,
            type: "parent" as const,
            isOnline: parent.is_online === 1,
            email: parent.email,
            phone: parent.phone,
            children: parent.children,
          }));
          setContacts(parentContacts);
        } else if (currentUser.type === "parent") {
          // Fetch centers for parent
          const centers = await chatService.getCentersForParent(token);
          const centerContacts: Contact[] = centers.map((center) => ({
            id: center.id.toString(),
            name: center.name,
            type: "center" as const,
            isOnline: center.is_online === 1,
            email: center.email,
            phone: center.phone,
          }));
          setContacts(centerContacts);
        }
      } catch (error) {
        console.error("Error fetching contacts:", error);
        toastError("Failed to load contacts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [currentUser.type, token]);

  useEffect(() => {
    const filtered = contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  const getContactAvatar = (contact: Contact) => {
    if (contact.type === "center") {
      if (contact.avatar) {
        return (
          <img
            src={contact.avatar}
            alt={contact.name}
            className="w-12 h-12 rounded-full object-cover shadow-md"
          />
        );
      }
      return (
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-lg">
          C
        </div>
      );
    }

    // Parent type - first two letters of name
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-600 text-white flex items-center justify-center text-sm font-bold shadow-lg">
        {contact.name.substring(0, 2).toUpperCase()}
      </div>
    );
  };

  const handleStartChat = (contact: Contact) => {
    onStartChat(contact.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">
              Start New Conversation
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <dashboardIcons.search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search ${
                currentUser.type === "center" ? "parents" : "centers"
              }...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200"
              autoFocus
            />
          </div>
        </div>

        {/* Contact List */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-gray-500">Loading contacts...</p>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="text-center py-8">
              <dashboardIcons.chat className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                {searchTerm ? "No contacts found" : "No contacts available"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  onClick={() => handleStartChat(contact)}
                  className="flex items-center p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm"
                >
                  {/* Avatar with online indicator */}
                  <div className="relative">
                    {getContactAvatar(contact)}
                    {contact.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {contact.name}
                    </h3>
                    <p className="text-xs text-gray-500 capitalize">
                      {contact.type}
                      {contact.isOnline && (
                        <span className="ml-2 text-green-500 font-medium">
                          • Online
                        </span>
                      )}
                    </p>
                    {contact.children && contact.children.length > 0 && (
                      <p className="text-xs text-blue-600 mt-1">
                        Children:{" "}
                        {contact.children
                          .map((child) => child.child_name)
                          .join(", ")}
                      </p>
                    )}
                  </div>

                  {/* Start chat button */}
                  <div className="ml-3">
                    <div className="p-2 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors duration-200">
                      <dashboardIcons.chat className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-xl">
          <p className="text-xs text-gray-600 text-center">
            {currentUser.type === "center"
              ? "Select a parent to start a conversation"
              : "Select a center to start a conversation"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
