// src/components/reports/ReportsContent.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ReportsContent = ({ folder, searchTerm, onSearch }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const sampleReports = [
    {
      id: 1,
      name: "Top 10 Templates by Click Rate",
      description: "Top 10 templates based on percentage of clicks",
      folder: "Email Reports",
      lastAccessed: "Now",
      createdBy: "-",
      category: "Email",
      isFavorite: true,
      icon: "📈"
    },
    {
      id: 2,
      name: "Top 10 Templates by Open Rate",
      description: "Top 10 templates based on percentage of opens",
      folder: "Email Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Email",
      isFavorite: false,
      icon: "📈"
    },
    {
      id: 3,
      name: "Email and Activities Analytics Report",
      description: "No. of emails sent and replied, calls dialled...",
      folder: "Email Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Email",
      isFavorite: true,
      icon: "📊"
    },
    {
      id: 4,
      name: "Email and Call Analytics Report",
      description: "No. of mails sent and replied, calls attended...",
      folder: "Email Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Email",
      isFavorite: false,
      icon: "📊"
    },
    {
      id: 5,
      name: "Top 10 Users",
      description: "Top 10 users based on Mails Sent Rate",
      folder: "Email Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Email",
      isFavorite: false,
      icon: "👥"
    },
    {
      id: 6,
      name: "Email Analytics",
      description: "Summary of the email status/sent, bounce...",
      folder: "Email Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Email",
      isFavorite: true,
      icon: "📧"
    },
    {
      id: 7,
      name: "Planned Vs Realized Meetings this Month",
      description: "Know how many planned check-ins have been realized...",
      folder: "Meeting Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Meetings",
      isFavorite: false,
      icon: "📅"
    },
    {
      id: 8,
      name: "Number of Check-Ins by Salesperson",
      description: "Get number of monthly check-ins for customers...",
      folder: "Meeting Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Meetings",
      isFavorite: false,
      icon: "👥"
    },
    {
      id: 9,
      name: "Number of Check-Ins by Locality",
      description: "Get total number of monthly check-ins for localities",
      folder: "Meeting Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Meetings",
      isFavorite: false,
      icon: "📍"
    },
    {
      id: 10,
      name: "Check-Ins by Locality",
      description: "Get check-in details categorized by locality",
      folder: "Meeting Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Meetings",
      isFavorite: false,
      icon: "📍"
    },
    {
      id: 11,
      name: "Check-Ins for Leads",
      description: "Get check-in details for each Lead",
      folder: "Meeting Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Meetings",
      isFavorite: false,
      icon: "👥"
    },
    {
      id: 12,
      name: "Check-Ins for Accounts",
      description: "Get check-in details for each Account",
      folder: "Meeting Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Meetings",
      isFavorite: false,
      icon: "🏢"
    },
    {
      id: 13,
      name: "Bounce Report",
      description: "Summary of bounced emails, reason for the bounce...",
      folder: "Email Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Email",
      isFavorite: false,
      icon: "📧"
    },
    {
      id: 14,
      name: "Overall Sales Duration Across Deal Type",
      description: "Average time taken for Lead to be converted...",
      folder: "Sales Metrics Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Sales",
      isFavorite: true,
      icon: "⏰"
    },
    {
      id: 15,
      name: "Overall Sales Duration Across Lead Sources",
      description: "Average number of days taken for the Lead...",
      folder: "Sales Metrics Reports",
      lastAccessed: "-",
      createdBy: "-",
      category: "Sales",
      isFavorite: false,
      icon: "⏰"
    }
  ];

  useEffect(() => {
    const loadReports = () => {
      setLoading(true);
      setTimeout(() => {
        let filteredReports = [...sampleReports];
        
        // Filter by folder
        if (folder === 'favorites') {
          filteredReports = filteredReports.filter(report => report.isFavorite);
        } else if (folder === 'recent') {
          filteredReports = filteredReports.slice(0, 8);
        }
        
        // Filter by search term
        if (searchTerm) {
          filteredReports = filteredReports.filter(report =>
            report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.category.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        setReports(filteredReports);
        setLoading(false);
      }, 500);
    };
    
    loadReports();
  }, [folder, searchTerm]);

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
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {folder === 'all' ? 'All Reports' : 
               folder === 'favorites' ? 'Favorites' :
               folder === 'recent' ? 'Recently Viewed' : 
               folder?.charAt(0).toUpperCase() + folder?.slice(1) || 'All Reports'}
            </h1>
            <p className="text-gray-600 mt-1">
              {reports.length} reports found
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex items-center space-x-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : 'text-gray-600'}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-gray-600">Loading reports...</div>
        </div>
      ) : (
        viewMode === 'grid' ? (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Link
                key={report.id}
                to={`/reports/view/${report.id}`}
                className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow block"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{report.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{report.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{report.folder}</p>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleToggleFavorite(report.id);
                    }}
                    className="text-gray-400 hover:text-yellow-500"
                  >
                    {report.isFavorite ? '★' : '☆'}
                  </button>
                </div>
                <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Last accessed: {report.lastAccessed}</span>
                  <span className="bg-gray-100 px-2 py-1 rounded text-xs">
                    {report.category}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Table View (List) */
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Report Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Folder
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Accessed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/reports/view/${report.id}`} className="flex items-center">
                        <span className="mr-3">{report.icon}</span>
                        <span className="font-medium text-gray-900">{report.name}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {report.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                        {report.folder}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {report.lastAccessed}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleToggleFavorite(report.id)}
                        className="text-gray-400 hover:text-yellow-500 mr-3"
                      >
                        {report.isFavorite ? '★' : '☆'}
                      </button>
                      <button className="text-gray-400 hover:text-blue-500">
                        ⋮
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}
    </div>
  );
};

export default ReportsContent;