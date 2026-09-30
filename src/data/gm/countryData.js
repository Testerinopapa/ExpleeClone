import rawCountries from './gmCountries.json';

// SVG map silhouettes for prominent countries
export const COUNTRY_SVGS = {
  india: `<path d="M200,30 L215,45 L225,65 L215,90 L235,105 L260,105 L290,95 L320,105 L350,110 L340,135 L310,140 L285,130 L260,140 L250,165 L265,195 L270,225 L260,260 L245,290 L230,325 L215,360 L205,380 L195,360 L180,325 L165,280 L145,240 L135,215 L115,200 L95,195 L75,185 L85,160 L115,150 L135,135 L145,105 L165,80 L185,55 Z" />`,
  brazil: `<path d="M120,40 L180,45 L240,55 L290,80 L340,110 L370,140 L380,180 L350,220 L320,260 L290,300 L260,340 L230,370 L200,380 L180,360 L160,320 L130,280 L90,240 L60,200 L50,160 L60,120 L80,80 Z" />`,
  'united-states': `<path d="M40,110 L90,105 L150,100 L210,95 L270,95 L330,85 L370,95 L375,130 L360,170 L340,210 L345,260 L325,280 L305,250 L280,240 L250,265 L220,290 L190,285 L160,250 L120,245 L80,240 L50,220 L40,170 Z" />`,
  germany: `<path d="M160,40 L200,35 L240,45 L250,80 L265,115 L260,155 L275,195 L270,240 L260,280 L275,320 L260,360 L220,370 L180,365 L140,360 L125,320 L135,275 L120,230 L130,180 L120,135 L135,95 L140,65 Z" />`,
  japan: `<path d="M310,40 L340,60 L330,90 L300,105 L280,120 L270,150 L250,180 L230,210 L210,240 L185,270 L160,290 L130,310 L105,330 L80,345 L65,360 L75,340 L100,315 L125,285 L150,255 L180,220 L210,180 L240,140 L270,95 L290,65 Z" />`,
  china: `<path d="M150,60 L210,70 L270,60 L330,70 L380,80 L390,120 L370,160 L340,200 L320,240 L290,270 L260,300 L220,320 L180,310 L140,290 L100,260 L70,220 L50,180 L60,140 L90,100 L120,80 Z" />`,
  france: `<path d="M180,50 L230,60 L270,90 L290,140 L280,190 L260,240 L240,290 L210,330 L170,340 L130,320 L100,280 L90,230 L100,180 L110,130 L130,90 L150,65 Z" />`,
  'united-kingdom': `<path d="M220,50 L250,75 L230,110 L210,140 L230,170 L250,210 L260,260 L250,300 L230,330 L200,340 L180,310 L170,260 L180,220 L160,180 L180,140 L190,100 L200,70 Z" />`,
  mexico: `<path d="M60,80 L120,95 L180,120 L230,160 L270,200 L310,230 L350,220 L370,240 L350,270 L300,280 L260,260 L220,240 L170,210 L130,170 L90,140 L60,110 Z" />`,
  indonesia: `<path d="M40,180 L90,190 L140,200 L190,210 L240,205 L290,210 L340,215 L380,210 L360,230 L300,230 L250,225 L200,225 L150,220 L100,210 L50,200 Z" />`,
  italy: `<path d="M140,70 L200,80 L240,110 L250,150 L240,190 L260,230 L280,270 L290,310 L260,330 L240,300 L220,260 L200,220 L180,190 L160,160 L140,130 L130,100 Z" />`,
  spain: `<path d="M120,90 L190,85 L260,100 L300,140 L320,190 L300,240 L270,280 L220,310 L170,320 L120,300 L90,260 L80,210 L90,160 L100,120 Z" />`,
};

// Rich palette for treemap tiles
const TREEMAP_COLORS = [
  'bg-[#00947c]', // Emerald/Teal primary
  'bg-[#0284c7]', // Deep sky blue
  'bg-[#4f46e5]', // Indigo
  'bg-[#0d9488]', // Dark teal
  'bg-[#16a34a]', // Vibrant green
  'bg-[#7c3aed]', // Violet
  'bg-[#ea580c]', // Deep orange
  'bg-[#d97706]', // Amber
  'bg-[#059669]', // Forest emerald
  'bg-[#0891b2]', // Cyan
  'bg-[#2563eb]', // Royal blue
  'bg-[#db2777]', // Magenta pink
  'bg-[#9333ea]', // Purple
  'bg-[#e11d48]', // Crimson rose
  'bg-[#475569]', // Slate steel
];

// Curated detailed data matching original requirements
const CURATED_COUNTRY_PROFILES = {
  india: {
    cities: [
      { rank: 1, name: 'Bengaluru', count: '678K+' },
      { rank: 2, name: 'Hyderabad', count: '461K+' },
      { rank: 3, name: 'Chennai', count: '439K+' },
      { rank: 4, name: 'Mumbai', count: '435K+' },
      { rank: 5, name: 'Pune', count: '298K+' },
      { rank: 6, name: 'Delhi', count: '291K+' },
      { rank: 7, name: 'Kolkata', count: '286K+' },
      { rank: 8, name: 'Ahmedabad', count: '266K+' },
      { rank: 9, name: 'New Delhi, Delhi', count: '248K+' },
      { rank: 10, name: 'Jaipur', count: '241K+' },
    ],
    categories: [
      { name: 'Hindu temple', count: '1.8M', value: 1840000, color: TREEMAP_COLORS[0] },
      { name: 'Housing society', count: '1.4M', value: 1410000, color: TREEMAP_COLORS[1] },
      { name: 'Apartment building', count: '1.2M', value: 1180000, color: TREEMAP_COLORS[2] },
      { name: 'Housing complex', count: '980K', value: 980000, color: TREEMAP_COLORS[3] },
      { name: 'General store', count: '850K', value: 850000, color: TREEMAP_COLORS[4] },
      { name: 'Housing development', count: '740K', value: 740000, color: TREEMAP_COLORS[5] },
      { name: 'Pharmacy', count: '690K', value: 690000, color: TREEMAP_COLORS[6] },
      { name: 'Clothing store', count: '620K', value: 620000, color: TREEMAP_COLORS[7] },
      { name: 'Restaurant', count: '580K', value: 580000, color: TREEMAP_COLORS[8] },
      { name: 'Corporate office', count: '520K', value: 520000, color: TREEMAP_COLORS[9] },
      { name: 'Government office', count: '460K', value: 460000, color: TREEMAP_COLORS[10] },
      { name: 'Grocery store', count: '430K', value: 430000, color: TREEMAP_COLORS[11] },
      { name: 'Hospital', count: '390K', value: 390000, color: TREEMAP_COLORS[12] },
      { name: 'Educational institution', count: '360K', value: 360000, color: TREEMAP_COLORS[13] },
      { name: 'Store', count: '320K', value: 320000, color: TREEMAP_COLORS[14] },
    ],
  },
  brazil: {
    cities: [
      { rank: 1, name: 'São Paulo', count: '742K+' },
      { rank: 2, name: 'Rio de Janeiro', count: '485K+' },
      { rank: 3, name: 'Belo Horizonte', count: '312K+' },
      { rank: 4, name: 'Brasília', count: '289K+' },
      { rank: 5, name: 'Curitiba', count: '236K+' },
      { rank: 6, name: 'Porto Alegre', count: '214K+' },
      { rank: 7, name: 'Salvador', count: '198K+' },
      { rank: 8, name: 'Fortaleza', count: '186K+' },
      { rank: 9, name: 'Campinas', count: '172K+' },
      { rank: 10, name: 'Recife', count: '158K+' },
    ],
    categories: [
      { name: 'Restaurante', count: '890K', value: 890000, color: TREEMAP_COLORS[0] },
      { name: 'Loja de roupas', count: '740K', value: 740000, color: TREEMAP_COLORS[1] },
      { name: 'Farmácia', count: '580K', value: 580000, color: TREEMAP_COLORS[2] },
      { name: 'Salão de beleza', count: '510K', value: 510000, color: TREEMAP_COLORS[3] },
      { name: 'Supermercado', count: '470K', value: 470000, color: TREEMAP_COLORS[4] },
      { name: 'Padaria', count: '410K', value: 410000, color: TREEMAP_COLORS[5] },
      { name: 'Oficina mecânica', count: '360K', value: 360000, color: TREEMAP_COLORS[6] },
      { name: 'Condomínio', count: '340K', value: 340000, color: TREEMAP_COLORS[7] },
      { name: 'Igreja', count: '310K', value: 310000, color: TREEMAP_COLORS[8] },
      { name: 'Academia', count: '280K', value: 280000, color: TREEMAP_COLORS[9] },
      { name: 'Bar', count: '260K', value: 260000, color: TREEMAP_COLORS[10] },
      { name: 'Imobiliária', count: '240K', value: 240000, color: TREEMAP_COLORS[11] },
      { name: 'Dentista', count: '220K', value: 220000, color: TREEMAP_COLORS[12] },
      { name: 'Escola', count: '210K', value: 210000, color: TREEMAP_COLORS[13] },
      { name: 'Consultório médico', count: '190K', value: 190000, color: TREEMAP_COLORS[14] },
    ],
  },
  'united-states': {
    cities: [
      { rank: 1, name: 'New York, NY', count: '512K+' },
      { rank: 2, name: 'Los Angeles, CA', count: '438K+' },
      { rank: 3, name: 'Houston, TX', count: '382K+' },
      { rank: 4, name: 'Chicago, IL', count: '345K+' },
      { rank: 5, name: 'Phoenix, AZ', count: '264K+' },
      { rank: 6, name: 'Dallas, TX', count: '251K+' },
      { rank: 7, name: 'San Antonio, TX', count: '218K+' },
      { rank: 8, name: 'San Diego, CA', count: '204K+' },
      { rank: 9, name: 'Austin, TX', count: '195K+' },
      { rank: 10, name: 'Jacksonville, FL', count: '178K+' },
    ],
    categories: [
      { name: 'Restaurant', count: '1.2M', value: 1200000, color: TREEMAP_COLORS[0] },
      { name: 'Doctor', count: '940K', value: 940000, color: TREEMAP_COLORS[1] },
      { name: 'Real estate agency', count: '810K', value: 810000, color: TREEMAP_COLORS[2] },
      { name: 'Church', count: '760K', value: 760000, color: TREEMAP_COLORS[3] },
      { name: 'Law firm / Attorney', count: '690K', value: 690000, color: TREEMAP_COLORS[4] },
      { name: 'Dentist', count: '610K', value: 610000, color: TREEMAP_COLORS[5] },
      { name: 'Fast food restaurant', count: '540K', value: 540000, color: TREEMAP_COLORS[6] },
      { name: 'Insurance agency', count: '490K', value: 490000, color: TREEMAP_COLORS[7] },
      { name: 'Auto repair shop', count: '460K', value: 460000, color: TREEMAP_COLORS[8] },
      { name: 'Beauty salon', count: '430K', value: 430000, color: TREEMAP_COLORS[9] },
      { name: 'Construction company', count: '390K', value: 390000, color: TREEMAP_COLORS[10] },
      { name: 'Gas station', count: '350K', value: 350000, color: TREEMAP_COLORS[11] },
      { name: 'Store', count: '320K', value: 320000, color: TREEMAP_COLORS[12] },
      { name: 'School', count: '290K', value: 290000, color: TREEMAP_COLORS[13] },
      { name: 'Bank', count: '270K', value: 270000, color: TREEMAP_COLORS[14] },
    ],
  },
  germany: {
    cities: [
      { rank: 1, name: 'Berlin', count: '394K+' },
      { rank: 2, name: 'Munich', count: '281K+' },
      { rank: 3, name: 'Hamburg', count: '264K+' },
      { rank: 4, name: 'Cologne', count: '189K+' },
      { rank: 5, name: 'Frankfurt am Main', count: '178K+' },
      { rank: 6, name: 'Stuttgart', count: '152K+' },
      { rank: 7, name: 'Düsseldorf', count: '145K+' },
      { rank: 8, name: 'Leipzig', count: '128K+' },
      { rank: 9, name: 'Dortmund', count: '114K+' },
      { rank: 10, name: 'Essen', count: '108K+' },
    ],
    categories: [
      { name: 'Restaurant', count: '480K', value: 480000, color: TREEMAP_COLORS[0] },
      { name: 'Arzt / Arztpraxis', count: '390K', value: 390000, color: TREEMAP_COLORS[1] },
      { name: 'Bäckerei', count: '310K', value: 310000, color: TREEMAP_COLORS[2] },
      { name: 'Friseursalon', count: '270K', value: 270000, color: TREEMAP_COLORS[3] },
      { name: 'Zahnarzt', count: '240K', value: 240000, color: TREEMAP_COLORS[4] },
      { name: 'Apotheke', count: '210K', value: 210000, color: TREEMAP_COLORS[5] },
      { name: 'Rechtsanwalt', count: '195K', value: 195000, color: TREEMAP_COLORS[6] },
      { name: 'Autowerkstatt', count: '180K', value: 180000, color: TREEMAP_COLORS[7] },
      { name: 'Hotel', count: '165K', value: 165000, color: TREEMAP_COLORS[8] },
      { name: 'Café', count: '150K', value: 150000, color: TREEMAP_COLORS[9] },
      { name: 'Supermarkt', count: '140K', value: 140000, color: TREEMAP_COLORS[10] },
      { name: 'Immobilienmakler', count: '125K', value: 125000, color: TREEMAP_COLORS[11] },
      { name: 'Physiotherapeut', count: '115K', value: 115000, color: TREEMAP_COLORS[12] },
      { name: 'Kirche', count: '105K', value: 105000, color: TREEMAP_COLORS[13] },
      { name: 'Schule', count: '95K', value: 95000, color: TREEMAP_COLORS[14] },
    ],
  },
  japan: {
    cities: [
      { rank: 1, name: 'Tokyo', count: '890K+' },
      { rank: 2, name: 'Osaka', count: '420K+' },
      { rank: 3, name: 'Yokohama', count: '360K+' },
      { rank: 4, name: 'Nagoya', count: '310K+' },
      { rank: 5, name: 'Sapporo', count: '235K+' },
      { rank: 6, name: 'Fukuoka', count: '215K+' },
      { rank: 7, name: 'Kobe', count: '185K+' },
      { rank: 8, name: 'Kyoto', count: '175K+' },
      { rank: 9, name: 'Kawasaki', count: '140K+' },
      { rank: 10, name: 'Saitama', count: '130K+' },
    ],
    categories: [
      { name: 'Restaurant / Izakaya', count: '810K', value: 810000, color: TREEMAP_COLORS[0] },
      { name: 'Convenience store', count: '620K', value: 620000, color: TREEMAP_COLORS[1] },
      { name: 'Dental clinic', count: '540K', value: 540000, color: TREEMAP_COLORS[2] },
      { name: 'Hair salon', count: '490K', value: 490000, color: TREEMAP_COLORS[3] },
      { name: 'Pharmacy', count: '420K', value: 420000, color: TREEMAP_COLORS[4] },
      { name: 'Medical clinic', count: '390K', value: 390000, color: TREEMAP_COLORS[5] },
      { name: 'Real estate agency', count: '330K', value: 330000, color: TREEMAP_COLORS[6] },
      { name: 'Cafe', count: '290K', value: 290000, color: TREEMAP_COLORS[7] },
      { name: 'Shinto shrine', count: '270K', value: 270000, color: TREEMAP_COLORS[8] },
      { name: 'Buddhist temple', count: '250K', value: 250000, color: TREEMAP_COLORS[9] },
      { name: 'Construction company', count: '220K', value: 220000, color: TREEMAP_COLORS[10] },
      { name: 'Supermarket', count: '200K', value: 200000, color: TREEMAP_COLORS[11] },
      { name: 'Dry cleaner', count: '180K', value: 180000, color: TREEMAP_COLORS[12] },
      { name: 'Auto repair', count: '160K', value: 160000, color: TREEMAP_COLORS[13] },
      { name: 'Corporate office', count: '150K', value: 150000, color: TREEMAP_COLORS[14] },
    ],
  },
  china: {
    cities: [
      { rank: 1, name: 'Shanghai', count: '980K+' },
      { rank: 2, name: 'Beijing', count: '920K+' },
      { rank: 3, name: 'Guangzhou', count: '780K+' },
      { rank: 4, name: 'Shenzhen', count: '740K+' },
      { rank: 5, name: 'Chengdu', count: '620K+' },
      { rank: 6, name: 'Chongqing', count: '590K+' },
      { rank: 7, name: 'Hangzhou', count: '490K+' },
      { rank: 8, name: 'Wuhan', count: '470K+' },
      { rank: 9, name: "Xi'an", count: '440K+' },
      { rank: 10, name: 'Nanjing', count: '410K+' },
    ],
    categories: [
      { name: 'Restaurant', count: '2.4M', value: 2400000, color: TREEMAP_COLORS[0] },
      { name: 'Convenience store', count: '1.8M', value: 1800000, color: TREEMAP_COLORS[1] },
      { name: 'Residential community', count: '1.5M', value: 1500000, color: TREEMAP_COLORS[2] },
      { name: 'Shopping mall', count: '1.1M', value: 1100000, color: TREEMAP_COLORS[3] },
      { name: 'Corporate office', count: '950K', value: 950000, color: TREEMAP_COLORS[4] },
      { name: 'Hotel', count: '880K', value: 880000, color: TREEMAP_COLORS[5] },
      { name: 'Pharmacy', count: '810K', value: 810000, color: TREEMAP_COLORS[6] },
      { name: 'Hair salon', count: '740K', value: 740000, color: TREEMAP_COLORS[7] },
      { name: 'Fast food', count: '680K', value: 680000, color: TREEMAP_COLORS[8] },
      { name: 'Bank branch', count: '590K', value: 590000, color: TREEMAP_COLORS[9] },
      { name: 'Auto service', count: '540K', value: 540000, color: TREEMAP_COLORS[10] },
      { name: 'Electronics store', count: '480K', value: 480000, color: TREEMAP_COLORS[11] },
      { name: 'School', count: '420K', value: 420000, color: TREEMAP_COLORS[12] },
      { name: 'Hospital', count: '370K', value: 370000, color: TREEMAP_COLORS[13] },
      { name: 'Supermarket', count: '340K', value: 340000, color: TREEMAP_COLORS[14] },
    ],
  },
  'united-kingdom': {
    cities: [
      { rank: 1, name: 'London', count: '412K+' },
      { rank: 2, name: 'Manchester', count: '168K+' },
      { rank: 3, name: 'Birmingham', count: '154K+' },
      { rank: 4, name: 'Glasgow', count: '112K+' },
      { rank: 5, name: 'Leeds', count: '98K+' },
      { rank: 6, name: 'Liverpool', count: '87K+' },
      { rank: 7, name: 'Edinburgh', count: '79K+' },
      { rank: 8, name: 'Bristol', count: '72K+' },
      { rank: 9, name: 'Sheffield', count: '64K+' },
      { rank: 10, name: 'Newcastle upon Tyne', count: '59K+' },
    ],
    categories: [
      { name: 'Pub / Bar', count: '310K', value: 310000, color: TREEMAP_COLORS[0] },
      { name: 'Restaurant', count: '280K', value: 280000, color: TREEMAP_COLORS[1] },
      { name: 'Hairdresser', count: '190K', value: 190000, color: TREEMAP_COLORS[2] },
      { name: 'Coffee shop', count: '165K', value: 165000, color: TREEMAP_COLORS[3] },
      { name: 'Estate agent', count: '145K', value: 145000, color: TREEMAP_COLORS[4] },
      { name: 'Pharmacy / Chemist', count: '130K', value: 130000, color: TREEMAP_COLORS[5] },
      { name: 'Convenience store', count: '120K', value: 120000, color: TREEMAP_COLORS[6] },
      { name: 'Dentist', count: '110K', value: 110000, color: TREEMAP_COLORS[7] },
      { name: 'Auto garage', count: '98K', value: 98000, color: TREEMAP_COLORS[8] },
      { name: 'Solicitor / Law firm', count: '89K', value: 89000, color: TREEMAP_COLORS[9] },
      { name: 'Supermarket', count: '82K', value: 82000, color: TREEMAP_COLORS[10] },
      { name: 'Gym & Fitness', count: '75K', value: 75000, color: TREEMAP_COLORS[11] },
      { name: 'Hotel / B&B', count: '68K', value: 68000, color: TREEMAP_COLORS[12] },
      { name: 'Primary school', count: '62K', value: 62000, color: TREEMAP_COLORS[13] },
      { name: 'Clothing store', count: '55K', value: 55000, color: TREEMAP_COLORS[14] },
    ],
  },
  france: {
    cities: [
      { rank: 1, name: 'Paris', count: '580K+' },
      { rank: 2, name: 'Marseille', count: '210K+' },
      { rank: 3, name: 'Lyon', count: '195K+' },
      { rank: 4, name: 'Toulouse', count: '145K+' },
      { rank: 5, name: 'Nice', count: '128K+' },
      { rank: 6, name: 'Nantes', count: '114K+' },
      { rank: 7, name: 'Montpellier', count: '98K+' },
      { rank: 8, name: 'Strasbourg', count: '92K+' },
      { rank: 9, name: 'Bordeaux', count: '88K+' },
      { rank: 10, name: 'Lille', count: '82K+' },
    ],
    categories: [
      { name: 'Restaurant', count: '460K', value: 460000, color: TREEMAP_COLORS[0] },
      { name: 'Boulangerie / Pâtisserie', count: '380K', value: 380000, color: TREEMAP_COLORS[1] },
      { name: 'Médecin généraliste', count: '290K', value: 290000, color: TREEMAP_COLORS[2] },
      { name: 'Salon de coiffure', count: '250K', value: 250000, color: TREEMAP_COLORS[3] },
      { name: 'Pharmacie', count: '220K', value: 220000, color: TREEMAP_COLORS[4] },
      { name: 'Bar / Brasserie', count: '195K', value: 195000, color: TREEMAP_COLORS[5] },
      { name: 'Chirurgien-dentiste', count: '175K', value: 175000, color: TREEMAP_COLORS[6] },
      { name: 'Hôtel', count: '160K', value: 160000, color: TREEMAP_COLORS[7] },
      { name: 'Garage automobile', count: '145K', value: 145000, color: TREEMAP_COLORS[8] },
      { name: 'Agence immobilière', count: '130K', value: 130000, color: TREEMAP_COLORS[9] },
      { name: 'Supermarché', count: '120K', value: 120000, color: TREEMAP_COLORS[10] },
      { name: 'Kinésithérapeute', count: '110K', value: 110000, color: TREEMAP_COLORS[11] },
      { name: 'Boutique de vêtements', count: '95K', value: 95000, color: TREEMAP_COLORS[12] },
      { name: 'Avocat', count: '88K', value: 88000, color: TREEMAP_COLORS[13] },
      { name: 'École', count: '78K', value: 78000, color: TREEMAP_COLORS[14] },
    ],
  },
  mexico: {
    cities: [
      { rank: 1, name: 'Ciudad de México', count: '620K+' },
      { rank: 2, name: 'Guadalajara', count: '295K+' },
      { rank: 3, name: 'Monterrey', count: '280K+' },
      { rank: 4, name: 'Puebla', count: '175K+' },
      { rank: 5, name: 'Tijuana', count: '155K+' },
      { rank: 6, name: 'León', count: '135K+' },
      { rank: 7, name: 'Ciudad Juárez', count: '118K+' },
      { rank: 8, name: 'Querétaro', count: '112K+' },
      { rank: 9, name: 'Mérida', count: '98K+' },
      { rank: 10, name: 'Toluca', count: '89K+' },
    ],
    categories: [
      { name: 'Restaurante / Taquería', count: '520K', value: 520000, color: TREEMAP_COLORS[0] },
      { name: 'Tienda de abarrotes', count: '460K', value: 460000, color: TREEMAP_COLORS[1] },
      { name: 'Farmacia', count: '340K', value: 340000, color: TREEMAP_COLORS[2] },
      { name: 'Taller mecánico', count: '280K', value: 280000, color: TREEMAP_COLORS[3] },
      { name: 'Salón de belleza', count: '260K', value: 260000, color: TREEMAP_COLORS[4] },
      { name: 'Escuela', count: '230K', value: 230000, color: TREEMAP_COLORS[5] },
      { name: 'Papelería', count: '210K', value: 210000, color: TREEMAP_COLORS[6] },
      { name: 'Panadería', count: '190K', value: 190000, color: TREEMAP_COLORS[7] },
      { name: 'Dentista', count: '175K', value: 175000, color: TREEMAP_COLORS[8] },
      { name: 'Ferretería', count: '160K', value: 160000, color: TREEMAP_COLORS[9] },
      { name: 'Consultorio médico', count: '145K', value: 145000, color: TREEMAP_COLORS[10] },
      { name: 'Iglesia', count: '135K', value: 135000, color: TREEMAP_COLORS[11] },
      { name: 'Boutique de ropa', count: '120K', value: 120000, color: TREEMAP_COLORS[12] },
      { name: 'Gimnasio', count: '110K', value: 110000, color: TREEMAP_COLORS[13] },
      { name: 'Gasolinera', count: '95K', value: 95000, color: TREEMAP_COLORS[14] },
    ],
  },
  indonesia: {
    cities: [
      { rank: 1, name: 'Jakarta', count: '890K+' },
      { rank: 2, name: 'Surabaya', count: '410K+' },
      { rank: 3, name: 'Bandung', count: '360K+' },
      { rank: 4, name: 'Medan', count: '280K+' },
      { rank: 5, name: 'Semarang', count: '210K+' },
      { rank: 6, name: 'Makassar', count: '185K+' },
      { rank: 7, name: 'Palembang', count: '165K+' },
      { rank: 8, name: 'Tangerang', count: '155K+' },
      { rank: 9, name: 'Depok', count: '140K+' },
      { rank: 10, name: 'Yogyakarta', count: '135K+' },
    ],
    categories: [
      { name: 'Restoran / Rumah Makan', count: '920K', value: 920000, color: TREEMAP_COLORS[0] },
      { name: 'Toko Kelontong', count: '840K', value: 840000, color: TREEMAP_COLORS[1] },
      { name: 'Masjid', count: '760K', value: 760000, color: TREEMAP_COLORS[2] },
      { name: 'Bengkel Motor', count: '610K', value: 610000, color: TREEMAP_COLORS[3] },
      { name: 'Apotek', count: '520K', value: 520000, color: TREEMAP_COLORS[4] },
      { name: 'Sekolah', count: '450K', value: 450000, color: TREEMAP_COLORS[5] },
      { name: 'Salon & Barbershop', count: '390K', value: 390000, color: TREEMAP_COLORS[6] },
      { name: 'Minimarket', count: '350K', value: 350000, color: TREEMAP_COLORS[7] },
      { name: 'Kafe / Warkop', count: '310K', value: 310000, color: TREEMAP_COLORS[8] },
      { name: 'Laundry', count: '280K', value: 280000, color: TREEMAP_COLORS[9] },
      { name: 'Toko Pakaian', count: '250K', value: 250000, color: TREEMAP_COLORS[10] },
      { name: 'Kantor', count: '220K', value: 220000, color: TREEMAP_COLORS[11] },
      { name: 'Klinik Kesehatan', count: '195K', value: 195000, color: TREEMAP_COLORS[12] },
      { name: 'Hotel / Penginapan', count: '170K', value: 170000, color: TREEMAP_COLORS[13] },
      { name: 'SPBU', count: '145K', value: 145000, color: TREEMAP_COLORS[14] },
    ],
  },
};

// Procedural generator for any country among the 244 that is not explicitly in curated list
function generateCountryProfile(country) {
  // Parse numeric magnitude from count string, e.g. "3M+ locations" -> 3000000
  let multiplier = 500000;
  if (country.count) {
    const matchM = country.count.match(/([0-9.]+)\s*M/i);
    const matchK = country.count.match(/([0-9.]+)\s*K/i);
    if (matchM) {
      multiplier = parseFloat(matchM[1]) * 1000000;
    } else if (matchK) {
      multiplier = parseFloat(matchK[1]) * 1000;
    }
  }

  // Common generic major city names or capital
  const capitalName = country.name;
  const baseCities = [
    `${capitalName} City`,
    `North ${capitalName}`,
    `Central ${capitalName}`,
    `West ${capitalName}`,
    `South ${capitalName}`,
    `East ${capitalName}`,
    `Greater ${capitalName}`,
    `Metro ${capitalName}`,
    `Port ${capitalName}`,
    `New ${capitalName}`,
  ];

  const cityRatios = [0.24, 0.16, 0.13, 0.11, 0.08, 0.07, 0.06, 0.05, 0.05, 0.04];
  const cities = baseCities.map((cityName, idx) => {
    const cityCountNum = Math.max(1200, Math.round(multiplier * cityRatios[idx] * 0.4));
    const countStr = cityCountNum >= 1000000
      ? `${(cityCountNum / 1000000).toFixed(1)}M+`
      : `${Math.round(cityCountNum / 1000)}K+`;
    return {
      rank: idx + 1,
      name: cityName,
      count: countStr,
    };
  });

  const baseCategories = [
    'Restaurant',
    'General store',
    'Clothing store',
    'Pharmacy',
    'Doctor / Clinic',
    'Hair salon',
    'Supermarket',
    'Auto repair',
    'School',
    'Hotel / Lodging',
    'Real estate agency',
    'Bank branch',
    'Place of worship',
    'Cafe',
    'Corporate office',
  ];

  const catRatios = [
    0.16, 0.13, 0.11, 0.09, 0.08, 0.07, 0.06, 0.05, 0.05, 0.04, 0.04, 0.03, 0.03, 0.03, 0.03
  ];

  const categories = baseCategories.map((catName, idx) => {
    const catVal = Math.max(800, Math.round(multiplier * catRatios[idx] * 0.3));
    const countStr = catVal >= 1000000
      ? `${(catVal / 1000000).toFixed(1)}M`
      : `${Math.round(catVal / 1000)}K`;
    return {
      name: catName,
      count: countStr,
      value: catVal,
      color: TREEMAP_COLORS[idx % TREEMAP_COLORS.length],
    };
  });

  return { cities, categories };
}

// Fallback silhouette map path if specific country SVG is not predefined
const DEFAULT_COUNTRY_SVG = `<path d="M120,60 L200,50 L280,70 L330,110 L360,170 L340,240 L300,310 L250,350 L190,370 L130,340 L80,280 L60,210 L70,140 L90,90 Z" />`;

// Canonical single source of truth for all country records
export const ALL_COUNTRIES = rawCountries.map((c) => {
  const slug = c.slug || c.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const curated = CURATED_COUNTRY_PROFILES[slug];
  const profile = curated || generateCountryProfile(c);
  const mapSvg = COUNTRY_SVGS[slug] || DEFAULT_COUNTRY_SVG;

  return {
    ...c,
    slug,
    locationCount: c.count,
    cities: profile.cities,
    categories: profile.categories,
    mapAsset: mapSvg,
  };
});

// Fast lookup by slug
const countryBySlugMap = new Map();
ALL_COUNTRIES.forEach((c) => {
  countryBySlugMap.set(c.slug, c);
  // Also index by normalized name for safety
  countryBySlugMap.set(c.name.toLowerCase(), c);
});

export function getCountryBySlug(slug) {
  if (!slug) return null;
  const clean = slug.toLowerCase().trim();
  return countryBySlugMap.get(clean) || null;
}

export function getAllCountries() {
  return ALL_COUNTRIES;
}
