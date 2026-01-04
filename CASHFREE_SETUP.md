# Cashfree Payment Gateway Integration Guide

This project uses Cashfree Payment Gateway for processing property listing payments (₹100 per property).

## Setup Instructions

### 1. Create Cashfree Account

1. Go to [Cashfree](https://www.cashfree.com/) and sign up
2. Complete KYC verification (required for production)
3. You'll get access to both Sandbox and Production environments

### 2. Get Credentials

**For Testing (Sandbox):**
1. Login to [Cashfree Sandbox Dashboard](https://sandbox.cashfree.com/merchant/dashboard)
2. Navigate to **Developers** → **API Keys**
3. Copy your **App ID** and **Secret Key**

**For Production:**
1. Login to [Cashfree Dashboard](https://merchant.cashfree.com/merchant/dashboard)
2. Navigate to **Developers** → **API Keys**
3. Copy your **App ID** and **Secret Key**

### 3. Configure Environment Variables

Add these to your `.env` file:

```env
# Cashfree Payment Gateway
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_ENVIRONMENT=TEST  # or PRODUCTION
BACKEND_URL=http://localhost:5000
```

### 4. Frontend Configuration

Create/update `.env` in the client folder:

```env
REACT_APP_CASHFREE_MODE=sandbox  # or production
```

## How It Works

### Payment Flow

1. **Create Order**: Landlord clicks "Pay ₹100 & List Property"
   - Frontend calls `/api/payments/create-order`
   - Backend creates Cashfree order and returns `payment_session_id`

2. **Payment Modal**: Cashfree SDK opens in modal
   - Landlord selects payment method (UPI, Card, Net Banking, Wallet)
   - Completes payment on Cashfree's secure interface

3. **Payment Verification**: After payment
   - Frontend calls `/api/payments/verify` with `order_id`
   - Backend verifies payment with Cashfree API
   - Returns success/failure status

4. **Webhook (Optional)**: Cashfree sends webhook
   - Endpoint: `/api/payments/webhook`
   - Automatically updates payment status in database

5. **Property Creation**: After successful payment
   - Frontend receives `paymentId`
   - Property is created with linked `paymentId`

## Testing in Sandbox Mode

### Test Cards

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- OTP: `123456`

**Failed Payment:**
- Card Number: `4012 0010 3714 1112`
- CVV: Any 3 digits
- Expiry: Any future date

### Test UPI

- UPI ID: `success@cashfree`
- PIN: Any 4-6 digits

## Webhook Configuration

Configure webhook URL in Cashfree dashboard:

**Webhook URL:** `https://yourdomain.com/api/v1/payments/webhook`

**Events to Subscribe:**
- `PAYMENT_SUCCESS_WEBHOOK`
- `PAYMENT_FAILED_WEBHOOK`

## Security Best Practices

1. **Never expose Secret Key**: Keep it in `.env` file only
2. **Verify Webhook Signature**: Implement signature verification for webhooks
3. **Use HTTPS**: Always use HTTPS in production
4. **Validate Payment**: Always verify payment status with Cashfree API

## API Endpoints

### Create Payment Order
```http
POST /api/v1/payments/create-order
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "orderId": "ORDER_xxx",
    "amount": 100,
    "currency": "INR",
    "paymentId": "mongodb_id",
    "payment_session_id": "session_xxx",
    "order_id": "order_xxx"
  }
}
```

### Verify Payment
```http
POST /api/v1/payments/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": "ORDER_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified successfully",
  "data": {
    "paymentId": "mongodb_id",
    "status": "success"
  }
}
```

### Webhook Handler
```http
POST /api/v1/payments/webhook
Content-Type: application/json
X-Webhook-Signature: <signature>
X-Webhook-Timestamp: <timestamp>

{
  "type": "PAYMENT_SUCCESS_WEBHOOK",
  "data": {
    "order": { "order_id": "ORDER_xxx" },
    "payment": {
      "cf_payment_id": "xxx",
      "payment_status": "SUCCESS",
      "payment_group": "upi",
      "payment_message": "Payment successful"
    }
  }
}
```

## Frontend Integration

The Cashfree SDK is loaded dynamically:

```javascript
// Load SDK
<script src="https://sdk.cashfree.com/js/v3/cashfree.js"></script>

// Initialize Cashfree
const cashfree = window.Cashfree({
  mode: "sandbox" // or "production"
});

// Open Checkout
cashfree.checkout({
  paymentSessionId: payment_session_id,
  redirectTarget: "_modal"
});
```

## Troubleshooting

### Error: "Payment session not found"
- Check if CASHFREE_APP_ID and CASHFREE_SECRET_KEY are correct
- Ensure CASHFREE_ENVIRONMENT matches your credentials (TEST/PRODUCTION)

### Error: "Invalid signature"
- Verify webhook signature validation
- Check if request is coming from Cashfree IPs

### Payment not updating in database
- Check webhook configuration
- Verify webhook URL is publicly accessible
- Check server logs for webhook errors

## Production Checklist

- [ ] Complete Cashfree KYC verification
- [ ] Switch to production credentials
- [ ] Update `CASHFREE_ENVIRONMENT=PRODUCTION`
- [ ] Update `REACT_APP_CASHFREE_MODE=production`
- [ ] Configure production webhook URL
- [ ] Implement webhook signature verification
- [ ] Test payment flow end-to-end
- [ ] Set up error monitoring
- [ ] Configure payment notification emails

## Support

- Cashfree Documentation: https://docs.cashfree.com/
- Cashfree Support: support@cashfree.com
- API Reference: https://docs.cashfree.com/reference

## References

- [Cashfree PG SDK](https://docs.cashfree.com/docs/web-integration)
- [Payment Gateway API](https://docs.cashfree.com/reference/pgcreateorder)
- [Webhooks](https://docs.cashfree.com/docs/webhooks)
