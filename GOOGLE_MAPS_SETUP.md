# Google Maps Integration Setup Guide

This guide explains how to set up Google Maps integration for precise location selection in the property listing form.

## 📋 Prerequisites

- Google Cloud Platform (GCP) account
- Enabled billing on your GCP project
- Property listing payment system already configured

## 🔧 Setup Steps

### 1. Create/Select Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your **Project ID**

### 2. Enable Required APIs

Enable these APIs in your GCP project:

1. **Maps JavaScript API**
   - Provides the map display functionality
   - Navigate to: APIs & Services → Library
   - Search for "Maps JavaScript API"
   - Click "Enable"

2. **Places API**
   - Provides address autocomplete and geocoding
   - Navigate to: APIs & Services → Library
   - Search for "Places API"
   - Click "Enable"

3. **Geocoding API** (Optional but recommended)
   - Converts addresses to coordinates and vice versa
   - Navigate to: APIs & Services → Library
   - Search for "Geocoding API"
   - Click "Enable"

### 3. Create API Key

1. Go to: **APIs & Services → Credentials**
2. Click **"+ CREATE CREDENTIALS"**
3. Select **"API key"**
4. Copy the generated API key immediately

### 4. Secure Your API Key (Important!)

1. Click on your newly created API key to edit it
2. Under **"Application restrictions"**:
   - For development: Select **"HTTP referrers"**
   - Add: `http://localhost:5173/*` (your dev server)
   - Add: `https://yourdomain.com/*` (your production domain)
   
3. Under **"API restrictions"**:
   - Select **"Restrict key"**
   - Choose:
     - Maps JavaScript API
     - Places API
     - Geocoding API

4. Click **"Save"**

### 5. Configure Environment Variables

Add to `client/.env`:

```env
VITE_GOOGLE_MAPS_API_KEY=your_actual_google_maps_api_key_here
```

**⚠️ Important:** 
- Never commit `.env` file to version control
- The API key must start with `VITE_` to be accessible in Vite
- Restart the dev server after adding the key

### 6. Update `.env.example`

```env
# Google Maps API Key (get from Google Cloud Console)
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## 🎯 Features Implemented

### LocationPicker Component

The component provides:

1. **Interactive Map Display**
   - Click anywhere to select location
   - Automatic marker placement
   - Zoom controls

2. **Address Search**
   - Powered by Google Places Autocomplete
   - Instant search results
   - Auto-updates map on selection

3. **Current Location Button**
   - Uses browser's geolocation API
   - One-click location detection
   - Reverse geocoding for address

4. **Address Auto-fill**
   - Automatically extracts:
     - Street address
     - Locality
     - City
     - State
     - Pincode
   - Populates form fields automatically

5. **Coordinate Display**
   - Shows precise latitude/longitude
   - 6 decimal places for accuracy
   - Formatted display

### Integration with AddProperty Form

The LocationPicker component is integrated into the Add Property form and:

1. **Replaces manual coordinate inputs**
   - No more guessing longitude/latitude
   - Visual selection instead of text input
   
2. **Auto-fills address fields**
   - Street address
   - Locality
   - City
   - State
   - Pincode

3. **Maintains form state**
   - Coordinates stored in proper format [longitude, latitude]
   - Compatible with MongoDB GeoJSON Point structure

## 🧪 Testing

### Test Locally

1. Start the client dev server:
```bash
cd client
npm run dev
```

2. Navigate to: http://localhost:5173/landlord/add-property

3. Scroll to the "Property Location" section

4. Test the following:
   - **Search**: Type an address and select from dropdown
   - **Click**: Click on the map to select a location
   - **Current Location**: Click the location button to use your current position
   - **Marker**: Verify the red marker appears at the selected location
   - **Auto-fill**: Check that address fields are populated automatically

### Verify Data

Check the browser console for:
- No API key errors
- No CORS errors
- Location data structure:
```javascript
{
  coordinates: [longitude, latitude],
  address: "Full formatted address",
  addressComponents: {
    street: "...",
    locality: "...",
    city: "...",
    state: "...",
    pincode: "...",
    country: "..."
  }
}
```

## 🚀 Usage Instructions

### For Landlords:

1. **Navigate to Add Property Page**
   - Login as landlord
   - Go to Dashboard → Add New Property

2. **Fill Basic Details**
   - Property title, description, rent, etc.

3. **Select Location**
   - **Option A - Search**: Type the property address in the search box
   - **Option B - Click Map**: Click directly on the map where the property is located
   - **Option C - Current Location**: Click the location icon if you're at the property

4. **Verify Location**
   - Check the blue info box showing the selected address
   - Verify the coordinates are correct
   - The marker shows the exact position

5. **Address Auto-fill**
   - Most address fields will be filled automatically
   - Review and edit if needed
   - Add landmark manually if required

6. **Complete Form**
   - Fill remaining details (amenities, rooms, etc.)
   - Click "Pay ₹100 & List Property"

## 💰 Google Maps Pricing

### Free Tier
- **$200 free credit per month**
- Covers approximately:
  - 28,500 map loads
  - 40,000 geocoding requests
  - 17,000 autocomplete requests per month

### Pricing After Free Tier
- Maps JavaScript API: **$7** per 1,000 loads
- Places Autocomplete: **$17** per 1,000 requests
- Geocoding API: **$5** per 1,000 requests

**💡 Tip:** For a property listing platform with moderate traffic, the free tier should be sufficient. Monitor usage in GCP Console.

## 🔒 Security Best Practices

1. **Restrict API Key**
   - Always set HTTP referrer restrictions
   - Only enable required APIs
   - Different keys for dev/production

2. **Hide from Git**
   - Add `.env` to `.gitignore`
   - Use `.env.example` for documentation
   - Never commit actual keys

3. **Monitor Usage**
   - Set up billing alerts in GCP
   - Review API usage regularly
   - Check for unauthorized usage

4. **Rate Limiting** (Optional)
   - Implement rate limiting on frontend
   - Debounce search requests
   - Cache geocoding results

## 🐛 Troubleshooting

### Issue: "Google Maps API Key Missing" Error

**Solution:**
1. Verify `.env` file exists in `client/` directory
2. Check variable name: `VITE_GOOGLE_MAPS_API_KEY` (must start with `VITE_`)
3. Restart the dev server after adding the key

### Issue: Map Not Loading

**Solutions:**
1. Check browser console for errors
2. Verify API key is correct
3. Ensure Maps JavaScript API is enabled in GCP
4. Check HTTP referrer restrictions match your domain

### Issue: Search Not Working

**Solutions:**
1. Verify Places API is enabled
2. Check API key restrictions
3. Ensure billing is enabled on GCP project

### Issue: "This page can't load Google Maps correctly"

**Solutions:**
1. Check that Maps JavaScript API is enabled
2. Verify billing account is active
3. Ensure API key restrictions are correct
4. Check browser console for specific error codes

### Issue: Address Not Auto-filling

**Solutions:**
1. Check that address components are being parsed correctly
2. Verify the geocoding response structure
3. Check browser console for errors
4. Try selecting location again

## 📚 Additional Resources

- [Google Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)
- [Google Maps Platform Pricing](https://developers.google.com/maps/billing-and-pricing/pricing)

## 🎉 Success Checklist

- [ ] Google Cloud project created
- [ ] Maps JavaScript API enabled
- [ ] Places API enabled
- [ ] API key created and secured
- [ ] HTTP referrer restrictions set
- [ ] API restrictions configured
- [ ] Environment variable added to `.env`
- [ ] Dev server restarted
- [ ] Map displays correctly
- [ ] Search functionality works
- [ ] Current location button works
- [ ] Address auto-fills correctly
- [ ] Marker appears on selection
- [ ] Coordinates display properly
- [ ] Form submission works with location data

---

**Ready to go!** Your property listing form now has precise, Google Maps-powered location selection. 🎯📍
