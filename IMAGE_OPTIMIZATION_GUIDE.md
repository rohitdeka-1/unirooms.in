# Quick Reference: Image Optimization Usage

## For Developers

### 🎯 How to Use Optimized Images

```javascript
import { getOptimizedImageUrl } from '../utils/imageOptimizer';

// Usage
const imageUrl = getOptimizedImageUrl(property.images[0].url, 'card');
```

### 📐 Available Size Presets

| Preset | Width | Quality | Use Case |
|--------|-------|---------|----------|
| `thumb` | 200px | auto:low | Thumbnails, avatars |
| `small` | 400px | auto:good | Small cards, previews |
| `medium` | 800px | auto:good | Default size (recommended) |
| `large` | 1200px | auto:good | Detail pages, galleries |
| `card` | 500px | auto:good | Property cards, listings |
| `hero` | 1400px | auto:good | Hero sections, banners |

### 💡 Example Usage

```javascript
// Property Card
<img src={getOptimizedImageUrl(imageUrl, 'card')} />

// Property Detail Page
<img src={getOptimizedImageUrl(imageUrl, 'large')} />

// Thumbnail
<img src={getOptimizedImageUrl(imageUrl, 'thumb')} />

// Hero Banner
<img src={getOptimizedImageUrl(imageUrl, 'hero')} />
```

### 🔧 Custom Transformations

```javascript
import { optimizeCloudinaryImage } from '../utils/imageOptimizer';

const customUrl = optimizeCloudinaryImage(originalUrl, {
    width: 600,
    quality: 'auto:best',
    format: 'auto',
    crop: 'fill',
    gravity: 'auto'
});
```

### ⚡ Performance Tips

1. **Always use size presets** - Don't load large images where small ones work
2. **Let format be auto** - Cloudinary will serve WebP/AVIF to modern browsers
3. **Use lazy loading** - Add `loading="lazy"` to img tags
4. **Preload critical images** - Use `<link rel="preload">` for above-fold images

### 🎨 Cloudinary URL Parameters

The optimizer adds these automatically:
- `w_XXX` - Width
- `q_auto:good` - Quality (automatic)
- `f_auto` - Format (WebP, AVIF, or JPEG based on browser)
- `c_fill` - Crop mode
- `g_auto` - Gravity (smart crop)
- `dpr_auto` - Device pixel ratio
- `fl_progressive` - Progressive loading
- `fl_lossy` - Lossy compression

### 🚫 What NOT to Do

```javascript
// ❌ Don't load raw Cloudinary URLs
<img src={property.images[0].url} />

// ❌ Don't use 'large' for thumbnails
<img src={getOptimizedImageUrl(url, 'large')} className="w-20 h-20" />

// ✅ Do use appropriate size
<img src={getOptimizedImageUrl(url, 'thumb')} className="w-20 h-20" />
```

### 📊 File Size Comparison

| Size | Before | After | Savings |
|------|--------|-------|---------|
| thumb | ~80KB | ~15KB | 81% |
| small | ~200KB | ~40KB | 80% |
| medium | ~400KB | ~80KB | 80% |
| large | ~800KB | ~150KB | 81% |

### 🔍 Debugging

Check the actual URL being generated:
```javascript
const optimizedUrl = getOptimizedImageUrl(imageUrl, 'card');
console.log('Optimized URL:', optimizedUrl);
```

Example output:
```
https://res.cloudinary.com/yourcloud/image/upload/
w_500,q_auto:good,f_auto,c_fill,g_auto,dpr_auto,fl_progressive,fl_lossy/
v1234567890/properties/image.jpg
```

### 📱 Responsive Images

For art-directed responsive images:
```javascript
<picture>
  <source 
    media="(min-width: 768px)" 
    srcSet={getOptimizedImageUrl(url, 'large')} 
  />
  <source 
    media="(min-width: 480px)" 
    srcSet={getOptimizedImageUrl(url, 'medium')} 
  />
  <img 
    src={getOptimizedImageUrl(url, 'small')} 
    alt="Property"
  />
</picture>
```

### 🎯 Best Practices

1. **Property Listings** → Use `'card'` preset
2. **Property Detail** → Use `'large'` for main images
3. **Gallery Thumbnails** → Use `'thumb'`
4. **Hero Sections** → Use `'hero'`
5. **User Avatars** → Use `'thumb'`

---

**Last Updated:** January 9, 2026
