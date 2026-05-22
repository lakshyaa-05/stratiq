import OpenAI from "openai";

const GROQ_BASE = "https://api.groq.com/openai/v1";
// Primary model: best quality (100k tokens/day free). Fallback: faster with 500k tokens/day free.
const MODEL_PRIMARY = "llama-3.3-70b-versatile";
const MODEL_FALLBACK = "llama-3.1-8b-instant";

function getClient() {
  const key = process.env.GROQ_API_KEY;
  if (!key) throw new Error("GROQ_API_KEY not set in .env.local");
  return new OpenAI({ apiKey: key, baseURL: GROQ_BASE });
}

async function callGroq(
  system: string,
  user: string,
  attempt = 0,
  model = MODEL_PRIMARY
): Promise<Record<string, unknown>> {
  const client = getClient();
  try {
    const res = await client.chat.completions.create({
      model,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.7,
    });
    const text = res.choices[0].message.content || "{}";
    return JSON.parse(text);
  } catch (err) {
    const status = (err as { status?: number }).status;
    const isRateLimit = status === 429 || (status && status >= 500);
    if (!isRateLimit) throw err;

    // On first rate-limit hit with the primary model, switch to the fallback model immediately
    if (attempt === 0 && model === MODEL_PRIMARY) {
      console.warn("Primary model rate-limited, switching to fallback model");
      return callGroq(system, user, 0, MODEL_FALLBACK);
    }

    // Exponential backoff on the current model (up to 3 retries)
    if (attempt < 3) {
      const wait = [4000, 8000, 16000][attempt] ?? 16000;
      await new Promise((r) => setTimeout(r, wait));
      return callGroq(system, user, attempt + 1, model);
    }
    throw err;
  }
}

// ─── Web search for real local businesses ────────────────────────────────────

export interface BusinessResult {
  name: string;
  snippet: string;
  url: string;
  rating?: number;
  reviewCount?: number;
  address?: string;
  isOperational?: boolean;
  source: "google_places" | "duckduckgo";
}

// Maps category slugs → the actual search terms that find businesses on Google/DuckDuckGo.
// Most-specific terms come FIRST so slice(0, N) picks the best ones.
function expandCategoryToKeywords(category: string): string[] {
  const l = category.toLowerCase();

  // Exact slug matches first (most reliable)
  if (l === "visa_agency" || l === "visa agency")
    return ["visa consultant", "immigration consultant", "abroad education consultant", "travel agent", "IELTS coaching center", "student visa agent"];
  if (l === "consultancy")
    return ["business consultant", "management consultant", "visa consultant", "immigration consultant", "consultancy services"];
  if (l === "education")
    return ["coaching institute", "education institute", "tuition center", "IELTS coaching", "study abroad consultant"];
  if (l === "coaching")
    return ["coaching institute", "coaching center", "tuition center", "IELTS coaching", "academy"];
  if (l === "fitness")
    return ["gym", "fitness center", "health club", "yoga center", "sports complex"];
  if (l === "salon")
    return ["salon", "beauty parlour", "hair salon", "spa", "beauty salon"];
  if (l === "restaurant")
    return ["restaurant", "cafe", "dhaba", "food court", "eating place"];
  if (l === "healthcare")
    return ["clinic", "hospital", "medical center", "doctor", "diagnostic center"];
  if (l === "real_estate")
    return ["real estate agent", "property dealer", "housing society", "builder developer"];
  if (l === "accounting")
    return ["chartered accountant", "CA firm", "tax consultant", "accounting services"];
  if (l === "marketing")
    return ["digital marketing agency", "advertising agency", "marketing agency", "PR firm"];
  if (l === "logistics")
    return ["logistics company", "courier service", "transport company", "freight forwarder"];
  if (l === "saas")
    return ["software company", "IT company", "tech startup", "web development"];
  if (l === "ecommerce")
    return ["online store", "ecommerce business", "retail shop", "shopping store"];

  // Fallback: substring matching for any other value
  const kws: string[] = [];
  if (l.includes("visa") || l.includes("immigra") || l.includes("abroad"))
    return ["visa consultant", "immigration consultant", "abroad consultant", "travel agent", "IELTS coaching"];
  if (l.includes("coach") || l.includes("tutor"))
    return ["coaching institute", "coaching center", "tuition center", "academy"];
  if (l.includes("education") || l.includes("school"))
    return ["coaching institute", "education institute", "training institute", "IELTS coaching"];
  if (l.includes("gym") || l.includes("fitness"))
    return ["gym", "fitness center", "health club", "yoga center"];
  if (l.includes("salon") || l.includes("beauty"))
    return ["salon", "beauty parlour", "hair salon", "spa"];
  if (l.includes("restaurant") || l.includes("food") || l.includes("cafe"))
    return ["restaurant", "cafe", "dhaba", "food"];
  if (l.includes("clinic") || l.includes("health") || l.includes("doctor"))
    return ["clinic", "hospital", "medical center", "doctor"];
  if (l.includes("consult"))
    kws.push("consultant", "consultancy services", "advisory firm");

  return kws.length ? kws : [category, `${category} services`, `${category} center`];
}

// Geocodes a city name to lat/lng — tries multiple query forms to handle small towns and villages
async function getCityCoordinates(
  city: string,
  country: string,
  apiKey: string
): Promise<{ lat: number; lng: number } | null> {
  const queries = [
    `${city}, ${country}`,
    `${city} city, ${country}`,
    `${city} town, ${country}`,
    `${city} village, ${country}`,
    city,
  ];
  for (const q of queries) {
    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&key=${apiKey}`,
        { signal: AbortSignal.timeout(6000) }
      );
      if (!res.ok) continue;
      const data = await res.json() as { results: { geometry: { location: { lat: number; lng: number } } }[] };
      const loc = data.results?.[0]?.geometry?.location;
      if (loc) return loc;
    } catch {
      // try next form
    }
  }
  return null;
}

// Nearby search within radius km — finds businesses actually in the city
async function nearbySearch(
  keyword: string,
  lat: number,
  lng: number,
  radiusMeters: number,
  apiKey: string
): Promise<BusinessResult[]> {
  const kw = encodeURIComponent(keyword);
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusMeters}&keyword=${kw}&key=${apiKey}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) return [];
  const data = await res.json() as {
    results: {
      place_id: string;
      name: string;
      business_status?: string;
      rating?: number;
      user_ratings_total?: number;
      vicinity?: string;
    }[];
  };
  return (data.results || [])
    .filter((r) => r.business_status === "OPERATIONAL" || !r.business_status)
    .map((r) => ({
      name: r.name,
      snippet: `${r.vicinity ?? ""} — ${r.rating ?? "N/A"}/5 stars (${r.user_ratings_total ?? 0} reviews)`,
      url: "",
      rating: r.rating,
      reviewCount: r.user_ratings_total,
      address: r.vicinity,
      isOperational: true,
      source: "google_places" as const,
      _placeId: r.place_id,
    }));
}

// Deduplicates and sorts a list of batched nearby-search results
function mergeNearbyResults(
  batches: PromiseSettledResult<BusinessResult[]>[]
): BusinessResult[] {
  const seen = new Set<string>();
  const merged: BusinessResult[] = [];
  for (const batch of batches) {
    if (batch.status !== "fulfilled") continue;
    for (const r of batch.value) {
      const key = (r as BusinessResult & { _placeId?: string })._placeId || r.name.toLowerCase();
      if (!seen.has(key)) { seen.add(key); merged.push(r); }
    }
  }
  merged.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
  return merged;
}

async function googleTextSearch(
  query: string,
  coords: { lat: number; lng: number } | null,
  apiKey: string,
  radiusMeters = 50000
): Promise<BusinessResult[]> {
  const q = encodeURIComponent(query);
  let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${q}&key=${apiKey}`;
  if (coords) url += `&location=${coords.lat},${coords.lng}&radius=${radiusMeters}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
  if (!res.ok) return [];
  const data = await res.json() as {
    results: { place_id?: string; name: string; business_status?: string; rating?: number; user_ratings_total?: number; formatted_address?: string }[];
  };
  return (data.results || [])
    .filter((r) => r.business_status === "OPERATIONAL" || !r.business_status)
    .slice(0, 8)
    .map((r) => ({
      name: r.name,
      snippet: `${r.formatted_address ?? ""} — ${r.rating ?? "N/A"}/5 stars`,
      url: "",
      rating: r.rating,
      reviewCount: r.user_ratings_total,
      address: r.formatted_address,
      isOperational: true,
      source: "google_places" as const,
      _placeId: r.place_id,
    }));
}

async function searchViaGooglePlaces(
  categories: string[],
  city: string,
  country: string,
  apiKey: string
): Promise<BusinessResult[]> {
  const allKeywords = Array.from(
    new Set(categories.flatMap(expandCategoryToKeywords))
  ).slice(0, 8);

  // Step 1: geocode the city
  const coords = await getCityCoordinates(city, country, apiKey);

  // Step 2: Text Search first — more reliable for small Indian towns than Nearby Search
  // Run all keywords in parallel with location bias when available
  const textQueries = allKeywords.map((kw) => `${kw} in ${city}`);
  const textBatches = await Promise.allSettled(
    textQueries.map((q) => googleTextSearch(q, coords, apiKey, 50000))
  );
  const textMerged = mergeNearbyResults(textBatches);
  if (textMerged.length >= 3) return textMerged.slice(0, 12);

  // Step 3: Nearby Search fallback (needs coords)
  if (coords) {
    const batches25 = await Promise.allSettled(
      allKeywords.map((kw) => nearbySearch(kw, coords.lat, coords.lng, 25000, apiKey))
    );
    const merged25 = mergeNearbyResults(batches25);
    if (merged25.length > 0) return merged25.slice(0, 12);

    const batches50 = await Promise.allSettled(
      allKeywords.map((kw) => nearbySearch(kw, coords.lat, coords.lng, 50000, apiKey))
    );
    const merged50 = mergeNearbyResults(batches50);
    if (merged50.length > 0) return merged50.slice(0, 12);
  }

  // Return whatever text search found (even < 3)
  return textMerged.slice(0, 12);
}

// Known directory/aggregator domains — their page titles aren't business names
const DIRECTORY_DOMAINS = [
  "justdial", "sulekha", "indiamart", "yellowpages", "worldplaces",
  "asklaila", "eyesonsites", "india-business-directory", "businesslist",
  "zaubacorp", "tofler", "crunchbase", "linkedin.com/company",
  "tripadvisor", "yelp.com",
];

function cleanDDGTitle(title: string, url: string): string | null {
  // DuckDuckGo hrefs are redirect URLs — decode to get the real domain
  let decodedUrl = url;
  try { decodedUrl = decodeURIComponent(url); } catch {}
  const lowerUrl = decodedUrl.toLowerCase();

  // Skip known aggregator/registry pages
  if (DIRECTORY_DOMAINS.some((d) => lowerUrl.includes(d))) return null;

  let name = title
    .replace(/<[^>]+>/g, "")          // strip HTML tags
    // Decode common HTML entities
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    // Strip "Name | Anything" — pipe usually separates site name or tagline
    .replace(/\s*\|.*$/, "")
    // Strip "Name - SocialSite" suffixes
    .replace(/\s*[-–]\s*(Facebook|Instagram|Twitter|LinkedIn|YouTube|Yelp|TripAdvisor|Google Maps|Maps)\s*$/i, "")
    // Strip "Name - Description" — if the part after " - " is ≥3 words, it's a tagline, strip it
    .replace(/\s+-\s+\S+(\s+\S+){2,}$/i, "")
    // Strip remaining single-word known suffixes after " - "
    .replace(/\s+-\s+(Immigration|Visa|Consultant|Consultancy|Education|Travel|Tours|Services|Agency|Institute|Center|Centre|Company|Business|Profile|Information|Overview|Pvt|Private|Ltd|Limited)\b.*/i, "")
    // Strip trailing "Company Profile" / "Private Limited" without hyphen
    .replace(/\s+(Company Profile|Company Information|Private Limited|Pvt Ltd|Pvt\. Ltd\.?)\s*$/i, "")
    // Strip geographic noise at end: "in Sangrur Punjab India", "Sangrur Punjab India"
    .replace(/\s+in\s+[A-Za-z\s,]+(?:India|Punjab|Haryana|Delhi|Mumbai|UP)\s*$/i, "")
    .replace(/\s*,?\s*[A-Z][a-z]+\s+(?:India|Punjab|Haryana)\s*$/i, "")
    // Strip exclamation / question marks at the end (ad headlines)
    .replace(/[!?]+$/, "")
    .trim();

  // Skip generic directory headings and page-level nav titles
  if (/^(top|best|list of|all|find|search|about us|home|contact|services|welcome|apply|applying|get|getting|how to|why choose)\b/i.test(name)) return null;
  // Skip ad-style headlines ending with action words
  if (/\b(fast|easy|now|today|online|click|start|here|free)\s*$/i.test(name)) return null;
  // Skip pure generic service phrases with no proper noun (1-3 generic words only)
  if (/^(visa|immigration|consultant|consultancy|agency|consultation|coaching|education|travel|services)\s*(services|consultation|consultant|agency|center|centre)?\s*$/i.test(name)) return null;
  // Skip if clearly a sentence (>10 words) after cleaning
  if (name.split(/\s+/).length > 10) return null;

  return name.length > 2 ? name : null;
}

async function fetchDDG(query: string): Promise<{ name: string; snippet: string; url: string }[]> {
  const res = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36",
      Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.5",
    },
    signal: AbortSignal.timeout(8000),
  });
  const html = await res.text();
  const titleRe = /<a[^>]+class="result__a"[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
  const snippetRe = /<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>/gi;
  const raw: { name: string; url: string }[] = [];
  let m: RegExpExecArray | null;
  while ((m = titleRe.exec(html)) !== null && raw.length < 12) {
    const rawName = m[2].replace(/<[^>]+>/g, "").trim();
    if (rawName && m[1]) raw.push({ name: rawName, url: m[1] });
  }
  const snippets: string[] = [];
  while ((m = snippetRe.exec(html)) !== null && snippets.length < 12) {
    snippets.push(m[1].replace(/<[^>]+>/g, "").trim());
  }
  const results: { name: string; snippet: string; url: string }[] = [];
  raw.forEach((r, i) => {
    const cleaned = cleanDDGTitle(r.name, r.url);
    if (cleaned) results.push({ name: cleaned, snippet: snippets[i] || "", url: r.url });
  });
  return results;
}

// Category priority order — more specific/niche categories should drive the search queries.
// Visa/immigration is more searchable than generic "consultancy" in small Indian cities.
const CATEGORY_PRIORITY = [
  "visa_agency", "visa agency", "healthcare", "fitness", "salon", "restaurant",
  "real_estate", "coaching", "education", "accounting", "marketing", "logistics",
  "saas", "ecommerce", "consultancy",
];

function sortCategoriesByPriority(categories: string[]): string[] {
  return [...categories].sort((a, b) => {
    const ai = CATEGORY_PRIORITY.indexOf(a.toLowerCase());
    const bi = CATEGORY_PRIORITY.indexOf(b.toLowerCase());
    return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
  });
}

async function searchViaDuckDuckGo(
  categories: string[],
  city: string,
  country: string
): Promise<BusinessResult[]> {
  // Prioritize more specific/niche categories so the best keywords come first
  const sorted = sortCategoriesByPriority(categories);
  const primaryKws = sorted
    .map((c) => expandCategoryToKeywords(c)[0])
    .filter(Boolean)
    .slice(0, 2);
  const kw0 = primaryKws[0] || "business";
  const kw1 = primaryKws[1] || kw0;

  // Five query styles proven to surface actual business pages in Indian cities
  const queries = [
    `${kw0} ${city} ${country}`,               // basic — returns Facebook pages, business sites
    `${kw1} in ${city} contact`,               // "contact" pushes search to prefer business pages
    `best ${kw0} in ${city}`,                  // curated lists name real businesses
    `${kw0} ${city} reviews`,                  // review pages always list real business names
    `${kw0} ${city} phone number`,             // phone number pages surface local directories
  ];

  const batches = await Promise.allSettled(queries.map((q) => fetchDDG(q)));

  const seen = new Set<string>();
  const merged: BusinessResult[] = [];
  for (const b of batches) {
    if (b.status !== "fulfilled") continue;
    for (const r of b.value) {
      const key = r.name.toLowerCase().trim();
      if (key && !seen.has(key)) {
        seen.add(key);
        merged.push({ ...r, source: "duckduckgo" as const });
      }
    }
  }
  return merged.slice(0, 12);
}

export async function searchLocalBusinesses(
  categories: string[],
  city: string,
  country: string
): Promise<BusinessResult[]> {
  const googleKey = process.env.GOOGLE_API_KEY;
  if (googleKey) {
    try {
      const results = await searchViaGooglePlaces(categories, city, country, googleKey);
      if (results.length > 0) return results;
    } catch {
      // fall through to DuckDuckGo
    }
  }
  try {
    return await searchViaDuckDuckGo(categories, city, country);
  } catch {
    return [];
  }
}

// ─── Context builder ─────────────────────────────────────────────────────────

function buildContext(
  businessName: string,
  categories: string[],
  country: string,
  city: string,
  website?: string
) {
  return `Business: ${businessName}
Category: ${categories.join(", ")}
Country: ${country}
City/Town: ${city}
Website: ${website || "Not provided"}
Date: ${new Date().toLocaleString("en-US", { month: "long", year: "numeric" })}`;
}

// ─── Analysis modules ────────────────────────────────────────────────────────

async function getMarketOverview(ctx: string) {
  return callGroq(
    `You are a market research analyst specialising in Indian regional markets, tier-2/tier-3 cities, and emerging local industries.
Generate a realistic, city-specific market overview — not generic global figures.
For India: use INR (₹) for market size. Reflect local purchasing power, regional demand patterns, and industry-specific trends for the exact city and category given.
Return ONLY valid JSON:
{
  "marketSize": "realistic local/regional market size in ₹ (e.g. '₹45Cr locally', '₹2,400Cr across Punjab')",
  "growthRate": "string like '+14% YoY'",
  "growthPotentialScore": number 1-10,
  "localOpportunityScore": number 1-10,
  "demandTrend": [{"month": "Jan", "value": number 40-100}, ...12 months reflecting real seasonal patterns for this industry],
  "summary": "2-3 sentences on what's specifically driving demand in THIS city/region right now — not generic market commentary"
}`,
    `Generate market overview for:\n${ctx}`
  );
}

async function getCompetitors(
  ctx: string,
  city: string,
  country: string,
  categories: string[],
  webResults: BusinessResult[]
) {
  const fromGooglePlaces = webResults.some((r) => r.source === "google_places");

  // Build the context block passed to the AI
  let webContext = "";
  if (webResults.length === 0) {
    webContext = `\n\nNo live search data available. Use your knowledge of ${city}, ${country} to name 4-6 real or plausible local competitors in the ${categories.join("/")} sector. Be realistic for the city size.`;
  } else if (fromGooglePlaces) {
    const lines = webResults.map((r, i) => {
      let line = `${i + 1}. ${r.name}`;
      if (r.address) line += ` | ${r.address}`;
      if (r.rating) line += ` | ${r.rating}★ ${r.reviewCount ?? 0} reviews`;
      return line;
    }).join("\n");
    webContext = `\n\nVerified Google Maps businesses in ${city} — use exactly these, one entry each:\n${lines}`;
  } else {
    // DuckDuckGo: pass title + snippet so AI can extract real business names from noisy results
    const lines = webResults.map((r, i) => {
      const snippet = r.snippet ? ` | "${r.snippet.slice(0, 100)}"` : "";
      return `${i + 1}. "${r.name}"${snippet}`;
    }).join("\n");
    webContext = `\n\nWeb search results for ${categories.join("/")} businesses near ${city} (some titles may include site names or extra text — extract the actual business name):\n${lines}`;
  }

  return callGroq(
    `You are a competitive intelligence analyst for local Indian markets.
Rules:
- Extract the real business name from each result (strip site names like "| Facebook", "- Company Profile", geographic modifiers like "in Sangrur Punjab India")
- Skip obvious non-business entries (generic directory titles like "Top 10 X in City", "Best X Services")
- Ratings MUST be between 1.0 and 5.0 — never higher
- Fill in realistic details using your knowledge of this city and sector
- Return 4-8 competitors; if fewer real businesses are identifiable, use your India market knowledge to add plausible local ones

Return ONLY valid JSON:
{"competitors": [
  {
    "name": "clean business name",
    "isLocal": true,
    "type": "local" | "national_chain" | "multinational",
    "rating": number between 1.0-5.0,
    "reviewCount": number,
    "priceRange": "realistic INR price range for this service",
    "strengths": ["string", "string", "string"],
    "weaknesses": ["string", "string", "string"],
    "missingServices": ["string", "string"],
    "threatScore": number 1-10,
    "address": "city/area string",
    "website": null,
    "category": "string",
    "localInsight": "one sentence on their standing in this market"
  }
]}`,
    `Analyze competitors for:\n${ctx}${webContext}`
  );
}

// Runs as a separate lightweight call so it never competes with the core 9 modules
async function getSectorSocialSignals(ctx: string) {
  return callGroq(
    `You are a social media analyst. Return ONLY valid JSON:
{"dominantPlatform":"string","keyInfluencerTypes":["string","string","string"],"trendingHashtags":["#tag","#tag","#tag","#tag"],"contentTypesThatWork":["string","string","string"],"marketMood":"1 sentence"}`,
    `Social media landscape for this sector:\n${ctx}`
  );
}

async function getCustomerPsychology(ctx: string) {
  return callGroq(
    `You are a consumer psychology expert. Generate detailed customer insights.
Return ONLY valid JSON:
{
  "personas": [
    {
      "name": "string",
      "age": "string like '28-35'",
      "description": "string 2 sentences",
      "painPoints": ["string", ...3-4],
      "emotionalTriggers": ["string", ...3],
      "preferredPlatforms": ["Instagram", ...],
      "preferredPricing": "string",
      "trustFactors": ["string", ...3],
      "buyingBehavior": "string",
      "avatar": "string emoji"
    }
    ...3 personas
  ],
  "topPainPoints": [{"pain": "string", "frequency": "string", "opportunityScore": number 1-10} ...5],
  "buyingPatterns": ["string", ...4-5],
  "trustFactors": ["string", ...4-5],
  "preferredChannels": ["string", ...4-5]
}`,
    `Generate customer psychology for:\n${ctx}`
  );
}

async function getMarketGaps(ctx: string) {
  return callGroq(
    `You are a market opportunity analyst. Find real unmet needs in this specific locality.
Return ONLY valid JSON:
{
  "searchIntentSummary": "2-3 sentences on what people in this city/area are actually searching for and why their current options fall short",
  "topSearches": ["most common search query 1", "query 2", "query 3", "query 4", "query 5"],
  "gaps": [
    {
      "title": "string",
      "description": "string 2-3 sentences",
      "audience": "string",
      "opportunityScore": number 1-10,
      "type": "service" | "content" | "positioning" | "audience",
      "localAngle": "1 sentence on why THIS specific city/town is underserved here"
    }
    ...6-8 gaps
  ]
}`,
    `Find market gaps for:\n${ctx}`
  );
}

async function getBrandPositioning(ctx: string, businessName: string) {
  return callGroq(
    `You are a brand strategist. Generate premium brand positioning.
Return ONLY valid JSON:
{
  "usp": "string — core unique selling proposition in 1-2 sentences",
  "positioningStatement": "string — full positioning statement",
  "taglines": ["string", ...5 tagline options],
  "premiumAngle": "string",
  "trustAngle": "string",
  "differentiationMap": [
    {"dimension": "string", "yourBrand": number 1-10, "competitors": number 1-10}
    ...6 dimensions: Price, Quality, Speed, Trust, Experience, Innovation
  ]
}`,
    `Generate brand positioning for ${businessName}:\n${ctx}`
  );
}

async function getContentStrategy(ctx: string, businessName: string) {
  return callGroq(
    `You are a content strategist for local Indian businesses. Create platform-specific, locally-resonant content ideas — Reels hooks, WhatsApp content, city-specific SEO pages. Each idea must be specific enough to create tomorrow.
Return ONLY valid JSON:
{
  "blogPosts": [{"title":"string — SEO title with city+keyword","description":"string"} ...6],
  "tiktokIdeas": [{"title":"string","hook":"string — opening 3-second line"} ...6],
  "instagramCalendar": [{"title":"string","type":"Reel"|"Carousel"|"Story"|"Post","description":"string"} ...6],
  "youtubeTopics": [{"title":"string","description":"string"} ...4],
  "localSEOContent": [{"title":"string","description":"string"} ...4],
  "viralHooks": ["string — copy-pasteable Reels/WhatsApp hook",...6]
}`,
    `Content strategy for ${businessName}:\n${ctx}`
  );
}

async function getActionPlan(ctx: string, businessName: string, competitorSummary: string) {
  return callGroq(
    `You are a growth strategist for local Indian businesses. Give hyper-specific, actionable advice — name exact platforms (WhatsApp, Instagram Reels, Google Business Profile), INR budgets where useful, and real tactics not generic advice. Every step should be doable tomorrow.
Return ONLY valid JSON:
{
  "immediateActions": [{"title":"string","description":"string — exactly HOW to do it","priority":"critical"|"high"|"medium","timeframe":"string","priorityScore":number 1-10,"category":"string"} ...6],
  "thirtyDayRoadmap": [{"week":"Week 1","title":"string","tasks":["task",...4],"goal":"string"} ...4],
  "launchStrategy": ["string",...5],
  "growthStrategy": ["string",...5],
  "scalingRecommendations": ["string",...4]
}`,
    `Action plan for ${businessName}:\n${ctx}\nCompetitors: ${competitorSummary || "none found yet"}`
  );
}

async function getSEOAudit(
  website: string,
  businessName: string,
  country: string,
  city: string,
  categories: string[]
) {
  let mobile = 0,
    desktop = 0;
  try {
    const key = process.env.GOOGLE_API_KEY;
    if (key) {
      const [mRes, dRes] = await Promise.all([
        fetch(
          `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(website)}&strategy=mobile&key=${key}`
        ),
        fetch(
          `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(website)}&strategy=desktop&key=${key}`
        ),
      ]);
      if (mRes.ok) {
        const d = await mRes.json();
        mobile = Math.round(
          (d.lighthouseResult?.categories?.performance?.score ?? 0.5) * 100
        );
      }
      if (dRes.ok) {
        const d = await dRes.json();
        desktop = Math.round(
          (d.lighthouseResult?.categories?.performance?.score ?? 0.7) * 100
        );
      }
    }
  } catch {}

  const ctx = `Website: ${website}\nBusiness: ${businessName}\nCountry: ${country}\nCity: ${city}\nCategories: ${categories.join(", ")}\nMobile PageSpeed: ${mobile || "unknown"}\nDesktop PageSpeed: ${desktop || "unknown"}`;
  const result = await callGroq(
    `You are an SEO auditor. Generate a detailed, realistic SEO audit.
Return ONLY valid JSON:
{
  "overallScore": number 0-100,
  "pageSpeed": {"mobile": number 0-100, "desktop": number 0-100},
  "metaIssues": [{"issue": "string", "impact": "high"|"medium"|"low", "fix": "string"}, ...3-5],
  "keywordOpportunities": [{"keyword": "string", "searchVolume": "string", "difficulty": "easy"|"medium"|"hard", "relevance": number 1-10}, ...6-8],
  "technicalIssues": [{"issue": "string", "impact": "high"|"medium"|"low", "fix": "string"}, ...3-5],
  "localSEOScore": number 0-100,
  "backlinks": {"total": number, "quality": "string"},
  "contentWeaknesses": [{"issue": "string", "impact": "high"|"medium"|"low", "fix": "string"}, ...3-4],
  "competitorKeywordGaps": ["string", ...6-10]
}`,
    ctx
  );

  if (mobile > 0) (result.pageSpeed as Record<string, number>).mobile = mobile;
  if (desktop > 0) (result.pageSpeed as Record<string, number>).desktop = desktop;
  return result;
}

// ─── Local landscape analysis ─────────────────────────────────────────────────

export async function getLocalLandscape(
  city: string,
  country: string,
  categories: string[],
  webResults: BusinessResult[]
) {
  const webCtx = webResults.length
    ? `Real currently-operating businesses found: ${webResults.map((r) => `${r.name}: ${r.snippet}`).join(" | ")}`
    : "No web results available — generate realistic local landscape";

  return callGroq(
    `You are a local market analyst. Analyze the business landscape in a specific locality.
Return ONLY valid JSON:
{
  "localVsMNC": {
    "localCount": number,
    "mncCount": number,
    "summary": "string — 2 sentences on the balance of local vs chain businesses",
    "localAdvantage": "string — key advantage for a new LOCAL brand entering this market"
  },
  "dominantPlayers": [
    {"name": "string", "type": "local"|"national_chain"|"multinational", "marketShare": "string like 'Dominant'|'Strong'|'Moderate'", "weakness": "string"}
    ...top 3
  ],
  "whiteSpace": "string — 2-3 sentences on the specific opportunity for a new local brand to carve its niche",
  "brandOpportunityScore": number 1-10
}`,
    `Locality: ${city}, ${country}\nCategory: ${categories.join(", ")}\n${webCtx}`
  );
}

// ─── Market entry analysis (new_launch mode only) ────────────────────────────

async function getMarketEntryAnalysis(ctx: string) {
  return callGroq(
    `You are a market entry strategist. Evaluate whether this is a good market to enter as a new brand.
Return ONLY valid JSON:
{
  "verdict": "strong_opportunity" | "moderate_opportunity" | "saturated",
  "verdictLabel": "string like 'Strong Market Opportunity' or 'Competitive but Viable' or 'Highly Saturated'",
  "summary": "2-3 sentences on the overall market viability for a new entrant",
  "pros": ["string reason to enter", ...4-5 items],
  "cons": ["string challenge or risk", ...3-4 items],
  "keyPlayersGap": "1-2 sentences on what ALL current key players are missing — the collective blind spot",
  "recommendation": "2-3 sentences on the best angle/strategy for a new brand to enter and win",
  "entryScore": number 1-10
}`,
    `Market entry analysis for:\n${ctx}`
  );
}

// ─── Main orchestrator ───────────────────────────────────────────────────────

export async function runAnalysis(params: {
  analysisId: string;
  businessMode?: "existing" | "new_launch";
  businessName: string;
  categories: string[];
  country: string;
  city: string;
  website?: string;
}) {
  const { analysisId, businessMode = "existing", businessName, categories, country, city, website } = params;
  const modeLabel = businessMode === "new_launch"
    ? "NOTE: This is a planned/future brand — NOT yet in the market. Analysis should focus on market entry viability."
    : "NOTE: This is an existing brand already operating in the market.";
  const ctx = buildContext(businessName, categories, country, city, website) + `\nMode: ${modeLabel}`;

  // Web search for real local businesses — all categories, 25 km radius
  const webResults = await searchLocalBusinesses(categories, city, country);

  // Build a human-readable competitor summary from real search results
  const competitorSummary = webResults
    .filter((r) => r.source === "google_places" || !r.url.includes("justdial"))
    .slice(0, 6)
    .map((r) => {
      let line = r.name;
      if (r.address) line += ` (${r.address})`;
      if (r.rating) line += ` — ${r.rating}★ ${r.reviewCount ?? 0} reviews`;
      return line;
    })
    .join("\n");

  const safe = <T>(r: PromiseSettledResult<T>, fallback: T): T =>
    r.status === "fulfilled" ? r.value : fallback;

  // Step 1: Competitors get their own dedicated call — it's the largest prompt and most important.
  // Running it alone prevents TPM collisions with the other 4 parallel calls.
  const competitorsRaw = await getCompetitors(ctx, city, country, categories, webResults)
    .catch((e) => { console.error("getCompetitors failed:", e?.message ?? e); return {}; });

  const competitorsObj = competitorsRaw as { competitors?: Record<string, unknown>[] };
  const aiCompetitors = (competitorsObj.competitors || []).map((c) => {
    // Cap any hallucinated rating > 5 (Google Maps max is 5.0)
    const rawRating = typeof c.rating === "number" ? c.rating : parseFloat(String(c.rating ?? "0"));
    const clampedRating = isNaN(rawRating) ? undefined : Math.min(5, Math.max(1, rawRating));

    // Override with real Google Places data when available
    const cName = String(c.name ?? "").toLowerCase();
    const realMatch = webResults.find((r) => r.source === "google_places" && (() => {
      const rName = r.name.toLowerCase();
      return rName === cName || rName.includes(cName) || cName.includes(rName);
    })());

    return {
      ...c,
      rating: realMatch?.rating ?? clampedRating,
      ...(realMatch?.reviewCount !== undefined && { reviewCount: realMatch.reviewCount }),
      ...(realMatch?.address && { address: realMatch.address }),
    };
  });

  // Brief pause so competitor tokens settle before the next batch
  await new Promise((r) => setTimeout(r, 1000));

  // Step 2: Core market intelligence (4 calls in parallel)
  const [marketOverview, customerPsychology, marketGaps, localLandscape] = await Promise.allSettled([
    getMarketOverview(ctx),
    getCustomerPsychology(ctx),
    getMarketGaps(ctx),
    getLocalLandscape(city, country, categories, webResults),
  ]);

  await new Promise((r) => setTimeout(r, 1000));

  // Step 3: Strategy modules (4 calls in parallel)
  const [brandPositioning, contentStrategy, actionPlan, seoAudit] = await Promise.allSettled([
    getBrandPositioning(ctx, businessName),
    getContentStrategy(ctx, businessName),
    getActionPlan(ctx, businessName, competitorSummary),
    website ? getSEOAudit(website, businessName, country, city, categories) : Promise.resolve(null),
  ]);

  const marketGapsObj = safe(marketGaps, {}) as {
    gaps?: unknown[];
    searchIntentSummary?: string;
    topSearches?: string[];
  };

  await new Promise((r) => setTimeout(r, 1000));

  // Step 4: Secondary signals — run last so they never steal quota from core modules
  let sectorSocialSignals = null;
  let marketEntryAnalysis = null;
  const [socialResult, entryResult] = await Promise.allSettled([
    getSectorSocialSignals(ctx),
    businessMode === "new_launch" ? getMarketEntryAnalysis(ctx) : Promise.resolve(null),
  ]);
  if (socialResult.status === "fulfilled") sectorSocialSignals = socialResult.value;
  if (entryResult.status === "fulfilled") marketEntryAnalysis = entryResult.value;

  return {
    id: analysisId,
    businessMode,
    businessName,
    category: categories,
    country,
    city,
    website: website || null,
    createdAt: new Date().toISOString(),
    webSearchResults: webResults,
    marketOverview: safe(marketOverview, defaultMarketOverview()),
    competitors: aiCompetitors,
    sectorSocialSignals,
    customerPsychology: safe(customerPsychology, defaultPsychology()),
    marketGaps: marketGapsObj.gaps || [],
    marketSearchSummary: (marketGapsObj.searchIntentSummary || (marketGapsObj.topSearches?.length ?? 0) > 0)
      ? { summary: marketGapsObj.searchIntentSummary || "", topSearches: marketGapsObj.topSearches || [] }
      : null,
    seoAudit: safe(seoAudit, null),
    brandPositioning: safe(brandPositioning, defaultPositioning(businessName)),
    contentStrategy: safe(contentStrategy, defaultContent()),
    actionPlan: safe(actionPlan, defaultActionPlan()),
    localLandscape: safe(localLandscape, null),
    marketEntryAnalysis,
  };
}

// ─── Chat ─────────────────────────────────────────────────────────────────────

export async function runChat(analysis: Record<string, unknown>, message: string) {
  const client = getClient();
  const mo = analysis.marketOverview as Record<string, unknown>;
  const bp = analysis.brandPositioning as Record<string, unknown>;
  const competitors = (analysis.competitors as Record<string, unknown>[]) || [];
  const ll = analysis.localLandscape as Record<string, unknown> | null;

  const res = await client.chat.completions.create({
    model: MODEL_PRIMARY,
    messages: [
      {
        role: "system",
        content: `You are Stratiq's AI business analyst. You have analyzed ${analysis.businessName} in ${analysis.city}, ${analysis.country}.

Context:
- Market size: ${mo?.marketSize ?? "N/A"}
- Growth: ${mo?.growthRate ?? "N/A"}
- Top competitors: ${competitors
  .slice(0, 3)
  .map((c) => `${c.name} (${c.type || "unknown"})`)
  .join(", ")}
- USP: ${bp?.usp ?? "N/A"}
${ll ? `- Local vs MNC: ${(ll.localVsMNC as Record<string, unknown>)?.summary ?? ""}` : ""}

Answer as a knowledgeable business consultant. Be specific and actionable. Keep responses to 2-4 sentences.`,
      },
      { role: "user", content: message },
    ],
    temperature: 0.7,
    max_tokens: 400,
  });
  return res.choices[0].message.content;
}

// ─── Fallbacks ────────────────────────────────────────────────────────────────

function defaultMarketOverview() {
  return {
    marketSize: "Data unavailable",
    growthRate: "+8% YoY",
    growthPotentialScore: 7,
    localOpportunityScore: 7,
    demandTrend: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].map((m, i) => ({ month: m, value: 50 + i * 5 })),
    summary: "Market analysis generated. Synthesis in progress.",
  };
}
function defaultPsychology() {
  return { personas: [], topPainPoints: [], buyingPatterns: [], trustFactors: [], preferredChannels: [] };
}
function defaultPositioning(name: string) {
  return {
    usp: `${name} delivers exceptional value.`,
    positioningStatement: "For customers who demand quality.",
    taglines: ["Quality you can trust", "Built for results", "Your success, our mission", "Excellence delivered", "The smart choice"],
    premiumAngle: "Premium quality at competitive pricing.",
    trustAngle: "Proven results, transparent process.",
    differentiationMap: ["Price","Quality","Speed","Trust","Experience","Innovation"].map((d) => ({ dimension: d, yourBrand: 8, competitors: 6 })),
  };
}
function defaultContent() {
  return { blogPosts: [], tiktokIdeas: [], instagramCalendar: [], youtubeTopics: [], localSEOContent: [], viralHooks: [] };
}
function defaultActionPlan() {
  return { immediateActions: [], thirtyDayRoadmap: [], launchStrategy: [], growthStrategy: [], scalingRecommendations: [] };
}
