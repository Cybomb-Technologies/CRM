import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  Send,
  Image,
  Trash2,
  Edit,
} from "lucide-react";

export function SocialEngagement({ onSchedulePost }) {
  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: 1,
      content:
        "Excited to announce our new integration features! Making sales automation even more powerful. #CRM #SalesTech",
      platforms: ["twitter", "linkedin"],
      scheduledFor: "2024-01-20T10:00:00",
      status: "scheduled",
    },
    {
      id: 2,
      content:
        "Customer success story: How TechCorp increased sales by 45% using our platform. Read the full case study on our blog!",
      platforms: ["twitter", "facebook", "linkedin"],
      scheduledFor: "2024-01-21T14:30:00",
      status: "scheduled",
    },
  ]);

  const [newPost, setNewPost] = useState({
    content: "",
    platforms: [],
    scheduledFor: "",
    scheduledTime: "",
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
    setNewPost((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platformId)
        ? prev.platforms.filter((p) => p !== platformId)
        : [...prev.platforms, platformId],
    }));
  };

  const handleSchedulePost = () => {
    if (
      newPost.content &&
      newPost.platforms.length > 0 &&
      newPost.scheduledFor &&
      newPost.scheduledTime
    ) {
      const scheduledPost = {
        id: Date.now(),
        content: newPost.content,
        platforms: newPost.platforms,
        scheduledFor: `${newPost.scheduledFor}T${newPost.scheduledTime}`,
        status: "scheduled",
      };

      setScheduledPosts([...scheduledPosts, scheduledPost]);

      // Call parent function to handle the post scheduling
      if (onSchedulePost) {
        onSchedulePost(scheduledPost);
      }

      // Reset form
      setNewPost({
        content: "",
        platforms: [],
        scheduledFor: "",
        scheduledTime: "",
      });
    }
  };

  const handleDeletePost = (postId) => {
    setScheduledPosts(scheduledPosts.filter((post) => post.id !== postId));
  };

  const handlePostNow = (postId) => {
    const post = scheduledPosts.find((p) => p.id === postId);
    if (post && onSchedulePost) {
      onSchedulePost({
        ...post,
        scheduledFor: new Date().toISOString(),
      });
    }
    handleDeletePost(postId);
  };

  const getPlatformIcon = (platformId) => {
    const platform = platforms.find((p) => p.id === platformId);
    return platform ? (
      <platform.icon className={`w-4 h-4 ${platform.color}`} />
    ) : null;
  };

  const formatScheduledDate = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Schedule New Post */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule New Post
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Platforms Selection */}
          <div>
            <Label>Select Platforms *</Label>
            <div className="flex gap-2 mt-2 flex-wrap">
              {platforms.map((platform) => (
                <Button
                  key={platform.id}
                  type="button"
                  variant={
                    newPost.platforms.includes(platform.id)
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
            {newPost.platforms.length === 0 && (
              <p className="text-sm text-red-500 mt-1">
                Select at least one platform
              </p>
            )}
          </div>

          {/* Post Content */}
          <div>
            <Label htmlFor="content">Post Content *</Label>
            <Textarea
              id="content"
              placeholder="What would you like to share with your audience?"
              className="min-h-[120px] mt-2 resize-none"
              value={newPost.content}
              onChange={(e) =>
                setNewPost((prev) => ({ ...prev, content: e.target.value }))
              }
            />
            <div className="flex justify-between items-center mt-1">
              <span
                className={`text-sm ${
                  newPost.content.length > 280
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {newPost.content.length}/280 characters
                {newPost.content.length > 280 && " - Too long!"}
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
              <Label htmlFor="scheduledDate">Schedule Date *</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={newPost.scheduledFor}
                onChange={(e) =>
                  setNewPost((prev) => ({
                    ...prev,
                    scheduledFor: e.target.value,
                  }))
                }
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <Label htmlFor="scheduledTime">Schedule Time *</Label>
              <Input
                id="scheduledTime"
                type="time"
                value={newPost.scheduledTime}
                onChange={(e) =>
                  setNewPost((prev) => ({
                    ...prev,
                    scheduledTime: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Post Preview */}
          {newPost.content && (
            <div className="p-3 border rounded-lg bg-gray-50">
              <h4 className="font-semibold mb-2 text-sm">Preview</h4>
              <div className="flex items-center gap-2 mb-2">
                {newPost.platforms.map((platform) => getPlatformIcon(platform))}
              </div>
              <p className="text-sm whitespace-pre-wrap bg-white p-2 rounded border">
                {newPost.content}
              </p>
              {newPost.scheduledFor && newPost.scheduledTime && (
                <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>
                    Scheduled for{" "}
                    {new Date(newPost.scheduledFor).toLocaleDateString()} at{" "}
                    {newPost.scheduledTime}
                  </span>
                </div>
              )}
            </div>
          )}

          <Button
            className="w-full"
            onClick={handleSchedulePost}
            disabled={
              !newPost.content ||
              newPost.platforms.length === 0 ||
              !newPost.scheduledFor ||
              !newPost.scheduledTime ||
              newPost.content.length > 280
            }
          >
            <Calendar className="w-4 h-4 mr-2" />
            Schedule Post
          </Button>
        </CardContent>
      </Card>

      {/* Scheduled Posts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Scheduled Posts ({scheduledPosts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scheduledPosts.map((post) => {
              const { date, time } = formatScheduledDate(post.scheduledFor);

              return (
                <div
                  key={post.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      {post.platforms.map((platform) =>
                        getPlatformIcon(platform)
                      )}
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-blue-50 text-blue-700"
                    >
                      {post.status}
                    </Badge>
                  </div>

                  <p className="text-gray-700 mb-3 text-sm whitespace-pre-wrap">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {time}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handlePostNow(post.id)}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Post Now
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}

            {scheduledPosts.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-4" />
                <p>No scheduled posts</p>
                <p className="text-sm">
                  Schedule your first post to get started
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
