/**
 * B2B Business Signs sub-pages – each with real examples, materials, prices, quote CTA
 */
export interface SignSubPage {
  id: string;
  title: string;
  desc: string;
  img: string;
  materials: { name: string; priceRange: string }[];
  priceRange: string;
  examples: string[];
}

export const businessSignsSubPages: SignSubPage[] = [
  {
    id: 'reception',
    title: 'Reception Logo Signs',
    desc: 'Make a lasting first impression. 3D layered acrylic or LED backlit logos for reception walls and lobbies.',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
    materials: [
      { name: 'Layered 3D Acrylic', priceRange: 'From $299' },
      { name: 'LED Backlit Acrylic', priceRange: 'From $449' },
      { name: 'Brushed Metal Finish', priceRange: 'From $399' },
    ],
    priceRange: '$299 – $1,200+',
    examples: ['Corporate lobbies', 'Medical offices', 'Law firms', 'Co-working spaces'],
  },
  {
    id: 'outdoor',
    title: 'Outdoor Business Signs',
    desc: 'Durable signage for storefronts, building facades, and outdoor branding. Weather-resistant materials.',
    img: 'https://images.unsplash.com/photo-1556740714-a8395b3bf30f?w=800&q=80',
    materials: [
      { name: 'Aluminium Composite (Dibond)', priceRange: 'From $199' },
      { name: 'Acrylic + UV Print', priceRange: 'From $349' },
      { name: 'Natural Wood + Acrylic', priceRange: 'From $279' },
    ],
    priceRange: '$199 – $800+',
    examples: ['Restaurants', 'Retail stores', 'Salons', 'Gyms'],
  },
  {
    id: 'led',
    title: 'LED Acrylic Signs',
    desc: 'Stunning illuminated signs. Warm white, neon blue, or purple halo. Perfect for studios, bars, and modern offices.',
    img: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3?w=800&q=80',
    materials: [
      { name: 'Edge-Lit Acrylic', priceRange: 'From $349' },
      { name: 'Halo Backlit 3D', priceRange: 'From $499' },
      { name: 'RGB Color Changing', priceRange: 'From $549' },
    ],
    priceRange: '$349 – $900+',
    examples: ['YouTube studios', 'Gaming rooms', 'Bars & lounges', 'Salons'],
  },
  {
    id: 'office',
    title: 'Office Door Signs',
    desc: 'Professional nameplates, room signs, and directional signage. Clean, readable, and on-brand.',
    img: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80',
    materials: [
      { name: 'Matte Black Acrylic', priceRange: 'From $39' },
      { name: 'Brushed Brass', priceRange: 'From $69' },
      { name: 'Natural Oak', priceRange: 'From $59' },
    ],
    priceRange: '$39 – $129',
    examples: ['Meeting rooms', 'Executive offices', 'Wayfinding', 'Department signs'],
  },
  {
    id: 'restaurant',
    title: 'Restaurant Signs',
    desc: 'Menu boards, chalkboard replacements, and branded signage. Durable and easy to update.',
    img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
    materials: [
      { name: 'Engraved Oak Menu Board', priceRange: 'From $149' },
      { name: 'Acrylic Menu Panel', priceRange: 'From $99' },
      { name: 'LED Backlit Menu', priceRange: 'From $299' },
    ],
    priceRange: '$99 – $400+',
    examples: ['Menu boards', 'Special boards', 'Hours of operation', 'QR code stands'],
  },
  {
    id: 'salon',
    title: 'Salon & Barbershop Signs',
    desc: 'Brand your space. Logo signs, service menus, and decorative signage that matches your vibe.',
    img: 'https://images.unsplash.com/photo-1521484342378-0027f6ce72a8?w=800&q=80',
    materials: [
      { name: 'LED Neon-Style Logo', priceRange: 'From $249' },
      { name: '3D Layered Acrylic', priceRange: 'From $199' },
      { name: 'Mirror + Acrylic', priceRange: 'From $179' },
    ],
    priceRange: '$179 – $500+',
    examples: ['Reception logos', 'Service menus', 'Mirror signage', 'Brand walls'],
  },
];
