import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const initialData = {
  leads: [
    { id: '1', name: 'Sarah Johnson', company: 'Tech Corp', email: 'sarah@techcorp.com', phone: '+1 234 567 8900', status: 'New', source: 'Website', score: 85 },
    { id: '2', name: 'Michael Chen', company: 'Innovation Labs', email: 'michael@innovationlabs.com', phone: '+1 234 567 8901', status: 'Contacted', source: 'Referral', score: 72 },
    { id: '3', name: 'Emily Davis', company: 'Growth Solutions', email: 'emily@growthsolutions.com', phone: '+1 234 567 8902', status: 'Qualified', source: 'LinkedIn', score: 91 }
  ],
  accounts: [
    { id: '1', name: 'Tech Corp', website: 'techcorp.com', phone: '+1 234 567 8900', industry: 'Technology', contacts: 1 },
    { id: '2', name: 'Innovation Labs', website: 'innovationlabs.com', phone: '+1 234 567 8901', industry: 'R&D', contacts: 1 },
    { id: '3', name: 'Growth Solutions', website: 'growthsolutions.com', phone: '+1 234 567 8902', industry: 'Marketing', contacts: 1 }
  ],
  contacts: [
    { id: '1', name: 'Alex Green', email: 'alex@techcorp.com', phone: '+1 234 567 8903', company: 'Tech Corp', role: 'CTO' },
    { id: '2', name: 'Maria Rodriguez', email: 'maria@innovationlabs.com', phone: '+1 234 567 8904', company: 'Innovation Labs', role: 'Head of Research' }
  ],
  deals: {
    qualification: [
      { id: '1', title: 'Enterprise Software License', company: 'Tech Corp', value: 45000, probability: 30, closeDate: new Date(2025, 11, 15).toISOString(), owner: 'John Doe' },
      { id: '2', title: 'Cloud Migration Project', company: 'Innovation Labs', value: 78000, probability: 25, closeDate: new Date(2025, 11, 20).toISOString(), owner: 'Jane Smith' }
    ],
    proposal: [
      { id: '3', title: 'Marketing Automation Suite', company: 'Growth Solutions', value: 32000, probability: 50, closeDate: new Date(2025, 11, 10).toISOString(), owner: 'John Doe' }
    ],
    negotiation: [
      { id: '4', title: 'CRM Implementation', company: 'Sales Pro Inc', value: 95000, probability: 75, closeDate: new Date(2025, 11, 5).toISOString(), owner: 'Jane Smith' }
    ],
    'closed-won': [
      { id: '5', title: 'Analytics Platform', company: 'Data Insights', value: 52000, probability: 100, closeDate: new Date(2025, 10, 28).toISOString(), owner: 'John Doe' }
    ],
    'closed-lost': []
  },
  activities: [
    { id: '1', title: 'Follow up with Sarah Johnson', type: 'Call', dueDate: '2025-11-10', status: 'Pending', assignedTo: 'John Doe', relatedTo: 'Lead: 1' },
    { id: '2', title: 'Prepare proposal for Tech Corp', type: 'Task', dueDate: '2025-11-11', status: 'Completed', assignedTo: 'John Doe', relatedTo: 'Deal: 1' },
    { id: '3', title: 'Meeting with Innovation Labs', type: 'Meeting', dueDate: '2025-11-12', status: 'Pending', assignedTo: 'Jane Smith', relatedTo: 'Deal: 2' }
  ],
  team: [
    { id: '1', name: 'Jane Smith', email: 'jane@company.com', role: 'Admin', status: 'Active'},
    { id: '2', name: 'Peter Jones', email: 'peter@company.com', role: 'Sales Manager', status: 'Active'},
    { id: '3', name: 'Mike Williams', email: 'mike@company.com', role: 'Sales Rep', status: 'Inactive'},
  ],
  tickets: [
      { id: '1', subject: 'Cannot login to portal', contact: 'Alex Green', priority: 'High', status: 'Open', created: '2025-11-05' },
      { id: '2', subject: 'Invoice discrepancy', contact: 'Maria Rodriguez', priority: 'Medium', status: 'In Progress', created: '2025-11-04' },
  ],
  products: [
      { id: '1', name: 'Standard CRM License', sku: 'CRM-STD-01', price: 50.00, category: 'Software' },
      { id: '2', name: 'Premium Support Package', sku: 'SUP-PREM-YR', price: 250.00, category: 'Service' },
  ],
  quotes: [
      { id: '1', quoteNumber: 'Q-2025-001', deal: 'Enterprise Software License', total: 45000, status: 'Sent' },
      { id: '2', quoteNumber: 'Q-2025-002', deal: 'Marketing Automation Suite', total: 32000, status: 'Draft' },
  ]
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState({ leads: [], accounts: [], contacts: [], deals: {}, activities: [], team: [], tickets: [], products: [], quotes: [] });

  useEffect(() => {
    if (user) {
      const storedData = {};
      Object.keys(initialData).forEach(key => {
        const item = localStorage.getItem(`crm_${key}`);
        storedData[key] = item ? JSON.parse(item) : initialData[key];
        if (!item) {
          localStorage.setItem(`crm_${key}`, JSON.stringify(initialData[key]));
        }
      });
      setData(storedData);
    }
  }, [user]);

  const updateData = (key, newData) => {
    localStorage.setItem(`crm_${key}`, JSON.stringify(newData));
    setData(prevData => ({
      ...prevData,
      [key]: newData
    }));
  };
  
  const addDataItem = (key, item) => {
    const currentData = data[key] || [];
    const newData = Array.isArray(currentData) ? [item, ...currentData] : { ...currentData };
    if (!Array.isArray(currentData)) {
      // Logic for deals kanban
       if(item.stage && newData[item.stage]){
           newData[item.stage] = [item, ...newData[item.stage]];
       } else if (item.stage) {
           newData[item.stage] = [item];
       }
    }
    updateData(key, newData);
  }

  const value = { data, updateData, addDataItem };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};