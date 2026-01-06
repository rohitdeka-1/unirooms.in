#!/bin/bash

APP_NAME="unirooms-api-2026"

echo "Setting environment variables for $APP_NAME..."

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

echo "Done!"
