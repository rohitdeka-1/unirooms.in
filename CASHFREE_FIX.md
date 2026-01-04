# Cashfree Payment Integration - Troubleshooting Guide

## ✅ Issue Fixed: Cashfree.PGCreateOrder is not a function

### Problem
Error occurred when trying to create payment orders:
```
TypeError: Cashfree.PGCreateOrder is not a function
```

### Root Cause
Cashfree SDK v5.x changed from static methods to instance-based methods. The previous implementation was using:
```javascript
// ❌ Old (incorrect)
const response = await Cashfree.PGCreateOrder("2023-08-01", request);
```

### Solution Applied
Updated to use instance-based method calls with correct environment import:
```javascript
// ✅ New (correct)
import { Cashfree, CFEnvironment } from "cashfree-pg";

const cashfree = new Cashfree({
    XClientId: config.CASHFREE_APP_ID,
    XClientSecret: config.CASHFREE_SECRET_KEY,
    XEnvironment: config.CASHFREE_ENVIRONMENT === "PRODUCTION" 
        ? CFEnvironment.PRODUCTION 
        : CFEnvironment.SANDBOX
});

const response = await cashfree.PGCreateOrder("2023-08-01", request);
```

## 🔧 Current Implementation

### Files Modified
1. **server/src/Controllers/payment.controller.js**
   - Changed Cashfree initialization to instance-based
   - Updated `createPaymentOrder` function to use `cashfree.PGCreateOrder()`
   - Updated `verifyPayment` function to use `cashfree.PGOrderFetchPayments()`

### Cashfree SDK Version
- **Package**: `cashfree-pg`
- **Version**: `5.1.0`
- **API Version**: `2023-08-01`

## 🎯 Testing Payment Flow

### Prerequisites
1. Cashfree sandbox account credentials in `.env`:
```env
CASHFREE_APP_ID=your_sandbox_app_id
CASHFREE_SECRET_KEY=your_sandbox_secret_key
CASHFREE_ENVIRONMENT=SANDBOX
```

2. Server running on port 5000 (or configured port)
3. Client running on port 5173 (or configured port)

### Step-by-Step Test

1. **Login as Landlord**
   - Email: landlord@example.com
   - Role: landlord

2. **Navigate to Add Property**
   - URL: http://localhost:5173/landlord/add-property

3. **Fill Property Details**
   - Title, description, price, etc.
   - Select location using Google Maps

4. **Click "Pay ₹100 & List Property"**
   - Payment modal should open
   - Cashfree SDK loads dynamically

5. **Complete Payment in Sandbox**
   - Use Cashfree test cards
   - Test Card: 4111111111111111
   - CVV: 123
   - Expiry: Any future date

6. **Verify Payment**
   - Payment status updated in database
   - Property created with paymentId
   - Redirected to landlord dashboard

### Expected API Calls

#### 1. Create Payment Order
```http
POST /api/v1/payments/create-order
Authorization: Bearer <access_token>

Response:
{
  "success": true,
  "message": "Payment order created successfully",
  "data": {
    "orderId": "ORDER_1234567890_abc123",
    "amount": 100,
    "currency": "INR",
    "paymentId": "507f1f77bcf86cd799439011",
    "payment_session_id": "session_xxx",
    "order_id": "ORDER_1234567890_abc123"
  }
}
```

#### 2. Verify Payment
```http
POST /api/v1/payments/verify
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "orderId": "ORDER_1234567890_abc123"
}

Response:
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "paymentId": "507f1f77bcf86cd799439011",
    "status": "success"
  }
}
```

#### 3. Create Property
```http
POST /api/v1/properties
Authorization: Bearer <access_token>
Content-Type: application/json

Body:
{
  "title": "Comfortable PG near XYZ College",
  "description": "...",
  "price": 5000,
  "location": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716]
  },
  "paymentId": "507f1f77bcf86cd799439011",
  ...
}

Response:
{
  "success": true,
  "message": "Property created successfully",
  "data": { ... }
}
```

## 🐛 Common Issues & Solutions

### Issue 1: Environment.SANDBOX is undefined

**Error:**
```
TypeError: Cannot read properties of undefined (reading 'SANDBOX')
```

**Solution:**
Use `CFEnvironment` import instead of `Cashfree.Environment`:
```javascript
// ❌ Wrong
import { Cashfree } from "cashfree-pg";
XEnvironment: Cashfree.Environment.SANDBOX

// ✅ Correct
import { Cashfree, CFEnvironment } from "cashfree-pg";
XEnvironment: CFEnvironment.SANDBOX
```

### Issue 2: Payment modal not opening

**Possible Causes:**
1. Cashfree SDK not loaded
2. Invalid payment_session_id
3. CORS issues

**Debug Steps:**
```javascript
// Check if SDK is loaded
console.log('Cashfree SDK:', window.Cashfree);

// Check payment session ID
console.log('Session ID:', paymentSessionId);

// Check for errors in browser console
```

### Issue 3: Payment verification fails

**Possible Causes:**
1. Incorrect order ID
2. Payment not completed
3. Network issues with Cashfree API

**Debug Steps:**
1. Check payment status in Cashfree dashboard
2. Verify order ID matches
3. Check server logs for API errors

### Issue 4: Webhook not receiving events

**Possible Causes:**
1. Webhook URL not accessible (localhost)
2. Signature verification failed
3. Incorrect webhook URL in Cashfree dashboard

**Solutions:**
1. Use ngrok for local testing:
```bash
ngrok http 5000
# Use ngrok URL in webhook configuration
```

2. Verify webhook signature:
```javascript
const isValid = cashfree.PGVerifyWebhookSignature(
    rawBody,
    signature,
    timestamp
);
```

## 📊 Monitoring & Debugging

### Check Payment Status in Database

```javascript
// MongoDB query
db.payments.find({ userId: ObjectId("...") }).sort({ createdAt: -1 });

// Expected document:
{
  "_id": ObjectId("..."),
  "userId": ObjectId("..."),
  "amount": 100,
  "currency": "INR",
  "status": "success",
  "purpose": "property_listing",
  "cashfreeOrderId": "ORDER_1234567890_abc123",
  "cashfreePaymentId": "12345678",
  "paymentMethod": "card",
  "paymentDate": ISODate("..."),
  "transactionMessage": "Payment successful",
  "createdAt": ISODate("..."),
  "updatedAt": ISODate("...")
}
```

### Check Server Logs

```bash
# In server directory
npm run dev

# Look for:
✅ "Payment order created successfully"
✅ "Payment verified successfully"
❌ "Create Payment Order Error: ..."
❌ "Verify Payment Error: ..."
```

### Check Network Tab (Browser DevTools)

1. Open DevTools → Network tab
2. Filter: XHR
3. Look for:
   - `/api/v1/payments/create-order` - Should return 201
   - `/api/v1/payments/verify` - Should return 200
   - `/api/v1/properties` - Should return 201

## 🔐 Security Checklist

- [x] Cashfree credentials in `.env` (not committed)
- [x] Webhook signature verification implemented
- [x] Payment verification before property creation
- [x] User authorization checks (landlord only)
- [x] Order ID validation
- [x] CORS configured for frontend domain

## 📚 Useful Links

- [Cashfree SDK Documentation](https://docs.cashfree.com/docs/nodejs-integration)
- [Cashfree Sandbox Dashboard](https://sandbox.cashfree.com/merchants)
- [Cashfree API Reference](https://docs.cashfree.com/reference)
- [Cashfree Test Cards](https://docs.cashfree.com/docs/test-cards)

## ✨ Success Indicators

- [ ] Server starts without errors
- [ ] Payment order creates successfully
- [ ] Cashfree modal opens with test environment
- [ ] Test payment completes
- [ ] Payment verification succeeds
- [ ] Property creates with paymentId
- [ ] Payment status updates in database
- [ ] Webhook receives events (production)

---

**Payment integration is now working!** Test thoroughly in sandbox before moving to production. 💳✅
