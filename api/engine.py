"""
Stratiq Analysis Engine — LLaMA 3.3 70B via Groq (free).
"""

import os
import json
import asyncio
import httpx
from datetime import datetime
from typing import Optional, List
from openai import AsyncOpenAI

GROQ_BASE_URL = "https://api.groq.com/openai/v1"
GROQ_MODEL = "llama-3.3-70b-versatile"

def get_client():
    key = os.getenv("GROQ_API_KEY", "")
    if not key:
        raise ValueError("GROQ_API_KEY is not set. Add it to api/.env")
    return AsyncOpenAI(api_key=key, base_url=GROQ_BASE_URL)

CURRENT_DATE = datetime.now().strftime("%B %Y")


async def call_openai(system: str, user: str, model: str = "llama-3.3-70b-versatile") -> dict:
    """Call OpenAI and parse JSON response."""
    try:
        client = get_client()
        response = await client.chat.completions.create(
            model=model,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            temperature=0.7,
        )
        return json.loads(response.choices[0].message.content)
    except Exception as e:
        print(f"OpenAI error: {e}")
        raise


def build_context(business_name: str, categories: List[str], country: str, city: str, website: Optional[str]) -> str:
    cat_str = ", ".join(categories)
    return f"""
Business: {business_name}
Category: {cat_str}
Country: {country}
City: {city}
Website: {website or "Not provided"}
Date: {CURRENT_DATE}
"""


async def get_market_overview(ctx: str, business_name: str, country: str, city: str) -> dict:
    system = """You are a world-class market research analyst. Generate realistic, data-informed market analysis.
Return ONLY valid JSON matching this exact schema:
{
  "marketSize": "string like '$2.4B' or '£450M'",
  "growthRate": "string like '+12% YoY'",
  "growthPotentialScore": number 1-10,
  "localOpportunityScore": number 1-10,
  "demandTrend": [{"month": "Jan", "value": number}, ...12 months],
  "summary": "2-3 sentence AI insight about why this market is interesting right now"
}"""
    user = f"Generate market overview for:{ctx}"
    return await call_openai(system, user)


async def get_competitors(ctx: str, business_name: str, country: str, city: str) -> list:
    system = """You are a competitive intelligence specialist. Generate realistic local competitors.
Return ONLY valid JSON: {"competitors": [
  {
    "name": "string",
    "rating": number 1-5,
    "reviewCount": number,
    "priceRange": "string like '$50-100/session'",
    "strengths": ["string", ...3 items],
    "weaknesses": ["string", ...3 items],
    "missingServices": ["string", ...2-3 items],
    "threatScore": number 1-10,
    "address": "string",
    "website": "string or null",
    "category": "string"
  }
  ... 5-7 competitors
]}"""
    user = f"Generate realistic local competitors for:{ctx}"
    result = await call_openai(system, user)
    return result.get("competitors", [])


async def get_customer_psychology(ctx: str) -> dict:
    system = """You are a consumer psychology expert. Generate detailed customer insights.
Return ONLY valid JSON:
{
  "personas": [
    {
      "name": "string (persona name like 'The Ambitious Professional')",
      "age": "string like '28-35'",
      "description": "string 2 sentences",
      "painPoints": ["string", ...3-4],
      "emotionalTriggers": ["string", ...3],
      "preferredPlatforms": ["Instagram", "WhatsApp", ...],
      "preferredPricing": "string like 'Monthly subscription'",
      "trustFactors": ["string", ...3],
      "buyingBehavior": "string",
      "avatar": "string emoji"
    }
    ...3 personas
  ],
  "topPainPoints": [
    {"pain": "string", "frequency": "string like 'Very common'", "opportunityScore": number 1-10}
    ...5 items
  ],
  "buyingPatterns": ["string", ...4-5 patterns],
  "trustFactors": ["string", ...4-5 factors],
  "preferredChannels": ["string", ...4-5 channels]
}"""
    user = f"Generate customer psychology analysis for:{ctx}"
    return await call_openai(system, user)


async def get_market_gaps(ctx: str) -> list:
    system = """You are a market opportunity analyst. Find real unmet needs and gaps.
Return ONLY valid JSON: {"gaps": [
  {
    "title": "string",
    "description": "string 2-3 sentences",
    "audience": "string",
    "opportunityScore": number 1-10,
    "type": "service" | "content" | "positioning" | "audience"
  }
  ...6-8 gaps
]}"""
    user = f"Find market gaps and opportunities for:{ctx}"
    result = await call_openai(system, user)
    return result.get("gaps", [])


async def get_seo_audit(website: str, business_name: str, country: str, city: str, categories: List[str]) -> dict:
    """Run SEO audit. Uses Google PageSpeed Insights API if available, otherwise AI-generated."""
    pagespeed_mobile = 0
    pagespeed_desktop = 0

    # Try Google PageSpeed Insights
    try:
        api_key = os.getenv("GOOGLE_API_KEY", "")
        async with httpx.AsyncClient(timeout=15) as http:
            if api_key:
                mobile_resp = await http.get(
                    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
                    params={"url": website, "strategy": "mobile", "key": api_key}
                )
                desktop_resp = await http.get(
                    "https://www.googleapis.com/pagespeedonline/v5/runPagespeed",
                    params={"url": website, "strategy": "desktop", "key": api_key}
                )
                if mobile_resp.status_code == 200:
                    m_data = mobile_resp.json()
                    pagespeed_mobile = round(m_data.get("lighthouseResult", {}).get("categories", {}).get("performance", {}).get("score", 0.5) * 100)
                if desktop_resp.status_code == 200:
                    d_data = desktop_resp.json()
                    pagespeed_desktop = round(d_data.get("lighthouseResult", {}).get("categories", {}).get("performance", {}).get("score", 0.7) * 100)
    except Exception:
        pass

    ctx = f"Website: {website}\nBusiness: {business_name}\nCountry: {country}\nCity: {city}\nCategories: {', '.join(categories)}\nMobile PageSpeed: {pagespeed_mobile or 'unknown'}\nDesktop PageSpeed: {pagespeed_desktop or 'unknown'}"

    system = """You are an expert SEO auditor. Generate a detailed, realistic SEO audit.
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
  "competitorKeywordGaps": ["string", ...6-10 keywords]
}"""
    result = await call_openai(system, ctx, model="llama-3.3-70b-versatile")

    # Override page speed with real data if we got it
    if pagespeed_mobile > 0:
        result["pageSpeed"]["mobile"] = pagespeed_mobile
    if pagespeed_desktop > 0:
        result["pageSpeed"]["desktop"] = pagespeed_desktop

    return result


async def get_brand_positioning(ctx: str, business_name: str) -> dict:
    system = """You are a brand strategist at a top agency. Generate premium brand positioning.
Return ONLY valid JSON:
{
  "usp": "string — the core unique selling proposition in 1-2 sentences",
  "positioningStatement": "string — full positioning statement",
  "taglines": ["string", ...5 tagline options],
  "premiumAngle": "string — how to position as premium",
  "trustAngle": "string — how to build trust",
  "differentiationMap": [
    {"dimension": "string", "yourBrand": number 1-10, "competitors": number 1-10}
    ...6 dimensions like "Price", "Quality", "Speed", "Trust", "Experience", "Innovation"
  ]
}"""
    user = f"Generate brand positioning for {business_name}:{ctx}"
    return await call_openai(system, user)


async def get_content_strategy(ctx: str, business_name: str) -> dict:
    system = """You are a content strategist and viral marketing expert. Generate actionable content ideas.
Return ONLY valid JSON:
{
  "blogPosts": [{"title": "string", "description": "string"}, ...6],
  "tiktokIdeas": [{"title": "string", "hook": "string"}, ...6],
  "instagramCalendar": [{"title": "string", "type": "string", "description": "string"}, ...6],
  "youtubeTopics": [{"title": "string", "description": "string"}, ...4],
  "localSEOContent": [{"title": "string", "description": "string"}, ...4],
  "viralHooks": ["string", ...6 viral hook formulas]
}"""
    user = f"Generate content strategy for {business_name}:{ctx}"
    return await call_openai(system, user)


async def get_action_plan(ctx: str, business_name: str) -> dict:
    system = """You are a startup growth strategist. Generate a prioritized, realistic action plan.
Return ONLY valid JSON:
{
  "immediateActions": [
    {
      "title": "string",
      "description": "string",
      "priority": "critical"|"high"|"medium",
      "timeframe": "string like 'Today' or 'This week'",
      "priorityScore": number 1-10,
      "category": "string"
    }
    ...6 actions
  ],
  "thirtyDayRoadmap": [
    {
      "week": "Week 1",
      "title": "string",
      "tasks": ["string", ...3-4 tasks],
      "goal": "string"
    }
    ...4 weeks
  ],
  "launchStrategy": ["string", ...4-5 launch steps],
  "growthStrategy": ["string", ...4-5 growth tactics],
  "scalingRecommendations": ["string", ...4-5 scaling tips]
}"""
    user = f"Generate action plan for {business_name}:{ctx}"
    return await call_openai(system, user)


async def run_analysis(
    analysis_id: str,
    business_name: str,
    categories: List[str],
    country: str,
    city: str,
    website: Optional[str] = None,
) -> dict:
    """
    Orchestrate all 8 analysis modules in parallel where possible.
    """
    ctx = build_context(business_name, categories, country, city, website)

    # Run all non-SEO modules in parallel
    tasks = [
        get_market_overview(ctx, business_name, country, city),
        get_competitors(ctx, business_name, country, city),
        get_customer_psychology(ctx),
        get_market_gaps(ctx),
        get_brand_positioning(ctx, business_name),
        get_content_strategy(ctx, business_name),
        get_action_plan(ctx, business_name),
    ]

    if website:
        tasks.append(get_seo_audit(website, business_name, country, city, categories))

    results = await asyncio.gather(*tasks, return_exceptions=True)

    market_overview = results[0] if not isinstance(results[0], Exception) else default_market_overview()
    competitors = results[1] if not isinstance(results[1], Exception) else []
    customer_psychology = results[2] if not isinstance(results[2], Exception) else default_psychology()
    market_gaps = results[3] if not isinstance(results[3], Exception) else []
    brand_positioning = results[4] if not isinstance(results[4], Exception) else default_positioning(business_name)
    content_strategy = results[5] if not isinstance(results[5], Exception) else default_content()
    action_plan = results[6] if not isinstance(results[6], Exception) else default_action_plan()
    seo_audit = results[7] if website and len(results) > 7 and not isinstance(results[7], Exception) else None

    return {
        "id": analysis_id,
        "businessName": business_name,
        "category": categories,
        "country": country,
        "city": city,
        "website": website,
        "createdAt": datetime.utcnow().isoformat(),
        "marketOverview": market_overview,
        "competitors": competitors,
        "customerPsychology": customer_psychology,
        "marketGaps": market_gaps,
        "seoAudit": seo_audit,
        "brandPositioning": brand_positioning,
        "contentStrategy": content_strategy,
        "actionPlan": action_plan,
    }


async def run_chat(analysis: dict, message: str) -> str:
    """AI assistant with full context of the analysis."""
    ai_client = get_client()
    system = f"""You are Stratiq's AI business analyst assistant. You have analyzed {analysis.get('businessName', 'this business')} in {analysis.get('city', '')}, {analysis.get('country', '')}.

Here is the analysis context:
- Market size: {analysis.get('marketOverview', {}).get('marketSize', 'N/A')}
- Growth rate: {analysis.get('marketOverview', {}).get('growthRate', 'N/A')}
- Top competitors: {', '.join([c.get('name', '') for c in analysis.get('competitors', [])[:3]])}
- USP: {analysis.get('brandPositioning', {}).get('usp', 'N/A')}

Answer the user's question as a knowledgeable business consultant. Be specific, actionable, and reference the analysis data. Keep responses concise (2-4 sentences) unless the question requires detail."""

    response = await ai_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": message},
        ],
        temperature=0.7,
        max_tokens=400,
    )
    return response.choices[0].message.content


# Fallback defaults if individual modules fail
def default_market_overview():
    return {
        "marketSize": "Data unavailable",
        "growthRate": "+8% YoY",
        "growthPotentialScore": 7,
        "localOpportunityScore": 7,
        "demandTrend": [{"month": m, "value": 50 + i * 5} for i, m in enumerate(["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"])],
        "summary": "Market analysis generated. AI synthesis in progress.",
    }

def default_psychology():
    return {
        "personas": [],
        "topPainPoints": [],
        "buyingPatterns": [],
        "trustFactors": [],
        "preferredChannels": [],
    }

def default_positioning(business_name: str):
    return {
        "usp": f"{business_name} delivers exceptional value.",
        "positioningStatement": "For customers who demand quality and reliability.",
        "taglines": ["Quality you can trust", "Built for results", "Your success, our mission", "Excellence delivered", "The smart choice"],
        "premiumAngle": "Premium quality at competitive pricing.",
        "trustAngle": "Proven results, transparent process.",
        "differentiationMap": [
            {"dimension": d, "yourBrand": 8, "competitors": 6}
            for d in ["Price", "Quality", "Speed", "Trust", "Experience", "Innovation"]
        ],
    }

def default_content():
    return {
        "blogPosts": [],
        "tiktokIdeas": [],
        "instagramCalendar": [],
        "youtubeTopics": [],
        "localSEOContent": [],
        "viralHooks": [],
    }

def default_action_plan():
    return {
        "immediateActions": [],
        "thirtyDayRoadmap": [],
        "launchStrategy": [],
        "growthStrategy": [],
        "scalingRecommendations": [],
    }
