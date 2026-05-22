export interface CountryCity {
  code: string;
  name: string;
  flag: string;
  cities: string[];
}

export const COUNTRIES: CountryCity[] = [
  {
    code: "GB",
    name: "United Kingdom",
    flag: "🇬🇧",
    cities: ["London", "Manchester", "Birmingham", "Leeds", "Glasgow", "Liverpool", "Bristol", "Sheffield", "Edinburgh", "Leicester", "Bradford", "Cardiff", "Coventry", "Nottingham", "Newcastle"],
  },
  {
    code: "US",
    name: "United States",
    flag: "🇺🇸",
    cities: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose", "Austin", "Jacksonville", "Fort Worth", "Columbus", "Charlotte"],
  },
  {
    code: "IN",
    name: "India",
    flag: "🇮🇳",
    cities: ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat", "Lucknow", "Kanpur", "Nagpur", "Indore", "Chandigarh"],
  },
  {
    code: "AE",
    name: "United Arab Emirates",
    flag: "🇦🇪",
    cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Ras Al Khaimah", "Fujairah", "Umm Al Quwain"],
  },
  {
    code: "AU",
    name: "Australia",
    flag: "🇦🇺",
    cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide", "Gold Coast", "Canberra", "Newcastle", "Wollongong", "Logan City", "Geelong", "Townsville", "Cairns", "Darwin", "Hobart"],
  },
  {
    code: "CA",
    name: "Canada",
    flag: "🇨🇦",
    cities: ["Toronto", "Montreal", "Vancouver", "Calgary", "Edmonton", "Ottawa", "Winnipeg", "Quebec City", "Hamilton", "Brampton", "Surrey", "Halifax", "London", "Markham", "Vaughan"],
  },
  {
    code: "SG",
    name: "Singapore",
    flag: "🇸🇬",
    cities: ["Singapore City", "Jurong", "Woodlands", "Tampines", "Queenstown", "Ang Mo Kio"],
  },
  {
    code: "NZ",
    name: "New Zealand",
    flag: "🇳🇿",
    cities: ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Dunedin"],
  },
  {
    code: "ZA",
    name: "South Africa",
    flag: "🇿🇦",
    cities: ["Johannesburg", "Cape Town", "Durban", "Pretoria", "Port Elizabeth", "Bloemfontein"],
  },
  {
    code: "NG",
    name: "Nigeria",
    flag: "🇳🇬",
    cities: ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Benin City", "Maiduguri"],
  },
  {
    code: "KE",
    name: "Kenya",
    flag: "🇰🇪",
    cities: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
  },
  {
    code: "PK",
    name: "Pakistan",
    flag: "🇵🇰",
    cities: ["Karachi", "Lahore", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar"],
  },
  {
    code: "BD",
    name: "Bangladesh",
    flag: "🇧🇩",
    cities: ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna"],
  },
  {
    code: "PH",
    name: "Philippines",
    flag: "🇵🇭",
    cities: ["Manila", "Cebu City", "Davao", "Quezon City", "Makati"],
  },
  {
    code: "MY",
    name: "Malaysia",
    flag: "🇲🇾",
    cities: ["Kuala Lumpur", "Petaling Jaya", "Johor Bahru", "Penang", "Shah Alam"],
  },
];

export const CATEGORIES = [
  { id: "fitness", label: "Fitness", emoji: "💪" },
  { id: "consultancy", label: "Consultancy", emoji: "💼" },
  { id: "visa_agency", label: "Visa Agency", emoji: "✈️" },
  { id: "education", label: "Education", emoji: "📚" },
  { id: "real_estate", label: "Real Estate", emoji: "🏠" },
  { id: "salon", label: "Salon & Beauty", emoji: "💅" },
  { id: "accounting", label: "Accounting", emoji: "📊" },
  { id: "restaurant", label: "Restaurant", emoji: "🍽️" },
  { id: "healthcare", label: "Healthcare", emoji: "🏥" },
  { id: "saas", label: "SaaS", emoji: "⚡" },
  { id: "ecommerce", label: "Ecommerce", emoji: "🛒" },
  { id: "logistics", label: "Logistics", emoji: "🚚" },
  { id: "marketing", label: "Marketing Agency", emoji: "📣" },
  { id: "coaching", label: "Coaching", emoji: "🎯" },
  { id: "other", label: "Other", emoji: "✨" },
];
