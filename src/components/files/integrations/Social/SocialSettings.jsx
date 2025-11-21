import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Twitter,
  Facebook,
  Linkedin,
  Instagram,
  CheckCircle,
  XCircle,
  Link,
  Settings,
} from "lucide-react";

export function SocialSettings() {
  const [connectedAccounts, setConnectedAccounts] = useState([
    {
      id: 1,
      platform: "twitter",
      username: "@cloudcrm",
      connected: true,
      lastSync: "2 hours ago",
    },
    {
      id: 2,
      platform: "linkedin",
      username: "Cloud CRM",
      connected: true,
      lastSync: "1 hour ago",
    },
    {
      id: 3,
      platform: "facebook",
      username: "Cloud CRM Page",
      connected: false,
      lastSync: "Never",
    },
    {
      id: 4,
      platform: "instagram",
      username: "cloudcrm",
      connected: false,
      lastSync: "Never",
    },
  ]);

  const [settings, setSettings] = useState({
    autoRespond: true,
    leadAlerts: true,
    sentimentAnalysis: true,
    competitorMentions: false,
    dailyReports: true,
  });

  const toggleSetting = (setting) => {
    setSettings((prev) => ({
      ...prev,
      [setting]: !prev[setting],
    }));
  };

  const toggleAccount = (id) => {
    setConnectedAccounts((accounts) =>
      accounts.map((account) =>
        account.id === id
          ? { ...account, connected: !account.connected }
          : account
      )
    );
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case "twitter":
        return <Twitter className="w-5 h-5 text-blue-400" />;
      case "facebook":
        return <Facebook className="w-5 h-5 text-blue-600" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5 text-blue-700" />;
      case "instagram":
        return <Instagram className="w-5 h-5 text-pink-500" />;
      default:
        return <Settings className="w-5 h-5" />;
    }
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {connectedAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  {getPlatformIcon(account.platform)}
                  <div>
                    <div className="font-medium capitalize">
                      {account.platform}
                    </div>
                    <div className="text-sm text-gray-500">
                      {account.username}
                    </div>
                    <div className="text-xs text-gray-400">
                      Last sync: {account.lastSync}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {account.connected ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-500">
                      <XCircle className="w-3 h-3 mr-1" />
                      Disconnected
                    </Badge>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAccount(account.id)}
                  >
                    {account.connected ? "Disconnect" : "Connect"}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">
              Need to connect more accounts?
            </h4>
            <p className="text-sm text-blue-700 mb-3">
              Connect your social media accounts to monitor mentions, engage
              with customers, and generate leads automatically.
            </p>
            <Button>
              <Link className="w-4 h-4 mr-2" />
              Add Social Account
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Social Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Automation Settings */}
            <div>
              <h4 className="font-semibold mb-4">Automation Settings</h4>
              <div className="space-y-4">
                {Object.entries(settings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <Label htmlFor={key} className="flex-1">
                      <div className="font-medium capitalize">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getSettingDescription(key)}
                      </div>
                    </Label>
                    <Switch
                      id={key}
                      checked={value}
                      onCheckedChange={() => toggleSetting(key)}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Notification Settings */}
            <div>
              <h4 className="font-semibold mb-4">Notification Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailAlerts">Email Alerts</Label>
                  <Switch id="emailAlerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <Switch id="pushNotifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="leadAlerts">Lead Generation Alerts</Label>
                  <Switch id="leadAlerts" defaultChecked />
                </div>
              </div>
            </div>

            {/* API Configuration */}
            <div>
              <h4 className="font-semibold mb-4">API Configuration</h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="apiKey">API Key</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your API key"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="webhookUrl">Webhook URL</Label>
                  <Input
                    id="webhookUrl"
                    placeholder="https://your-domain.com/webhook"
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <Button className="w-full">Save Settings</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function getSettingDescription(key) {
  const descriptions = {
    autoRespond: "Automatically respond to common queries and mentions",
    leadAlerts: "Get alerts when potential leads are detected",
    sentimentAnalysis: "Analyze sentiment of social mentions automatically",
    competitorMentions: "Monitor mentions of competitor brands",
    dailyReports: "Receive daily summary reports of social activity",
  };
  return descriptions[key] || "Configure this setting";
}
