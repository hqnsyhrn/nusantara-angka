// Nusantara Angka — Indonesia's national statistics explorer.
// All figures bundled locally (no network). Data compiled from public sources
// (BPS - Statistics Indonesia, World Bank open data, APJII, UNESCO), rounded for
// display; the source is stated per series. A null value means the source does
// not publish that year; charts skip the gap.

export const META = {
  siteName: 'Nusantara Angka',
  country: 'Indonesia',
  motto: 'Satu data, semua sudut',
  population2024: 281.6,   // million, BPS projection
  areaKm2: 1910871,        // land area, km2
  provinces: 38,
  gdp2024: 1.396,          // nominal, trillion USD
  gdpPerCapita2024: 4960,  // USD per person per year
};

// Headline time series, years ascending, values aligned with years.
export const SERIES = {
  population: {
    title: 'Total population', unit: 'million people',
    source: 'BPS intercensal population projections',
    years: [1990, 1995, 2000, 2005, 2010, 2015, 2020, 2024],
    values: [181.4, 197.0, 206.3, 218.9, 241.5, 257.6, 270.2, 281.6],
  },
  gdpGrowth: {
    title: 'Real GDP growth', unit: '% per year',
    source: 'BPS national accounts',
    years: [2000, 2005, 2010, 2015, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [4.9, 5.7, 6.2, 4.9, 5.0, -2.1, 3.7, 5.3, 5.0, 5.0],
  },
  inflation: {
    title: 'Consumer price inflation', unit: '% per year',
    source: 'BPS consumer price index',
    years: [2005, 2008, 2011, 2014, 2017, 2020, 2022, 2023, 2024],
    values: [13.6, 9.8, 3.6, 4.8, 3.6, 1.7, 5.5, 2.6, 1.6],
  },
  poverty: {
    title: 'Poverty rate', unit: '% of population',
    source: 'BPS Susenas national socio-economic survey',
    years: [2002, 2006, 2010, 2014, 2018, 2020, 2022, 2024],
    values: [18.1, 17.8, 13.3, 11.3, 9.7, 10.2, 9.5, 9.0],
  },
  lifeExpectancy: {
    title: 'Life expectancy at birth', unit: 'years',
    source: 'BPS long-form census',
    years: [1990, 2000, 2010, 2015, 2020, 2023],
    values: [62.3, 66.2, 69.3, 71.0, 71.9, 73.4],
  },
  internetUsers: {
    title: 'Individuals using the internet', unit: '% of population',
    source: 'APJII annual survey',
    years: [2000, 2010, 2015, 2018, 2020, 2022, 2024],
    values: [0.9, 15.8, 31.6, 64.8, 73.7, 77.0, 79.5],
  },
  literacy: {
    title: 'Adult literacy rate', unit: '% of adults 15+',
    source: 'UNESCO Institute for Statistics',
    years: [2000, 2005, 2010, 2015, 2020, 2023],
    values: [88.1, 91.2, 93.4, 95.4, 96.0, 96.4],
  },
  unemployment: {
    title: 'Unemployment rate', unit: '% of labour force',
    source: 'BPS Sakernas labour force survey',
    years: [2005, 2010, 2015, 2019, 2020, 2021, 2022, 2023, 2024],
    values: [11.2, 7.1, 6.2, 5.2, 7.1, 6.5, 5.9, 5.3, 4.9],
  },
  electricity: {
    title: 'Households with electricity', unit: '% of households',
    source: 'Ministry of Energy and Mineral Resources',
    years: [2005, 2010, 2015, 2019, 2022, 2024],
    values: [64.5, 82.0, 91.9, 97.4, 99.1, 99.7],
  },
};

// The eight most populous provinces (2023 projections).
export const PROVINCES = [
  { name: 'West Java', capital: 'Bandung', population: 49.4, poverty: 7.9, gdpPerCapita: 22.1, island: 'Java' },
  { name: 'East Java', capital: 'Surabaya', population: 41.1, poverty: 10.1, gdpPerCapita: 27.4, island: 'Java' },
  { name: 'Central Java', capital: 'Semarang', population: 37.5, poverty: 10.4, gdpPerCapita: 19.8, island: 'Java' },
  { name: 'North Sumatra', capital: 'Medan', population: 15.5, poverty: 8.4, gdpPerCapita: 26.9, island: 'Sumatra' },
  { name: 'Banten', capital: 'Serang', population: 12.2, poverty: 6.0, gdpPerCapita: 34.6, island: 'Java' },
  { name: 'Jakarta (DKI)', capital: '—', population: 10.7, poverty: 4.4, gdpPerCapita: 292.7, island: 'Java' },
  { name: 'South Sulawesi', capital: 'Makassar', population: 9.4, poverty: 8.7, gdpPerCapita: 26.3, island: 'Sulawesi' },
  { name: 'Bali', capital: 'Denpasar', population: 4.4, poverty: 4.0, gdpPerCapita: 43.2, island: 'Bali & Nusa Tenggara' },
];

// Sector shares of GDP, 2023, per cent.
export const SECTORS = [
  { name: 'Manufacturing', share: 18.7 },
  { name: 'Trade', share: 12.9 },
  { name: 'Agriculture', share: 12.6 },
  { name: 'Other services', share: 27.7 },
  { name: 'Construction', share: 9.9 },
  { name: 'Mining', share: 8.6 },
  { name: 'Transport & logistics', share: 5.5 },
  { name: 'Information & communication', share: 4.1 },
];

// Goods trade partners, 2023, per cent of total trade.
export const TRADE = [
  { partner: 'China', share: 25.1 },
  { partner: 'United States', share: 10.7 },
  { partner: 'Japan', share: 7.6 },
  { partner: 'Singapore', share: 5.5 },
  { partner: 'India', share: 5.3 },
  { partner: 'Malaysia', share: 4.0 },
];

// Milestones a visitor should know.
export const MILESTONES = [
  { year: 1967, text: 'BPS re-established as the national statistical office.' },
  { year: 2000, text: 'Decentralisation begins; provincial statistics offices take over regional surveys.' },
  { year: 2010, text: 'Population census passes 241 million; first digital registry pilot.' },
  { year: 2020, text: 'COVID-19 shock: GDP contracts 2.1%, the first contraction since 1998.' },
  { year: 2022, text: 'Construction of the new capital (IKN Nusantara) starts in East Kalimantan.' },
  { year: 2024, text: 'Population reaches 281.6 million; poverty at a record low of 9.0%.' },
];
