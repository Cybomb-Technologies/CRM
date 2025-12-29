// src/contexts/DataContext.jsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useAuth } from "./AuthContext";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

const initialData = {
  leads: [
    {
      id: "1",
      firstName: "Sarah",
      lastName: "Johnson",
      company: "Tech Corp",
      email: "sarah@techcorp.com",
      phone: "+1 234 567 8900",
      leadStatus: "New",
      leadSource: "Website",
      industry: "Technology",
      title: "CTO",
      isConverted: false,
      isJunk: false,
      isQualified: true,
      isLocked: false,
      isUnsubscribed: false,
      isUnread: true,
      tags: ["hot", "enterprise"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      firstName: "Michael",
      lastName: "Chen",
      company: "Innovation Labs",
      email: "michael@innovationlabs.com",
      phone: "+1 234 567 8901",
      leadStatus: "Contacted",
      leadSource: "Referral",
      industry: "R&D",
      title: "Head of Research",
      isConverted: true,
      convertedToContactId: "2_contact",
      convertedToAccountId: "2",
      conversionDate: new Date().toISOString(),
      isJunk: false,
      isQualified: true,
      isLocked: false,
      isUnsubscribed: false,
      isUnread: false,
      tags: ["warm"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  accounts: [
    {
      id: "1",
      name: "Tech Corp",
      website: "techcorp.com",
      phone: "+1 234 567 8900",
      industry: "Technology",
      contacts: 1,
      email: "info@techcorp.com",
      type: "Customer",
      employees: 250,
      annualRevenue: 50000000,
      billingAddress: {
        street: "123 Tech Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA",
      },
      shippingAddress: {
        street: "123 Tech Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA",
      },
      description:
        "Leading technology company specializing in enterprise software solutions.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      name: "Innovation Labs",
      website: "innovationlabs.com",
      phone: "+1 234 567 8901",
      industry: "R&D",
      contacts: 1,
      email: "contact@innovationlabs.com",
      type: "Partner",
      employees: 120,
      annualRevenue: 25000000,
      billingAddress: {
        street: "456 Innovation Ave",
        city: "Boston",
        state: "MA",
        zipCode: "02108",
        country: "USA",
      },
      shippingAddress: {
        street: "456 Innovation Ave",
        city: "Boston",
        state: "MA",
        zipCode: "02108",
        country: "USA",
      },
      description:
        "Research and development company focused on cutting-edge technologies.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      name: "Global Solutions Inc",
      website: "globalsolutions.com",
      phone: "+1 234 567 8902",
      industry: "Consulting",
      contacts: 0,
      email: "info@globalsolutions.com",
      type: "Prospect",
      employees: 500,
      annualRevenue: 120000000,
      billingAddress: {
        street: "789 Global Blvd",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      shippingAddress: {
        street: "789 Global Blvd",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
      },
      description:
        "International consulting firm providing business transformation services.",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  contacts: [
    {
      id: "2_contact",
      firstName: "Michael",
      lastName: "Chen",
      name: "Michael Chen",
      email: "michael@innovationlabs.com",
      phone: "+1 234 567 8901",
      mobile: "+1 234 567 8998",
      accountId: "2",
      accountName: "Innovation Labs",
      title: "Head of Research",
      department: "R&D",
      leadSource: "Referral",
      reportsTo: "",
      mailingAddress: {
        street: "456 Innovation Ave",
        city: "Boston",
        state: "MA",
        zipCode: "02108",
        country: "USA",
      },
      otherAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      description:
        "Leads research initiatives and technology evaluation. Converted from lead on " +
        new Date().toLocaleDateString(),
      assistant: "",
      assistantPhone: "",
      emailOptOut: false,
      convertedFromLead: "2",
      leadConversionDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "3",
      firstName: "Jennifer",
      lastName: "Rodriguez",
      name: "Jennifer Rodriguez",
      email: "jennifer@techcorp.com",
      phone: "+1 234 567 8903",
      mobile: "+1 234 567 8999",
      accountId: "1",
      accountName: "Tech Corp",
      title: "Sales Director",
      department: "Sales",
      leadSource: "Website",
      reportsTo: "",
      mailingAddress: {
        street: "123 Tech Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA",
      },
      otherAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      description:
        "Sales director with 10+ years of experience in enterprise software.",
      assistant: "Lisa Thompson",
      assistantPhone: "+1 234 567 8910",
      emailOptOut: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  deals: {
    qualification: [
      {
        id: "1",
        title: "Enterprise Software License",
        company: "Tech Corp",
        contactId: "1",
        contactName: "Sarah Johnson",
        value: 45000,
        probability: 30,
        stage: "qualification",
        closeDate: new Date(2025, 11, 15).toISOString(),
        owner: "John Doe",
        description: "Enterprise CRM license for 250 users",
        tags: ["enterprise", "software"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Cloud Migration Project",
        company: "Innovation Labs",
        contactId: "2_contact",
        contactName: "Michael Chen",
        value: 78000,
        probability: 25,
        stage: "qualification",
        closeDate: new Date(2025, 11, 20).toISOString(),
        owner: "Jane Smith",
        sourceLeadId: "2",
        description: "Full cloud infrastructure migration",
        tags: ["cloud", "migration"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    "needs-analysis": [
      {
        id: "3",
        title: "Marketing Automation Suite",
        company: "Growth Solutions",
        contactId: "3",
        contactName: "Jennifer Rodriguez",
        value: 32000,
        probability: 45,
        stage: "needs-analysis",
        closeDate: new Date(2025, 11, 10).toISOString(),
        owner: "John Doe",
        description: "Complete marketing automation platform",
        tags: ["marketing", "automation"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    "value-proposition": [
      {
        id: "4",
        title: "CRM Implementation",
        company: "Sales Pro Inc",
        contactId: "4",
        contactName: "David Wilson",
        value: 95000,
        probability: 60,
        stage: "value-proposition",
        closeDate: new Date(2025, 11, 5).toISOString(),
        owner: "Jane Smith",
        description: "Full CRM implementation with training",
        tags: ["crm", "implementation"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    "identify-decision-makers": [],
    "proposal-price-quote": [
      {
        id: "5",
        title: "Analytics Platform",
        company: "Data Insights",
        contactId: "5",
        contactName: "Lisa Brown",
        value: 52000,
        probability: 75,
        stage: "proposal-price-quote",
        closeDate: new Date(2025, 10, 28).toISOString(),
        owner: "John Doe",
        description: "Advanced analytics and reporting platform",
        tags: ["analytics", "reporting"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    "negotiation-review": [
      {
        id: "6",
        title: "E-commerce Solution",
        company: "Retail Pro",
        contactId: "6",
        contactName: "Alex Thompson",
        value: 68000,
        probability: 85,
        stage: "negotiation-review",
        closeDate: new Date(2025, 10, 15).toISOString(),
        owner: "Jane Smith",
        description: "Complete e-commerce platform implementation",
        tags: ["ecommerce", "platform"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    "closed-won": [
      {
        id: "7",
        title: "Mobile App Development",
        company: "Startup XYZ",
        contactId: "7",
        contactName: "Maria Garcia",
        value: 45000,
        probability: 100,
        stage: "closed-won",
        closeDate: new Date(2025, 9, 20).toISOString(),
        owner: "John Doe",
        description: "Custom mobile application development",
        tags: ["mobile", "development"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    "closed-lost": [
      {
        id: "8",
        title: "Legacy System Upgrade",
        company: "Old Corp",
        contactId: "8",
        contactName: "Robert Kim",
        value: 120000,
        probability: 0,
        stage: "closed-lost",
        closeDate: new Date(2025, 8, 10).toISOString(),
        owner: "Jane Smith",
        description: "Legacy system modernization project",
        tags: ["legacy", "upgrade"],
        lostReason: "Budget constraints",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    "closed-lost-to-competition": [
      {
        id: "9",
        title: "AI Implementation",
        company: "Tech Giant Inc",
        contactId: "9",
        contactName: "Sarah Williams",
        value: 200000,
        probability: 0,
        stage: "closed-lost-to-competition",
        closeDate: new Date(2025, 7, 15).toISOString(),
        owner: "John Doe",
        description: "Enterprise AI implementation project",
        tags: ["ai", "enterprise"],
        lostReason: "Competitor offered better pricing",
        competitor: "AI Solutions Co",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
  },
  activities: [
    {
      id: "1",
      title: "Follow up with Sarah Johnson",
      type: "Call",
      dueDate: "2025-11-10",
      status: "Pending",
      assignedTo: "John Doe",
      relatedTo: "Lead: 1",
    },
    {
      id: "2",
      title: "Prepare proposal for Tech Corp",
      type: "Task",
      dueDate: "2025-11-11",
      status: "Completed",
      assignedTo: "John Doe",
      relatedTo: "Deal: 1",
    },
    {
      id: "3",
      title: "Meeting with Innovation Labs",
      type: "Meeting",
      dueDate: "2025-11-12",
      status: "Pending",
      assignedTo: "Jane Smith",
      relatedTo: "Deal: 2",
    },
  ],
  team: [
    {
      id: "1",
      name: "Jane Smith",
      email: "jane@company.com",
      role: "Admin",
      status: "Active",
    },
    {
      id: "2",
      name: "Peter Jones",
      email: "peter@company.com",
      role: "Sales Manager",
      status: "Active",
    },
    {
      id: "3",
      name: "Mike Williams",
      email: "mike@company.com",
      role: "Sales Rep",
      status: "Inactive",
    },
  ],
  tickets: [
    {
      id: "1",
      subject: "Cannot login to portal",
      contact: "Alex Green",
      priority: "High",
      status: "Open",
      created: "2025-11-05",
    },
    {
      id: "2",
      subject: "Invoice discrepancy",
      contact: "Maria Rodriguez",
      priority: "Medium",
      status: "In Progress",
      created: "2025-11-04",
    },
  ],
  products: [
    {
      id: "1",
      name: "Standard CRM License",
      sku: "CRM-STD-01",
      price: 50.0,
      category: "Software",
    },
    {
      id: "2",
      name: "Premium Support Package",
      sku: "SUP-PREM-YR",
      price: 250.0,
      category: "Service",
    },
  ],
  quotes: [
    {
      id: "1",
      quoteNumber: "Q-2025-001",
      deal: "Enterprise Software License",
      total: 45000,
      status: "Sent",
    },
    {
      id: "2",
      quoteNumber: "Q-2025-002",
      deal: "Marketing Automation Suite",
      total: 32000,
      status: "Draft",
    },
  ],
  campaigns: [
    {
      id: "1",
      campaignName: "Q4 Product Launch",
      status: "Active",
      startDate: "2025-10-01",
      endDate: "2025-12-31",
      type: "Email",
      members: [],
      activities: [
        {
          id: "activity_1",
          title: "Send Welcome Email to New Members",
          type: "Email",
          status: "Completed",
          priority: "High",
          dueDate: "2025-11-20",
          assignedTo: "John Doe",
          description:
            "Send personalized welcome email to all new campaign members",
          relatedTo: "Campaign: Q4 Product Launch",
          createdAt: "2025-11-15T10:00:00Z",
          updatedAt: "2025-11-16T14:30:00Z",
          createdBy: "Jane Smith",
        },
        {
          id: "activity_2",
          title: "Follow-up Call with Enterprise Leads",
          type: "Call",
          status: "In Progress",
          priority: "Medium",
          dueDate: "2025-11-25",
          assignedTo: "Mike Johnson",
          description:
            "Call enterprise leads to discuss product features and schedule demos",
          relatedTo: "Campaign: Q4 Product Launch",
          createdAt: "2025-11-18T09:15:00Z",
          updatedAt: "2025-11-18T09:15:00Z",
          createdBy: "John Doe",
        },
      ],
      expectedResponse: 15,
    },
    {
      id: "2",
      campaignName: "Holiday Promotion",
      status: "Planning",
      startDate: "2025-11-15",
      endDate: "2025-12-25",
      type: "Social Media",
      members: [],
      activities: [],
      expectedResponse: 20,
    },
  ],
  autoresponders: [
    { id: "1", name: "Welcome Series", trigger: "New Lead", status: "Active" },
    {
      id: "2",
      name: "Follow-up Sequence",
      trigger: "Lead Created",
      status: "Active",
    },
  ],
  drafts: [
    {
      id: "1",
      type: "email",
      subject: "Welcome to our platform",
      content: "Dear [Name],...",
      createdAt: new Date().toISOString(),
    },
    {
      id: "2",
      type: "campaign",
      name: "Summer Campaign Draft",
      content: {},
      createdAt: new Date().toISOString(),
    },
  ],
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
    drafts: [],
  });
  const [loading, setLoading] = useState(false);

  // Fetch data function
  const fetchData = useCallback(async () => {
    if (user) {
      // 1. Load basic data from localStorage (legacy/mock data)
      const storedData = {};
      Object.keys(initialData).forEach((key) => {
        // Skip products and quotes as we want to fetch them from API
        if (key === 'products' || key === 'quotes') return;

        const item = localStorage.getItem(`crm_${key}`);
        storedData[key] = item ? JSON.parse(item) : initialData[key];
        if (!item) {
          localStorage.setItem(`crm_${key}`, JSON.stringify(initialData[key]));
        }
      });

      // 2. Fetch real products from API
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('crm_token');
        if (token) {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const response = await fetch(`${API_URL}/products?limit=100`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              storedData.products = result.data;
              // Update localStorage to keep it in sync
              localStorage.setItem('crm_products', JSON.stringify(result.data));
            } else {
              // Fallback to local storage if API fails logically
              const item = localStorage.getItem('crm_products');
              storedData.products = item ? JSON.parse(item) : initialData.products;
            }
          } else {
            console.error('Failed to fetch products:', response.status);
            // Fallback
            const item = localStorage.getItem('crm_products');
            storedData.products = item ? JSON.parse(item) : initialData.products;
          }
        } else {
          // No token, fallback
          const item = localStorage.getItem('crm_products');
          storedData.products = item ? JSON.parse(item) : initialData.products;
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback
        const item = localStorage.getItem('crm_products');
        storedData.products = item ? JSON.parse(item) : initialData.products;
      }

      // 3. Fetch real quotes from API
      try {
        const token = localStorage.getItem('token') || localStorage.getItem('crm_token');
        if (token) {
          const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
          const response = await fetch(`${API_URL}/quotes?limit=100`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const result = await response.json();
            if (result.success) {
              storedData.quotes = result.data;
              // Update localStorage to keep it in sync
              localStorage.setItem('crm_quotes', JSON.stringify(result.data));
            } else {
              const item = localStorage.getItem('crm_quotes');
              storedData.quotes = item ? JSON.parse(item) : initialData.quotes;
            }
          } else {
            console.error('Failed to fetch quotes:', response.status);
            const item = localStorage.getItem('crm_quotes');
            storedData.quotes = item ? JSON.parse(item) : initialData.quotes;
          }
        } else {
          const item = localStorage.getItem('crm_quotes');
          storedData.quotes = item ? JSON.parse(item) : initialData.quotes;
        }
      } catch (error) {
        console.error('Error fetching quotes:', error);
        const item = localStorage.getItem('crm_quotes');
        storedData.quotes = item ? JSON.parse(item) : initialData.quotes;
      }

      setData(storedData);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateData = useCallback((key, newData) => {
    console.log(`🔄 DataContext: updateData called for key: ${key}`, newData);
    localStorage.setItem(`crm_${key}`, JSON.stringify(newData));
    setData((prevData) => ({
      ...prevData,
      [key]: newData,
    }));
  }, []);

  const addDataItem = useCallback(
    (key, item, stage = null) => {
      console.log(`➕ DataContext: addDataItem called for key: ${key}`, item);

      const currentData = data[key] || [];

      if (Array.isArray(currentData)) {
        const newData = [item, ...currentData];
        updateData(key, newData);
      } else {
        // For deals object structure
        const newData = { ...currentData };
        const targetStage = stage || item.stage || "qualification";

        if (!newData[targetStage]) {
          newData[targetStage] = [];
        }
        newData[targetStage] = [item, ...newData[targetStage]];
        updateData(key, newData);
      }
    },
    [data, updateData]
  );

  const updateDataItem = useCallback(
    (key, itemId, updatedItem, stage = null) => {
      console.log(
        `✏️ DataContext: updateDataItem called for key: ${key}, id: ${itemId}`,
        updatedItem
      );

      const currentData = data[key] || [];

      if (Array.isArray(currentData)) {
        const newData = currentData.map((item) =>
          item.id === itemId
            ? { ...item, ...updatedItem, updatedAt: new Date().toISOString() }
            : item
        );
        updateData(key, newData);
      } else {
        // For deals object structure
        const newData = { ...currentData };
        const targetStage = stage || updatedItem.stage;

        Object.keys(newData).forEach((stageKey) => {
          newData[stageKey] = newData[stageKey].map((item) =>
            item.id === itemId
              ? { ...item, ...updatedItem, updatedAt: new Date().toISOString() }
              : item
          );
        });
        updateData(key, newData);
      }
    },
    [data, updateData]
  );

  const deleteDataItem = useCallback(
    (key, itemId) => {
      console.log(
        `🗑️ DataContext: deleteDataItem called for key: ${key}, id: ${itemId}`
      );

      const currentData = data[key] || [];

      if (Array.isArray(currentData)) {
        const newData = currentData.filter((item) => item.id !== itemId);
        updateData(key, newData);
      } else {
        // For deals object structure
        const newData = { ...currentData };
        Object.keys(newData).forEach((stage) => {
          newData[stage] = newData[stage].filter((item) => item.id !== itemId);
        });
        updateData(key, newData);
      }
    },
    [data, updateData]
  );

  // ACCOUNT MANAGEMENT FUNCTIONS

  // Bulk delete accounts with associated contacts
  const bulkDeleteAccounts = useCallback(
    (accountIds) => {
      const currentAccounts = data.accounts || [];
      const currentContacts = data.contacts || [];

      // Delete accounts
      const newAccounts = currentAccounts.filter(
        (account) => !accountIds.includes(account.id)
      );

      // Also delete associated contacts
      const newContacts = currentContacts.filter(
        (contact) => !accountIds.includes(contact.accountId)
      );

      updateData("accounts", newAccounts);
      updateData("contacts", newContacts);

      return {
        success: true,
        message: `${accountIds.length} accounts deleted successfully`,
      };
    },
    [data.accounts, data.contacts, updateData]
  );

  // Update account contact count
  const updateAccountContactCount = useCallback(
    (accountId) => {
      const currentContacts = data.contacts || [];
      const contactCount = currentContacts.filter(
        (contact) => contact.accountId === accountId
      ).length;

      const currentAccounts = data.accounts || [];
      const newAccounts = currentAccounts.map((account) =>
        account.id === accountId
          ? {
            ...account,
            contacts: contactCount,
            updatedAt: new Date().toISOString(),
          }
          : account
      );

      updateData("accounts", newAccounts);
    },
    [data.accounts, data.contacts, updateData]
  );

  // Get accounts with contact count
  const getAccountsWithContactCount = useCallback(() => {
    const currentAccounts = data.accounts || [];
    const currentContacts = data.contacts || [];

    return currentAccounts.map((account) => ({
      ...account,
      contacts: currentContacts.filter(
        (contact) => contact.accountId === account.id
      ).length,
    }));
  }, [data.accounts, data.contacts]);

  // ENHANCED LEAD CONVERSION WITH DEAL CREATION
  const convertLead = useCallback(
    (leadId, dealData = {}) => {
      console.log(
        `🔄 DataContext: convertLead called for leadId: ${leadId}`,
        dealData
      );

      const lead = data.leads.find((l) => l.id === leadId);
      if (!lead) return { success: false, message: "Lead not found" };

      // Check if account already exists
      let account = data.accounts.find((acc) => acc.name === lead.company);

      // If account doesn't exist, create it
      if (!account) {
        account = {
          id: Date.now().toString(),
          name: lead.company,
          website: lead.website || "",
          phone: lead.phone,
          industry: lead.industry,
          email: lead.email,
          contacts: 1,
          type: "Customer",
          employees: lead.numberOfEmployees || 0,
          annualRevenue: lead.annualRevenue || 0,
          billingAddress: {
            street: lead.streetAddress || "",
            city: lead.city || "",
            state: lead.state || "",
            zipCode: lead.zipCode || "",
            country: lead.country || "",
          },
          shippingAddress: {
            street: lead.streetAddress || "",
            city: lead.city || "",
            state: lead.state || "",
            zipCode: lead.zipCode || "",
            country: lead.country || "",
          },
          description:
            lead.description ||
            `Account created from lead conversion on ${new Date().toLocaleDateString()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        addDataItem("accounts", account);
      } else {
        // Update existing account contact count
        updateAccountContactCount(account.id);
      }

      // Create contact from lead
      const contact = {
        id: Date.now().toString() + "_contact",
        firstName: lead.firstName,
        lastName: lead.lastName,
        name: `${lead.firstName} ${lead.lastName}`,
        email: lead.email,
        phone: lead.phone,
        mobile: lead.mobile || "",
        accountId: account.id,
        accountName: account.name,
        title: lead.title || "",
        department: "",
        leadSource: lead.leadSource,
        reportsTo: "",
        mailingAddress: {
          street: lead.streetAddress || "",
          city: lead.city || "",
          state: lead.state || "",
          zipCode: lead.zipCode || "",
          country: lead.country || "",
        },
        otherAddress: {
          street: "",
          city: "",
          state: "",
          zipCode: "",
          country: "",
        },
        description:
          lead.description ||
          `Converted from lead on ${new Date().toLocaleDateString()}`,
        assistant: "",
        assistantPhone: "",
        emailOptOut: lead.emailOptOut || false,
        convertedFromLead: leadId,
        leadConversionDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addDataItem("contacts", contact);

      // ENHANCED: Create opportunity from qualified lead with better logic
      let opportunity = null;
      if (lead.leadStatus === "Qualified" || lead.isQualified) {
        const calculateDealValue = (lead) => {
          if (lead.annualRevenue) {
            return Math.round(lead.annualRevenue * 0.1); // 10% of annual revenue
          }
          return lead.numberOfEmployees ? lead.numberOfEmployees * 500 : 10000; // $500 per employee or $10k default
        };

        const calculateProbability = (lead) => {
          if (lead.leadStatus === "Qualified") return 40;
          if (lead.tags?.includes("hot")) return 50;
          return 20;
        };

        opportunity = {
          id: `deal_${Date.now()}`,
          title: `${lead.company} - ${lead.productInterest || "Product"}`,
          company: lead.company,
          contactId: contact.id,
          contactName: contact.name,
          accountId: account.id,
          accountName: account.name,
          value: calculateDealValue(lead),
          probability: calculateProbability(lead),
          stage: "qualification",
          closeDate: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(),
          owner: user?.name || "Current User",
          description:
            lead.description ||
            `Opportunity created from converted lead: ${lead.firstName} ${lead.lastName}`,
          sourceLeadId: leadId,
          leadSource: lead.leadSource,
          industry: lead.industry,
          tags: lead.tags || [],
          ...dealData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        console.log(
          `🎯 DataContext: AUTO-CREATING deal from lead conversion`,
          opportunity
        );
        addDataItem("deals", opportunity, "qualification");
      }

      // Mark lead as converted
      const updatedLeads = data.leads.map((l) =>
        l.id === leadId
          ? {
            ...l,
            isConverted: true,
            convertedToContactId: contact.id,
            convertedToAccountId: account.id,
            conversionDate: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
          : l
      );
      updateData("leads", updatedLeads);

      return {
        success: true,
        message: "Lead converted successfully",
        contact,
        account,
        opportunity,
      };
    },
    [data, addDataItem, updateData, updateAccountContactCount, user]
  );

  // BULK LEAD CONVERSION
  const bulkConvertLeads = useCallback(
    (leadIds) => {
      const results = leadIds.map((leadId) => convertLead(leadId));
      const successful = results.filter((result) => result.success);
      const failed = results.filter((result) => !result.success);

      return {
        success: successful.length > 0,
        message: `${successful.length} leads converted successfully${failed.length > 0 ? `, ${failed.length} failed` : ""
          }`,
        successful,
        failed,
      };
    },
    [convertLead]
  );

  // APPROVE LEADS WITH CONVERSION FUNCTIONALITY
  const approveLeads = useCallback(
    (leadIds, dealData = {}) => {
      console.log(
        `✅ DataContext: approveLeads called for leadIds:`,
        leadIds,
        dealData
      );

      const currentLeads = data.leads || [];
      const results = [];

      leadIds.forEach((leadId) => {
        const lead = currentLeads.find((l) => l.id === leadId);
        if (!lead) {
          results.push({ success: false, message: `Lead ${leadId} not found` });
          return;
        }

        try {
          // Check if account already exists
          let account = data.accounts.find((acc) => acc.name === lead.company);

          // If account doesn't exist, create it
          if (!account) {
            account = {
              id: `account_${Date.now()}_${leadId}`,
              name: lead.company,
              website: lead.website || "",
              phone: lead.phone,
              industry: lead.industry,
              email: lead.email,
              contacts: 1,
              type: "Customer",
              employees: lead.numberOfEmployees || 0,
              annualRevenue: lead.annualRevenue || 0,
              billingAddress: {
                street: lead.streetAddress || "",
                city: lead.city || "",
                state: lead.state || "",
                zipCode: lead.zipCode || "",
                country: lead.country || "",
              },
              shippingAddress: {
                street: lead.streetAddress || "",
                city: lead.city || "",
                state: lead.state || "",
                zipCode: lead.zipCode || "",
                country: lead.country || "",
              },
              description:
                lead.description ||
                `Account created from approved lead on ${new Date().toLocaleDateString()}`,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            addDataItem("accounts", account);
          } else {
            // Update existing account contact count
            updateAccountContactCount(account.id);
          }

          // Create contact from lead
          const contact = {
            id: `contact_${Date.now()}_${leadId}`,
            firstName: lead.firstName,
            lastName: lead.lastName,
            name: `${lead.firstName} ${lead.lastName}`,
            email: lead.email,
            phone: lead.phone,
            mobile: lead.mobile || "",
            accountId: account.id,
            accountName: account.name,
            title: lead.title || "",
            department: "",
            leadSource: lead.leadSource,
            reportsTo: "",
            mailingAddress: {
              street: lead.streetAddress || "",
              city: lead.city || "",
              state: lead.state || "",
              zipCode: lead.zipCode || "",
              country: lead.country || "",
            },
            otherAddress: {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
            description:
              lead.description ||
              `Created from approved lead on ${new Date().toLocaleDateString()}`,
            assistant: "",
            assistantPhone: "",
            emailOptOut: lead.emailOptOut || false,
            convertedFromLead: leadId,
            leadConversionDate: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          addDataItem("contacts", contact);

          // Create opportunity from approved lead
          const calculateDealValue = (lead) => {
            if (lead.annualRevenue) {
              return Math.round(lead.annualRevenue * 0.1); // 10% of annual revenue
            }
            return lead.numberOfEmployees
              ? lead.numberOfEmployees * 500
              : 10000; // $500 per employee or $10k default
          };

          const calculateProbability = (lead) => {
            if (lead.leadStatus === "Qualified") return 60; // Higher probability for approved leads
            if (lead.tags?.includes("hot")) return 70;
            return 50; // Default higher probability for approved leads
          };

          const opportunity = {
            id: `deal_approved_${Date.now()}_${leadId}`,
            title: `${lead.company} - Approved Lead Opportunity`,
            company: lead.company,
            contactId: contact.id,
            contactName: contact.name,
            accountId: account.id,
            accountName: account.name,
            value: calculateDealValue(lead),
            probability: calculateProbability(lead),
            stage: "qualification",
            closeDate: new Date(
              Date.now() + 15 * 24 * 60 * 60 * 1000
            ).toISOString(), // 15 days for approved leads
            owner: user?.name || "Current User",
            description:
              lead.description ||
              `Opportunity created from approved lead: ${lead.firstName} ${lead.lastName}`,
            sourceLeadId: leadId,
            leadSource: lead.leadSource,
            industry: lead.industry,
            tags: [...(lead.tags || []), "approved"],
            ...dealData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          console.log(
            `🎯 DataContext: AUTO-CREATING deal from approved lead`,
            opportunity
          );
          addDataItem("deals", opportunity, "qualification");

          // Mark lead as approved and converted
          const updatedLeads = currentLeads.map((l) =>
            l.id === leadId
              ? {
                ...l,
                isApproved: true,
                isConverted: true,
                approvedAt: new Date().toISOString(),
                approvedBy: user?.name || "System",
                convertedToContactId: contact.id,
                convertedToAccountId: account.id,
                conversionDate: new Date().toISOString(),
                leadStatus: "Qualified", // Auto-qualify approved leads
                updatedAt: new Date().toISOString(),
              }
              : l
          );
          updateData("leads", updatedLeads);

          results.push({
            success: true,
            message: `Lead ${lead.firstName} ${lead.lastName} approved and converted successfully`,
            contact,
            account,
            opportunity,
          });
        } catch (error) {
          results.push({
            success: false,
            message: `Error approving lead ${leadId}: ${error.message}`,
          });
        }
      });

      const successful = results.filter((result) => result.success);
      const failed = results.filter((result) => !result.success);

      return {
        success: successful.length > 0,
        message: `${successful.length
          } leads approved and converted successfully${failed.length > 0 ? `, ${failed.length} failed` : ""
          }`,
        successful,
        failed,
      };
    },
    [data, addDataItem, updateData, updateAccountContactCount, user]
  );

  // MANUAL SYNC FUNCTION
  const syncLeadToContact = useCallback(
    (leadId) => {
      const lead = data.leads.find((l) => l.id === leadId);
      const contact = data.contacts.find((c) => c.convertedFromLead === leadId);

      if (!lead || !contact) {
        return { success: false, message: "Lead or contact not found" };
      }

      if (!lead.isConverted) {
        return { success: false, message: "Lead is not converted yet" };
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
            country: lead.country || contact.mailingAddress.country,
          },
          description: lead.description || contact.description,
          emailOptOut: lead.emailOptOut || contact.emailOptOut,
          updatedAt: new Date().toISOString(),
          lastSyncedFromLead: new Date().toISOString(),
        };

        updateDataItem("contacts", contact.id, updatedContact);

        return {
          success: true,
          message: "Lead data synced to contact successfully",
          contact: updatedContact,
        };
      } catch (error) {
        return { success: false, message: "Sync failed: " + error.message };
      }
    },
    [data.leads, data.contacts, updateDataItem]
  );

  // TAG MANAGEMENT
  const manageLeadTags = useCallback(
    (leadIds, tagsToAdd = [], tagsToRemove = []) => {
      const currentLeads = data.leads || [];
      const newLeads = currentLeads.map((lead) => {
        if (leadIds.includes(lead.id)) {
          const currentTags = lead.tags || [];
          const updatedTags = [
            ...currentTags.filter((tag) => !tagsToRemove.includes(tag)),
            ...tagsToAdd.filter((tag) => !currentTags.includes(tag)),
          ];
          return {
            ...lead,
            tags: updatedTags,
            updatedAt: new Date().toISOString(),
          };
        }
        return lead;
      });
      updateData("leads", newLeads);

      return {
        success: true,
        message: `Tags updated for ${leadIds.length} leads`,
      };
    },
    [data.leads, updateData]
  );

  // DEDUPLICATE LEADS
  const deduplicateLeads = useCallback(
    (criteria = ["email", "phone"]) => {
      const currentLeads = data.leads || [];
      const duplicates = [];
      const uniqueLeads = [];
      const seen = new Set();

      currentLeads.forEach((lead) => {
        const key = criteria
          .map((field) => lead[field] || "")
          .join("|")
          .toLowerCase();

        if (key && seen.has(key)) {
          duplicates.push(lead);
        } else {
          if (key) seen.add(key);
          uniqueLeads.push(lead);
        }
      });

      if (duplicates.length > 0) {
        updateData("leads", uniqueLeads);
      }

      return {
        success: true,
        duplicatesFound: duplicates.length,
        duplicates,
        uniqueLeads: uniqueLeads.length,
        message: `Found ${duplicates.length} duplicate leads and removed them`,
      };
    },
    [data.leads, updateData]
  );

  // ADD TO CAMPAIGN
  const addLeadsToCampaign = useCallback(
    (leadIds, campaignId) => {
      const currentCampaigns = data.campaigns || [];
      const campaign = currentCampaigns.find((c) => c.id === campaignId);

      if (!campaign) {
        return {
          success: false,
          message: "Campaign not found",
        };
      }

      const updatedMembers = [...(campaign.members || [])];

      leadIds.forEach((leadId) => {
        const lead = data.leads.find((l) => l.id === leadId);
        if (lead && !updatedMembers.find((member) => member.id === leadId)) {
          updatedMembers.push({
            id: lead.id,
            name: `${lead.firstName} ${lead.lastName}`,
            email: lead.email,
            type: "lead",
            company: lead.company,
            addedDate: new Date().toISOString(),
            responded: false,
            converted: false,
          });
        }
      });

      const updatedCampaign = {
        ...campaign,
        members: updatedMembers,
        updatedAt: new Date().toISOString(),
      };

      const updatedCampaigns = currentCampaigns.map((c) =>
        c.id === campaignId ? updatedCampaign : c
      );

      updateData("campaigns", updatedCampaigns);

      return {
        success: true,
        message: `${leadIds.length} leads added to ${campaign.campaignName}`,
      };
    },
    [data.campaigns, data.leads, updateData]
  );

  // CREATE CLIENT SCRIPT
  const createClientScript = useCallback(
    (leadIds, scriptType = "basic") => {
      const leads = data.leads.filter((lead) => leadIds.includes(lead.id));

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
        message: `Client script generated for ${leadIds.length} leads`,
      };
    },
    [data.leads]
  );

  // DEAL SPECIFIC FUNCTIONS

  // Get all deals as flat array
  const getAllDeals = useCallback(() => {
    const currentDeals = data.deals || {};
    return Object.values(currentDeals).flat();
  }, [data.deals]);

  // Get deals by specific stage
  const getDealsByStage = useCallback(
    (stage) => {
      const currentDeals = data.deals || {};
      return currentDeals[stage] || [];
    },
    [data.deals]
  );

  // Get deal stages configuration
  const getDealStages = useCallback(() => {
    return {
      qualification: "Qualification",
      "needs-analysis": "Needs Analysis",
      "value-proposition": "Value Proposition",
      "identify-decision-makers": "Identify Decision Makers",
      "proposal-price-quote": "Proposal/Price Quote",
      "negotiation-review": "Negotiation/Review",
      "closed-won": "Closed Won",
      "closed-lost": "Closed Lost",
      "closed-lost-to-competition": "Closed Lost to Competition",
    };
  }, []);

  // Move deal between stages
  const moveDealStage = useCallback(
    (dealId, fromStage, toStage) => {
      const currentDeals = data.deals || {};

      // Remove from current stage
      const updatedFromStage = (currentDeals[fromStage] || []).filter(
        (deal) => deal.id !== dealId
      );

      // Get deal data
      const deal = (currentDeals[fromStage] || []).find((d) => d.id === dealId);
      if (!deal) return { success: false, message: "Deal not found" };

      // Update deal with new stage
      const updatedDeal = {
        ...deal,
        stage: toStage,
        updatedAt: new Date().toISOString(),
      };

      // Add to new stage
      const updatedToStage = [updatedDeal, ...(currentDeals[toStage] || [])];

      // Update deals data
      const updatedDeals = {
        ...currentDeals,
        [fromStage]: updatedFromStage,
        [toStage]: updatedToStage,
      };

      updateData("deals", updatedDeals);

      return {
        success: true,
        message: `Deal moved from ${fromStage} to ${toStage}`,
        deal: updatedDeal,
      };
    },
    [data.deals, updateData]
  );

  // Bulk move deals between stages
  const bulkMoveDeals = useCallback(
    (dealIds, fromStage, toStage) => {
      const currentDeals = data.deals || {};
      const results = [];

      dealIds.forEach((dealId) => {
        const result = moveDealStage(dealId, fromStage, toStage);
        results.push(result);
      });

      const successful = results.filter((result) => result.success);
      const failed = results.filter((result) => !result.success);

      return {
        success: successful.length > 0,
        message: `${successful.length} deals moved successfully${failed.length > 0 ? `, ${failed.length} failed` : ""
          }`,
        successful,
        failed,
      };
    },
    [moveDealStage]
  );

  // Update deal probability
  const updateDealProbability = useCallback(
    (dealId, probability) => {
      const allDeals = getAllDeals();
      const deal = allDeals.find((d) => d.id === dealId);

      if (!deal) return { success: false, message: "Deal not found" };

      const updatedDeal = {
        ...deal,
        probability: Math.max(0, Math.min(100, probability)),
        updatedAt: new Date().toISOString(),
      };

      updateDataItem("deals", dealId, updatedDeal, deal.stage);

      return { success: true, deal: updatedDeal };
    },
    [getAllDeals, updateDataItem]
  );

  // Update deal value
  const updateDealValue = useCallback(
    (dealId, value) => {
      const allDeals = getAllDeals();
      const deal = allDeals.find((d) => d.id === dealId);

      if (!deal) return { success: false, message: "Deal not found" };

      const updatedDeal = {
        ...deal,
        value: Math.max(0, value),
        updatedAt: new Date().toISOString(),
      };

      updateDataItem("deals", dealId, updatedDeal, deal.stage);

      return { success: true, deal: updatedDeal };
    },
    [getAllDeals, updateDataItem]
  );

  // Bulk operations for deals
  const bulkUpdateDeals = useCallback(
    (dealIds, updates) => {
      const allDeals = getAllDeals();
      const updatedDeals = allDeals.map((deal) =>
        dealIds.includes(deal.id)
          ? { ...deal, ...updates, updatedAt: new Date().toISOString() }
          : deal
      );

      // Reorganize deals by stage
      const reorganizedDeals = {};
      updatedDeals.forEach((deal) => {
        if (!reorganizedDeals[deal.stage]) {
          reorganizedDeals[deal.stage] = [];
        }
        reorganizedDeals[deal.stage].push(deal);
      });

      updateData("deals", reorganizedDeals);

      return {
        success: true,
        message: `${dealIds.length} deals updated successfully`,
      };
    },
    [getAllDeals, updateData]
  );

  const bulkDeleteDeals = useCallback(
    (dealIds) => {
      const allDeals = getAllDeals();
      const remainingDeals = allDeals.filter(
        (deal) => !dealIds.includes(deal.id)
      );

      // Reorganize remaining deals by stage
      const reorganizedDeals = {};
      remainingDeals.forEach((deal) => {
        if (!reorganizedDeals[deal.stage]) {
          reorganizedDeals[deal.stage] = [];
        }
        reorganizedDeals[deal.stage].push(deal);
      });

      updateData("deals", reorganizedDeals);

      return {
        success: true,
        message: `${dealIds.length} deals deleted successfully`,
      };
    },
    [getAllDeals, updateData]
  );

  const manageDealTags = useCallback(
    (dealIds, tagsToAdd = [], tagsToRemove = []) => {
      const allDeals = getAllDeals();
      const updatedDeals = allDeals.map((deal) => {
        if (dealIds.includes(deal.id)) {
          const currentTags = deal.tags || [];
          const updatedTags = [
            ...currentTags.filter((tag) => !tagsToRemove.includes(tag)),
            ...tagsToAdd.filter((tag) => !currentTags.includes(tag)),
          ];
          return {
            ...deal,
            tags: updatedTags,
            updatedAt: new Date().toISOString(),
          };
        }
        return deal;
      });

      // Reorganize deals by stage
      const reorganizedDeals = {};
      updatedDeals.forEach((deal) => {
        if (!reorganizedDeals[deal.stage]) {
          reorganizedDeals[deal.stage] = [];
        }
        reorganizedDeals[deal.stage].push(deal);
      });

      updateData("deals", reorganizedDeals);

      return {
        success: true,
        message: `Tags updated for ${dealIds.length} deals`,
      };
    },
    [getAllDeals, updateData]
  );

  // Bulk operations for leads
  const bulkUpdateLeads = useCallback(
    (leadIds, updates) => {
      const currentLeads = data.leads || [];
      const newLeads = currentLeads.map((lead) =>
        leadIds.includes(lead.id)
          ? { ...lead, ...updates, updatedAt: new Date().toISOString() }
          : lead
      );
      updateData("leads", newLeads);

      return {
        success: true,
        message: `${leadIds.length} leads updated successfully`,
      };
    },
    [data.leads, updateData]
  );

  const bulkDeleteLeads = useCallback(
    (leadIds) => {
      const currentLeads = data.leads || [];
      const newLeads = currentLeads.filter(
        (lead) => !leadIds.includes(lead.id)
      );
      updateData("leads", newLeads);

      return {
        success: true,
        message: `${leadIds.length} leads deleted successfully`,
      };
    },
    [data.leads, updateData]
  );

  // Contact specific operations
  const bulkUpdateContacts = useCallback(
    (contactIds, updates) => {
      const currentContacts = data.contacts || [];
      const newContacts = currentContacts.map((contact) =>
        contactIds.includes(contact.id)
          ? { ...contact, ...updates, updatedAt: new Date().toISOString() }
          : contact
      );
      updateData("contacts", newContacts);
    },
    [data.contacts, updateData]
  );

  const bulkDeleteContacts = useCallback(
    (contactIds) => {
      const currentContacts = data.contacts || [];
      const newContacts = currentContacts.filter(
        (contact) => !contactIds.includes(contact.id)
      );
      updateData("contacts", newContacts);
    },
    [data.contacts, updateData]
  );

  // Account specific operations
  const bulkUpdateAccounts = useCallback(
    (accountIds, updates) => {
      const currentAccounts = data.accounts || [];
      const newAccounts = currentAccounts.map((account) =>
        accountIds.includes(account.id)
          ? { ...account, ...updates, updatedAt: new Date().toISOString() }
          : account
      );
      updateData("accounts", newAccounts);
    },
    [data.accounts, updateData]
  );

  const fetchLeads = useCallback(() => {
    setLoading(true);
    try {
      const storedLeads = localStorage.getItem("crm_leads");
      const leadsData = storedLeads
        ? JSON.parse(storedLeads)
        : initialData.leads;
      setData((prev) => ({ ...prev, leads: leadsData }));
    } catch (error) {
      console.error("Error fetching leads:", error);
      setData((prev) => ({ ...prev, leads: initialData.leads }));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchContacts = useCallback(() => {
    setLoading(true);
    try {
      const storedContacts = localStorage.getItem("crm_contacts");
      const contactsData = storedContacts
        ? JSON.parse(storedContacts)
        : initialData.contacts;
      setData((prev) => ({ ...prev, contacts: contactsData }));
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setData((prev) => ({ ...prev, contacts: initialData.contacts }));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAccounts = useCallback(() => {
    setLoading(true);
    try {
      const storedAccounts = localStorage.getItem("crm_accounts");
      const accountsData = storedAccounts
        ? JSON.parse(storedAccounts)
        : initialData.accounts;
      setData((prev) => ({ ...prev, accounts: accountsData }));
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setData((prev) => ({ ...prev, accounts: initialData.accounts }));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDeals = useCallback(() => {
    setLoading(true);
    try {
      const storedDeals = localStorage.getItem("crm_deals");
      const dealsData = storedDeals
        ? JSON.parse(storedDeals)
        : initialData.deals;
      setData((prev) => ({ ...prev, deals: dealsData }));
    } catch (error) {
      console.error("Error fetching deals:", error);
      setData((prev) => ({ ...prev, deals: initialData.deals }));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchQuotes = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('crm_token');
      if (!token) return;

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${API_URL}/quotes?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          updateData("quotes", result.data);
        }
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  }, [updateData]);

  const addQuote = useCallback(async (quoteData) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('crm_token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      console.log(`🚀 Creating Quote at: ${API_URL}/quotes`);
      const response = await fetch(`${API_URL}/quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(quoteData)
      });

      const result = await response.json();
      if (result.success) {
        const newQuote = result.data;
        const currentQuotes = data.quotes || [];
        updateData("quotes", [newQuote, ...currentQuotes]);
        return { success: true, data: newQuote };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Error adding quote:", error);
      return { success: false, message: error.message };
    }
  }, [data.quotes, updateData]);

  const updateQuote = useCallback(async (id, quoteData) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('crm_token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${API_URL}/quotes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(quoteData)
      });

      const result = await response.json();
      if (result.success) {
        const updatedQuote = result.data;
        const currentQuotes = data.quotes || [];
        const updatedQuotes = currentQuotes.map(q => q.id === id ? updatedQuote : q);
        updateData("quotes", updatedQuotes);
        return { success: true, data: updatedQuote };
      } else {
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Error updating quote:", error);
      return { success: false, message: error.message };
    }
  }, [data.quotes, updateData]);

  const deleteQuote = useCallback(async (id) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('crm_token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${API_URL}/quotes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const currentQuotes = data.quotes || [];
        const updatedQuotes = currentQuotes.filter(q => q.id !== id);
        updateData("quotes", updatedQuotes);
        return { success: true };
      } else {
        const result = await response.json();
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Error deleting quote:", error);
      return { success: false, message: error.message };
    }
  }, [data.quotes, updateData]);

  const bulkDeleteQuotes = useCallback(async (ids) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('crm_token');
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

      const response = await fetch(`${API_URL}/quotes/bulk-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ids })
      });

      if (response.ok) {
        const currentQuotes = data.quotes || [];
        const updatedQuotes = currentQuotes.filter(q => !ids.includes(q.id));
        updateData("quotes", updatedQuotes);
        return { success: true };
      } else {
        const result = await response.json();
        return { success: false, message: result.message };
      }
    } catch (error) {
      console.error("Error bulk deleting quotes:", error);
      return { success: false, message: error.message };
    }
  }, [data.quotes, updateData]);

  const value = {
    // Data
    data,
    leads: data.leads,
    contacts: data.contacts,
    accounts: data.accounts,
    deals: data.deals,
    campaigns: data.campaigns,
    autoresponders: data.autoresponders,
    drafts: data.drafts,

    // Core operations
    updateData,
    addDataItem,
    updateDataItem,
    deleteDataItem,

    // Lead operations
    bulkUpdateLeads,
    bulkDeleteLeads,
    convertLead,
    bulkConvertLeads,
    approveLeads, // Enhanced approveLeads function
    syncLeadToContact,
    manageLeadTags,
    deduplicateLeads,
    addLeadsToCampaign,
    createClientScript,

    // Contact operations
    bulkUpdateContacts,
    bulkDeleteContacts,

    // Account operations
    bulkUpdateAccounts,
    bulkDeleteAccounts,
    updateAccountContactCount,
    getAccountsWithContactCount,

    // Deal operations
    moveDealStage,
    bulkMoveDeals,
    updateDealProbability,
    updateDealValue,
    getAllDeals,
    getDealsByStage,
    getDealStages,
    bulkUpdateDeals,
    bulkDeleteDeals,
    manageDealTags,

    // Loading state
    loading,

    // Fetch functions
    fetchLeads,
    fetchContacts,
    fetchAccounts,
    fetchDeals,
    fetchData,
    fetchQuotes,
    addQuote,
    updateQuote,
    deleteQuote,
    bulkDeleteQuotes
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
