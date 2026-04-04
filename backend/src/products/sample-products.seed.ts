/** Sample catalog for POST /products/seed — categories match frontend Collection slugs (Rackets, Shoes, Shuttles, Apparel). */
export type SampleProductRow = {
  name: string;
  category: string;
  subCategory: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  isLimited?: boolean;
  specs: Record<string, string>;
};

export const SAMPLE_PRODUCTS: SampleProductRow[] = [
  // Rackets (5)
  {
    name: 'PRECISION X-1 CARBON',
    category: 'Rackets',
    subCategory: 'ENGINEERED RACKET / MATTE BLACK',
    description:
      'Engineered for silence and velocity. Toray T1100G carbon with an extra-stiff shaft for advanced players.',
    price: 340,
    stock: 24,
    imageUrl:
      'https://images.unsplash.com/photo-1626224582824-87c94bf94b8c?w=900&auto=format&fit=crop',
    isLimited: true,
    specs: {
      'Frame Weight': '84g ± 0.5',
      'Balance Point': '305mm (head heavy)',
      Flexibility: 'Extra stiff',
      'Max Tension': '32 lbs',
      Material: 'Toray T1100G carbon',
    },
  },
  {
    name: 'VELOCITY PRO 88',
    category: 'Rackets',
    subCategory: 'ATTACK / 4U',
    description:
      'Head-heavy balance for aggressive smashes. Aerodynamic frame reduces drag on fast swings.',
    price: 289,
    stock: 40,
    imageUrl:
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=900&auto=format&fit=crop',
    specs: {
      Weight: '4U (80–84g)',
      Balance: '300mm',
      Flex: 'Stiff',
      String: 'Unstrung',
    },
  },
  {
    name: 'AERO STRIKE 900',
    category: 'Rackets',
    subCategory: 'ALL-ROUND / NANO MESH',
    description:
      'Versatile racket with even balance for singles and doubles play.',
    price: 220,
    stock: 35,
    imageUrl:
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=900&auto=format&fit=crop',
    specs: {
      Weight: '3U',
      Balance: 'Even',
      Flex: 'Medium',
      Grip: 'G5',
    },
  },
  {
    name: 'PHANTOM LITE 7',
    category: 'Rackets',
    subCategory: 'DEFENSE / ULTRA LIGHT',
    description:
      'Lightweight frame for fast defense and net play without arm fatigue.',
    price: 175,
    stock: 50,
    imageUrl:
      'https://images.unsplash.com/photo-1617638924341-e7f2374bbd2d?w=900&auto=format&fit=crop',
    specs: {
      Weight: '5U (75–79g)',
      Balance: 'Head light',
      Flex: 'Medium',
      'Max Tension': '28 lbs',
    },
  },
  {
    name: 'TOURNAMENT MAX 3U',
    category: 'Rackets',
    subCategory: 'CLUB TOURNAMENT',
    description:
      'Durable club-grade racket with stable feel and consistent shuttle response.',
    price: 129,
    stock: 60,
    imageUrl:
      'https://images.unsplash.com/photo-1517649763962-0c62306601b7?w=900&auto=format&fit=crop',
    specs: {
      Weight: '3U',
      Balance: 'Slightly head heavy',
      Flex: 'Medium-stiff',
      Material: 'Graphite composite',
    },
  },
  // Shoes (5)
  {
    name: 'VELOCITY ELITE 2.0',
    category: 'Shoes',
    subCategory: 'FOOTWEAR / PURE WHITE',
    description:
      'Minimalist indoor court shoes with lateral stability and responsive cushioning.',
    price: 185,
    stock: 45,
    imageUrl:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop',
    specs: {
      Upper: 'Laser-cut TPU',
      Midsole: 'Foam + carbon plate',
      Outsole: 'Non-marking rubber',
      Weight: '~290g (size 10)',
    },
  },
  {
    name: 'COURT SLIDE PRO',
    category: 'Shoes',
    subCategory: 'INDOOR / BLACK',
    description:
      'Low-profile grip for quick direction changes on wooden and synthetic courts.',
    price: 149,
    stock: 38,
    imageUrl:
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=900&auto=format&fit=crop',
    specs: {
      Drop: '6mm',
      Cushion: 'EVA + gel',
      Fit: 'Snug heel',
      Use: 'Badminton / squash',
    },
  },
  {
    name: 'LATERAL LOCK 4',
    category: 'Shoes',
    subCategory: 'STABILITY',
    description:
      'Reinforced sidewalls and wide base to prevent rollover during lunges.',
    price: 165,
    stock: 32,
    imageUrl:
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&auto=format&fit=crop',
    specs: {
      Support: 'High',
      Upper: 'Mesh + synthetic',
      Midsole: 'Dual-density',
      Outsole: 'Herringbone',
    },
  },
  {
    name: 'APEX INDOOR WHITE',
    category: 'Shoes',
    subCategory: 'LIGHTWEIGHT',
    description:
      'Feather-light upper with breathable mesh for long training sessions.',
    price: 139,
    stock: 44,
    imageUrl:
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&auto=format&fit=crop',
    specs: {
      Weight: '~270g',
      Breathability: 'High',
      Cushion: 'Responsive foam',
      Colorway: 'White / silver',
    },
  },
  {
    name: 'GRIP RUSH BLACK',
    category: 'Shoes',
    subCategory: 'AGGRESSIVE CUTS',
    description:
      'Sticky rubber pattern optimized for explosive first steps and stops.',
    price: 159,
    stock: 28,
    imageUrl:
      'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=900&auto=format&fit=crop',
    specs: {
      Traction: 'High-grip',
      Durability: 'Reinforced toe',
      Midsole: 'Stability bar',
      Sizes: 'US 7–13',
    },
  },
  // Shuttles (5)
  {
    name: 'ELITE SERIES SHUTTLE',
    category: 'Shuttles',
    subCategory: 'TOURNAMENT GRADE / 12PK',
    description:
      'Grade-A goose feathers with natural cork base for stable flight and durability.',
    price: 42,
    stock: 120,
    imageUrl:
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=900&auto=format&fit=crop',
    specs: {
      Feather: 'Grade A goose',
      Cork: 'Triple-layer natural',
      Speed: '77 (standard)',
      Pack: '12 tubes',
    },
  },
  {
    name: 'TOURNAMENT FLIGHT 77',
    category: 'Shuttles',
    subCategory: 'FEATHER / SPEED 77',
    description:
      'Consistent trajectory for club matches; tested for altitude and humidity.',
    price: 38,
    stock: 200,
    imageUrl:
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=900&auto=format&fit=crop',
    specs: {
      Speed: '77',
      Feather: 'Mixed grade A',
      Durability: 'Medium-high',
      Quantity: '12 per tube',
    },
  },
  {
    name: 'SPEED MASTER 12',
    category: 'Shuttles',
    subCategory: 'TRAINING VALUE',
    description:
      'Reliable training shuttles with good flight at a lower price point.',
    price: 28,
    stock: 180,
    imageUrl:
      'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=900&auto=format&fit=crop',
    specs: {
      Type: 'Feather',
      Speed: '76–77',
      Use: 'Training / drills',
      Pack: '12',
    },
  },
  {
    name: 'PREMIUM GOOSE A+',
    category: 'Shuttles',
    subCategory: 'NATIONAL EVENT',
    description:
      'Hand-selected feathers for minimal wobble and precise drop shots.',
    price: 52,
    stock: 80,
    imageUrl:
      'https://images.unsplash.com/photo-1517649763962-0c62306601b7?w=900&auto=format&fit=crop',
    specs: {
      Feather: 'A+ goose',
      Cork: 'Composite + natural',
      Speed: '78',
      Flight: 'Stable',
    },
  },
  {
    name: 'TRAINING FEATHER 10',
    category: 'Shuttles',
    subCategory: '10-PACK',
    description: 'Smaller pack for casual play and warm-up before matches.',
    price: 22,
    stock: 150,
    imageUrl:
      'https://images.unsplash.com/photo-1626224582824-87c94bf94b8c?w=900&auto=format&fit=crop',
    specs: {
      Quantity: '10',
      Type: 'Feather',
      Speed: '77',
      Use: 'Casual / warm-up',
    },
  },
  // Apparel (5)
  {
    name: 'PRECISION TEE 01',
    category: 'Apparel',
    subCategory: 'CARBON-FIBER MESH / AERO-FIT',
    description:
      'Carbon-infused fibers for thermal regulation and zero-drag performance during high-intensity sessions.',
    price: 110,
    stock: 70,
    imageUrl:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&auto=format&fit=crop',
    specs: {
      Material: '92% poly, 8% elastane',
      Fit: 'Athletic / slim',
      Technology: 'Thermal-reg mesh',
      Care: 'Machine wash cold',
    },
  },
  {
    name: 'AERO SPLIT SHORTS',
    category: 'Apparel',
    subCategory: 'COURT / BLACK',
    description:
      'Laser-cut side vents and inner brief for full range of motion on court.',
    price: 72,
    stock: 55,
    imageUrl:
      'https://images.unsplash.com/photo-1591195853828-11db59a44d6d?w=900&auto=format&fit=crop',
    specs: {
      Inseam: '5 in',
      Liner: 'Built-in brief',
      Waist: 'Drawcord',
      Fabric: 'Lightweight stretch',
    },
  },
  {
    name: 'CARBON HOODIE LIGHT',
    category: 'Apparel',
    subCategory: 'WARM-UP / GRAPHITE',
    description:
      'Thin technical hoodie for travel and warm-up; packs down small.',
    price: 128,
    stock: 40,
    imageUrl:
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=900&auto=format&fit=crop',
    specs: {
      Weight: 'Light',
      Hood: 'Adjustable',
      Pockets: 'Zip hand pockets',
      Season: 'Spring / fall',
    },
  },
  {
    name: 'COMPRESSION ARM SLEEVES (PAIR)',
    category: 'Apparel',
    subCategory: 'RECOVERY / BLACK',
    description:
      'Graduated compression for forearms; reduces vibration on repeated swings.',
    price: 34,
    stock: 90,
    imageUrl:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&auto=format&fit=crop',
    specs: {
      Sizing: 'S–XL',
      Compression: '15–20 mmHg',
      Pair: '2 sleeves',
      Use: 'Match / training',
    },
  },
  {
    name: 'ELITE PERFORMANCE POLO',
    category: 'Apparel',
    subCategory: 'CLUB / WHITE',
    description:
      'Moisture-wicking polo with structured collar for club nights and coaching.',
    price: 88,
    stock: 48,
    imageUrl:
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=900&auto=format&fit=crop',
    specs: {
      Collar: 'Structured knit',
      Buttons: 'Hidden placket',
      Fabric: 'Quick-dry pique',
      Fit: 'Regular',
    },
  },
];
