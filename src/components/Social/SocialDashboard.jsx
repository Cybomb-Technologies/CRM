import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp,
  Users,
  MessageCircle,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export function SocialDashboard({ stats, onConvertToLead }) {
  const platformData = [
    {
      name: "Twitter",
      mentions: 124,
      engagement: 72,
      growth: 12,
      icon: Twitter,
      color: "text-blue-400",
    },
    {
      name: "Facebook",
      mentions: 68,
      engagement: 58,
      growth: 8,
      icon: Facebook,
      color: "text-blue-600",
    },
    {
      name: "LinkedIn",
      mentions: 32,
      engagement: 45,
      growth: 15,
      icon: Linkedin,
      color: "text-blue-700",
    },
    {
      name: "Instagram",
      mentions: 23,
      engagement: 78,
      growth: 22,
      icon: Instagram,
      color: "text-pink-500",
    },
  ];

  const recentMentions = [
    {
      id: 1,
      platform: "Twitter",
      username: "@john_tech",
      content:
        "Loving the new features in @CloudCRM! The sales automation is a game-changer for our team.",
      timestamp: "2 hours ago",
      engagement: { likes: 24, retweets: 12, replies: 8 },
      sentiment: "positive",
      potentialLead: true,
    },
    {
      id: 2,
      platform: "LinkedIn",
      username: "Sarah Johnson",
      content:
        "Looking for a robust CRM solution for our sales team. Any recommendations? #CRM #SalesTech",
      timestamp: "4 hours ago",
      engagement: { likes: 18, comments: 7 },
      sentiment: "neutral",
      potentialLead: true,
    },
    {
      id: 3,
      platform: "Twitter",
      username: "@startup_mike",
      content:
        "Having some issues with @CloudCRM integration. Support team was helpful though!",
      timestamp: "6 hours ago",
      engagement: { likes: 8, retweets: 2, replies: 3 },
      sentiment: "neutral",
      potentialLead: false,
    },
  ];

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
      {/* Platform Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Platform Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {platformData.map((platform) => (
              <div
                key={platform.name}
                className="text-center p-4 border rounded-lg"
              >
                <platform.icon
                  className={`w-8 h-8 mx-auto mb-2 ${platform.color}`}
                />
                <h3 className="font-semibold">{platform.name}</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {platform.mentions}
                </p>
                <p className="text-sm text-gray-600">Mentions</p>
                <div className="flex items-center justify-center mt-2">
                  {platform.growth > 0 ? (
                    <ArrowUp className="w-4 h-4 text-green-500" />
                  ) : (
                    <ArrowDown className="w-4 h-4 text-red-500" />
                  )}
                  <span
                    className={`text-sm ${
                      platform.growth > 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {platform.growth}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        {/* Recent Mentions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5" />
              Recent Mentions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentMentions.map((mention) => (
                <div key={mention.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {mention.platform === "Twitter" && (
                        <Twitter className="w-4 h-4 text-blue-400" />
                      )}
                      {mention.platform === "LinkedIn" && (
                        <Linkedin className="w-4 h-4 text-blue-700" />
                      )}
                      <span className="font-medium">{mention.username}</span>
                      <Badge
                        variant="outline"
                        className={getSentimentColor(mention.sentiment)}
                      >
                        {mention.sentiment}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-500">
                      {mention.timestamp}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-3">{mention.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {mention.engagement.likes && (
                        <span>❤️ {mention.engagement.likes}</span>
                      )}
                      {mention.engagement.retweets && (
                        <span>🔄 {mention.engagement.retweets}</span>
                      )}
                      {mention.engagement.replies && (
                        <span>💬 {mention.engagement.replies}</span>
                      )}
                      {mention.engagement.comments && (
                        <span>💬 {mention.engagement.comments}</span>
                      )}
                    </div>

                    {mention.potentialLead && (
                      <Button
                        size="sm"
                        onClick={() => onConvertToLead(mention)}
                      >
                        <Users className="w-4 h-4 mr-1" />
                        Convert to Lead
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Engagement Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span>Response Rate</span>
                <span className="font-bold text-blue-600">92%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span>Avg. Response Time</span>
                <span className="font-bold text-green-600">28 min</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span>Lead Conversion Rate</span>
                <span className="font-bold text-purple-600">18%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span>Total Reach</span>
                <span className="font-bold text-orange-600">45.2K</span>
              </div>
            </div>

            {/* Top Performing Posts */}
            <div className="mt-6">
              <h4 className="font-semibold mb-3">Top Performing Posts</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Product Launch Announcement</span>
                  <Badge>2.4K engagements</Badge>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Customer Success Story</span>
                  <Badge>1.8K engagements</Badge>
                </div>
                <div className="flex justify-between items-center p-2 border rounded">
                  <span className="text-sm">Industry Insights</span>
                  <Badge>1.2K engagements</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
