#!/bin/bash

echo "🚀 Deploying UniRooms Backend to Heroku"
echo "========================================"
echo ""

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "❌ Heroku CLI is not installed"
    echo "Install it: curl https://cli-assets.heroku.com/install.sh | sh"
    exit 1
fi

echo "✅ Heroku CLI found"
echo ""

# Login check
echo "Checking Heroku login status..."
if ! heroku auth:whoami &> /dev/null; then
    echo "Please login to Heroku:"
    heroku login
fi

echo ""
read -p "Enter your Heroku app name (e.g., unirooms-api): " APP_NAME

if [ -z "$APP_NAME" ]; then
    echo "❌ App name is required"
    exit 1
fi

echo ""
echo "Creating Heroku app: $APP_NAME"
heroku create $APP_NAME 2>&1 | grep -v "already exists" || true

echo ""
echo "📝 Setting environment variables..."

# Set all environment variables
heroku config:set \
  MONGO_URI="mongodb+srv://pencilpandaofficial_db_user:uNAdS9h59olXA49j@cluster0.wclkkjd.mongodb.net/PG_Finder" \
  JWT_ACCESS_SECRET="akjsdnakjsdn1798219827398213akjhdskjahskdjhskjdhakjsbdjabsdj7126y3187263182y71jh312j3b1j2h3bn21v3nb21v3bnnbnbvn2" \
  JWT_REFRESH_SECRET="refresh_secret_key_ACess_IS_different/News><different_from_access_should_be_very_long_and_secure_random_string_hereNEWdataandFASTMAE" \
  JWT_ACCESS_EXPIRE="15m" \
  JWT_REFRESH_EXPIRE="7d" \
  GMAIL_USER="unirooms.in@gmail.com" \
  GMAIL_APP_PASSWORD="dlzgxitvlypkjhqx" \
  EMAIL_FROM_NAME="UniRooms" \
  FRONTEND_URL="https://unirooms.in" \
  GOOGLE_CLIENT_ID="1094535447252-1tbclnb8gu84ph2j1uc348ptk3c1fv7j.apps.googleusercontent.com" \
  CLOUDINARY_CLOUD_NAME="dg0qpcdcy" \
  CLOUDINARY_API_KEY="657956641882283" \
  CLOUDINARY_API_SECRET="VL9NVYlfmdGqLUSoHdyPRz1YjmU" \
  CASHFREE_ENVIRONMENT="TEST" \
  NODE_ENV="production" \
  -a $APP_NAME

echo ""
echo "✅ Environment variables set"
echo ""

# Add git remote if not exists
if ! git remote | grep -q heroku; then
    echo "Adding Heroku git remote..."
    heroku git:remote -a $APP_NAME
fi

echo ""
echo "📦 Deploying to Heroku..."
git add .
git commit -m "Deploy to Heroku" --allow-empty
git push heroku main || git push heroku master

echo ""
echo "⚙️  Scaling web dyno..."
heroku ps:scale web=1 -a $APP_NAME

echo ""
echo "✅ Deployment complete!"
echo ""
echo "Your API is available at: https://$APP_NAME.herokuapp.com"
echo ""
echo "🔧 Important: Run this command ONCE to fix phone index:"
echo "   curl https://$APP_NAME.herokuapp.com/api/test/fix-phone-index"
echo ""
echo "📊 View logs:"
echo "   heroku logs --tail -a $APP_NAME"
echo ""
echo "🌐 Open app:"
echo "   heroku open -a $APP_NAME"
echo ""
