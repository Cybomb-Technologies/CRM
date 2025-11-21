import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { SocialDashboard } from "@/components/files/integrations/social/SocialDashboard";
import { SocialFeeds } from "@/components/files/integrations/social/SocialFeeds";
import { SocialMonitoring } from "@/components/files/integrations/social/SocialMonitoring";
import { SocialEngagement } from "@/components/files/integrations/social/SocialEngagement";
import { SocialSettings } from "@/components/files/integrations/social/SocialSettings";
import { ComposeSocialPost } from "@/components/files/integrations/social/ComposeSocialPost"; // ADD THIS IMPORT
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  RefreshCw,
  TrendingUp,
  MessageCircle,
  Share2,
  Users,
  Hash,
  Eye,
  Zap,
} from "lucide-react";

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [refreshing, setRefreshing] = useState(false);
  const [showCompose, setShowCompose] = useState(false); // ADD THIS STATE
  const [socialStats, setSocialStats] = useState({
    totalMentions: 0,
    engagementRate: 0,
    potentialLeads: 0,
    responseRate: 0,
  });

  useEffect(() => {
    loadSocialStats();
  }, []);

  const loadSocialStats = () => {
    // In real app, this would be API call
    const stats = {
      totalMentions: 247,
      engagementRate: 68,
      potentialLeads: 34,
      responseRate: 92,
    };
    setSocialStats(stats);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadSocialStats();
      setRefreshing(false);
    }, 1000);
  };

  const handleConvertToLead = (socialPost) => {
    console.log("Converting to lead:", socialPost);
    // Implementation for converting social post to lead
  };

  const handleSchedulePost = (postData) => {
    console.log("Scheduling post:", postData);
    // Implementation for scheduling social post
    setShowCompose(false); // Close the compose dialog after scheduling
  };

  return (
    <>
      <Helmet>
        <title>Social - CloudCRM</title>
      </Helmet>

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Social</h1>
            <p className="text-gray-600">
              Monitor social media, engage with customers, and generate leads
            </p>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button onClick={() => setShowCompose(true)}>
              {" "}
              {/* FIXED THIS BUTTON */}
              <Plus className="w-4 h-4 mr-2" />
              Schedule Post
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Mentions</p>
                <p className="text-2xl font-bold text-blue-600">
                  {socialStats.totalMentions}
                </p>
                <p className="text-xs text-green-600">+12% this week</p>
              </div>
              <MessageCircle className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {socialStats.engagementRate}%
                </p>
                <p className="text-xs text-green-600">+8% this week</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Potential Leads</p>
                <p className="text-2xl font-bold text-orange-600">
                  {socialStats.potentialLeads}
                </p>
                <p className="text-xs text-green-600">+5 new today</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Response Rate</p>
                <p className="text-2xl font-bold text-purple-600">
                  {socialStats.responseRate}%
                </p>
                <p className="text-xs text-green-600">+3% this week</p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="feeds" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              Feeds
            </TabsTrigger>
            <TabsTrigger value="monitoring" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Monitoring
            </TabsTrigger>
            <TabsTrigger value="engagement" className="flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Engagement
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <SocialDashboard
              stats={socialStats}
              onConvertToLead={handleConvertToLead}
            />
          </TabsContent>

          <TabsContent value="feeds" className="space-y-4">
            <SocialFeeds
              onConvertToLead={handleConvertToLead}
              onSchedulePost={handleSchedulePost}
            />
          </TabsContent>

          <TabsContent value="monitoring" className="space-y-4">
            <SocialMonitoring onConvertToLead={handleConvertToLead} />
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <SocialEngagement onSchedulePost={handleSchedulePost} />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SocialSettings />
          </TabsContent>
        </Tabs>
      </div>

      {/* Compose Social Post Modal */}
      {showCompose && (
        <ComposeSocialPost
          onClose={() => setShowCompose(false)}
          onSchedule={handleSchedulePost}
        />
      )}
    </>
  );
}
