export type BusinessMode = "existing" | "new_launch";

export interface OnboardingData {
  businessMode: BusinessMode;
  businessName: string;
  categories: string[];
  country: string;
  city: string;
  website?: string;
}

export interface MarketEntryAnalysis {
  verdict: "strong_opportunity" | "moderate_opportunity" | "saturated";
  verdictLabel: string;
  summary: string;
  pros: string[];
  cons: string[];
  keyPlayersGap: string;
  recommendation: string;
  entryScore: number;
}

export interface AnalysisRequest extends OnboardingData {}

export interface MarketOverview {
  marketSize: string;
  growthRate: string;
  growthPotentialScore: number;
  localOpportunityScore: number;
  demandTrend: TrendPoint[];
  summary: string;
}

export interface TrendPoint {
  month: string;
  value: number;
}

export interface SocialPresence {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  topPlatform?: string;
  activity?: string;
}

export interface SectorSocialSignals {
  dominantPlatform: string;
  keyInfluencerTypes: string[];
  trendingHashtags: string[];
  contentTypesThatWork: string[];
  marketMood: string;
}

export interface Competitor {
  name: string;
  isLocal: boolean;
  type: "local" | "national_chain" | "multinational";
  localInsight?: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  strengths: string[];
  weaknesses: string[];
  missingServices: string[];
  threatScore: number;
  address?: string;
  website?: string;
  category: string;
  socialPresence?: SocialPresence;
}

export interface LocalLandscape {
  localVsMNC: {
    localCount: number;
    mncCount: number;
    summary: string;
    localAdvantage: string;
  };
  dominantPlayers: {
    name: string;
    type: "local" | "national_chain" | "multinational";
    marketShare: string;
    weakness: string;
  }[];
  whiteSpace: string;
  brandOpportunityScore: number;
}

export interface CustomerPersona {
  name: string;
  age: string;
  description: string;
  painPoints: string[];
  emotionalTriggers: string[];
  preferredPlatforms: string[];
  preferredPricing: string;
  trustFactors: string[];
  buyingBehavior: string;
  avatar: string;
}

export interface CustomerPsychology {
  personas: CustomerPersona[];
  topPainPoints: PainPoint[];
  buyingPatterns: string[];
  trustFactors: string[];
  preferredChannels: string[];
}

export interface PainPoint {
  pain: string;
  frequency: string;
  opportunityScore: number;
}

export interface MarketGap {
  title: string;
  description: string;
  audience: string;
  opportunityScore: number;
  type: "service" | "content" | "positioning" | "audience";
  localAngle?: string;
}

export interface SEOAudit {
  overallScore: number;
  pageSpeed: { mobile: number; desktop: number };
  metaIssues: SEOIssue[];
  keywordOpportunities: KeywordOpportunity[];
  technicalIssues: SEOIssue[];
  localSEOScore: number;
  backlinks: { total: number; quality: string };
  contentWeaknesses: SEOIssue[];
  competitorKeywordGaps: string[];
}

export interface SEOIssue {
  issue: string;
  impact: "high" | "medium" | "low";
  fix: string;
}

export interface KeywordOpportunity {
  keyword: string;
  searchVolume: string;
  difficulty: "easy" | "medium" | "hard";
  relevance: number;
}

export interface BrandPositioning {
  usp: string;
  positioningStatement: string;
  taglines: string[];
  premiumAngle: string;
  trustAngle: string;
  differentiationMap: DifferentiationPoint[];
}

export interface DifferentiationPoint {
  dimension: string;
  yourBrand: number;
  competitors: number;
}

export interface ContentStrategy {
  blogPosts: ContentItem[];
  tiktokIdeas: ContentItem[];
  instagramCalendar: ContentItem[];
  youtubeTopics: ContentItem[];
  localSEOContent: ContentItem[];
  viralHooks: string[];
}

export interface ContentItem {
  title: string;
  hook?: string;
  description?: string;
  type?: string;
}

export interface ActionItem {
  title: string;
  description: string;
  priority: "critical" | "high" | "medium";
  timeframe: string;
  priorityScore: number;
  category: string;
}

export interface ActionPlan {
  immediateActions: ActionItem[];
  thirtyDayRoadmap: Milestone[];
  launchStrategy: string[];
  growthStrategy: string[];
  scalingRecommendations: string[];
}

export interface Milestone {
  week: string;
  title: string;
  tasks: string[];
  goal: string;
}

export interface AnalysisResult {
  id: string;
  businessMode?: BusinessMode;
  businessName: string;
  category: string[];
  country: string;
  city: string;
  website?: string;
  createdAt: string;
  marketEntryAnalysis?: MarketEntryAnalysis;
  webSearchResults?: { name: string; snippet: string; url: string; rating?: number; reviewCount?: number; address?: string; source?: string }[];
  marketOverview: MarketOverview;
  competitors: Competitor[];
  sectorSocialSignals?: SectorSocialSignals;
  localLandscape?: LocalLandscape;
  customerPsychology: CustomerPsychology;
  marketGaps: MarketGap[];
  marketSearchSummary?: { summary: string; topSearches: string[] };
  seoAudit?: SEOAudit;
  brandPositioning: BrandPositioning;
  contentStrategy: ContentStrategy;
  actionPlan: ActionPlan;
}
