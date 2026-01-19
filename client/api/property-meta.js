// Vercel Serverless Function to serve property pages with dynamic meta tags
export default async function handler(req, res) {
    const { id } = req.query;
    
    if (!id) {
        return res.status(400).send('Property ID required');
    }

    try {
        // Fetch property data from your API
        const apiUrl = process.env.VITE_API_URL || 'https://unirooms-01cba0aba98a.herokuapp.com';
        const response = await fetch(`${apiUrl}/api/v1/properties/${id}`);
        
        if (!response.ok) {
            throw new Error('Property not found');
        }
        
        const data = await response.json();
        const property = data.data?.property || data.data;

        if (!property) {
            return res.status(404).send('Property not found');
        }

        // Generate HTML with dynamic meta tags
        const title = `${property.title || 'PG Accommodation'} | ${property.nearbyCollege || property.city || 'Near College'} | Unirooms`;
        const description = property.description || `Find ${property.roomType || 'PG accommodation'} near ${property.nearbyCollege || property.city}. ₹${property.rent || property.price}/month. Book now!`;
        const image = property.images?.[0]?.url || property.images?.[0] || 'https://unirooms.in/logo.png';
        const url = `https://unirooms.in/property/${id}`;
        const rent = property.rent || property.price || 'N/A';

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${url}">
    
    <!-- Open Graph / Facebook / WhatsApp -->
    <meta property="og:type" content="product">
    <meta property="og:url" content="${url}">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${image}">
    <meta property="og:image:secure_url" content="${image}">
    <meta property="og:image:type" content="image/jpeg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:site_name" content="Unirooms">
    <meta property="product:price:amount" content="${rent}">
    <meta property="product:price:currency" content="INR">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${url}">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${image}">
    
    <meta http-equiv="refresh" content="0;url=${url}">
    <script>window.location.href = '${url}';</script>
</head>
<body>
    <p>Redirecting...</p>
</body>
</html>`;

        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600');
        res.status(200).send(html);
        
    } catch (error) {
        console.error('Error fetching property:', error);
        res.status(500).send('Error loading property');
    }
}
