import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Calendar,
  Clock,
  Image,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Send,
} from "lucide-react";

export function ComposeSocialPost({ onClose, onSchedule }) {
  const [formData, setFormData] = useState({
    content: "",
    platforms: [],
    scheduledDate: "",
    scheduledTime: "",
    postType: "organic",
  });

  const platforms = [
    { id: "twitter", name: "Twitter", icon: Twitter, color: "text-blue-400" },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "text-blue-600",
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "text-blue-700",
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "text-pink-500",
    },
  ];

  const handlePlatformToggle = (platformId) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter((p) => p !== platformId)
        : [...prev.platforms, platformId],
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSchedule = () => {
    if (formData.content && formData.platforms.length > 0) {
      onSchedule(formData);
    }
  };

  const getPlatformIcon = (platformId) => {
    const platform = platforms.find((p) => p.id === platformId);
    return platform ? (
      <platform.icon className={`w-4 h-4 ${platform.color}`} />
    ) : null;
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule Social Post
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* Platforms Selection */}
          <div>
            <Label>Select Platforms</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {platforms.map((platform) => (
                <Button
                  key={platform.id}
                  type="button"
                  variant={
                    formData.platforms.includes(platform.id)
                      ? "default"
                      : "outline"
                  }
                  className="flex items-center gap-2"
                  onClick={() => handlePlatformToggle(platform.id)}
                >
                  <platform.icon className="w-4 h-4" />
                  {platform.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Post Type */}
          <div>
            <Label htmlFor="postType">Post Type</Label>
            <Select
              value={formData.postType}
              onValueChange={(value) => handleInputChange("postType", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="organic">Organic Post</SelectItem>
                <SelectItem value="promoted">Promoted Post</SelectItem>
                <SelectItem value="announcement">Announcement</SelectItem>
                <SelectItem value="engagement">Engagement Post</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Post Content */}
          <div>
            <Label htmlFor="content">Post Content *</Label>
            <Textarea
              id="content"
              placeholder="What would you like to share with your audience?"
              className="min-h-[150px] mt-2 resize-none"
              value={formData.content}
              onChange={(e) => handleInputChange("content", e.target.value)}
            />
            <div className="flex justify-between items-center mt-1">
              <span className="text-sm text-gray-500">
                {formData.content.length}/280 characters
              </span>
              <Button variant="ghost" size="sm">
                <Image className="w-4 h-4 mr-1" />
                Add Media
              </Button>
            </div>
          </div>

          {/* Scheduling */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="scheduledDate">Schedule Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={formData.scheduledDate}
                onChange={(e) =>
                  handleInputChange("scheduledDate", e.target.value)
                }
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label htmlFor="scheduledTime">Schedule Time</Label>
              <Input
                id="scheduledTime"
                type="time"
                value={formData.scheduledTime}
                onChange={(e) =>
                  handleInputChange("scheduledTime", e.target.value)
                }
              />
            </div>
          </div>

          {/* Post Preview */}
          {formData.content && (
            <div className="p-4 border rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-3">Post Preview</h4>
              <div className="flex items-center gap-2 mb-3">
                {formData.platforms.map((platform) =>
                  getPlatformIcon(platform)
                )}
              </div>
              <div className="bg-white p-3 rounded border">
                <p className="text-sm whitespace-pre-wrap">
                  {formData.content}
                </p>
                {formData.scheduledDate && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>
                      Scheduled for{" "}
                      {new Date(formData.scheduledDate).toLocaleDateString()} at{" "}
                      {formData.scheduledTime}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSchedule}
              disabled={!formData.content || formData.platforms.length === 0}
              className="flex-1"
            >
              <Send className="w-4 h-4 mr-2" />
              Schedule Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
