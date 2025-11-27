import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  Users, 
  Mail, 
  Calendar, 
  MapPin, 
  Clock,
  Building2,
  Star,
  MoreVertical,
  Play,
  Edit3,
  Copy,
  Trash2
} from 'lucide-react';

const ReportsContent = ({ 
  reports, 
  loading, 
  selectedFolder, 
  searchTerm,
  onToggleFavorite 
}) => {
  
  const getIconComponent = (iconName) => {
    const iconMap = {
      TrendingUp: TrendingUp,
      BarChart3: BarChart3,
      Users: Users,
      Mail: Mail,
      Calendar: Calendar,
      MapPin: MapPin,
      Clock: Clock,
      Building2: Building2
    };
    return iconMap[iconName] || BarChart3;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 mb-4">
              <div className="h-12 bg-gray-200 rounded w-12"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Reports Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                  {/* Favorite column */}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Last Accessed Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    {searchTerm ? 'No reports found matching your search.' : 'No reports available.'}
                  </td>
                </tr>
              ) : (
                reports.map((report) => {
                  const IconComponent = getIconComponent(report.icon);
                  return (
                    <tr key={report.id} className="hover:bg-gray-50 group">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => onToggleFavorite(report.id)}
                          className={`p-1 rounded-full transition-colors ${
                            report.isFavorite 
                              ? 'text-yellow-500 hover:text-yellow-600' 
                              : 'text-gray-400 hover:text-yellow-500'
                          }`}
                        >
                          <Star 
                            className={`w-4 h-4 ${report.isFavorite ? 'fill-current' : ''}`} 
                          />
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <IconComponent className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                          <div className="text-sm font-medium text-gray-900 min-w-0">
                            {report.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-md truncate">
                          {report.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(report.lastAccessed)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {report.createdBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                            <Play className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Advanced Analytics Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-blue-900">
              Advanced Analytics for Zoho CRM powered by Zoho Analytics
            </h3>
            <p className="text-blue-700 mt-1">
              Get deeper insights with advanced analytics and custom reporting capabilities
            </p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
            Explore Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportsContent;