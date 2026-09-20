/**
 * Temporary landing-page content fixture.
 *
 * The shape mirrors the public home endpoint planned for the backend. When
 * that endpoint is available, replace this module at the page boundary with
 * `homeApi.getLandingPage()`; presentational components should not change.
 */
export const homeContent = {
  hero: {
    eyebrow: "One place for every farming decision",
    title: "Grow every season with a clearer next step.",
    description:
      "Source reliable inputs, understand your local market, and take confident action from field to sale.",
    primaryAction: { label: "Explore farm inputs", to: "/catalog" },
    secondaryAction: { label: "Check mandi prices", to: "/market-intelligence" },
    metrics: [
      { value: "24/7", label: "Farm guidance" },
      { value: "6K+", label: "Products to compare" },
      { value: "100+", label: "Markets to track" },
    ],
  },
  categories: [
    { id: "seeds", name: "Seeds", description: "Strong starts for every season", icon: "sprout", to: "/catalog?category=seeds" },
    { id: "nutrition", name: "Crop nutrition", description: "Feed soil and crop precisely", icon: "leaf", to: "/catalog?category=nutrition" },
    { id: "protection", name: "Crop protection", description: "Act early against threats", icon: "shield", to: "/catalog?category=protection" },
    { id: "irrigation", name: "Irrigation", description: "Make every drop count", icon: "droplet", to: "/catalog?category=irrigation" },
    { id: "tools", name: "Tools & machinery", description: "Make field work lighter", icon: "tractor", to: "/catalog?category=machinery" },
    { id: "organic", name: "Organic farming", description: "Inputs for a living soil", icon: "sun", to: "/catalog?category=organic" },
  ],
  featuredProducts: [
    {
      id: "demo-seed-01",
      name: "Sona Gold hybrid maize seeds",
      category: "Seeds",
      unit: "4 kg pack",
      price: 1190,
      originalPrice: 1320,
      rating: 4.8,
      reviewsCount: 128,
      badge: "High germination",
      art: "seed",
    },
    {
      id: "demo-nutrition-01",
      name: "Balanced NPK water-soluble nutrition",
      category: "Crop nutrition",
      unit: "1 kg pack",
      price: 465,
      originalPrice: null,
      rating: 4.7,
      reviewsCount: 94,
      badge: "Popular this week",
      art: "nutrition",
    },
    {
      id: "demo-protection-01",
      name: "Neem-based broad spectrum protectant",
      category: "Crop protection",
      unit: "500 ml bottle",
      price: 620,
      originalPrice: 690,
      rating: 4.9,
      reviewsCount: 207,
      badge: "Farmer favourite",
      art: "protection",
    },
    {
      id: "demo-irrigation-01",
      name: "Micro drip starter kit for 1 acre",
      category: "Irrigation",
      unit: "Complete kit",
      price: 3890,
      originalPrice: null,
      rating: 4.6,
      reviewsCount: 75,
      badge: "Easy installation",
      art: "irrigation",
    },
  ],
};
