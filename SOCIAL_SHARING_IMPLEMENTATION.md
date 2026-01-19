# Social Media Preview Implementation

## Changes Made

I've implemented dynamic Open Graph meta tags so that when you share property URLs on WhatsApp, Facebook, Twitter, or other social platforms, the actual property image appears in the preview instead of just your website icon.

### What Was Changed

1. **Created HTML Template** (`server/src/Utils/htmlTemplate.js`)
   - Dynamic HTML generator that creates pages with property-specific meta tags
   - Includes Open Graph tags for Facebook/WhatsApp
   - Includes Twitter Card tags
   - Includes Structured Data (JSON-LD) for SEO

2. **Updated Server App** (`server/src/app.js`)
   - Added route handler for `/property/:id` that detects bot/crawler user agents
   - Serves HTML with dynamic meta tags to social media bots
   - Serves normal React app to regular users
   - Added support for serving static files from client build

3. **Updated Property Controller** (`server/src/Controllers/property.controller.js`)
   - Added `getPropertyMetadata` function
   - Imports the HTML template generator

4. **Updated Property Routes** (`server/src/Routes/property.routes.js`)
   - Imported the new metadata controller

5. **Updated Vercel Config** (`client/vercel.json`)
   - Added rewrite rule to forward `/property/:id` requests to the server
   - This ensures bots/crawlers hit the server to get dynamic meta tags

## How It Works

1. When someone shares a property link (e.g., `https://unirooms.in/property/123abc`)
2. WhatsApp/Facebook/Twitter bots request the URL
3. Vercel forwards the request to your Heroku server
4. The server detects it's a bot (via User-Agent header)
5. Server fetches the property data from the database
6. Server generates HTML with property-specific meta tags:
   - Property title
   - Property description
   - Property image (first image in the array)
   - Price, location, and other details
7. Bot reads the meta tags and shows the property preview
8. Regular users still get the normal React SPA experience

## Deployment Steps

### 1. Deploy Server Changes

```bash
cd server
git add .
git commit -m "Add dynamic meta tags for social sharing"
git push heroku main  # or your deployment method
```

### 2. Deploy Client Changes

```bash
cd client
git add .
git commit -m "Update vercel config for social sharing"
# Vercel will auto-deploy if connected to git
# Or manually: vercel --prod
```

### 3. Test the Implementation

#### Test with cURL (simulating WhatsApp bot):
```bash
curl -A "WhatsApp/2.0" https://unirooms.in/property/YOUR_PROPERTY_ID
```

You should see HTML with meta tags like:
```html
<meta property="og:image" content="https://res.cloudinary.com/..." />
<meta property="og:title" content="Your Property Title..." />
```

#### Test with Online Tools:
1. **Facebook Debugger**: https://developers.facebook.com/tools/debug/
2. **Twitter Card Validator**: https://cards-dev.twitter.com/validator
3. **LinkedIn Inspector**: https://www.linkedin.com/post-inspector/

Just paste your property URL and see the preview!

## Important Notes

### Image Requirements for Social Sharing

- **Facebook/WhatsApp**: Recommended 1200x630px (minimum 600x315px)
- **Twitter**: Recommended 1200x628px (minimum 300x157px)
- Images should be under 5MB
- HTTPS URLs only

### Caching Issues

Social platforms cache previews. After deployment:

1. **Facebook/WhatsApp**: Use the [Facebook Debugger](https://developers.facebook.com/tools/debug/) to clear cache
2. **Twitter**: Use the [Card Validator](https://cards-dev.twitter.com/validator) to refresh
3. **LinkedIn**: Use the [Post Inspector](https://www.linkedin.com/post-inspector/)

### Verify It's Working

1. Pick any active property from your site
2. Copy the property URL
3. Go to Facebook Debugger and paste the URL
4. Click "Scrape Again"
5. You should see the property image, title, and description in the preview

## Troubleshooting

### Preview shows old/default image
- Clear the cache on social platforms using the tools above
- Wait a few minutes and try again

### Preview shows no image
- Check that the property has at least one image
- Verify the image URL is accessible (HTTPS)
- Check that the property is marked as `isVerified: true`

### Regular users see issues
- The bot detection ensures only crawlers get the special HTML
- Regular users still get the React app
- If issues occur, check browser console for errors

### Server errors
- Check Heroku logs: `heroku logs --tail`
- Verify the property ID exists and is verified
- Ensure MongoDB connection is working

## Example Property URL

Test with your property URL format:
```
https://unirooms.in/property/YOUR_PROPERTY_ID_HERE
```

The first image from `property.images[0]` will be used as the preview image.

## Future Enhancements

Consider adding:
- Image optimization for social sharing (specific dimensions)
- Multiple image sizes for different platforms
- Custom preview images separate from property images
- A/B testing different preview texts
- Analytics to track social sharing clicks

---

**That's it!** After deployment, all your property links will show beautiful previews with property images when shared on social media. 🎉
