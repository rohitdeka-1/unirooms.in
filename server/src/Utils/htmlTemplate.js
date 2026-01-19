/**
 * Generate HTML with dynamic meta tags for social media sharing
 */
export const generatePropertyHTML = (property) => {
    const title = `${property.title || 'PG Accommodation'} | ${property.nearbyCollege || property.city || 'Near College'} | Unirooms`;
    const description = property.description || `Find ${property.roomType || 'PG accommodation'} near ${property.nearbyCollege || property.city}. ₹${property.rent || property.price}/month. Book now!`;
    const image = property.images?.[0]?.url || property.images?.[0] || 'https://unirooms.in/logo.png';
    const url = `https://unirooms.in/property/${property._id}`;
    const rent = property.rent || property.price || 'N/A';

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Primary Meta Tags -->
  <title>${title}</title>
  <meta name="title" content="${title}" />
  <meta name="description" content="${description}" />
  <meta name="keywords" content="PG near ${property.nearbyCollege || property.city}, ${property.roomType}, ${property.gender} PG, PG accommodation, student housing" />
  <meta name="author" content="Unirooms" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${url}" />
  
  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="product" />
  <meta property="og:url" content="${url}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:secure_url" content="${image}" />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="Unirooms" />
  <meta property="og:locale" content="en_IN" />
  <meta property="product:price:amount" content="${rent}" />
  <meta property="product:price:currency" content="INR" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${url}" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${image}" />
  <meta name="twitter:image:alt" content="${title}" />
  
  <!-- WhatsApp -->
  <meta property="og:image:width" content="300" />
  <meta property="og:image:height" content="300" />
  
  <!-- Favicon -->
  <link rel="icon" type="image/png" href="/logo.png" />
  <link rel="apple-touch-icon" href="/logo.png" />
  
  <!-- Geo Tags -->
  <meta name="geo.region" content="IN" />
  <meta name="geo.placename" content="${property.city || 'India'}" />
  ${property.location?.coordinates ? `
  <meta name="geo.position" content="${property.location.coordinates[1]};${property.location.coordinates[0]}" />
  <meta name="ICBM" content="${property.location.coordinates[1]}, ${property.location.coordinates[0]}" />
  ` : ''}
  
  <!-- Structured Data -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Accommodation",
    "name": "${property.title}",
    "description": "${description}",
    "image": "${image}",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "${property.address?.street || ''}",
      "addressLocality": "${property.city || ''}",
      "addressRegion": "${property.state || 'India'}",
      "addressCountry": "IN"
    },
    ${property.location?.coordinates ? `
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": ${property.location.coordinates[1]},
      "longitude": ${property.location.coordinates[0]}
    },
    ` : ''}
    "priceRange": "₹${rent}",
    "url": "${url}",
    "numberOfRooms": ${property.totalRooms || 1}
  }
  </script>
  
  <script type="module" crossorigin src="/assets/index.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index.css">
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
};

export const generateDefaultHTML = () => {
    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Primary Meta Tags -->
  <title>PG Near Colleges | Find Best PG Accommodation Near University | Unirooms</title>
  <meta name="title" content="PG Near Colleges | Find Best PG Accommodation Near University | Unirooms" />
  <meta name="description" content="Find verified PG accommodations near top colleges and universities in India. Boys PG, Girls PG, and Co-living spaces at affordable prices. Safe, comfortable, and verified listings starting at ₹4,500/month." />
  <meta name="keywords" content="PG near college, PG near university, boys PG, girls PG, co-living space, paying guest accommodation" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://unirooms.in/" />
  
  <!-- Open Graph -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://unirooms.in/" />
  <meta property="og:title" content="PG Near Colleges | Find Best PG Accommodation Near University | Unirooms" />
  <meta property="og:description" content="Find verified PG accommodations near top colleges and universities in India." />
  <meta property="og:image" content="https://unirooms.in/logo.png" />
  
  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="https://unirooms.in/" />
  <meta name="twitter:title" content="PG Near Colleges | Unirooms" />
  <meta name="twitter:image" content="https://unirooms.in/logo.png" />
  
  <link rel="icon" type="image/png" href="/logo.png" />
  
  <script type="module" crossorigin src="/assets/index.js"></script>
  <link rel="stylesheet" crossorigin href="/assets/index.css">
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
};
