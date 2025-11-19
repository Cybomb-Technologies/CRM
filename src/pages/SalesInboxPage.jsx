import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { EmailList } from "@/components/sales-inbox/EmailList";
import { EmailView } from "@/components/sales-inbox/EmailView";
import { SalesInboxSidebar } from "@/components/sales-inbox/SalesInboxSidebar";
import { EmailIntegrationSetup } from "@/components/sales-inbox/EmailIntegrationSetup";
import { ComposeEmail } from "@/components/sales-inbox/ComposeEmail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, RefreshCw, Plus, Settings, Mail } from "lucide-react";

export default function SalesInboxPage() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [refreshing, setRefreshing] = useState(false);
  const [emails, setEmails] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [showIntegrationSetup, setShowIntegrationSetup] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState([]);

  // Load emails from localStorage or API
  useEffect(() => {
    loadEmails();
    loadConnectedAccounts();
  }, []);

  const loadEmails = () => {
    // In real app, this would be an API call
    const savedEmails = localStorage.getItem("crm_emails");
    if (savedEmails) {
      setEmails(JSON.parse(savedEmails));
    } else {
      // Load mock data initially
      const mockEmails = [
        {
          id: 1,
          from: "john.ceo@techcorp.com",
          fromName: "John Smith",
          subject: "Enterprise Demo Request - Urgent",
          preview:
            "We're evaluating CRM solutions and would like to schedule a demo...",
          body: "Hi Team,\n\nWe're currently evaluating CRM solutions for our 200-person sales team and were impressed by your platform. We'd like to schedule a comprehensive demo of your enterprise features.\n\nBest regards,\nJohn Smith\nCEO, TechCorp Inc",
          date: new Date().toISOString(),
          read: false,
          important: true,
          hasAttachment: true,
          priority: "high",
          relatedTo: {
            type: "lead",
            id: "lead-1",
            name: "TechCorp Enterprise",
          },
          labels: ["demo", "urgent"],
        },
      ];
      setEmails(mockEmails);
      localStorage.setItem("crm_emails", JSON.stringify(mockEmails));
    }
  };

  const loadConnectedAccounts = () => {
    const accounts = localStorage.getItem("crm_connected_accounts");
    if (accounts) {
      setConnectedAccounts(JSON.parse(accounts));
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Simulate API call to refresh emails
    setTimeout(() => {
      loadEmails();
      setRefreshing(false);
    }, 1000);
  };

  const handleEmailAction = (emailId, action, data = {}) => {
    const updatedEmails = emails.map((email) => {
      if (email.id === emailId) {
        switch (action) {
          case "markRead":
            return { ...email, read: true };
          case "markImportant":
            return { ...email, important: !email.important };
          case "addLabel":
            return {
              ...email,
              labels: [...(email.labels || []), data.label],
            };
          case "moveToFolder":
            return { ...email, folder: data.folder };
          default:
            return email;
        }
      }
      return email;
    });

    setEmails(updatedEmails);
    localStorage.setItem("crm_emails", JSON.stringify(updatedEmails));
  };

  const handleSendEmail = (emailData) => {
    const newEmail = {
      id: Date.now(),
      from: connectedAccounts[0]?.email || "user@company.com",
      fromName: "You",
      subject: emailData.subject,
      preview: emailData.body.substring(0, 100) + "...",
      body: emailData.body,
      date: new Date().toISOString(),
      read: true,
      important: false,
      hasAttachment: emailData.attachments?.length > 0,
      priority: "medium",
      relatedTo: emailData.relatedTo,
      status: "sent",
      labels: ["sent"],
    };

    const updatedEmails = [newEmail, ...emails];
    setEmails(updatedEmails);
    localStorage.setItem("crm_emails", JSON.stringify(updatedEmails));
    setShowCompose(false);
  };

  const handleConnectEmail = (accountData) => {
    const newAccount = {
      id: Date.now(),
      ...accountData,
      connectedAt: new Date().toISOString(),
      status: "connected",
    };

    const updatedAccounts = [...connectedAccounts, newAccount];
    setConnectedAccounts(updatedAccounts);
    localStorage.setItem(
      "crm_connected_accounts",
      JSON.stringify(updatedAccounts)
    );
    setShowIntegrationSetup(false);

    // After connecting, load emails from this account
    loadEmailsFromProvider(accountData.provider, accountData.email);
  };

  const loadEmailsFromProvider = async (provider, email) => {
    // This would integrate with actual email provider APIs
    console.log(`Loading emails from ${provider} for ${email}`);
    // Simulate API call
  };

  return (
    <>
      <Helmet>
        <title>SalesInbox - CloudCRM</title>
      </Helmet>

      <div className="flex h-screen bg-gray-50">
        {/* Left Sidebar - Folders */}
        <SalesInboxSidebar
          activeFolder={activeFolder}
          onFolderChange={setActiveFolder}
          connectedAccounts={connectedAccounts}
          onConnectEmail={() => setShowIntegrationSetup(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold">SalesInbox</h1>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={refreshing}
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
                    />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4" />
                  </Button>
                  {connectedAccounts.length === 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowIntegrationSetup(true)}
                    >
                      <Settings className="w-4 h-4" />
                      Setup
                    </Button>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search emails..."
                    className="pl-10 w-80"
                  />
                </div>
                <Button onClick={() => setShowCompose(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Compose
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Email List */}
            <div
              className={`${
                selectedEmail ? "w-1/2" : "w-full"
              } border-r bg-white`}
            >
              <EmailList
                activeFolder={activeFolder}
                onEmailSelect={setSelectedEmail}
                selectedEmail={selectedEmail}
                emails={emails}
                onEmailAction={handleEmailAction}
              />
            </div>

            {/* Email Detail View */}
            {selectedEmail && (
              <div className="w-1/2 bg-white">
                <EmailView
                  email={selectedEmail}
                  onBack={() => setSelectedEmail(null)}
                  onEmailAction={handleEmailAction}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Compose Email Modal */}
      {showCompose && (
        <ComposeEmail
          onClose={() => setShowCompose(false)}
          onSend={handleSendEmail}
          connectedAccounts={connectedAccounts}
        />
      )}

      {/* Email Integration Setup Modal */}
      {showIntegrationSetup && (
        <EmailIntegrationSetup
          onClose={() => setShowIntegrationSetup(false)}
          onConnect={handleConnectEmail}
          connectedAccounts={connectedAccounts}
        />
      )}
    </>
  );
}
