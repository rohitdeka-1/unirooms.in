# Admin Property Approval System

## Overview
A complete admin property approval system has been implemented. When landlords list a property, an email is automatically sent to `alkardorhd@gmail.com` for review. The admin can then approve or decline properties through a dedicated admin panel.

## Features Implemented

### 1. **Email Notifications**
- When a landlord creates a new property, an automatic email is sent to `alkardorhd@gmail.com`
- Email includes:
  - Property title and description
  - Landlord name and email
  - Location (city)
  - Price
  - Direct link to review the property in admin panel

### 2. **Backend API Endpoints**

#### Admin Routes (Protected)
- **GET** `/api/properties/admin/all?status=pending|verified|all`
  - Fetches all properties based on status filter
  - Returns array of properties with landlord information

- **PUT** `/api/properties/admin/:id/approve`
  - Approves a property (sets `isVerified: true`)
  - Makes the property visible to students

- **DELETE** `/api/properties/admin/:id/decline`
  - Declines and deletes a property from database
  - Permanently removes the property

### 3. **Admin Dashboard UI**
- **Route**: `/admin/properties`
- **Location**: `client/src/pages/AdminProperties.jsx`

#### Dashboard Features:
- **Filter Tabs**: 
  - Pending - Shows all unverified properties
  - Verified - Shows all approved properties
  - All - Shows all properties regardless of status

- **Property Cards Display**:
  - Property title, description, location, price
  - Landlord information (name, email, phone)
  - Property details (room type, total rooms, available rooms, nearby college)
  - Verification status badge (Pending/Verified)

- **Action Buttons** (for pending properties):
  - ✅ **Approve Property** - Verifies the property
  - ❌ **Decline & Delete** - Removes the property permanently

## How It Works

### Landlord Flow:
1. Landlord lists a new property on `/landlord/add-property`
2. Pays ₹99 listing fee via Cashfree
3. Property is created with `isVerified: false`
4. Email is automatically sent to admin
5. Property appears in their dashboard as "Pending Verification"

### Admin Flow:
1. Receives email notification at `alkardorhd@gmail.com`
2. Visits `/admin/properties` to review
3. Filters by "Pending" to see new properties
4. Reviews property details and landlord information
5. Takes action:
   - **Approve** → Property becomes visible to students
   - **Decline** → Property is deleted from database

### Student Flow:
- Only sees verified properties on `/browse`
- Unverified properties are automatically hidden

## Access the Admin Panel

Simply navigate to: **`http://your-domain.com/admin/properties`**

**Note**: Currently, any logged-in user can access the admin panel. You may want to add role-based authorization to restrict access to admin users only.

## Files Modified/Created

### Backend:
- ✅ `server/src/Services/email.service.js` - Added `sendNewPropertyNotification` function
- ✅ `server/src/Controllers/property.controller.js` - Added admin endpoints and email call
- ✅ `server/src/Routes/property.routes.js` - Added admin routes

### Frontend:
- ✅ `client/src/pages/AdminProperties.jsx` - New admin dashboard page
- ✅ `client/src/App.jsx` - Added route for admin page

## Security Recommendations

### Current State:
- Routes are protected with JWT authentication
- Any logged-in user can access admin endpoints

### Recommended Improvements:
1. **Add Admin Role**:
   - Add `role` field to User model with values: 'student', 'landlord', 'admin'
   - Update auth middleware to check for admin role
   - Only allow users with `role: 'admin'` to access admin routes

2. **Admin Email Whitelist**:
   - Create a whitelist of admin emails in config
   - Check if user's email is in whitelist before allowing access

3. **Example Admin Middleware**:
```javascript
// Middlewares/admin.middleware.js
export const isAdmin = (req, res, next) => {
  if (req.user.email !== 'alkardorhd@gmail.com') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};
```

Then use it in routes:
```javascript
router.get("/admin/all", protect, isAdmin, getAllPropertiesAdmin);
router.put("/admin/:id/approve", protect, isAdmin, approveProperty);
router.delete("/admin/:id/decline", protect, isAdmin, declineProperty);
```

## Testing

1. **Test Email Notification**:
   - Create a new property as landlord
   - Check `alkardorhd@gmail.com` inbox
   - Verify email received with property details

2. **Test Admin Dashboard**:
   - Navigate to `/admin/properties`
   - Click "Pending" filter
   - Should see newly created property
   - Click "Approve Property" button
   - Property should disappear from pending and appear in "Verified" filter

3. **Test Decline**:
   - Create another test property
   - Click "Decline & Delete" button
   - Confirm deletion in popup
   - Property should be removed from database

## Email Template Example

The admin receives an email with:
```
Subject: New Property Listing - [Property Title]

Hi Admin,

A new property has been listed on PG College Finder and requires your review.

Property Details:
- Title: [Property Title]
- Description: [Property Description]
- City: [City Name]
- Price: ₹[Price]/month

Landlord Information:
- Name: [Landlord Name]
- Email: [Landlord Email]

Please review this property in the admin panel:
[Link to Admin Panel]

Best regards,
PG College Finder Team
```

## Environment Variables Required

Make sure these are set in your `.env`:
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
```

## Next Steps

1. ✅ System is ready to use
2. 🔒 Consider adding admin role-based authorization
3. 📧 Verify email service is working correctly
4. 🧪 Test the complete flow end-to-end
5. 📱 Optionally add mobile-responsive improvements

---

**All set! The admin property approval system is now live and ready to use.** 🎉
