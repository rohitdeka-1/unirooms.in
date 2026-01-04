# Email Notifications Summary

## ✅ All Authentication Methods Now Send Emails

### 1. Student/Landlord Registration (Normal JWT)
- **On Registration**: Sends email verification link
- **After Email Verification**: Sends welcome email
- **On Login**: Sends login notification email

### 2. Google Signup
- **On Signup**: Sends welcome email immediately (no verification needed)
- **User Info**: Auto-verified since Google confirms the email

### 3. Google Login
- **On Login**: Sends login notification email
- **Details Included**: Device, IP address, location

### 4. OTP Login
- **On OTP Request**: Sends OTP code via email
- **On Successful Login**: Sends login notification email

## Email Types

### Welcome Email
- **Sent to**: New users after registration/verification
- **Content**: 
  - Welcome message
  - Role-specific information
  - Next steps for students/landlords
- **Template**: `welcome.hbs`

### Login Notification Email
- **Sent to**: Users on every login
- **Content**:
  - Login timestamp
  - Device information
  - IP address
  - Location (India)
  - Security alert if suspicious
- **Template**: `loginNotification.hbs`

### Verification Email
- **Sent to**: New users (JWT registration only)
- **Content**:
  - Verification link
  - Token expires in 24 hours
- **Template**: `emailVerification.hbs`

### OTP Email
- **Sent to**: Users requesting OTP login
- **Content**:
  - 6-digit OTP code
  - Expires in 10 minutes
- **Template**: `otp.hbs`

### Password Reset Email
- **Sent to**: Users requesting password reset
- **Content**:
  - 6-digit OTP code
  - Expires in 10 minutes
- **Template**: `passwordResetOTP.hbs`

## Configuration

All emails are sent from:
- **Service**: Gmail SMTP
- **Email**: `momootthubs28@gmail.com`
- **Auth**: App-specific password
- **From Name**: PG Finder

## Error Handling

All email sending is non-blocking:
```javascript
sendWelcomeEmail(...).catch((err) => 
    console.error("Failed to send email:", err)
);
```

This ensures that even if email fails, the authentication process completes successfully.

## Testing

To test emails:
1. Register a new student: Verification email sent
2. Verify email: Welcome email sent
3. Login: Login notification sent
4. Google Signup: Welcome email sent
5. Google Login: Login notification sent

All emails should appear in the user's inbox within seconds.
