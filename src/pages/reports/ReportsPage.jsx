// src/pages/reports/ReportsPage.jsx
import React from 'react';
import ReportsLayout from '@/components/reports/ReportsLayout';
import ReportsContent from '@/components/reports/ReportsContent';
import { useParams } from 'react-router-dom';

const ReportsPage = () => {
  const { folder } = useParams();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <ReportsLayout folder={folder}>
        <ReportsContent folder={folder} />
      </ReportsLayout>
    </div>
  );
};

export default ReportsPage;