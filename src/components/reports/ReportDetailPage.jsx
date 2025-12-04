// src/components/reports/ReportDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReportViewer from './ReportViewer';

const ReportDetailPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: 'last6months',
    dateValue: '${LAST6MONTHS}',
    fields: [],
    showDetails: false
  });

  // Sample report data based on your specifications
  const sampleReportData = {
    id: reportId,
    name: "Top 10 Templates by Click Rate",
    description: "Top 10 templates based on percentage of clicks",
    category: "Email",
    lastUpdated: "Updated less than a minute ago",
    columns: [
      "Template Name",
      "Sent",
      "Bounced",
      "Tracked",
      "Bounced Among Tracked",
      "Opened",
      "Clicked",
      "Replied",
      "Received",
      "Sent",
      "Bounced",
      "Tracked",
      "Bounced Among Tracked",
      "Opened"
    ],
    data: [
      {
        id: 1,
        templateName: "Welcome Email",
        sent: 1250,
        bounced: 25,
        tracked: 1225,
        bouncedAmongTracked: 25,
        opened: 980,
        clicked: 450,
        replied: 120,
        received: 1225,
        sent2: 1250,
        bounced2: 25,
        tracked2: 1225,
        bouncedAmongTracked2: 25,
        opened2: 980
      },
      {
        id: 2,
        templateName: "Promo Campaign",
        sent: 3200,
        bounced: 64,
        tracked: 3136,
        bouncedAmongTracked: 64,
        opened: 2450,
        clicked: 890,
        replied: 210,
        received: 3136,
        sent2: 3200,
        bounced2: 64,
        tracked2: 3136,
        bouncedAmongTracked2: 64,
        opened2: 2450
      },
      {
        id: 3,
        templateName: "Newsletter",
        sent: 8500,
        bounced: 170,
        tracked: 8330,
        bouncedAmongTracked: 170,
        opened: 6120,
        clicked: 2345,
        replied: 540,
        received: 8330,
        sent2: 8500,
        bounced2: 170,
        tracked2: 8330,
        bouncedAmongTracked2: 170,
        opened2: 6120
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    const loadReport = () => {
      setLoading(true);
      setTimeout(() => {
        setReport(sampleReportData);
        setLoading(false);
      }, 300);
    };

    loadReport();
  }, [reportId]);

  const handleBack = () => {
    navigate('/reports');
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const handleToggleFilterPanel = () => {
    setShowFilterPanel(!showFilterPanel);
  };

  const handleClearFilters = () => {
    setFilters({
      dateRange: 'last6months',
      dateValue: '${LAST6MONTHS}',
      fields: [],
      showDetails: false
    });
  };

  const handleAddField = () => {
    setFilters(prev => ({
      ...prev,
      fields: [...prev.fields, `Field ${prev.fields.length + 1}`]
    }));
  };

  const handleRemoveField = (index) => {
    setFilters(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const handleApplyFilter = () => {
    // Apply filter logic here
    console.log('Filters applied:', filters);
    setShowFilterPanel(false);
  };

  const handleToggleDetails = () => {
    setFilters(prev => ({
      ...prev,
      showDetails: !prev.showDetails
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading report...</div>
      </div>
    );
  }

  return (
    <ReportViewer 
      report={report}
      filters={filters}
      showFilterPanel={showFilterPanel}
      onBack={handleBack}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      onToggleFilterPanel={handleToggleFilterPanel}
      onAddField={handleAddField}
      onRemoveField={handleRemoveField}
      onApplyFilter={handleApplyFilter}
      onToggleDetails={handleToggleDetails}
    />
  );
};

export default ReportDetailPage;