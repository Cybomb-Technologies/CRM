import React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Star,
  Paperclip,
  User,
  Building2,
  Target,
  Mail,
} from "lucide-react";

export function EmailList({
  activeFolder,
  onEmailSelect,
  selectedEmail,
  emails,
  onEmailAction,
}) {
  // Filtering is mainly done by parent/backend, but we keep some client-side filtering support if needed
  // especially for smart views if backend didn't filter them perfectly.
  
  // Note: emails passed here should already be largely filtered by the parent's API call.
  // We'll rely on the parent props `emails`.
  
  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelatedIcon = (type) => {
    switch (type) {
      case "lead":
        return <User className="w-3 h-3 text-green-600" />;
      case "deal":
        return <Target className="w-3 h-3 text-blue-600" />;
      case "account":
        return <Building2 className="w-3 h-3 text-purple-600" />;
      default:
        return null;
    }
  };

  const handleStarClick = (emailId, e) => {
    e.stopPropagation();
    onEmailAction(emailId, "markImportant");
  };

  return (
    <div className="h-full flex flex-col">
      {/* List Header */}
      <div className="flex items-center p-4 border-b bg-gray-50">
        <Checkbox />
        <div className="flex-1"></div>
        <Button variant="ghost" size="sm">
          Mark as
        </Button>
        <Button variant="ghost" size="sm">
          Move to
        </Button>
      </div>

      {/* Email Items */}
      <div className="flex-1 overflow-y-auto">
        {emails.map((email) => (
          <div
            key={email._id || email.id}
            className={`border-b hover:bg-gray-50 cursor-pointer transition-colors ${
              (selectedEmail?._id === email._id || selectedEmail?.id === email.id) ? "bg-blue-50 border-blue-200" : ""
            } ${!email.read ? "bg-white font-semibold" : "bg-gray-50"}`}
            onClick={() => {
              onEmailSelect(email);
              if (!email.read) {
                onEmailAction(email._id || email.id, "markRead");
              }
            }}
          >
            <div className="flex items-center p-4">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <Checkbox />
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6"
                  onClick={(e) => handleStarClick(email._id || email.id, e)}
                >
                  <Star
                    className={`w-4 h-4 ${
                      email.important
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </Button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <span
                      className={`${
                        !email.read ? "font-semibold" : ""
                      } truncate`}
                    >
                      {email.from?.name || email.from?.email || email.from || "Unknown"}
                    </span>
                    {email.relatedTo && getRelatedIcon(email.relatedTo.type)}
                  </div>

                  <div className="flex items-center space-x-2 text-sm">
                    <span
                      className={`${
                        !email.read ? "font-semibold" : "font-normal"
                      } text-gray-900 truncate flex-1`}
                    >
                      {email.subject}
                    </span>
                    {email.hasAttachment && (
                      <Paperclip className="w-3 h-3 text-gray-400 flex-shrink-0" />
                    )}
                  </div>

                  <p className="text-sm text-gray-500 truncate mt-1">
                    {email.snippet || email.preview}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 ml-4 flex-shrink-0">
                <span className="text-sm text-gray-500 whitespace-nowrap">
                  {formatTime(email.date)}
                </span>
              </div>
            </div>
          </div>
        ))}

        {emails.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Mail className="w-12 h-12 mb-4" />
            <p>No emails found</p>
            <p className="text-sm">Connect your email account to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
