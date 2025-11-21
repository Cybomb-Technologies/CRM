import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Hash,
  Users,
  MessageCircle,
  Bell,
  Trash2,
  Edit,
} from "lucide-react";

export function SocialMonitoring({ onConvertToLead }) {
  const [keywords, setKeywords] = useState([
    {
      id: 1,
      keyword: "CloudCRM",
      platform: "all",
      active: true,
      mentions: 124,
    },
    {
      id: 2,
      keyword: "CRM software",
      platform: "all",
      active: true,
      mentions: 87,
    },
    {
      id: 3,
      keyword: "sales automation",
      platform: "twitter",
      active: true,
      mentions: 45,
    },
    {
      id: 4,
      keyword: "customer relationship",
      platform: "linkedin",
      active: false,
      mentions: 32,
    },
  ]);

  const [newKeyword, setNewKeyword] = useState("");

  const addKeyword = () => {
    if (newKeyword.trim()) {
      setKeywords([
        ...keywords,
        {
          id: Date.now(),
          keyword: newKeyword.trim(),
          platform: "all",
          active: true,
          mentions: 0,
        },
      ]);
      setNewKeyword("");
    }
  };

  const toggleKeyword = (id) => {
    setKeywords(
      keywords.map((kw) => (kw.id === id ? { ...kw, active: !kw.active } : kw))
    );
  };

  const deleteKeyword = (id) => {
    setKeywords(keywords.filter((kw) => kw.id !== id));
  };

  const monitoredMentions = [
    {
      id: 1,
      keyword: "CloudCRM",
      platform: "twitter",
      username: "@small_biz_owner",
      content:
        "Considering @CloudCRM for our small business. Anyone have experience with their pricing plans?",
      timestamp: "30 minutes ago",
      sentiment: "neutral",
      potentialLead: true,
    },
    {
      id: 2,
      keyword: "sales automation",
      platform: "linkedin",
      username: "Enterprise Sales Dir",
      content:
        "Evaluating sales automation tools. CloudCRM seems to have the features we need for our 100+ sales team.",
      timestamp: "2 hours ago",
      sentiment: "positive",
      potentialLead: true,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Keyword Monitoring */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Keyword Monitoring
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Add New Keyword */}
          <div className="flex gap-2 mb-6">
            <Input
              placeholder="Add keyword to monitor (e.g., your brand, product names)"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addKeyword()}
            />
            <Button onClick={addKeyword}>
              <Plus className="w-4 h-4 mr-2" />
              Add Keyword
            </Button>
          </div>

          {/* Keywords List */}
          <div className="space-y-3">
            {keywords.map((keyword) => (
              <div
                key={keyword.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <Switch
                    checked={keyword.active}
                    onCheckedChange={() => toggleKeyword(keyword.id)}
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{keyword.keyword}</span>
                      <Badge variant="outline">{keyword.platform}</Badge>
                    </div>
                    <div className="text-sm text-gray-500">
                      {keyword.mentions} mentions
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteKeyword(keyword.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Monitored Mentions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Recent Monitored Mentions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monitoredMentions.map((mention) => (
              <div key={mention.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{mention.platform}</Badge>
                    <span className="font-medium">{mention.username}</span>
                    <Badge
                      variant="outline"
                      className={
                        mention.sentiment === "positive"
                          ? "bg-green-100 text-green-800"
                          : mention.sentiment === "negative"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {mention.sentiment}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      via "{mention.keyword}"
                    </span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {mention.timestamp}
                  </span>
                </div>

                <p className="text-gray-700 mb-3">{mention.content}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Engage
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bell className="w-4 h-4 mr-1" />
                      Create Alert
                    </Button>
                  </div>

                  {mention.potentialLead && (
                    <Button size="sm" onClick={() => onConvertToLead(mention)}>
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
    </div>
  );
}
