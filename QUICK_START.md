# Quick Start Guide - Cashfree Integration

## ✅ What's Been Implemented

### Backend Integration
- ✅ Cashfree SDK installed (`cashfree-pg`)
- ✅ Payment controller with Cashfree API integration
- ✅ Create order endpoint
- ✅ Verify payment endpoint  
- ✅ Webhook handler for automatic status updates
- ✅ Payment routes configured

### Frontend Integration
- ✅ PaymentModal component with Cashfree SDK
- ✅ Dynamic SDK loading
- ✅ Modal checkout integration
- ✅ Payment verification flow

## 🚀 Getting Started

### 1. Install Dependencies

**Server:**
```bash
cd server
npm install
```

**Client:**
```bash
cd client
npm install
```

### 2. Configure Environment Variables

Create `.env` file in `server/` directory:

```env
# Required for Cashfree
CASHFREE_APP_ID=your_app_id_here
CASHFREE_SECRET_KEY=your_secret_key_here
CASHFREE_ENVIRONMENT=TEST
BACKEND_URL=http://localhost:5000

# Other required variables
MONGO_URI=your_mongodb_uri
JWT_ACCESS_SECRET=your_jwt_access_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
GOOGLE_CLIENT_ID=your_google_client_id
FRONTEND_URL=http://localhost:5173
```

Create `.env` file in `client/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
REACT_APP_CASHFREE_MODE=sandbox
```

### 3. Get Cashfree Credentials

**For Testing (Sandbox):**
1. Sign up at [Cashfree](https://www.cashfree.com/)
2. Go to [Sandbox Dashboard](https://sandbox.cashfree.com/merchant/dashboard)
3. Navigate to **Developers** → **API Keys**
4. Copy **App ID** and **Secret Key**

### 4. Start Development Servers

**Terminal 1 - Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Client:**
```bash
cd client
npm run dev
```

## 💳 Testing Payments

### Test Card (Sandbox)

**Success:**
- Card: `4111 1111 1111 1111`
- CVV: `123`
- Expiry: Any future date
- OTP: `123456`

**Failure:**
- Card: `4012 0010 3714 1112`

### Test UPI (Sandbox)
- UPI ID: `success@cashfree`

## 🔄 Payment Flow

1. Landlord fills property form
2. Clicks "Pay ₹100 & List Property"
3. Payment modal opens with Cashfree checkout
4. Landlord completes payment
5. Payment is verified automatically
6. Property gets created with linked payment

## 📁 Key Files Modified

### Backend
- `/server/src/Controllers/payment.controller.js` - Cashfree integration
- `/server/src/Routes/payment.routes.js` - Payment endpoints
- `/server/package.json` - Added `cashfree-pg` dependency

### Frontend
- `/client/src/components/PaymentModal.jsx` - Cashfree SDK integration
- `/client/src/utils/api.js` - Payment API calls

## 🐛 Troubleshooting

### Server won't start
```bash
# Check if all dependencies are installed
cd server && npm install

# Verify .env file exists and has correct values
cat .env
```

### Payment creation fails
- ✅ Check CASHFREE_APP_ID and CASHFREE_SECRET_KEY in .env
- ✅ Verify CASHFREE_ENVIRONMENT is set to "TEST" for sandbox
- ✅ Check server logs for detailed error

### Cashfree SDK not loading
- ✅ Check browser console for script loading errors
- ✅ Verify internet connection
- ✅ Clear browser cache

## 📚 API Endpoints

### Create Payment Order
```http
POST /api/v1/payments/create-order
Authorization: Bearer <landlord_token>
```

### Verify Payment
```http
POST /api/v1/payments/verify
Authorization: Bearer <landlord_token>
Content-Type: application/json

{
  "orderId": "ORDER_xxx"
}
```

### Webhook (Called by Cashfree)
```http
POST /api/v1/payments/webhook
```

## 🔐 Security Notes

- Never commit `.env` file
- Use different credentials for production
- Implement webhook signature verification in production
- Always verify payment on backend before creating property

## 📖 Full Documentation

See [CASHFREE_SETUP.md](./CASHFREE_SETUP.md) for detailed documentation.

## ✅ Checklist for Production

- [ ] Get production Cashfree credentials
- [ ] Update CASHFREE_ENVIRONMENT to "PRODUCTION"
- [ ] Update REACT_APP_CASHFREE_MODE to "production"
- [ ] Configure webhook URL in Cashfree dashboard
- [ ] Implement webhook signature verification
- [ ] Set up SSL/HTTPS
- [ ] Test payment flow end-to-end
- [ ] Set up error monitoring
