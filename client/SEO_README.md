# SEO Configuration Guide - Unirooms

## Overview
This document explains the SEO implementation for Unirooms, a platform for finding PG accommodations near colleges and universities in India.

## Files Modified/Created

### Core SEO Files
1. **`/client/public/robots.txt`** - Search engine crawling rules
2. **`/client/public/sitemap.xml`** - Site structure for search engines
3. **`/client/src/utils/seo.js`** - SEO utility functions
4. **`/client/index.html`** - Enhanced with meta tags and structured data

### Pages with SEO
All major pages updated with dynamic SEO:
- Home (`/client/src/pages/Home.jsx`)
- Browse (`/client/src/pages/Browse.jsx`)
- Property Detail (`/client/src/pages/PropertyDetail.jsx`)
- About (`/client/src/pages/About.jsx`)
- Contact (`/client/src/pages/Contact.jsx`)
- Pricing (`/client/src/pages/Pricing.jsx`)
- Safety (`/client/src/pages/Safety.jsx`)

## SEO Features Implemented

### 1. Meta Tags
```html
<title>PG Near Colleges | Find Best PG Accommodation Near University | Unirooms</title>
<meta name="description" content="..." />
<meta name="keywords" content="PG near college, boys PG, girls PG..." />
```

### 2. Open Graph Tags (Social Media)
```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
```

### 3. Structured Data (JSON-LD)
- Organization schema
- Website schema with search capability
- LocalBusiness schema
- Property/Accommodation schema for listings

### 4. Dynamic SEO Updates
Pages update meta tags dynamically based on content:
```javascript
import { updateMetaTags, pageSEO } from '../utils/seo';

useEffect(() => {
    updateMetaTags(pageSEO.home);
}, []);
```

## Using the SEO Utils

### Update Page Meta Tags
```javascript
import { updateMetaTags } from '../utils/seo';

updateMetaTags({
    title: 'Your Page Title',
    description: 'Your page description',
    keywords: 'keyword1, keyword2',
    image: '/your-image.png',
    url: 'https://unirooms.in/your-page',
    type: 'website'
});
```

### Add Property Structured Data
```javascript
import { generatePropertyStructuredData, addStructuredData } from '../utils/seo';

const structuredData = generatePropertyStructuredData(propertyObject);
addStructuredData(structuredData);
```

### Generate SEO-Friendly Slugs
```javascript
import { generateSlug } from '../utils/seo';

const slug = generateSlug('Boys PG Near IIT Delhi');
// Output: 'boys-pg-near-iit-delhi'
```

## Target Keywords

### Primary Keywords
- PG near college
- PG near university
- Boys PG
- Girls PG
- Co-living space
- Student accommodation
- Paying guest accommodation

### Long-tail Keywords
- Best PG near [College Name]
- Affordable PG accommodation near university
- Single room PG near college
- Double sharing PG
- Triple sharing PG
- PG with food near college
- Verified PG accommodations

### Location-based Keywords
- PG near IIT Delhi
- PG near NIT Trichy
- Student housing in [City Name]
- College accommodation in [City Name]

## robots.txt Configuration

```
User-agent: *
Allow: /
Disallow: /admin
Disallow: /landlord/dashboard
Disallow: /api/
Sitemap: https://unirooms.in/sitemap.xml
```

## Sitemap Structure

The sitemap includes:
- Homepage (Priority: 1.0)
- Browse page (Priority: 0.9)
- Pricing page (Priority: 0.8)
- About, Contact (Priority: 0.7)
- Safety (Priority: 0.6)
- Terms, Privacy, Refund (Priority: 0.4)

**Update Frequency:**
- Homepage & Browse: Daily
- About, Contact, Pricing: Monthly
- Legal pages: Yearly

## Image SEO

All images include descriptive alt text:
```jsx
<img 
    src="..." 
    alt="Modern PG room near college with comfortable bed and study area"
    className="..."
/>
```

## Heading Structure

Proper H1-H6 hierarchy:
- H1: Main page title (one per page)
- H2: Major sections
- H3: Subsections
- Bold text for emphasis within paragraphs

## Internal Linking

Links use descriptive anchor text:
```jsx
<Link to="/browse">Browse PG Accommodations</Link>
```

## Performance Optimization

1. **Image Optimization**
   - Lazy loading implemented
   - WebP format support
   - Responsive images

2. **Code Splitting**
   - React lazy loading for routes
   - Dynamic imports

3. **Caching**
   - Browser caching headers
   - Service worker (PWA ready)

## Setting Up Google Search Console

1. Verify ownership:
   - Add meta tag to `index.html`, OR
   - Upload HTML file to `/public`, OR
   - Use DNS verification

2. Submit sitemap:
   ```
   https://unirooms.in/sitemap.xml
   ```

3. Request indexing for important pages

## Setting Up Google Analytics

Add to `index.html` before `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## SEO Best Practices Implemented

✅ **Technical SEO**
- Responsive design
- Fast page load
- Mobile-friendly
- HTTPS required
- Semantic HTML5
- Clean URL structure

✅ **On-Page SEO**
- Optimized titles (50-60 chars)
- Meta descriptions (150-160 chars)
- Keyword-rich content
- Alt tags on all images
- Internal linking
- Structured data

✅ **Content SEO**
- Unique titles per page
- Quality content
- Regular updates
- User-focused writing
- Clear CTAs

## Monitoring & Maintenance

### Weekly Tasks
- [ ] Monitor search rankings
- [ ] Check Google Search Console for errors
- [ ] Review Analytics data

### Monthly Tasks
- [ ] Update sitemap with new properties
- [ ] Analyze keyword performance
- [ ] Check for broken links
- [ ] Review and update meta descriptions

### Quarterly Tasks
- [ ] Content audit
- [ ] Competitor analysis
- [ ] Backlink profile review
- [ ] Update target keywords

## Testing Your SEO

### Tools to Test
1. **Google Search Console** - Index status, errors
2. **PageSpeed Insights** - Performance score
3. **Mobile-Friendly Test** - Mobile usability
4. **Rich Results Test** - Structured data validation
5. **Lighthouse** - Overall SEO audit

### Commands to Test
```bash
# Build production version
npm run build

# Test locally
npm run preview

# Check for broken links
# Use online tools or CLI tools like 'broken-link-checker'
```

## Expected Results Timeline

### 1-2 Weeks
- Indexed by Google
- Search Console data available

### 1-2 Months
- Rankings for long-tail keywords
- Increased organic impressions

### 3-6 Months
- Top 10 rankings for target keywords
- Steady organic traffic growth

### 6-12 Months
- First page for competitive keywords
- Established domain authority
- Consistent traffic

## Troubleshooting

### Pages Not Indexed
1. Check robots.txt isn't blocking
2. Verify sitemap submission
3. Request indexing in Search Console

### Low Rankings
1. Improve content quality
2. Build backlinks
3. Optimize page speed
4. Enhance user experience

### High Bounce Rate
1. Improve page load speed
2. Make content more engaging
3. Add clear CTAs
4. Improve mobile experience

## Contact & Support

For SEO questions or updates, contact the development team.

---

**Last Updated:** January 7, 2026
**Version:** 1.0
**Status:** Production Ready ✅
