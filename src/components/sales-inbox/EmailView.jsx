import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Reply,
  ReplyAll,
  Forward,
  Archive,
  Trash2,
  MoreVertical,
  User,
  Building2,
  Target,
  Calendar,
  Phone,
  Star,
} from "lucide-react";

export function EmailView({ email, onBack, onEmailAction }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getRelatedBadge = (relatedTo) => {
    if (!relatedTo) return null;

    const colors = {
      lead: "bg-green-100 text-green-800",
      deal: "bg-blue-100 text-blue-800",
      account: "bg-purple-100 text-purple-800",
    };

    const icons = {
      lead: User,
      deal: Target,
      account: Building2,
    };

    const Icon = icons[relatedTo.type];

    return (
      <Badge variant="secondary" className={colors[relatedTo.type]}>
        <Icon className="w-3 h-3 mr-1" />
        {relatedTo.name}
      </Badge>
    );
  };

  const handleStarClick = () => {
    onEmailAction(email.id, "markImportant");
  };

  return (
    <div className="h-full flex flex-col">
      {/* Email Header */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack}>
            ← Back
          </Button>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleStarClick}>
              <Star
                className={`w-4 h-4 ${
                  email.important
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-400"
                }`}
              />
            </Button>
            <Button variant="ghost" size="sm">
              <Reply className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <ReplyAll className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Forward className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Archive className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <h1 className="text-xl font-semibold mb-2">{email.subject}</h1>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {(email.fromName || email.from).charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-semibold">
                {email.fromName || email.from}
              </div>
              <div className="text-sm text-gray-500">to me</div>
            </div>
          </div>

          <div className="text-sm text-gray-500">{formatDate(email.date)}</div>
        </div>

        {email.relatedTo && (
          <div className="mt-3 flex items-center space-x-2">
            <span className="text-sm text-gray-600">Related to:</span>
            {getRelatedBadge(email.relatedTo)}
          </div>
        )}
      </div>

      {/* Email Body */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="prose max-w-none whitespace-pre-wrap">{email.body}</div>
      </div>

      {/* Action Footer */}
      <div className="border-t p-4 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button>
              <Reply className="w-4 h-4 mr-2" />
              Reply
            </Button>
            <Button variant="outline">
              <ReplyAll className="w-4 h-4 mr-2" />
              Reply All
            </Button>
            <Button variant="outline">
              <Forward className="w-4 h-4 mr-2" />
              Forward
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {email.relatedTo?.type === "lead" && (
              <Button variant="outline">
                <Phone className="w-4 h-4 mr-2" />
                Call Lead
              </Button>
            )}
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Meeting
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
