# Fix Google OAuth Signup - Phone Index Error

## Problem
```
MongoServerError: E11000 duplicate key error collection: PG_Finder.users index: phone_1 dup key: { phone: null }
```

This error occurs when multiple users try to sign up with Google OAuth because:
- Google OAuth users don't have phone numbers (phone is `null`)
- MongoDB's unique index on the `phone` field treats all `null` values as the same
- Only ONE user can have `phone: null`, so the second Google signup fails

## Solution: Fix the Database Index

The phone index needs to be **sparse**, which allows multiple `null` values while still enforcing uniqueness on actual phone numbers.

### Option 1: Run the Fix Script (Recommended)

**On Railway (Production):**

1. **Connect to your Railway app via terminal:**
   ```bash
   railway run node src/scripts/fix-phone-index.js
   ```

   OR if you have direct access:
   ```bash
   cd server
   node src/scripts/fix-phone-index.js
   ```

2. **The script will:**
   - Drop the old non-sparse phone index
   - Create a new sparse unique index
   - Verify the fix

**On Local Development:**

```bash
cd server
node src/scripts/fix-phone-index.js
```

### Option 2: Fix Manually via MongoDB Compass or Shell

**Using MongoDB Shell:**

```javascript
// Connect to your database
use PG_Finder

// Drop the old index
db.users.dropIndex("phone_1")

// Create new sparse unique index
db.users.createIndex(
  { phone: 1 }, 
  { unique: true, sparse: true, name: "phone_1" }
)

// Verify
db.users.getIndexes()
```

**Using MongoDB Compass:**

1. Connect to your MongoDB database
2. Go to the `PG_Finder` database
3. Select the `users` collection
4. Go to "Indexes" tab
5. Delete the `phone_1` index
6. Create a new index:
   - Field: `phone`
   - Type: `1 (ascending)`
   - Options: Check "unique" and "sparse"
   - Name: `phone_1`

### Option 3: Railway Dashboard Method

If you can't run scripts directly on Railway:

1. **Add a temporary API endpoint** to run the fix:

Add this to `server/src/Routes/test.routes.js`:

```javascript
router.get("/fix-phone-index", async (req, res) => {
    try {
        const db = mongoose.connection.db;
        const usersCollection = db.collection("users");
        
        // Drop old index
        await usersCollection.dropIndex("phone_1").catch(() => {});
        
        // Create sparse index
        await usersCollection.createIndex(
            { phone: 1 }, 
            { unique: true, sparse: true, name: "phone_1" }
        );
        
        res.json({ 
            success: true, 
            message: "Phone index fixed successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});
```

2. **Deploy to Railway**

3. **Call the endpoint once:**
   ```bash
   curl https://your-app.railway.app/api/test/fix-phone-index
   ```

4. **Remove the endpoint** and redeploy

## Verify the Fix

After running the fix:

1. **Check the logs** - you should see:
   ```
   ✅ Sparse unique index created successfully
   ```

2. **Test Google OAuth signup** - multiple users should now be able to sign up

3. **Verify in MongoDB:**
   ```javascript
   db.users.getIndexes()
   // Look for: { phone: 1 } with sparse: true
   ```

## Prevention

The User model already has `sparse: true` set:

```javascript
phone: {
    type: String,
    required: false,
    unique: true,
    sparse: true,  // ✅ Already configured
    ...
}
```

But if the index was created before this was added, it needs to be manually updated.

## Common Issues

### Issue 1: Script can't connect to MongoDB
**Fix:** Ensure `MONGO_URI` is set in your `.env` file

### Issue 2: "ns not found" error when dropping index
**Fix:** This is okay - it means the index doesn't exist. The script will create it.

### Issue 3: Permission denied on Railway
**Fix:** Use Option 3 (temporary API endpoint) instead

## After the Fix

Once fixed, Google OAuth users can sign up successfully:
- ✅ Multiple users with `phone: null` are allowed
- ✅ Users with actual phone numbers must still be unique
- ✅ No more duplicate key errors

## Alternative: Remove Phone Unique Constraint

If you don't need phone numbers to be unique:

```javascript
// In user.model.js, change:
phone: {
    type: String,
    required: false,
    // Remove: unique: true,
    // Remove: sparse: true,
    match: [/^[6-9]\d{9}$/, "Please provide a valid 10-digit Indian phone number"],
}
```

Then run:
```javascript
db.users.dropIndex("phone_1")
```

## Need Help?

If the issue persists:
1. Check Railway logs for the exact error
2. Verify MongoDB connection
3. Ensure the fix script ran successfully
4. Check that indexes are correct: `db.users.getIndexes()`
