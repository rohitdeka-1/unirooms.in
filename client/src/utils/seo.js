// SEO Utility Functions

/**
 * Update page meta tags dynamically
 */
export const updateMetaTags = ({ 
  title, 
  description, 
  keywords, 
  image = '/logo.png',
  url = window.location.href,
  type = 'website' 
}) => {
  // Update title
  if (title) {
    document.title = title;
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('name', 'twitter:title', title);
  }

  // Update description
  if (description) {
    updateMetaTag('name', 'description', description);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('name', 'twitter:description', description);
  }

  // Update keywords
  if (keywords) {
    updateMetaTag('name', 'keywords', keywords);
  }

  // Update image
  if (image) {
    // Ensure image is a string (could be an array from property.images)
    const imageUrl = Array.isArray(image) ? image[0] : image;
    const fullImageUrl = (typeof imageUrl === 'string' && imageUrl.startsWith('http')) 
      ? imageUrl 
      : `https://unirooms.in${imageUrl || '/logo.png'}`;
    updateMetaTag('property', 'og:image', fullImageUrl);
    updateMetaTag('name', 'twitter:image', fullImageUrl);
  }

  // Update URL
  if (url) {
    updateMetaTag('property', 'og:url', url);
    updateMetaTag('name', 'twitter:url', url);
    
    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }

  // Update type
  if (type) {
    updateMetaTag('property', 'og:type', type);
  }
};

/**
 * Helper function to update or create meta tags
 */
const updateMetaTag = (attribute, key, content) => {
  let element = document.querySelector(`meta[${attribute}="${key}"]`);
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  
  element.setAttribute('content', content);
};

/**
 * Generate structured data for property listings
 */
export const generatePropertyStructuredData = (property) => {
  return {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "name": property.title,
    "description": property.description,
    "image": property.images?.[0] || '/logo.png',
    "address": {
      "@type": "PostalAddress",
      "streetAddress": property.address,
      "addressLocality": property.city,
      "addressRegion": property.state || "India",
      "addressCountry": "IN"
    },
    "geo": property.coordinates ? {
      "@type": "GeoCoordinates",
      "latitude": property.coordinates.latitude,
      "longitude": property.coordinates.longitude
    } : undefined,
    "priceRange": `₹${property.rent || property.price}`,
    "amenityFeature": property.amenities?.map(amenity => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    })),
    "aggregateRating": property.rating ? {
      "@type": "AggregateRating",
      "ratingValue": property.rating,
      "reviewCount": property.reviewCount || 1
    } : undefined,
    "url": `https://unirooms.in/property/${property._id}`,
    "telephone": property.phone,
    "numberOfRooms": property.totalRooms,
    "occupancy": {
      "@type": "QuantitativeValue",
      "value": property.occupancy || 1
    }
  };
};

/**
 * Generate breadcrumb structured data
 */
export const generateBreadcrumbStructuredData = (breadcrumbs) => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": `https://unirooms.in${crumb.url}`
    }))
  };
};

/**
 * Generate FAQ structured data
 */
export const generateFAQStructuredData = (faqs) => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
};

/**
 * Add structured data to page
 */
export const addStructuredData = (data) => {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(data);
  
  // Remove existing structured data of same type
  const existing = document.querySelector(`script[type="application/ld+json"]`);
  if (existing && existing.text.includes(data['@type'])) {
    existing.remove();
  }
  
  document.head.appendChild(script);
};

/**
 * SEO-friendly URL slug generator
 */
export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Page-specific SEO configurations
 */
export const pageSEO = {
  home: {
    title: 'PG Near Colleges | Find Best PG Accommodation Near University | Unirooms',
    description: 'Find verified PG accommodations near top colleges and universities in India. Boys PG, Girls PG, and Co-living spaces at affordable prices starting at ₹4,500/month.',
    keywords: 'PG near college, PG near university, boys PG, girls PG, co-living space, paying guest accommodation, student accommodation',
    url: 'https://unirooms.in/'
  },
  browse: {
    title: 'Browse PG Accommodations Near Colleges | Verified Listings | Unirooms',
    description: 'Explore hundreds of verified PG accommodations near your college. Filter by price, amenities, gender preference, and location. Find your perfect student housing.',
    keywords: 'browse PG, search PG near college, PG listings, verified PG accommodations, student housing search',
    url: 'https://unirooms.in/browse'
  },
  about: {
    title: 'About Unirooms - Your Trusted PG Accommodation Partner',
    description: 'Learn about Unirooms, India\'s trusted platform for finding PG accommodations near colleges and universities. Safe, verified, and student-friendly housing solutions.',
    keywords: 'about unirooms, PG accommodation platform, student housing India',
    url: 'https://unirooms.in/about'
  },
  contact: {
    title: 'Contact Us - Unirooms Customer Support',
    description: 'Get in touch with Unirooms for any queries about PG accommodations near colleges. Our support team is here to help you find your perfect student housing.',
    keywords: 'contact unirooms, PG accommodation support, student housing help',
    url: 'https://unirooms.in/contact'
  },
  pricing: {
    title: 'Pricing Plans - List Your PG Property | Unirooms for Landlords',
    description: 'Affordable pricing plans for landlords to list PG properties on Unirooms. Reach thousands of students looking for accommodation near colleges.',
    keywords: 'PG listing pricing, landlord plans, list PG property, property listing cost',
    url: 'https://unirooms.in/pricing'
  },
  safety: {
    title: 'Safety & Trust - Verified PG Accommodations | Unirooms',
    description: 'Your safety is our priority. Learn about Unirooms\' verification process, safety guidelines, and how we ensure secure PG accommodations for students.',
    keywords: 'PG safety, verified accommodations, safe student housing, secure PG',
    url: 'https://unirooms.in/safety'
  }
};

export default {
  updateMetaTags,
  generatePropertyStructuredData,
  generateBreadcrumbStructuredData,
  generateFAQStructuredData,
  addStructuredData,
  generateSlug,
  pageSEO
};
