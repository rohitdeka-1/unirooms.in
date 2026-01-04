# College-Based Property Search Feature

## Overview
This feature allows students to search for PG accommodations by college name. When users search for a college, the system shows properties within a 5km radius, sorted by distance.

## Implementation Details

### Backend Components

#### 1. College Model (`server/src/Models/college.model.js`)
- Stores college information with GeoJSON coordinates
- Includes geospatial 2dsphere index for proximity queries
- Fields: name, shortName, location (coordinates), address, type

#### 2. College Service (`server/src/Services/college.service.js`)
- Contains a database of 25+ popular Indian colleges with accurate coordinates
- Includes colleges like VIT (Vellore, Bhopal, Chennai), IITs, NITs, BITS, SRM, etc.
- Provides `searchColleges()` function for autocomplete
- Provides `getCollegeByName()` for exact matches

#### 3. Property Controller Updates (`server/src/Controllers/property.controller.js`)
Two new endpoints added:

**a) Search Colleges API**
- **Endpoint**: `GET /api/v1/properties/colleges/search?query=<name>`
- **Purpose**: Returns matching colleges for autocomplete dropdown
- **Returns**: Array of colleges with name, location, city, state

**b) Get Properties Near College**
- **Endpoint**: `GET /api/v1/properties/near-college?collegeName=<name>&maxDistance=5`
- **Purpose**: Finds properties within specified radius of college
- **Uses MongoDB $geoNear** for efficient geospatial queries
- **Returns**: 
  - Properties sorted by distance
  - Distance in kilometers for each property
  - College information
  - Supports all standard filters (price, room type, amenities, etc.)

#### 4. Routes (`server/src/Routes/property.routes.js`)
Added two public routes:
```javascript
router.get("/colleges/search", searchCollegesAPI);
router.get("/near-college", getPropertiesNearCollege);
```

### Frontend Components

#### 1. API Utilities (`client/src/utils/api.js`)
Added two new API methods:
```javascript
propertyAPI.searchColleges(query) // Search colleges
propertyAPI.getPropertiesNearCollege(params) // Get nearby properties
```

#### 2. SearchBar Component (`client/src/components/SearchBar.jsx`)
Enhanced with:
- **Real-time college autocomplete** with 300ms debounce
- **Dropdown suggestions** with college icons and locations
- **Popular colleges** quick select buttons
- **Loading indicator** during search
- **Click outside** to close suggestions
- Navigates to browse page with college filter

Features:
- Shows colleges as user types (minimum 2 characters)
- Displays college name, city, and state
- Beautiful UI with icons and hover effects
- Mobile responsive

#### 3. Browse Page (`client/src/pages/Browse.jsx`)
Major updates:
- **Detects college parameter** from URL (`?college=<name>`)
- **Fetches properties near college** using API
- **Shows college info banner** with college details
- **Displays distance** for each property
- **Adds "Nearest First" sorting** option when college search is active
- **Loading states** and error handling
- Falls back to mock data if API fails

New UI Elements:
- College info banner with clear button
- Distance badges on property cards (green badges showing "X km away")
- Dynamic title: "PGs near [College Name]"
- Distance-based sorting option

#### 4. PropertyCard Component (`client/src/components/PropertyCard.jsx`)
Added:
- **Distance badge** showing kilometers from college (when available)
- Green badge with distance icon
- Only displays when `distanceInKm` property exists

## How It Works

### User Flow

1. **User types college name** in search bar
   - System searches for matching colleges
   - Shows autocomplete dropdown with suggestions

2. **User selects a college** from dropdown or popular colleges
   - Navigates to: `/properties?college=VIT%20Bhopal`
   - Browse page detects college parameter

3. **System fetches nearby properties**
   - Sends college name to backend API
   - Backend finds college coordinates
   - Uses MongoDB geospatial query to find properties within 5km
   - Calculates distance for each property

4. **Results displayed**
   - College info banner at top
   - Properties sorted by distance (nearest first)
   - Each property shows distance badge
   - All standard filters still work (price, type, amenities)

### Technical Implementation

#### MongoDB Geospatial Query
```javascript
Property.aggregate([
    {
        $geoNear: {
            near: {
                type: "Point",
                coordinates: [longitude, latitude], // College coordinates
            },
            distanceField: "distance",
            maxDistance: 5000, // 5km in meters
            spherical: true,
            query: filters, // Other filters like price, room type
        },
    },
    // ... additional pipeline stages
])
```

#### Distance Calculation
- MongoDB automatically calculates distance in meters
- Converted to kilometers: `distance / 1000`
- Rounded to 2 decimal places for display

## Supported Colleges

The system includes 25+ colleges across India:

**VIT Campuses**: Vellore, Bhopal, Chennai  
**IITs**: Delhi, Bombay, Madras, Kanpur, Kharagpur, Roorkee  
**NITs**: Trichy, Kurukshetra, Warangal  
**BITS**: Pilani, Goa  
**Others**: SRM, Manipal, Anna University, Delhi University, BHU, AMU, Jamia, Jadavpur

More colleges can be easily added to `college.service.js`.

## Configuration

### Search Radius
Default: 5km  
Can be adjusted in Browse page API call:
```javascript
const params = {
    collegeName: collegeName,
    maxDistance: 10, // Change to 10km
};
```

### Debounce Time
Default: 300ms  
Can be adjusted in SearchBar component:
```javascript
searchTimeoutRef.current = setTimeout(async () => {
    // Search logic
}, 300); // Change delay here
```

## Future Enhancements

1. **Add more colleges** to the database
2. **Allow users to suggest** new colleges
3. **Show college on map** with property locations
4. **Filter by distance ranges** (0-2km, 2-5km, etc.)
5. **Public transport information** from college to property
6. **Multiple college selection** to search between several colleges
7. **Save favorite colleges** to user profile
8. **Popular PGs near college** trending section

## Testing

### Backend Testing
```bash
# Test college search
curl "http://localhost:5000/api/v1/properties/colleges/search?query=VIT"

# Test nearby properties
curl "http://localhost:5000/api/v1/properties/near-college?collegeName=VIT%20Bhopal&maxDistance=5"
```

### Frontend Testing
1. Open home page
2. Type college name in search bar
3. Select from dropdown
4. Verify results show distance
5. Test sorting by distance
6. Test clearing college filter

## Dependencies

No new dependencies required. Uses existing:
- MongoDB with geospatial indexes
- Framer Motion (already installed)
- React Router (already installed)

## Performance Considerations

- **Geospatial indexes** ensure fast queries
- **Debounced search** reduces API calls
- **Client-side filtering** for additional criteria
- **Pagination** for large result sets
- **Caching** can be added for frequently searched colleges

## Mobile Responsiveness

- Autocomplete dropdown adapts to screen size
- College info banner responsive
- Distance badges visible on all devices
- Touch-friendly interface

## Accessibility

- Keyboard navigation support
- ARIA labels for screen readers
- Clear focus indicators
- Color contrast compliant

---

**Status**: ✅ Fully Implemented and Ready to Use

**Last Updated**: January 4, 2026
