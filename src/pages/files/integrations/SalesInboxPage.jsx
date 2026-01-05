import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { EmailList } from "@/components/files/integrations/sales-inbox/EmailList";
import { EmailView } from "@/components/files/integrations/sales-inbox/EmailView";
import { SalesInboxSidebar } from "@/components/files/integrations/sales-inbox/SalesInboxSidebar";
import { EmailIntegrationSetup } from "@/components/files/integrations/sales-inbox/EmailIntegrationSetup";
import { ComposeEmail } from "@/components/files/integrations/sales-inbox/ComposeEmail";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, RefreshCw, Plus, Settings } from "lucide-react";
import api from "@/lib/axios";

export default function SalesInboxPage() {
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [activeFolder, setActiveFolder] = useState("inbox");
  const [refreshing, setRefreshing] = useState(false);
  const [emails, setEmails] = useState([]);
  const [showCompose, setShowCompose] = useState(false);
  const [showIntegrationSetup, setShowIntegrationSetup] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({});

  // Load emails and accounts on mount
  useEffect(() => {
    loadData();
  }, []);

  // Reload emails when folder changes
  useEffect(() => {
    loadEmails();
  }, [activeFolder]);

  // Reload stats periodically or on action
  useEffect(() => {
      loadStats();
  }, [emails]); // Refresh stats whenever emails change

  const loadData = async () => {
    setLoading(true);
    await Promise.all([loadEmails(), loadConnectedAccounts(), loadStats()]);
    setLoading(false);
  };

  const loadStats = async () => {
    try {
        const res = await api.get('/sales-inbox/emails/stats');
        if (res.data.success) {
            setStats(res.data.data);
        }
    } catch (error) {
        console.error("Failed to load stats", error);
    }
  };

  const loadEmails = async () => {
    try {
      let params = {};
      
      const standardFolders = ['inbox', 'sent', 'drafts', 'archive', 'trash', 'spam'];
      if (standardFolders.includes(activeFolder)) {
        params.folder = activeFolder;
      } else if (activeFolder === 'unread') {
        params.read = false;
        // Search globally for unread if the user clicks "Unread" folder, 
        // or just filter current view? Often "Unread" is a pseudo-folder spanning all.
        // Backend 'read=false' query does exactly that.
      } else if (activeFolder === 'important') {
        params.important = true;
      }
       // Smart Views
      else if (activeFolder === 'leads') {
        // Backend doesn't support direct 'type' filtering yet via query params in the generic sense 
        // but 'folder' param is used. 
        // We need to support filtering by relatedTo type in the backend getEmails or do it here.
        // Let's rely on client side filtering for now as fallback, OR update backend.
        // BETTER: Update backend to handle these queries? 
        // For now, let's just fetch all and filter client side IF backend returns everything, 
        // BUT fetching all is bad.
        // Let's assume for now we just show inbox and filter? No, user wants to see them.
        // Let's just pass no folder param (returns all) and filter here? 
        // Or adding a temporary param.
      }

      const res = await api.get('/sales-inbox/emails', { params });
      
      if (res.data.success) {
        let fetchedEmails = res.data.data;
        
        // Client-side filtering for Smart Views
        if (activeFolder === 'leads') {
          fetchedEmails = fetchedEmails.filter(e => e.relatedTo?.type === 'lead');
        } else if (activeFolder === 'deals') {
          fetchedEmails = fetchedEmails.filter(e => e.relatedTo?.type === 'deal');
        } else if (activeFolder === 'priority') {
             fetchedEmails = fetchedEmails.filter(e => e.important);
        }
        
        setEmails(fetchedEmails);
      }
    } catch (error) {
      console.error("Failed to load emails", error);
    }
  };

  const loadConnectedAccounts = async () => {
    try {
      const res = await api.get('/sales-inbox/accounts');
      if (res.data.success) {
        setConnectedAccounts(res.data.data);
      }
    } catch (error) {
      console.error("Failed to load accounts", error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadEmails(), loadStats()]);
    setRefreshing(false);
  };
  
 // ... (handleEmailAction and handleSendEmail remain mostly same but good to refresh stats)

  const handleEmailAction = async (emailId, action, data = {}) => {
    try {
      let updates = {};
      if (action === "markRead") updates.read = true;
      if (action === "markImportant") {
        const email = emails.find((e) => e._id === emailId);
        if (email) updates.important = !email.important;
      }
      if (action === "moveToFolder") updates.folder = data.folder;
      if (action === "addLabel") updates.labels = data.label;

      // Optimistic update
      const updatedEmails = emails.map((email) => {
        if (email._id === emailId) {
           if (action === 'markRead') return { ...email, read: true };
           if (action === 'markImportant') return { ...email, important: !email.important };
           if (action === 'moveToFolder') return { ...email, folder: data.folder };
           return email;
        }
        return email;
      });
      setEmails(updatedEmails);
      
      if (selectedEmail?._id === emailId) {
         if (action === 'markRead') setSelectedEmail(prev => ({ ...prev, read: true }));
         if (action === 'markImportant') setSelectedEmail(prev => ({ ...prev, important: !prev.important }));
      }

      await api.put(`/sales-inbox/emails/${emailId}`, updates);
      loadStats(); // Reload stats after action
      
    } catch (error) {
      console.error("Failed to update email", error);
      loadEmails(); // Revert on error
    }
  };

  const handleSendEmail = async (emailData) => {
    if (connectedAccounts.length === 0) {
        alert("Please connect an email account first.");
        return;
    }
    try {
      const res = await api.post('/sales-inbox/emails', {
        ...emailData,
        connectedAccountId: connectedAccounts[0]?._id
      });
      
      if (res.data.success) {
        setShowCompose(false);
        if (activeFolder === 'sent') {
            loadEmails();
        }
        loadStats();
      }
    } catch (error) {
      console.error("Failed to send email", error);
    }
  };

  const handleConnectEmail = async (accountData) => {
    try {
      const res = await api.post('/sales-inbox/accounts', accountData);
      if (res.data.success) {
        setShowIntegrationSetup(false);
        loadConnectedAccounts();
        loadEmails(); 
        loadStats();
      }
    } catch (error) {
      console.error("Failed to connect account", error);
    }
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
          stats={stats}
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
