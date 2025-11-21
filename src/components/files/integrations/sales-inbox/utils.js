// Mock data for sales inbox emails
export const mockEmails = [
  {
    id: 1,
    from: "john.ceo@techcorp.com",
    fromName: "John Smith",
    subject: "Enterprise Demo Request - Urgent",
    preview:
      "We're evaluating CRM solutions and would like to schedule a demo...",
    body: "Hi Team,\n\nWe're currently evaluating CRM solutions for our 200-person sales team and were impressed by your platform. We'd like to schedule a comprehensive demo of your enterprise features.\n\nBest regards,\nJohn Smith\nCEO, TechCorp Inc",
    date: new Date().toISOString(),
    read: false,
    important: true,
    hasAttachment: true,
    priority: "high",
    relatedTo: { type: "lead", id: "lead-1", name: "TechCorp Enterprise" },
    labels: ["demo", "urgent"],
  },
  {
    id: 2,
    from: "sarah.j@startup.io",
    fromName: "Sarah Johnson",
    subject: "Contract Renewal Discussion",
    preview:
      "Following up on our call yesterday about the annual contract renewal...",
    body: "Hi,\n\nFollowing up on our call yesterday, I've reviewed the renewal terms with our team. We'd like to discuss the enterprise support package and potential volume discounts.\n\nCould we schedule a brief call this week?\n\nThanks,\nSarah",
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: true,
    important: false,
    hasAttachment: false,
    priority: "medium",
    relatedTo: { type: "deal", id: "deal-1", name: "Startup.io Renewal" },
  },
  {
    id: 3,
    from: "mike.rodriguez@company.com",
    fromName: "Mike Rodriguez",
    subject: "Technical Support: Integration Issue",
    preview:
      "We're experiencing issues with the API integration when syncing user data...",
    body: "Hello,\n\nWe're experiencing 500 errors when trying to sync our user data through your API. The integration was working fine until yesterday.\n\nCan you please look into this urgently?\n\nThanks,\nMike",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: true,
    important: true,
    hasAttachment: true,
    priority: "high",
    relatedTo: { type: "account", id: "account-1", name: "Company Inc" },
  },
];
