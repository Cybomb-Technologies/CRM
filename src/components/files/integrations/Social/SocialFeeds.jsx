import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  MessageCircle,
  Heart,
  Share2,
  Users,
  Filter,
  Search,
} from "lucide-react";

export function SocialFeeds({ onConvertToLead, onSchedulePost }) {
  const [activePlatform, setActivePlatform] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const platforms = [
    { id: "all", name: "All Platforms", icon: MessageCircle },
    { id: "twitter", name: "Twitter", icon: Twitter },
    { id: "facebook", name: "Facebook", icon: Facebook },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin },
    { id: "instagram", name: "Instagram", icon: Instagram },
  ];

  const socialPosts = [
    {
      id: 1,
      platform: "twitter",
      username: "@tech_enthusiast",
      handle: "tech_enthusiast",
      content:
        "Just started using @CloudCRM and I'm impressed with the automation features! Any tips for maximizing productivity? #CRM #SalesAutomation",
      timestamp: "1 hour ago",
      engagement: { likes: 42, retweets: 18, replies: 9 },
      sentiment: "positive",
      potentialLead: true,
      profileImage: "TE",
    },
    {
      id: 2,
      platform: "linkedin",
      username: "Michael Chen",
      handle: "michael-chen",
      content:
        "Our sales team is evaluating CRM solutions. Looking for something with good social integration and lead tracking capabilities. Any recommendations?",
      timestamp: "3 hours ago",
      engagement: { likes: 27, comments: 14 },
      sentiment: "neutral",
      potentialLead: true,
      profileImage: "MC",
    },
    {
      id: 3,
      platform: "twitter",
      username: "@startup_founder",
      handle: "startup_founder",
      content:
        "The customer support from @CloudCRM team has been exceptional! Quick responses and actually helpful solutions. 👏",
      timestamp: "5 hours ago",
      engagement: { likes: 56, retweets: 23, replies: 12 },
      sentiment: "positive",
      potentialLead: false,
      profileImage: "SF",
    },
    {
      id: 4,
      platform: "facebook",
      username: "Digital Marketing Pro",
      handle: "digitalmarketingpro",
      content:
        "Comparing different CRM platforms for our agency. CloudCRM seems to have the best social media integration features. Anyone using it for client management?",
      timestamp: "7 hours ago",
      engagement: { likes: 34, comments: 8, shares: 3 },
      sentiment: "neutral",
      potentialLead: true,
      profileImage: "DM",
    },
  ];

  const filteredPosts = socialPosts.filter((post) => {
    if (activePlatform !== "all" && post.platform !== activePlatform)
      return false;
    if (
      searchQuery &&
      !post.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="w-4 h-4 text-blue-400" />;
      case "facebook":
        return <Facebook className="w-4 h-4 text-blue-600" />;
      case "linkedin":
        return <Linkedin className="w-4 h-4 text-blue-700" />;
      case "instagram":
        return <Instagram className="w-4 h-4 text-pink-500" />;
      default:
        return <MessageCircle className="w-4 h-4" />;
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800";
      case "negative":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search mentions, keywords..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Platform Tabs */}
          <Tabs
            value={activePlatform}
            onValueChange={setActivePlatform}
            className="mt-4"
          >
            <TabsList className="grid grid-cols-5">
              {platforms.map((platform) => {
                const Icon = platform.icon;
                return (
                  <TabsTrigger
                    key={platform.id}
                    value={platform.id}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{platform.name}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Social Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {/* Profile Image */}
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {post.profileImage}
                </div>

                {/* Post Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold">{post.username}</span>
                    <span className="text-gray-500 text-sm">
                      @{post.handle}
                    </span>
                    {getPlatformIcon(post.platform)}
                    <span className="text-gray-400 text-sm">
                      {post.timestamp}
                    </span>
                    <Badge
                      variant="outline"
                      className={getSentimentColor(post.sentiment)}
                    >
                      {post.sentiment}
                    </Badge>
                  </div>

                  <p className="text-gray-800 mb-3">{post.content}</p>

                  {/* Engagement Metrics */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-gray-500">
                      {post.engagement.likes && (
                        <div className="flex items-center gap-1">
                          <Heart className="w-4 h-4" />
                          <span>{post.engagement.likes}</span>
                        </div>
                      )}
                      {post.engagement.retweets && (
                        <div className="flex items-center gap-1">
                          <Share2 className="w-4 h-4" />
                          <span>{post.engagement.retweets}</span>
                        </div>
                      )}
                      {post.engagement.replies && (
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.engagement.replies}</span>
                        </div>
                      )}
                      {post.engagement.comments && (
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.engagement.comments}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        Reply
                      </Button>
                      {post.potentialLead && (
                        <Button size="sm" onClick={() => onConvertToLead(post)}>
                          <Users className="w-4 h-4 mr-1" />
                          Convert to Lead
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPosts.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No posts found
              </h3>
              <p className="text-gray-500">
                {searchQuery
                  ? "No posts match your search criteria"
                  : "No posts available for the selected platform"}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
