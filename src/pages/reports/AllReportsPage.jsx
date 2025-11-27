import React, { useState, useEffect } from 'react';
import ReportsTable from '../../components/reports/ReportsTable';
import { useParams } from 'react-router-dom';

const AllReportsPage = () => {
  const { folder } = useParams();
  const [selectedFolder, setSelectedFolder] = useState('All Reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample reports data matching your image
  const sampleReports = [
    {
      id: 1,
      name: "Top 10 Templates by Click Rate",
      description: "Top 10 templates based on percentage of clicks",
      folder: "Email Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Email",
      isFavorite: true
    },
    {
      id: 2,
      name: "Top 10 Templates by Open Rate",
      description: "Top 10 templates based on percentage of opens",
      folder: "Email Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Email",
      isFavorite: false
    },
    {
      id: 3,
      name: "Email and Activities Analytics Report",
      description: "No. of emails sent and replied, calls dialled...",
      folder: "Email Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Email",
      isFavorite: true
    },
    {
      id: 4,
      name: "Email and Call Analytics Report",
      description: "No. of mails sent and replied, calls attended...",
      folder: "Email Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Email",
      isFavorite: false
    },
    {
      id: 5,
      name: "Top 10 Users",
      description: "Top 10 users based on Mails Sent Rate",
      folder: "Email Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Email",
      isFavorite: false
    },
    {
      id: 6,
      name: "Email Analytics",
      description: "Summary of the email status/sent, bounce...",
      folder: "Email Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Email",
      isFavorite: true
    },
    {
      id: 7,
      name: "Planned Vs Realized Meetings this Month",
      description: "Know how many planned check-ins have been realized...",
      folder: "Meeting Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Meetings",
      isFavorite: false
    },
    {
      id: 8,
      name: "Number of Check-Ins by Salesperson",
      description: "Get number of monthly check-ins for customers...",
      folder: "Meeting Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Meetings",
      isFavorite: false
    },
    {
      id: 9,
      name: "Number of Check-Ins by Locality",
      description: "Get total number of monthly check-ins for localities",
      folder: "Meeting Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Meetings",
      isFavorite: false
    },
    {
      id: 10,
      name: "Check-Ins by Locality",
      description: "Get check-in details categorized by locality",
      folder: "Meeting Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Meetings",
      isFavorite: false
    },
    {
      id: 11,
      name: "Check-Ins for Leads",
      description: "Get check-in details for each Lead",
      folder: "Meeting Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Meetings",
      isFavorite: false
    },
    {
      id: 12,
      name: "Check-Ins for Accounts",
      description: "Get check-in details for each Account",
      folder: "Meeting Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Meetings",
      isFavorite: false
    },
    {
      id: 13,
      name: "Bounce Report",
      description: "Summary of bounced emails, reason for the bounce...",
      folder: "Email Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Email",
      isFavorite: false
    },
    {
      id: 14,
      name: "Overall Sales Duration Across Deal Type",
      description: "Average time taken for Lead to be converted...",
      folder: "Sales Metrics Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Sales",
      isFavorite: true
    },
    {
      id: 15,
      name: "Overall Sales Duration Across Lead Sources",
      description: "Average number of days taken for the Lead...",
      folder: "Sales Metrics Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Sales",
      isFavorite: false
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadReports = () => {
      setLoading(true);
      setTimeout(() => {
        let filteredReports = [...sampleReports];
        
        // Filter by folder if specified in URL
        if (folder) {
          const folderMap = {
            'all': 'All Reports',
            'favorites': 'Favorites',
            'recent': 'Recently Viewed',
            'scheduled': 'Scheduled Reports',
            'deleted': 'Recently Deleted',
            'accounts': 'Account and Contact Reports',
            'deals': 'Deal Reports',
            'leads': 'Lead Reports',
            'campaigns': 'Campaign Reports',
            'cases': 'Case and Solution Reports',
            'products': 'Product Reports',
            'vendors': 'Vendor Reports',
            'quotes': 'Quote Reports',
            'sales-orders': 'Sales Order Reports',
            'purchase-orders': 'Purchase Order Reports',
            'invoices': 'Invoice Reports'
          };
          
          const folderName = folderMap[folder] || 'All Reports';
          setSelectedFolder(folderName);
          
          // Apply folder-specific filtering
          if (folder === 'favorites') {
            filteredReports = filteredReports.filter(report => report.isFavorite);
          } else if (folder === 'recent') {
            // For demo, just take first few
            filteredReports = filteredReports.slice(0, 8);
          }
        }
        
        setReports(filteredReports);
        setLoading(false);
      }, 500);
    };

    loadReports();
  }, [folder]);

  useEffect(() => {
    // Filter reports based on search term
    if (searchTerm) {
      const filtered = sampleReports.filter(report =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.folder.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setReports(filtered);
    } else {
      setReports(sampleReports);
    }
  }, [searchTerm]);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleToggleFavorite = (reportId) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId
          ? { ...report, isFavorite: !report.isFavorite }
          : report
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
              <p className="text-gray-600 mt-1">Manage and view your reports</p>
            </div>
            <div className="flex items-center space-x-4">
              {/* Create Report Button */}
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Report
              </button>
              
              {/* Search Bar */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-80 pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <ReportsTable 
          reports={reports}
          loading={loading}
          selectedFolder={selectedFolder}
          searchTerm={searchTerm}
          onToggleFavorite={handleToggleFavorite}
        />
      </div>
    </div>
  );
};

export default AllReportsPage;