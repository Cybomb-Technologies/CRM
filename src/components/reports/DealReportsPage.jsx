import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const DealReportsPage = () => {
  const { folder } = useParams();
  const [selectedFolder, setSelectedFolder] = useState('Deal Reports');
  const [searchTerm, setSearchTerm] = useState('');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sample deal reports data matching your image
  const sampleDealReports = [
    {
      id: 1,
      name: "Stage Vs Deal Type Report",
      description: "Summarizes the various stages of New and Existing Business",
      folder: "Deal Analysis",
      lastAccessed: "2024-01-15",
      createdBy: "System",
      isFavorite: false
    },
    {
      id: 2,
      name: "Today's Sales",
      description: "Today's Sales",
      folder: "Sales Reports",
      lastAccessed: "2024-01-15",
      createdBy: "System",
      isFavorite: true
    },
    {
      id: 3,
      name: "Sales This Month",
      description: "This Month's Sales",
      folder: "Sales Reports",
      lastAccessed: "2024-01-14",
      createdBy: "System",
      isFavorite: false
    },
    {
      id: 4,
      name: "Sales by Lead Source",
      description: "Sales gained from various Lead Sources",
      folder: "Sales Analysis",
      lastAccessed: "2024-01-13",
      createdBy: "System",
      isFavorite: true
    },
    {
      id: 5,
      name: "Pipeline by Probability",
      description: "Deals by Probability",
      folder: "Pipeline Reports",
      lastAccessed: "2024-01-12",
      createdBy: "System",
      isFavorite: false
    },
    {
      id: 6,
      name: "Open Deals",
      description: "Deals Pending",
      folder: "Deal Management",
      lastAccessed: "2024-01-11",
      createdBy: "System",
      isFavorite: false
    },
    {
      id: 7,
      name: "Deals by Type",
      description: "Deals by Type",
      folder: "Deal Analysis",
      lastAccessed: "2024-01-10",
      createdBy: "System",
      isFavorite: false
    },
    {
      id: 8,
      name: "Lost Deals",
      description: "Deals Lost",
      folder: "Sales Analysis",
      lastAccessed: "2024-01-09",
      createdBy: "System",
      isFavorite: false
    },
    {
      id: 9,
      name: "Salesperson's Performance Report",
      description: "Deals gained by salesperson",
      folder: "Performance Reports",
      lastAccessed: "2024-01-08",
      createdBy: "System",
      isFavorite: true
    },
    {
      id: 10,
      name: "Deals Closing this Month",
      description: "Deals closing this month",
      folder: "Pipeline Reports",
      lastAccessed: "2024-01-07",
      createdBy: "System",
      isFavorite: false
    },
    {
      id: 11,
      name: "Pipeline by Stage",
      description: "Deals by Stage",
      folder: "Pipeline Reports",
      lastAccessed: "2024-01-06",
      createdBy: "System",
      isFavorite: false
    }
  ];

  useEffect(() => {
    // Simulate API call for deal reports
    const loadDealReports = () => {
      setLoading(true);
      setTimeout(() => {
        let filteredReports = [...sampleDealReports];
        
        // Filter by folder if specified in URL
        if (folder) {
          const folderMap = {
            'all': 'All Reports',
            'favorites': 'Favorites',
            'recent': 'Recently Viewed',
            'scheduled': 'Scheduled Reports',
            'deleted': 'Recently Deleted',
            'my-reports': 'My Reports',
            'shared': 'Shared with Me',
            'deals': 'Deal Reports'
          };
          
          const folderName = folderMap[folder] || 'Deal Reports';
          setSelectedFolder(folderName);
        }
        
        setReports(filteredReports);
        setLoading(false);
      }, 500);
    };

    loadDealReports();
  }, [folder]);

  useEffect(() => {
    // Filter reports based on search term
    if (searchTerm) {
      const filtered = sampleDealReports.filter(report =>
        report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.folder.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setReports(filtered);
    } else {
      setReports(sampleDealReports);
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
              <h1 className="text-2xl font-bold text-gray-900">Deal Reports</h1>
              <p className="text-gray-600 mt-1">Manage and view your reports</p>
            </div>
            <div className="flex items-center space-x-4">
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
                  placeholder="Search deal reports..."
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
        {/* Advanced Analytics Section */}
        <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Advanced Analytics for Zoho CRM powered by Zoho Analytics
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Create powerful reports and dashboards with Zoho Analytics
                  </p>
                </div>
              </div>
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Try Now
              </button>
            </div>
          </div>
        </div>

        {/* Deal Reports Table Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Deal Reports</h2>
          </div>
          
          {loading ? (
            <div className="p-6">
              <div className="animate-pulse">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 mb-4">
                    <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : reports.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Deal Reports found</h3>
              <p className="text-gray-500">
                No deal reports available.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Folder
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Accessed Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created By
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button 
                            onClick={() => handleToggleFavorite(report.id)}
                            className="mr-3 text-gray-400 hover:text-yellow-500 focus:outline-none"
                          >
                            <svg 
                              className={`w-5 h-5 ${report.isFavorite ? 'text-yellow-500 fill-current' : ''}`}
                              fill={report.isFavorite ? "currentColor" : "none"}
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                          </button>
                          <div className="text-sm font-medium text-gray-900">{report.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{report.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {report.folder}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.lastAccessed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.createdBy}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DealReportsPage;