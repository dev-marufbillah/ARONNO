export const heroImage =
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80";

export const categorySeed = [
  {
    name: "Perfume",
    slug: "perfume",
    description: "Signature scents and refined fragrance houses.",
    imageUrl:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Watches",
    slug: "watches",
    description: "Swiss timepieces and modern luxury icons.",
    imageUrl:
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Eyewear",
    slug: "eyewear",
    description: "Sophisticated frames for every setting.",
    imageUrl:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Bags & Leather",
    slug: "bags-leather",
    description: "Leather essentials with timeless craftsmanship.",
    imageUrl:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Wallets & Card Holders",
    slug: "wallets-card-holders",
    description: "Compact luxury for modern everyday carry.",
    imageUrl:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Jewelry",
    slug: "jewelry",
    description: "Delicate pieces with elevated detail.",
    imageUrl:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Shoes",
    slug: "shoes",
    description: "Luxury footwear for statement dressing.",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Grooming",
    slug: "grooming",
    description: "Premium grooming and self-care essentials.",
    imageUrl:
      "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&w=900&q=80",
  },
  {
    name: "Gift Sets",
    slug: "gift-sets",
    description: "Curated gifting for memorable occasions.",
    imageUrl:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80",
  },
] as const;

export const productSeed = [
  {
    sku: "AUR-PER-001",
    brand: "Tom Ford",
    name: "Oud Wood Eau de Parfum",
    slug: "tom-ford-oud-wood-eau-de-parfum",
    categorySlug: "perfume",
    subcategory: "Eau de Parfum",
    description:
      "A warm, smoky and deeply refined fragrance featuring oud, cardamom and sandalwood. Designed for evening elegance and confident presence.",
    shortDescription: "Smoky oud fragrance with cardamom and sandalwood.",
    price: 34500,
    compareAtPrice: 38000,
    stockQuantity: 14,
    thumbnail:
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.8,
    reviewCount: 24,
    featured: true,
    bestSeller: true,
    newArrival: true,
    tags: ["oud", "woody", "evening"],
    specifications: {
      "Fragrance Family": "Woody Oriental",
      Volume: "100ml",
      Origin: "USA",
      Notes: "Oud, Cardamom, Sandalwood",
    },
  },
  {
    sku: "AUR-WAT-001",
    brand: "Rolex",
    name: "Submariner Date",
    slug: "rolex-submariner-date",
    categorySlug: "watches",
    subcategory: "Luxury Sports Watch",
    description:
      "An icon of modern watchmaking featuring a bold black dial, rotating bezel and oystersteel construction built for timeless wear.",
    shortDescription: "A legendary dive watch with timeless presence.",
    price: 620000,
    compareAtPrice: 650000,
    stockQuantity: 3,
    thumbnail:
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.9,
    reviewCount: 24,
    featured: true,
    bestSeller: true,
    newArrival: true,
    tags: ["automatic", "diver", "swiss"],
    specifications: {
      Movement: "Automatic",
      Material: "Oystersteel",
      Resistance: "300m",
      Warranty: "5 Years",
      Origin: "Swiss Made",
    },
  },
  {
    sku: "AUR-WAT-002",
    brand: "Omega",
    name: "Seamaster Moonwatch",
    slug: "omega-seamaster-moonwatch",
    categorySlug: "watches",
    subcategory: "Chronograph",
    description:
      "A bold stainless steel chronograph with heritage styling and precision movement, ideal for collectors and everyday luxury.",
    shortDescription: "Heritage-driven chronograph with elevated detail.",
    price: 770000,
    compareAtPrice: 810000,
    stockQuantity: 6,
    thumbnail:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.8,
    reviewCount: 18,
    featured: false,
    bestSeller: true,
    newArrival: false,
    tags: ["chronograph", "swiss", "collector"],
    specifications: {
      Movement: "Co-Axial Manual",
      Material: "Stainless Steel",
      Diameter: "42mm",
      Warranty: "5 Years",
      Origin: "Swiss Made",
    },
  },
  {
    sku: "AUR-EYE-001",
    brand: "Ray-Ban",
    name: "Wayfarer Classic",
    slug: "ray-ban-wayfarer-classic",
    categorySlug: "eyewear",
    subcategory: "Sunglasses",
    description:
      "The definitive statement frame with iconic angles, premium lenses and effortless wearability.",
    shortDescription: "The iconic luxury-casual statement frame.",
    price: 18500,
    compareAtPrice: 21000,
    stockQuantity: 20,
    thumbnail:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1577803645773-f96470509666?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.7,
    reviewCount: 31,
    featured: true,
    bestSeller: false,
    newArrival: true,
    tags: ["sunglasses", "classic", "unisex"],
    specifications: {
      Frame: "Acetate",
      Lens: "UV Protection",
      Color: "Black",
      Origin: "Italy",
    },
  },
  {
    sku: "AUR-EYE-002",
    brand: "Persol",
    name: "9649S",
    slug: "persol-9649s",
    categorySlug: "eyewear",
    subcategory: "Sunglasses",
    description:
      "A handcrafted Italian frame with a distinguished profile and rich brown lens tint.",
    shortDescription: "Handcrafted Italian eyewear with rich detailing.",
    price: 22500,
    compareAtPrice: 25000,
    stockQuantity: 11,
    thumbnail:
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.6,
    reviewCount: 12,
    featured: false,
    bestSeller: false,
    newArrival: false,
    tags: ["italy", "handcrafted", "premium"],
    specifications: {
      Frame: "Acetate",
      Lens: "Crystal Lens",
      Color: "Tortoise",
      Origin: "Italy",
    },
  },
  {
    sku: "AUR-BAG-001",
    brand: "Loewe",
    name: "Puzzle Bag",
    slug: "loewe-puzzle-bag",
    categorySlug: "bags-leather",
    subcategory: "Leather Bag",
    description:
      "A refined geometric leather bag celebrated for sculptural form, luxurious finish and versatile carry options.",
    shortDescription: "Sculptural leather icon with timeless utility.",
    price: 295000,
    compareAtPrice: 325000,
    stockQuantity: 4,
    thumbnail:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1591561954557-26941169b49e?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.9,
    reviewCount: 15,
    featured: true,
    bestSeller: true,
    newArrival: true,
    tags: ["leather", "designer", "shoulder bag"],
    specifications: {
      Material: "Calfskin Leather",
      Color: "Black",
      Origin: "Spain",
      Strap: "Detachable",
    },
  },
  {
    sku: "AUR-WAL-001",
    brand: "Montblanc",
    name: "Meisterstück Card Holder",
    slug: "montblanc-meisterstuck-card-holder",
    categorySlug: "wallets-card-holders",
    subcategory: "Card Holder",
    description:
      "A compact, luxurious leather card holder finished with understated craftsmanship and signature detailing.",
    shortDescription: "Slim everyday carry in signature black leather.",
    price: 21000,
    compareAtPrice: 23500,
    stockQuantity: 16,
    thumbnail:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.6,
    reviewCount: 19,
    featured: false,
    bestSeller: true,
    newArrival: false,
    tags: ["wallet", "card holder", "leather"],
    specifications: {
      Material: "Full Grain Leather",
      Color: "Black",
      Compartments: "6",
      Origin: "Germany",
    },
  },
  {
    sku: "AUR-JEW-001",
    brand: "Swarovski",
    name: "Halo Necklace",
    slug: "swarovski-halo-necklace",
    categorySlug: "jewelry",
    subcategory: "Necklace",
    description:
      "A delicate gold-tone necklace designed to add soft brilliance to formal and everyday styling.",
    shortDescription: "Gold-tone necklace with delicate brilliance.",
    price: 46000,
    compareAtPrice: 52000,
    stockQuantity: 9,
    thumbnail:
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.8,
    reviewCount: 27,
    featured: true,
    bestSeller: false,
    newArrival: true,
    tags: ["gold-tone", "necklace", "gift"],
    specifications: {
      Material: "Gold Tone Finish",
      Stone: "Crystal",
      Length: "42cm",
      Origin: "Austria",
    },
  },
  {
    sku: "AUR-SHO-001",
    brand: "Gucci",
    name: "Leather Horsebit Loafer",
    slug: "gucci-leather-horsebit-loafer",
    categorySlug: "shoes",
    subcategory: "Formal Shoes",
    description:
      "An iconic loafer with polished leather construction and signature horsebit hardware for effortless refinement.",
    shortDescription: "Iconic polished leather loafer with horsebit detail.",
    price: 88000,
    compareAtPrice: 94000,
    stockQuantity: 7,
    thumbnail:
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.7,
    reviewCount: 10,
    featured: false,
    bestSeller: false,
    newArrival: true,
    tags: ["loafer", "formal", "leather"],
    specifications: {
      Material: "Leather",
      Sole: "Leather",
      Color: "Black",
      Origin: "Italy",
    },
  },
  {
    sku: "AUR-GRO-001",
    brand: "Aesop",
    name: "Resurrection Hand Care Duo",
    slug: "aesop-resurrection-hand-care-duo",
    categorySlug: "grooming",
    subcategory: "Hand Care",
    description:
      "A premium cleansing and moisturizing duo with citrus, woody and herbaceous notes for daily ritual.",
    shortDescription: "Luxury grooming duo for daily care ritual.",
    price: 14500,
    compareAtPrice: 16000,
    stockQuantity: 22,
    thumbnail:
      "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1621607512022-6aecc4fed814?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.5,
    reviewCount: 9,
    featured: false,
    bestSeller: false,
    newArrival: false,
    tags: ["grooming", "care", "gift"],
    specifications: {
      Volume: "500ml",
      Use: "Hand Wash + Balm",
      Origin: "Australia",
      Notes: "Citrus, Woody, Herbal",
    },
  },
  {
    sku: "AUR-GIF-001",
    brand: "Jo Malone",
    name: "Wood Sage Gift Set",
    slug: "jo-malone-wood-sage-gift-set",
    categorySlug: "gift-sets",
    subcategory: "Gift Set",
    description:
      "An elegant fragrance gift set ideal for weddings, anniversaries and elevated celebrations.",
    shortDescription: "A memorable fragrance gift for premium occasions.",
    price: 28500,
    compareAtPrice: 31500,
    stockQuantity: 8,
    thumbnail:
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=900&q=80",
    images: [
      "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=1200&q=80",
    ],
    rating: 4.8,
    reviewCount: 7,
    featured: true,
    bestSeller: false,
    newArrival: true,
    tags: ["gift", "wedding", "premium"],
    specifications: {
      Includes: "Cologne + Candle + Gift Box",
      Occasion: "Wedding / Anniversary",
      Origin: "United Kingdom",
      Packaging: "Premium Box",
    },
  },
] as const;

export const testimonials = [
  {
    name: "Tasnim Rahman",
    review:
      "ARONNO’s service is exceptional. The products are authentic and beautifully packaged.",
  },
  {
    name: "Fahim Ahmed",
    review:
      "The packaging, the quality, the experience — everything was perfect. Highly recommended.",
  },
  {
    name: "Sabrina Islam",
    review:
      "Premium products and a seamless shopping experience. Truly a luxury experience.",
  },
] as const;

export const socialGallery = [
  "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
] as const;

export const storyImages = {
  signature:
    "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1600&q=80",
  brandStory:
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80",
  gift:
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80",
};
