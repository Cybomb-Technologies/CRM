import React from "react";
import { Button } from "@/components/ui/button";
import {
  Inbox,
  Send,
  FileText,
  Archive,
  AlertCircle,
  Star,
  Users,
  Target,
  Zap,
  Plus,
  Mail,
  Link,
  Settings,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function SalesInboxSidebar({
  activeFolder,
  onFolderChange,
  connectedAccounts,
  onConnectEmail,
  onDisconnectEmail,
  stats = {}
}) {
  // ... folders and smartViews definitions (keep existing) ...
  const folders = [
    {
      id: "inbox",
      name: "Inbox",
      icon: Inbox,
      count: stats.inbox || 0,
      color: "text-blue-600",
    },
    {
      id: "unread",
      name: "Unread",
      icon: AlertCircle,
      count: stats.unread || 0,
      color: "text-red-600",
    },
    {
      id: "important",
      name: "Important",
      icon: Star,
      count: stats.important || 0,
      color: "text-yellow-600",
    },
    { id: "sent", name: "Sent", icon: Send, count: stats.sent || 0, color: "text-green-600" },
    {
      id: "drafts",
      name: "Drafts",
      icon: FileText,
      count: stats.drafts || 0,
      color: "text-gray-600",
    },
    {
      id: "archive",
      name: "Archive",
      icon: Archive,
      count: stats.archive || 0,
      color: "text-gray-600",
    },
  ];

  const smartViews = [
    {
      id: "leads",
      name: "Lead Emails",
      icon: Users,
      count: stats.leads || 0,
      color: "text-purple-600",
    },
    {
      id: "deals",
      name: "Deal Related",
      icon: Target,
      count: stats.deals || 0,
      color: "text-orange-600",
    },
    {
      id: "priority",
      name: "Priority Inbox",
      icon: Zap,
      count: stats.priority || 0,
      color: "text-red-600",
    },
  ];

  return (
    <div className="w-64 bg-white border-r h-full flex flex-col">
      {/* Connect Email Button */}
      <div className="p-4 border-b">
        <Button className="w-full justify-center" onClick={onConnectEmail}>
          <Plus className="w-4 h-4 mr-2" />
          Connect Email
        </Button>
      </div>

      {/* Folders */}
      <div className="p-4 flex-1">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Folders
        </h3>
        <div className="space-y-1">
          {folders.map((folder) => (
            <Button
              key={folder.id}
              variant={activeFolder === folder.id ? "secondary" : "ghost"}
              className="w-full justify-between"
              onClick={() => onFolderChange(folder.id)}
            >
              <div className="flex items-center">
                <folder.icon className={`w-4 h-4 mr-3 ${folder.color}`} />
                <span>{folder.name}</span>
              </div>
              {folder.count > 0 && (
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {folder.count}
                </span>
              )}
            </Button>
          ))}
        </div>

        {/* Smart Views */}
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 mt-6">
          Smart Views
        </h3>
        <div className="space-y-1">
          {smartViews.map((view) => (
            <Button
              key={view.id}
              variant={activeFolder === view.id ? "secondary" : "ghost"}
              className="w-full justify-between"
              onClick={() => onFolderChange(view.id)}
            >
              <div className="flex items-center">
                <view.icon className={`w-4 h-4 mr-3 ${view.color}`} />
                <span>{view.name}</span>
              </div>
              {view.count > 0 && (
                <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs">
                  {view.count}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="p-4 border-t">
        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Connected Accounts
        </h3>
        <div className="space-y-2">
          {connectedAccounts.length === 0 ? (
            <div className="text-center p-4 border-2 border-dashed rounded-lg">
              <Mail className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 mb-2">
                No email accounts connected
              </p>
              <Button variant="outline" size="sm" onClick={onConnectEmail}>
                <Link className="w-4 h-4 mr-2" />
                Connect Email
              </Button>
            </div>
          ) : (
            connectedAccounts.map((account) => (
              <div
                key={account._id || account.id} 
                className="flex items-center justify-between p-2 bg-green-50 rounded"
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <div>
                    <div className="text-sm font-medium truncate w-32" title={account.email}>{account.email}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {account.provider}
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                             <Settings className="w-4 h-4 text-gray-500" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem className="text-red-600 focus:text-red-600" onClick={() => onDisconnectEmail(account._id)}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Disconnect Account
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
