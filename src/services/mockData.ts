import { Category, Product, Address, Coupon, NotificationItem, SupportFaq } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-laptops',
    name: 'Laptops',
    slug: 'laptops',
    iconName: 'laptop-mac',
    itemCount: 28,
    subcategories: ['MacBooks', 'Gaming Laptops', 'Ultrabooks', 'Workstations'],
  },
  {
    id: 'cat-phones',
    name: 'Phones',
    slug: 'phones',
    iconName: 'smartphone',
    itemCount: 42,
    subcategories: ['Flagship 5G', 'Foldable Phones', 'Gaming Phones', 'Budget Killers'],
  },
  {
    id: 'cat-audio',
    name: 'Audio',
    slug: 'audio',
    iconName: 'headphones',
    itemCount: 35,
    subcategories: ['Noise Cancelling', 'TWS Earbuds', 'Studio Monitors', 'Soundbars'],
  },
  {
    id: 'cat-wearables',
    name: 'Wearables',
    slug: 'wearables',
    iconName: 'watch',
    itemCount: 19,
    subcategories: ['Titanium Watches', 'Fitness Bands', 'Smart Rings', 'AR Glasses'],
  },
  {
    id: 'cat-gaming',
    name: 'Gaming',
    slug: 'gaming',
    iconName: 'sports-esports',
    itemCount: 31,
    subcategories: ['Consoles', 'Mechanical Keyboards', 'Gaming Mice', 'OLED Monitors'],
  },
  {
    id: 'cat-cameras',
    name: 'Cameras',
    slug: 'cameras',
    iconName: 'photo-camera',
    itemCount: 16,
    subcategories: ['Mirrorless Full Frame', 'Action Cams', 'Cinema Lenses', 'Gimbals'],
  },
  {
    id: 'cat-accessories',
    name: 'Accessories',
    slug: 'accessories',
    iconName: 'cable',
    itemCount: 54,
    subcategories: ['GaN Fast Chargers', 'Thunderbolt Docks', 'Bags & Sleeves', 'MagSafe'],
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-aerosound-pro',
    name: 'AeroSound Pro Max ANC',
    brand: 'VoltAcoustics',
    tagline: 'Flagship Studio ANC Over-Ear Acoustics with Ultra Low Latency',
    description:
      'Engineered for discerning audiophiles and music producers. Features custom 45mm neodymium beryllium drivers, active hybrid noise cancellation with 8 precision microphones, lossless 24-bit 96kHz wireless streaming, and 42-hour continuous endurance playback.',
    categoryId: 'cat-audio',
    categoryName: 'Audio',
    price: 24999,
    originalPrice: 32999,
    discountPercentage: 24,
    rating: 4.9,
    reviewCount: 2410,
    inStock: true,
    stockCount: 14,
    isFlashDeal: true,
    isFeatured: true,
    dealEndsInHours: 8,
    soldPercentage: 78,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    ],
    badges: ['Lightning Deal', 'Volt VIP Choice'],
    warranty: '2-Year International Brand Replacement Warranty',
    returnPolicy: '7-Day Hassle-Free Instant Return & Refund',
    variants: [
      {
        id: 'var-color',
        name: 'Color',
        options: [
          { label: 'Obsidian Black', value: 'black', priceDelta: 0 },
          { label: 'Cyber Cyan', value: 'cyan', priceDelta: 1000 },
          { label: 'Silver Mist', value: 'silver', priceDelta: 0 },
        ],
      },
    ],
    specs: [
      {
        group: 'Acoustic Performance',
        items: [
          { label: 'Driver Size', value: '45mm Beryllium diaphragm' },
          { label: 'Frequency Response', value: '4Hz - 48,000Hz' },
          { label: 'Impedance', value: '32 Ohms' },
          { label: 'Active Noise Cancellation', value: 'Dual-chip Hybrid ANC (-43dB)' },
        ],
      },
      {
        group: 'Connectivity & Battery',
        items: [
          { label: 'Wireless Protocol', value: 'Bluetooth 5.4 + LE Audio / LDAC' },
          { label: 'Battery Capacity', value: '920 mAh' },
          { label: 'Playback Time', value: '42 hrs (ANC ON) / 60 hrs (ANC OFF)' },
          { label: 'Fast Charge', value: '10 mins gives 6 hours' },
        ],
      },
    ],
  },
  {
    id: 'prod-titanpulse-ultra',
    name: 'TitanPulse Ultra Titanium Smartwatch',
    brand: 'VoltWear',
    tagline: 'Aerospace-Grade Titanium GPS Smartwatch with Sapphire Glass',
    description:
      'Forged from Grade 5 aerospace titanium with sapphire crystal lens and ceramic back. Features dual-frequency GNSS tracking, ECG arrhythmia analysis, depth gauge to 40 meters, and an ultra-bright 2500 nits micro-OLED retina display.',
    categoryId: 'cat-wearables',
    categoryName: 'Wearables',
    price: 18499,
    originalPrice: 22999,
    discountPercentage: 20,
    rating: 4.8,
    reviewCount: 1820,
    inStock: true,
    stockCount: 12,
    isFlashDeal: true,
    isFeatured: true,
    dealEndsInHours: 6,
    soldPercentage: 60,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80',
    ],
    badges: ['Hot Pick', 'Best Seller'],
    warranty: '1-Year Manufacturer Complete Protection',
    returnPolicy: '7-Day Replacement Policy',
    variants: [
      {
        id: 'var-strap',
        name: 'Band Type',
        options: [
          { label: 'Trail Loop Charcoal', value: 'loop', priceDelta: 0 },
          { label: 'Titanium Milanese', value: 'milanese', priceDelta: 2500 },
          { label: 'Oceanic Cyan Fluoroelastomer', value: 'cyan', priceDelta: 500 },
        ],
      },
    ],
    specs: [
      {
        group: 'Display & Build',
        items: [
          { label: 'Display', value: '1.96-inch LTPO OLED, 2500 Nits peak' },
          { label: 'Bezel Material', value: 'Titanium Grade 5' },
          { label: 'Water Resistance', value: '10 ATM (100 meters)' },
        ],
      },
      {
        group: 'Sensors & Health',
        items: [
          { label: 'Health Sensors', value: 'ECG, SpO2, Skin Temp, Heart Rate' },
          { label: 'Battery Life', value: 'Up to 7 days standard / 72h GPS' },
        ],
      },
    ],
  },
  {
    id: 'prod-macbook-pro-m3',
    name: 'MacBook Pro 16" M3 Max Flagship',
    brand: 'Apple',
    tagline: 'Scary Fast 16-Core CPU, 40-Core GPU, Liquid Retina XDR',
    description:
      'The ultimate mobile powerhouse for developers, 3D artists, and computational engineers. Powered by the groundbreaking M3 Max chip with 48GB unified memory and 1TB ultra-fast PCIe Gen4 SSD.',
    categoryId: 'cat-laptops',
    categoryName: 'Laptops',
    price: 319900,
    originalPrice: 349900,
    discountPercentage: 9,
    rating: 5.0,
    reviewCount: 940,
    inStock: true,
    stockCount: 6,
    isFlashDeal: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&auto=format&fit=crop&q=80',
    ],
    badges: ['Pro Hardware', 'VIP Free Delivery'],
    warranty: '1-Year Apple Warranty + AppleCare Available',
    returnPolicy: '7-Day Return Policy',
    variants: [
      {
        id: 'var-memory',
        name: 'Unified Memory',
        options: [
          { label: '48GB Unified', value: '48gb', priceDelta: 0 },
          { label: '64GB Unified', value: '64gb', priceDelta: 40000 },
          { label: '128GB Unified', value: '128gb', priceDelta: 100000 },
        ],
      },
    ],
    specs: [
      {
        group: 'Processor & Memory',
        items: [
          { label: 'Processor', value: 'Apple M3 Max (16-Core CPU, 40-Core GPU)' },
          { label: 'Memory', value: '48GB Unified Memory, 400GB/s bandwidth' },
          { label: 'Storage', value: '1TB Superfast PCIe NVMe SSD' },
        ],
      },
      {
        group: 'Display & Ports',
        items: [
          { label: 'Display', value: '16.2-inch Liquid Retina XDR (120Hz ProMotion)' },
          { label: 'Ports', value: '3x Thunderbolt 4, HDMI 2.1, SDXC, MagSafe 3' },
        ],
      },
    ],
  },
  {
    id: 'prod-cyberblade-gaming',
    name: 'CyberBlade OLED RTX 4080 Gaming Rig 16"',
    brand: 'VoltTech Labs',
    tagline: '240Hz 2.5K QHD+ OLED, Intel Core i9-14900HX, Vapor Chamber',
    description:
      'Hyper-fast esports gaming laptop crafted in CNC anodized obsidian aluminum with illuminated RGB micro-perforations. Powered by GeForce RTX 4080 175W TGP with full MUX Switch and NVIDIA G-SYNC.',
    categoryId: 'cat-gaming',
    categoryName: 'Gaming',
    price: 189999,
    originalPrice: 224999,
    discountPercentage: 15,
    rating: 4.8,
    reviewCount: 650,
    inStock: true,
    stockCount: 8,
    isFlashDeal: true,
    isFeatured: true,
    dealEndsInHours: 14,
    soldPercentage: 45,
    images: [
      'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80',
    ],
    badges: ['Gamers Choice', 'GeForce RTX 4080'],
    warranty: '2-Year On-Site Express Warranty',
    returnPolicy: '7-Day Return Policy',
    specs: [
      {
        group: 'Graphics & Performance',
        items: [
          { label: 'GPU', value: 'NVIDIA GeForce RTX 4080 12GB GDDR6 (175W)' },
          { label: 'CPU', value: 'Intel Core i9-14900HX (24 cores, 5.8 GHz)' },
          { label: 'RAM', value: '32GB DDR5 5600MHz (Upgradable to 64GB)' },
        ],
      },
    ],
  },
  {
    id: 'prod-sony-a7rv',
    name: 'Sony Alpha 7R V Mirrorless Camera',
    brand: 'Sony',
    tagline: '61.0 MP Full-Frame Exmor R Sensor with AI Autofocus Tracking',
    description:
      'The benchmark in precision commercial photography. Real-time AI recognition autofocus for humans, vehicles, birds, and insects with 8-stop in-body 5-axis image stabilization.',
    categoryId: 'cat-cameras',
    categoryName: 'Cameras',
    price: 334990,
    originalPrice: 369990,
    discountPercentage: 9,
    rating: 4.9,
    reviewCount: 312,
    inStock: true,
    stockCount: 4,
    isFlashDeal: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80',
    ],
    badges: ['Studio Master', 'Official Sony India'],
    warranty: '2-Year Official Sony India Warranty',
    returnPolicy: '7-Day Replacement Policy',
    specs: [
      {
        group: 'Camera Specs',
        items: [
          { label: 'Sensor', value: '61.0 MP 35mm full-frame Exmor R CMOS' },
          { label: 'Autofocus', value: '693 Phase-detection points with AI processor' },
          { label: 'Video', value: '8K 24p / 4K 60p 10-bit 4:2:2 All-Intra' },
        ],
      },
    ],
  },
  {
    id: 'prod-gan-140w',
    name: 'VoltWarp 140W GaN Fast Charging Station',
    brand: 'VoltTech Labs',
    tagline: 'Quad-Port PD 3.1 Gallium Nitride Charger for Laptops & Phones',
    description:
      'Replace all your bulky bricks with one pocket-sized 140W powerhouse. Features 3x USB-C PD 3.1 and 1x USB-A QC 4.0 ports with intelligent dynamic power distribution and intelligent thermal heat monitoring.',
    categoryId: 'cat-accessories',
    categoryName: 'Accessories',
    price: 4499,
    originalPrice: 6999,
    discountPercentage: 35,
    rating: 4.7,
    reviewCount: 1450,
    inStock: true,
    stockCount: 48,
    isFlashDeal: true,
    isFeatured: false,
    dealEndsInHours: 24,
    soldPercentage: 82,
    images: [
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&auto=format&fit=crop&q=80',
    ],
    badges: ['Top Accessory', 'PD 3.1 Fast Charge'],
    warranty: '18-Month Replacement Warranty',
    returnPolicy: '7-Day Return Policy',
    specs: [
      {
        group: 'Power & Output',
        items: [
          { label: 'Max Output', value: '140W USB Power Delivery 3.1' },
          { label: 'Ports', value: '3x USB-C + 1x USB-A' },
          { label: 'Technology', value: 'GaNFast Gallium Nitride Chipset' },
        ],
      },
    ],
  },
  {
    id: 'prod-voltmech-keyboard',
    name: 'VoltMech RGB Mechanical Keyboard',
    brand: 'VoltTech',
    tagline: 'Gasket-Mounted Hot-Swappable Wireless Keyboard with OLED Display',
    description:
      'Precision tactile keyboard featuring pre-lubed linear switches, sound dampening PORON silicone foam, South-facing RGB lighting, and an integrated customizable mini OLED display for system stats.',
    categoryId: 'cat-gaming',
    categoryName: 'Gaming',
    price: 11999,
    originalPrice: 14999,
    discountPercentage: 20,
    rating: 4.8,
    reviewCount: 520,
    inStock: true,
    stockCount: 22,
    isFlashDeal: false,
    isFeatured: true,
    images: [
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80',
    ],
    badges: ['Gasket Mount', 'Hot-Swap'],
    warranty: '1-Year Warranty',
    returnPolicy: '7-Day Return Policy',
    specs: [
      {
        group: 'Hardware Specifications',
        items: [
          { label: 'Switch Type', value: 'Pre-lubed Cyan Linear Switches (Hot-swap)' },
          { label: 'Connectivity', value: 'Tri-Mode: 2.4Ghz + BT 5.2 + Type-C' },
          { label: 'Battery', value: '4000 mAh rechargeable battery' },
        ],
      },
    ],
  },
];

export const INITIAL_ADDRESSES: Address[] = [
  {
    id: 'addr-1',
    userId: 'user-default',
    fullName: 'Rahul Sharma',
    phone: '+91 98765 43210',
    addressLine1: 'Flat 402, Cyber Heights Apartments',
    addressLine2: 'Outer Ring Road, Bellandur',
    landmark: 'Near Ecospace Tech Park',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560103',
    type: 'HOME',
    isDefault: true,
  },
  {
    id: 'addr-2',
    userId: 'user-default',
    fullName: 'Rahul Sharma (Office)',
    phone: '+91 98765 43210',
    addressLine1: 'VoltTech HQ, Level 7, Prestige Tech Cloud',
    addressLine2: 'Marathahalli - Sarjapur Outer Ring Rd',
    landmark: 'Opposite Cisco Gate 2',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560087',
    type: 'WORK',
    isDefault: false,
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: 'CYBERVOLT',
    description: 'Instant ₹1,500 VIP discount on orders above ₹10,000',
    discountType: 'flat',
    discountValue: 1500,
    minOrderValue: 10000,
  },
  {
    code: 'VOLT500',
    description: 'Flat ₹500 off on checkout across all tech orders',
    discountType: 'flat',
    discountValue: 500,
    minOrderValue: 2000,
  },
  {
    code: 'FESTIVAL10',
    description: '10% instant festival discount (up to ₹3,000)',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 5000,
    maxDiscount: 3000,
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Flash Sale: 40% Off AeroSound Pro ANC',
    message: 'Cyber Sound Week deals are live now with extra cashback on UPI.',
    type: 'deal',
    timestamp: '10 mins ago',
    read: false,
  },
  {
    id: 'notif-2',
    title: 'Order Shipped: VT-ORD-88219',
    message: 'Your TitanPulse Ultra Titanium Smartwatch has been dispatched via BlueDart Express Air.',
    type: 'order',
    timestamp: '2 hours ago',
    read: false,
    orderId: 'VT-ORD-88219',
  },
  {
    id: 'notif-3',
    title: 'Volt VIP Status Activated',
    message: 'Enjoy free priority air delivery and 24/7 dedicated hardware concierge.',
    type: 'system',
    timestamp: '1 day ago',
    read: true,
  },
];

export const SUPPORT_FAQS: SupportFaq[] = [
  {
    id: 'faq-1',
    category: 'Orders',
    question: 'How do I track my delivery status in real-time?',
    answer:
      'You can track your order directly inside the Order History section under Account. Click on any active order to see real-time updates from our express air logistics network.',
  },
  {
    id: 'faq-2',
    category: 'Payments',
    question: 'What Razorpay payment methods are accepted?',
    answer:
      'We accept all Razorpay-powered payment options including UPI (Google Pay, PhonePe, Paytm, Custom VPA), Credit & Debit cards (Visa, MasterCard, RuPay, Amex), Net Banking with over 50+ banks, No-Cost EMI, and Cash on Delivery.',
  },
  {
    id: 'faq-3',
    category: 'Warranty',
    question: 'Is the official brand warranty valid across India?',
    answer:
      'Yes, 100% of products sold on VoltTech come with authentic manufacturer invoices and official pan-India brand warranty honored at any authorized service center.',
  },
  {
    id: 'faq-4',
    category: 'Returns',
    question: 'What is the 7-day replacement guarantee?',
    answer:
      'If your hardware arrives with any manufacturing defect, transit damage, or mismatch, simply raise a replacement request within 7 days from the order details screen for doorstep pickup.',
  },
];
