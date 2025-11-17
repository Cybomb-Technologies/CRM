import React, { useState } from 'react';
import LeadsHeader from '../components/leads/LeadsHeader';
import LeadsTopBar from '../components/leads/LeadsTopBar';
import LeadsFilterPanel from '../components/leads/LeadsFilterPanel';
import LeadsTable from '../components/leads/LeadsTable';

const LeadsPage = () => {
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(10);

  // Mock data matching the screenshot exactly
  const leadsData = [
    {
      id: 1,
      name: 'Christopher Maclead (Sample)',
      company: 'Rangoni Of Florence',
      email: 'christopher-maclead@noemail.invalid',
      phone: '555-555-5555',
      lastActivity: 'Today'
    },
    {
      id: 2,
      name: 'Carissa Kidman (Sample)',
      company: 'Oh My Goodknits Inc',
      email: 'carissa-kidman@noemail.invalid',
      phone: '555-555-5555',
      lastActivity: 'Nov 20'
    },
    {
      id: 3,
      name: 'James Merced (Sample)',
      company: 'Kwik Kopy Printing',
      email: 'james-merced@noemail.invalid',
      phone: '555-555-5555',
      lastActivity: 'Nov 19'
    },
    {
      id: 4,
      name: 'Treas Sweely (Sample)',
      company: 'Moorong Associates',
      email: 'treas-sweely@noemail.invalid',
      phone: '555-555-5555',
      lastActivity: 'Nov 18'
    },
    {
      id: 5,
      name: 'Felix Hirpara (Sample)',
      company: 'Chapman',
      email: 'felix.hirpara@noemail.invalid',
      phone: '555-555-5555',
      lastActivity: 'Nov 17'
    },
    {
      id: 6,
      name: 'Kayleigh Lace (Sample)',
      company: 'Printing Dimensions',
      email: 'kayleigh-lace@noemail.invalid',
      phone: '555-555-5555',
      lastActivity: 'Nov 16'
    },
    {
      id: 7,
      name: 'Yvonne Tjepkema (Sample)',
      company: 'Grayson',
      email: 'yvonne-tjepkema@noemail.invalid',
      phone: '555-555-5555',
      lastActivity: 'Nov 15'
    }
  ];

  const handleSelectLead = (leadId) => {
    setSelectedLeads(prev => 
      prev.includes(leadId) 
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const handleSelectAll = () => {
    if (selectedLeads.length === leadsData.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leadsData.map(lead => lead.id));
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Your existing component */}
            
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <LeadsHeader />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left Filter Panel */}
          <div className="w-80 flex-shrink-0 border-r border-gray-200 bg-white overflow-y-auto">
            <LeadsFilterPanel />
          </div>
          
          {/* Right Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            <LeadsTopBar 
              totalRecords={leadsData.length}
              selectedCount={selectedLeads.length}
              currentPage={currentPage}
              recordsPerPage={recordsPerPage}
              onRecordsPerPageChange={setRecordsPerPage}
              onPageChange={setCurrentPage}
            />
            
            <div className="flex-1 overflow-auto">
              <LeadsTable 
                leads={leadsData}
                selectedLeads={selectedLeads}
                onSelectLead={handleSelectLead}
                onSelectAll={handleSelectAll}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeadsPage;