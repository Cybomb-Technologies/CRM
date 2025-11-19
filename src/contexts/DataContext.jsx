// src/contexts/DataContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const initialData = {
  leads: [
    { 
      id: '1', 
      firstName: 'Sarah', 
      lastName: 'Johnson', 
      company: 'Tech Corp', 
      email: 'sarah@techcorp.com', 
      phone: '+1 234 567 8900', 
      leadStatus: 'New', 
      leadSource: 'Website', 
      industry: 'Technology',
      title: 'CTO',
      isConverted: false,
      isJunk: false,
      isQualified: true,
      isLocked: false,
      isUnsubscribed: false,
      isUnread: true,
      tags: ['hot', 'enterprise'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: '2', 
      firstName: 'Michael', 
      lastName: 'Chen', 
      company: 'Innovation Labs', 
      email: 'michael@innovationlabs.com', 
      phone: '+1 234 567 8901', 
      leadStatus: 'Contacted', 
      leadSource: 'Referral', 
      industry: 'R&D',
      title: 'Head of Research',
      isConverted: true,
      convertedToContactId: '2_contact',
      convertedToAccountId: '2',
      conversionDate: new Date().toISOString(),
      isJunk: false,
      isQualified: true,
      isLocked: false,
      isUnsubscribed: false,
      isUnread: false,
      tags: ['warm'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  accounts: [
    { 
      id: '1', 
      name: 'Tech Corp', 
      website: 'techcorp.com', 
      phone: '+1 234 567 8900', 
      industry: 'Technology', 
      contacts: 1,
      email: 'info@techcorp.com',
      billingAddress: {
        street: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'USA'
      },
      shippingAddress: {
        street: '123 Tech Street',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94105',
        country: 'USA'
      },
      annualRevenue: 50000000,
      employees: 250,
      type: 'Customer',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    { 
      id: '2', 
      name: 'Innovation Labs', 
      website: 'innovationlabs.com', 
      phone: '+1 234 567 8901', 
      industry: 'R&D', 
      contacts: 1,
      email: 'contact@innovationlabs.com',
      billingAddress: {
        street: '456 Innovation Ave',
        city: 'Boston',
        state: 'MA',
        zipCode: '02108',
        country: 'USA'
      },
      annualRevenue: 25000000,
      employees: 120,
      type: 'Partner',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  contacts: [
    { 
      id: '2_contact', 
      firstName: 'Michael',
      lastName: 'Chen',
      name: 'Michael Chen',
      email: 'michael@innovationlabs.com', 
      phone: '+1 234 567 8901', 
      mobile: '+1 234 567 8998',
      accountId: '2',
      accountName: 'Innovation Labs',
      title: 'Head of Research',
      department: 'R&D',
      leadSource: 'Referral',
      reportsTo: '',
      mailingAddress: {
        street: '456 Innovation Ave',
        city: 'Boston',
        state: 'MA',
        zipCode: '02108',
        country: 'USA'
      },
      otherAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      description: 'Leads research initiatives and technology evaluation. Converted from lead on ' + new Date().toLocaleDateString(),
      assistant: '',
      assistantPhone: '',
      emailOptOut: false,
      convertedFromLead: '2',
      leadConversionDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  deals: {
    qualification: [
      { id: '1', title: 'Enterprise Software License', company: 'Tech Corp', contactId: '1', value: 45000, probability: 30, closeDate: new Date(2025, 11, 15).toISOString(), owner: 'John Doe' },
      { id: '2', title: 'Cloud Migration Project', company: 'Innovation Labs', contactId: '2_contact', value: 78000, probability: 25, closeDate: new Date(2025, 11, 20).toISOString(), owner: 'Jane Smith', sourceLeadId: '2' }
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
  ],
  campaigns: [
    { id: '1', name: 'Q4 Product Launch', status: 'Active', startDate: '2025-10-01', endDate: '2025-12-31' },
    { id: '2', name: 'Holiday Promotion', status: 'Planning', startDate: '2025-11-15', endDate: '2025-12-25' }
  ],
  autoresponders: [
    { id: '1', name: 'Welcome Series', trigger: 'New Lead', status: 'Active' },
    { id: '2', name: 'Follow-up Sequence', trigger: 'Lead Created', status: 'Active' }
  ],
  drafts: [
    { id: '1', type: 'email', subject: 'Welcome to our platform', content: 'Dear [Name],...', createdAt: new Date().toISOString() },
    { id: '2', type: 'campaign', name: 'Summer Campaign Draft', content: {}, createdAt: new Date().toISOString() }
  ]
};

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [data, setData] = useState({ 
    leads: [], 
    accounts: [], 
    contacts: [], 
    deals: {}, 
    activities: [], 
    team: [], 
    tickets: [], 
    products: [], 
    quotes: [],
    campaigns: [],
    autoresponders: [],
    drafts: []
  });
  const [loading, setLoading] = useState(false);

  // Fetch data function
  const fetchData = useCallback(() => {
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

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateData = useCallback((key, newData) => {
    localStorage.setItem(`crm_${key}`, JSON.stringify(newData));
    setData(prevData => ({
      ...prevData,
      [key]: newData
    }));
  }, []);
  
  const addDataItem = useCallback((key, item) => {
    const currentData = data[key] || [];
    
    if (Array.isArray(currentData)) {
      const newData = [item, ...currentData];
      updateData(key, newData);
    } else {
      const newData = { ...currentData };
      if (item.stage && newData[item.stage]) {
        newData[item.stage] = [item, ...newData[item.stage]];
      } else if (item.stage) {
        newData[item.stage] = [item];
      }
      updateData(key, newData);
    }
  }, [data, updateData]);

  const updateDataItem = useCallback((key, itemId, updatedItem) => {
    const currentData = data[key] || [];
    
    if (Array.isArray(currentData)) {
      const newData = currentData.map(item => 
        item.id === itemId ? { ...item, ...updatedItem, updatedAt: new Date().toISOString() } : item
      );
      updateData(key, newData);
    } else {
      const newData = { ...currentData };
      Object.keys(newData).forEach(stage => {
        newData[stage] = newData[stage].map(item =>
          item.id === itemId ? { ...item, ...updatedItem, updatedAt: new Date().toISOString() } : item
        );
      });
      updateData(key, newData);
    }
  }, [data, updateData]);

  const deleteDataItem = useCallback((key, itemId) => {
    const currentData = data[key] || [];
    
    if (Array.isArray(currentData)) {
      const newData = currentData.filter(item => item.id !== itemId);
      updateData(key, newData);
    } else {
      const newData = { ...currentData };
      Object.keys(newData).forEach(stage => {
        newData[stage] = newData[stage].filter(item => item.id !== itemId);
      });
      updateData(key, newData);
    }
  }, [data, updateData]);

  // LEAD CONVERSION LOGIC
  const convertLead = useCallback((leadId) => {
    const lead = data.leads.find(l => l.id === leadId);
    if (!lead) return { success: false, message: 'Lead not found' };

    // Check if account already exists
    let account = data.accounts.find(acc => acc.name === lead.company);
    
    // If account doesn't exist, create it
    if (!account) {
      account = {
        id: Date.now().toString(),
        name: lead.company,
        website: lead.website || '',
        phone: lead.phone,
        industry: lead.industry,
        email: lead.email,
        contacts: 0,
        billingAddress: {
          street: lead.streetAddress || '',
          city: lead.city || '',
          state: lead.state || '',
          zipCode: lead.zipCode || '',
          country: lead.country || ''
        },
        shippingAddress: {
          street: lead.streetAddress || '',
          city: lead.city || '',
          state: lead.state || '',
          zipCode: lead.zipCode || '',
          country: lead.country || ''
        },
        annualRevenue: lead.annualRevenue || 0,
        employees: lead.numberOfEmployees || 0,
        type: 'Customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      addDataItem('accounts', account);
    }

    // Create contact from lead - ONE-TIME COPY
    const contact = {
      id: Date.now().toString() + '_contact',
      firstName: lead.firstName,
      lastName: lead.lastName,
      name: `${lead.firstName} ${lead.lastName}`,
      email: lead.email,
      phone: lead.phone,
      mobile: lead.mobile || '',
      accountId: account.id,
      accountName: account.name,
      title: lead.title || '',
      department: '',
      leadSource: lead.leadSource,
      reportsTo: '',
      mailingAddress: {
        street: lead.streetAddress || '',
        city: lead.city || '',
        state: lead.state || '',
        zipCode: lead.zipCode || '',
        country: lead.country || ''
      },
      otherAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: ''
      },
      description: lead.description || `Converted from lead on ${new Date().toLocaleDateString()}`,
      assistant: '',
      assistantPhone: '',
      emailOptOut: lead.emailOptOut || false,
      convertedFromLead: leadId, // Track original lead
      leadConversionDate: new Date().toISOString(), // Track conversion time
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    addDataItem('contacts', contact);

    // Create opportunity from qualified lead
    if (lead.leadStatus === 'Qualified' || lead.isQualified) {
      const opportunity = {
        id: Date.now().toString() + '_deal',
        title: `${lead.company} - ${lead.firstName} ${lead.lastName}`,
        company: lead.company,
        contactId: contact.id,
        contactName: contact.name,
        value: 10000,
        probability: 20,
        stage: 'qualification',
        closeDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        owner: 'Current User',
        description: `Opportunity created from converted lead: ${lead.firstName} ${lead.lastName}`,
        sourceLeadId: leadId, // Track source lead
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      const currentDeals = data.deals;
      const updatedDeals = {
        ...currentDeals,
        qualification: [opportunity, ...(currentDeals.qualification || [])]
      };
      updateData('deals', updatedDeals);
    }

    // Mark lead as converted with references
    const updatedLeads = data.leads.map(l =>
      l.id === leadId ? { 
        ...l, 
        isConverted: true, 
        convertedToContactId: contact.id, // Reference to contact
        convertedToAccountId: account.id, // Reference to account
        conversionDate: new Date().toISOString(), // Conversion timestamp
        updatedAt: new Date().toISOString() 
      } : l
    );
    updateData('leads', updatedLeads);

    return { 
      success: true, 
      message: 'Lead converted successfully',
      contact, 
      account, 
      opportunity: lead.isQualified 
    };
  }, [data, addDataItem, updateData]);

  // BULK LEAD CONVERSION
  const bulkConvertLeads = useCallback((leadIds) => {
    const results = leadIds.map(leadId => convertLead(leadId));
    const successful = results.filter(result => result.success);
    const failed = results.filter(result => !result.success);
    
    return {
      success: successful.length > 0,
      message: `${successful.length} leads converted successfully${failed.length > 0 ? `, ${failed.length} failed` : ''}`,
      successful,
      failed
    };
  }, [convertLead]);

  // MANUAL SYNC FUNCTION
  const syncLeadToContact = useCallback((leadId) => {
    const lead = data.leads.find(l => l.id === leadId);
    const contact = data.contacts.find(c => c.convertedFromLead === leadId);
    
    if (!lead || !contact) {
      return { success: false, message: 'Lead or contact not found' };
    }

    if (!lead.isConverted) {
      return { success: false, message: 'Lead is not converted yet' };
    }

    try {
      // Update contact with latest lead data
      const updatedContact = {
        ...contact,
        firstName: lead.firstName,
        lastName: lead.lastName,
        name: `${lead.firstName} ${lead.lastName}`,
        email: lead.email,
        phone: lead.phone,
        mobile: lead.mobile || contact.mobile,
        title: lead.title || contact.title,
        leadSource: lead.leadSource || contact.leadSource,
        mailingAddress: {
          street: lead.streetAddress || contact.mailingAddress.street,
          city: lead.city || contact.mailingAddress.city,
          state: lead.state || contact.mailingAddress.state,
          zipCode: lead.zipCode || contact.mailingAddress.zipCode,
          country: lead.country || contact.mailingAddress.country
        },
        description: lead.description || contact.description,
        emailOptOut: lead.emailOptOut || contact.emailOptOut,
        updatedAt: new Date().toISOString(),
        lastSyncedFromLead: new Date().toISOString() // Track sync time
      };

      updateDataItem('contacts', contact.id, updatedContact);
      
      return { 
        success: true, 
        message: 'Lead data synced to contact successfully',
        contact: updatedContact
      };
    } catch (error) {
      return { success: false, message: 'Sync failed: ' + error.message };
    }
  }, [data.leads, data.contacts, updateDataItem]);

  // TAG MANAGEMENT
  const manageLeadTags = useCallback((leadIds, tagsToAdd = [], tagsToRemove = []) => {
    const currentLeads = data.leads || [];
    const newLeads = currentLeads.map(lead => {
      if (leadIds.includes(lead.id)) {
        const currentTags = lead.tags || [];
        const updatedTags = [
          ...currentTags.filter(tag => !tagsToRemove.includes(tag)),
          ...tagsToAdd.filter(tag => !currentTags.includes(tag))
        ];
        return { ...lead, tags: updatedTags, updatedAt: new Date().toISOString() };
      }
      return lead;
    });
    updateData('leads', newLeads);
    
    return {
      success: true,
      message: `Tags updated for ${leadIds.length} leads`
    };
  }, [data.leads, updateData]);

  // DEDUPLICATE LEADS
  const deduplicateLeads = useCallback((criteria = ['email', 'phone']) => {
    const currentLeads = data.leads || [];
    const duplicates = [];
    const uniqueLeads = [];
    const seen = new Set();

    currentLeads.forEach(lead => {
      const key = criteria.map(field => lead[field] || '').join('|').toLowerCase();
      
      if (key && seen.has(key)) {
        duplicates.push(lead);
      } else {
        if (key) seen.add(key);
        uniqueLeads.push(lead);
      }
    });

    if (duplicates.length > 0) {
      updateData('leads', uniqueLeads);
    }

    return {
      success: true,
      duplicatesFound: duplicates.length,
      duplicates,
      uniqueLeads: uniqueLeads.length,
      message: `Found ${duplicates.length} duplicate leads and removed them`
    };
  }, [data.leads, updateData]);

  // APPROVE LEADS
  const approveLeads = useCallback((leadIds) => {
    const currentLeads = data.leads || [];
    const newLeads = currentLeads.map(lead => 
      leadIds.includes(lead.id) ? { 
        ...lead, 
        isApproved: true, 
        approvedAt: new Date().toISOString(),
        approvedBy: user?.name || 'System',
        updatedAt: new Date().toISOString() 
      } : lead
    );
    updateData('leads', newLeads);
    
    return {
      success: true,
      message: `${leadIds.length} leads approved successfully`
    };
  }, [data.leads, updateData, user]);

  // ADD TO CAMPAIGN
  const addLeadsToCampaign = useCallback((leadIds, campaignId) => {
    const currentLeads = data.leads || [];
    const newLeads = currentLeads.map(lead => 
      leadIds.includes(lead.id) ? { 
        ...lead, 
        campaignId,
        addedToCampaignAt: new Date().toISOString(),
        updatedAt: new Date().toISOString() 
      } : lead
    );
    updateData('leads', newLeads);
    
    return {
      success: true,
      message: `${leadIds.length} leads added to campaign`
    };
  }, [data.leads, updateData]);

  // CREATE CLIENT SCRIPT
  const createClientScript = useCallback((leadIds, scriptType = 'basic') => {
    const leads = data.leads.filter(lead => leadIds.includes(lead.id));
    
    const script = `
// Client Script for ${leadIds.length} Leads
// Generated on ${new Date().toLocaleString()}

const leads = ${JSON.stringify(leads, null, 2)};

// Example script template
leads.forEach(lead => {
  console.log(\`Processing lead: \${lead.firstName} \${lead.lastName}\`);
  // Add your custom logic here
});

export default leads;
    `;
    
    return {
      success: true,
      script,
      message: `Client script generated for ${leadIds.length} leads`
    };
  }, [data.leads]);

  // Bulk operations
  const bulkUpdateLeads = useCallback((leadIds, updates) => {
    const currentLeads = data.leads || [];
    const newLeads = currentLeads.map(lead => 
      leadIds.includes(lead.id) ? { ...lead, ...updates, updatedAt: new Date().toISOString() } : lead
    );
    updateData('leads', newLeads);
    
    return {
      success: true,
      message: `${leadIds.length} leads updated successfully`
    };
  }, [data.leads, updateData]);

  const bulkDeleteLeads = useCallback((leadIds) => {
    const currentLeads = data.leads || [];
    const newLeads = currentLeads.filter(lead => !leadIds.includes(lead.id));
    updateData('leads', newLeads);
    
    return {
      success: true,
      message: `${leadIds.length} leads deleted successfully`
    };
  }, [data.leads, updateData]);

  // Contact specific operations
  const bulkUpdateContacts = useCallback((contactIds, updates) => {
    const currentContacts = data.contacts || [];
    const newContacts = currentContacts.map(contact => 
      contactIds.includes(contact.id) ? { ...contact, ...updates, updatedAt: new Date().toISOString() } : contact
    );
    updateData('contacts', newContacts);
  }, [data.contacts, updateData]);

  const bulkDeleteContacts = useCallback((contactIds) => {
    const currentContacts = data.contacts || [];
    const newContacts = currentContacts.filter(contact => !contactIds.includes(contact.id));
    updateData('contacts', newContacts);
  }, [data.contacts, updateData]);

  const fetchLeads = useCallback(() => {
    setLoading(true);
    try {
      const storedLeads = localStorage.getItem('crm_leads');
      const leadsData = storedLeads ? JSON.parse(storedLeads) : initialData.leads;
      setData(prev => ({ ...prev, leads: leadsData }));
    } catch (error) {
      console.error('Error fetching leads:', error);
      setData(prev => ({ ...prev, leads: initialData.leads }));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContacts = useCallback(() => {
    setLoading(true);
    try {
      const storedContacts = localStorage.getItem('crm_contacts');
      const contactsData = storedContacts ? JSON.parse(storedContacts) : initialData.contacts;
      setData(prev => ({ ...prev, contacts: contactsData }));
    } catch (error) {
      console.error('Error fetching contacts:', error);
      setData(prev => ({ ...prev, contacts: initialData.contacts }));
    } finally {
      setLoading(false);
    }
  }, []);

  const value = { 
    data, 
    updateData, 
    addDataItem,
    updateDataItem,
    deleteDataItem,
    bulkUpdateLeads,
    bulkDeleteLeads,
    bulkUpdateContacts,
    bulkDeleteContacts,
    convertLead,
    bulkConvertLeads,
    syncLeadToContact,
    manageLeadTags,
    deduplicateLeads,
    approveLeads,
    addLeadsToCampaign,
    createClientScript,
    leads: data.leads,
    contacts: data.contacts,
    accounts: data.accounts,
    campaigns: data.campaigns,
    autoresponders: data.autoresponders,
    drafts: data.drafts,
    loading,
    fetchLeads,
    fetchContacts,
    fetchData
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};