import React from 'react';
import { 
  Folder, 
  Star, 
  Clock, 
  Calendar, 
  Trash2, 
  Users, 
  Target,
  BarChart3,
  Package,
  Building2,
  FileText
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReportsSidebar = ({ selectedFolder, onFolderSelect }) => {
  const navigate = useNavigate();

  const folderSections = [
    {
      title: "Search Folder",
      folders: [
        { name: "All Reports", icon: Folder, path: "/reports/all" },
        { name: "My Reports", icon: Users, path: "/reports/my" },
        { name: "Favorites", icon: Star, path: "/reports/favorites" },
        { name: "Recently Viewed", icon: Clock, path: "/reports/recent" },
        { name: "Scheduled Reports", icon: Calendar, path: "/reports/scheduled" },
        { name: "Recently Deleted", icon: Trash2, path: "/reports/deleted" },
      ]
    },
    {
      title: "By Module",
      folders: [
        { name: "Account and Contact Reports", icon: Users, path: "/reports/accounts" },
        { name: "Deal Reports", icon: Target, path: "/reports/deals" },
        { name: "Lead Reports", icon: Users, path: "/reports/leads" },
        { name: "Campaign Reports", icon: Target, path: "/reports/campaigns" },
        { name: "Case and Solution Reports", icon: FileText, path: "/reports/cases" },
        { name: "Product Reports", icon: Package, path: "/reports/products" },
        { name: "Vendor Reports", icon: Building2, path: "/reports/vendors" },
        { name: "Quote Reports", icon: FileText, path: "/reports/quotes" },
        { name: "Sales Order Reports", icon: FileText, path: "/reports/sales-orders" },
        { name: "Purchase Order Reports", icon: FileText, path: "/reports/purchase-orders" },
        { name: "Invoice Reports", icon: FileText, path: "/reports/invoices" },
      ]
    }
  ];

  const handleFolderClick = (folder) => {
    onFolderSelect(folder.name);
    if (folder.path) {
      navigate(folder.path);
    }
  };

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
      </div>

      {folderSections.map((section, index) => (
        <div key={index} className="mb-8">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
            {section.title}
          </h3>
          <div className="space-y-1">
            {section.folders.map((folder, folderIndex) => {
              const IconComponent = folder.icon;
              const isSelected = selectedFolder === folder.name;
              
              return (
                <button
                  key={folderIndex}
                  onClick={() => handleFolderClick(folder)}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                    isSelected
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <IconComponent className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="truncate text-left">{folder.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* CRM Teamspace Section */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-2">CRM Teamspace</h3>
        <p className="text-xs text-gray-600">
          Your workspace for collaborative reporting and analytics.
        </p>
      </div>
    </div>
  );
};

export default ReportsSidebar;