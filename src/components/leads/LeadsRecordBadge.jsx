import React from 'react';

const LeadsRecordBadge = ({ date }) => {
  const isToday = date === 'Today';
  
  return (
    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
      isToday 
        ? 'bg-orange-100 text-orange-800' 
        : 'bg-green-100 text-green-800'
    }`}>
      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      {date}
    </div>
  );
};

export default LeadsRecordBadge;