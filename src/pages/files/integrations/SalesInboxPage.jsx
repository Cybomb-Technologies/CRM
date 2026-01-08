import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// ... existing imports

export default function SalesInboxPage() {
  // ... existing state

  // ... existing functions

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
          onDisconnectEmail={handleDisconnectEmail}
          stats={stats}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
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
                  {/* ... other header buttons */}
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
                 {/* ... search and compose */}
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

          {/* Main Content: List ONLY */}
          <div className="flex-1 flex overflow-hidden min-w-0">
            <div className="w-full bg-white flex flex-col min-w-0">
              <EmailList
                activeFolder={activeFolder}
                onEmailSelect={setSelectedEmail}
                selectedEmail={selectedEmail}
                emails={emails}
                onEmailAction={handleEmailAction}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Email View Modal */}
      <Dialog open={!!selectedEmail} onOpenChange={(open) => !open && setSelectedEmail(null)}>
        <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
            <EmailView
                email={selectedEmail}
                onBack={() => setSelectedEmail(null)}
                onEmailAction={handleEmailAction}
                isModal={true} 
            />
        </DialogContent>
      </Dialog>

