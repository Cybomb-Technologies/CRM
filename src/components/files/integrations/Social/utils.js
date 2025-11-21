// Mock data and utility functions for Social integration

export const socialPlatforms = [
  {
    id: "twitter",
    name: "Twitter",
    icon: "Twitter",
    color: "text-blue-400",
    bgColor: "bg-blue-400",
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: "Facebook",
    color: "text-blue-600",
    bgColor: "bg-blue-600",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: "Linkedin",
    color: "text-blue-700",
    bgColor: "bg-blue-700",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: "Instagram",
    color: "text-pink-500",
    bgColor: "bg-pink-500",
  },
];

export const mockSocialPosts = [
  {
    id: 1,
    platform: "twitter",
    username: "@tech_entrepreneur",
    content:
      "Just integrated @CloudCRM with our sales process. The automation features are saving us hours each week!",
    timestamp: "1 hour ago",
    engagement: { likes: 34, retweets: 12, replies: 8 },
    sentiment: "positive",
    potentialLead: false,
  },
  {
    id: 2,
    platform: "linkedin",
    username: "Enterprise Sales Director",
    content:
      "Evaluating CRM platforms for our global sales team. Looking for strong social integration and lead tracking.",
    timestamp: "3 hours ago",
    engagement: { likes: 28, comments: 15 },
    sentiment: "neutral",
    potentialLead: true,
  },
];

export const sentimentColors = {
  positive: "bg-green-100 text-green-800 border-green-200",
  negative: "bg-red-100 text-red-800 border-red-200",
  neutral: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

export const formatEngagement = (engagement, platform) => {
  if (platform === "twitter") {
    return `${engagement.likes} Likes • ${engagement.retweets} RTs • ${engagement.replies} Replies`;
  } else if (platform === "linkedin") {
    return `${engagement.likes} Likes • ${engagement.comments} Comments`;
  } else if (platform === "facebook") {
    return `${engagement.likes} Likes • ${engagement.comments} Comments • ${engagement.shares} Shares`;
  }
  return "";
};

// Calculate social metrics
export const calculateMetrics = (posts) => {
  const totalMentions = posts.length;
  const positiveMentions = posts.filter(
    (p) => p.sentiment === "positive"
  ).length;
  const potentialLeads = posts.filter((p) => p.potentialLead).length;

  return {
    totalMentions,
    engagementRate: Math.round((positiveMentions / totalMentions) * 100),
    potentialLeads,
    responseRate: 92, // Mock response rate
  };
};
