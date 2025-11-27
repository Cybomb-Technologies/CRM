import React, { useState, useEffect } from 'react';
import ReportsLayout from '../components/reports/ReportsLayout';
import ReportsContent from '../components/reports/ReportsContent';
import { useParams } from 'react-router-dom';

const ReportsPage = () => {
  const { folder } = useParams();
  const [selectedFolder, setSelectedFolder] = useState('All Reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample reports data - in real app, this would come from API
  const sampleReports = [
    {
      id: 1,
      name: "Top 10 Templates by Click Rate",
      description: "Top 10 templates based on percentage of clicks",
      lastAccessed: "2024-01-15",
      createdBy: "Admin User",
      category: "Email",
      isFavorite: true,
      icon: "TrendingUp"
    },
    {
      id: 2,
      name: "Top 10 Templates by Open Rate",
      description: "Top 10 templates based on percentage of opens",
      lastAccessed: "2024-01-14",
      createdBy: "Admin User",
      category: "Email",
      isFavorite: false,
      icon: "TrendingUp"
    },
    {
      id: 3,
      name: "Email and Activities Analytics Report",
      description: "No. of emails sent and replied, calls dialled...",
      lastAccessed: "2024-01-13",
      createdBy: "Sales Manager",
      category: "Activities",
      isFavorite: true,
      icon: "BarChart3"
    },
    {
      id: 4,
      name: "Email and Call Analytics Report",
      description: "No. of mails sent and replied, calls attended...",
      lastAccessed: "2024-01-12",
      createdBy: "Sales Manager",
      category: "Activities",
      isFavorite: false,
      icon: "BarChart3"
    },
    {
      id: 5,
      name: "Top 10 Users",
      description: "Top 10 users based on Mails Sent Rate",
      lastAccessed: "2024-01-11",
      createdBy: "Admin User",
      category: "Users",
      isFavorite: false,
      icon: "Users"
    },
    {
      id: 6,
      name: "Email Analytics",
      description: "Summary of the email status/sent, bounce...",
      lastAccessed: "2024-01-10",
      createdBy: "Marketing Team",
      category: "Email",
      isFavorite: true,
      icon: "Mail"
    },
    {
      id: 7,
      name: "Planned Vs Realized Meetings this Month",
      description: "Know how many planned check-ins have been realized...",
      lastAccessed: "2024-01-09",
      createdBy: "Sales Team",
      category: "Meetings",
      isFavorite: false,
      icon: "Calendar"
    },
    {
      id: 8,
      name: "Number of Check-Ins by Salesperson",
      description: "Get number of monthly check-ins for customers...",
      lastAccessed: "2024-01-08",
      createdBy: "Sales Manager",
      category: "Activities",
      isFavorite: false,
      icon: "Users"
    },
    {
      id: 9,
      name: "Number of Check-Ins by Locality",
      description: "Get total number of monthly check-ins for localities",
      lastAccessed: "2024-01-07",
      createdBy: "Sales Manager",
      category: "Locations",
      isFavorite: false,
      icon: "MapPin"
    },
    {
      id: 10,
      name: "Check-Ins by Locality",
      description: "Get check-in details categorized by locality",
      lastAccessed: "2024-01-06",
      createdBy: "Sales Manager",
      category: "Locations",
      isFavorite: false,
      icon: "MapPin"
    },
    {
      id: 11,
      name: "Check-Ins for Leads",
      description: "Get check-in details for each Lead",
      lastAccessed: "2024-01-05",
      createdBy: "Sales Team",
      category: "Leads",
      isFavorite: false,
      icon: "Users"
    },
    {
      id: 12,
      name: "Check-Ins for Accounts",
      description: "Get check-in details for each Account",
      lastAccessed: "2024-01-04",
      createdBy: "Sales Team",
      category: "Accounts",
      isFavorite: false,
      icon: "Building2"
    },
    {
      id: 13,
      name: "Bounce Report",
      description: "Summary of bounced emails, reason for the bounce...",
      lastAccessed: "2024-01-03",
      createdBy: "Marketing Team",
      category: "Email",
      isFavorite: false,
      icon: "Mail"
    },
    {
      id: 14,
      name: "Overall Sales Duration Across Deal Type",
      description: "Average time taken for Lead to be converted...",
      lastAccessed: "2024-01-02",
      createdBy: "Analytics Team",
      category: "Sales",
      isFavorite: true,
      icon: "Clock"
    },
    {
      id: 15,
      name: "Overall Sales Duration Across Lead Sources",
      description: "Average number of days taken for the Lead...",
      lastAccessed: "2024-01-01",
      createdBy: "Analytics Team",
      category: "Sales",
      isFavorite: false,
      icon: "Clock"
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadReports = () => {
      setLoading(true);
      setTimeout(() => {
        let filteredReports = [...sampleReports];
        
        // Filter by folder if specified
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
            // Sort by last accessed date for recently viewed
            filteredReports = filteredReports.sort((a, b) => 
              new Date(b.lastAccessed) - new Date(a.lastAccessed)
            ).slice(0, 10);
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
        report.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setReports(filtered);
    } else {
      setReports(sampleReports);
    }
  }, [searchTerm]);

  const handleFolderSelect = (folder) => {
    setSelectedFolder(folder);
    // In a real app, you would fetch reports for the selected folder
  };

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
      <ReportsLayout 
        selectedFolder={selectedFolder}
        onFolderSelect={handleFolderSelect}
        onSearch={handleSearch}
        searchTerm={searchTerm}
      >
        <ReportsContent 
          reports={reports}
          loading={loading}
          selectedFolder={selectedFolder}
          searchTerm={searchTerm}
          onToggleFavorite={handleToggleFavorite}
        />
      </ReportsLayout>
    </div>
  );
};

export default ReportsPage;