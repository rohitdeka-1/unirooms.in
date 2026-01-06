/**
 * Fix Phone Index - Drop and Recreate as Sparse Index
 * 
 * This script fixes the duplicate key error for Google OAuth users
 * by ensuring the phone index is sparse (allows multiple null values)
 * 
 * Run this script once in production:
 * node src/scripts/fix-phone-index.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "../../.env") });

const MONGO_URI = process.env.MONGO_URI;

async function fixPhoneIndex() {
    try {
        console.log("🔌 Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("✅ Connected to MongoDB");

        const db = mongoose.connection.db;
        const usersCollection = db.collection("users");

        // Check existing indexes
        console.log("\n📋 Current indexes on 'users' collection:");
        const existingIndexes = await usersCollection.indexes();
        existingIndexes.forEach(index => {
            console.log(`  - ${index.name}:`, JSON.stringify(index.key), 
                       index.sparse ? "(sparse)" : "(not sparse)");
        });

        // Check if phone index exists and is not sparse
        const phoneIndex = existingIndexes.find(idx => idx.key.phone === 1);
        
        if (phoneIndex && !phoneIndex.sparse) {
            console.log("\n⚠️  Phone index exists but is NOT sparse");
            console.log("🗑️  Dropping old phone index...");
            await usersCollection.dropIndex("phone_1");
            console.log("✅ Old phone index dropped");
        } else if (phoneIndex && phoneIndex.sparse) {
            console.log("\n✅ Phone index is already sparse - no action needed");
            await mongoose.connection.close();
            return;
        } else {
            console.log("\n⚠️  No phone index found");
        }

        // Create sparse index
        console.log("📝 Creating new sparse unique index on phone field...");
        await usersCollection.createIndex(
            { phone: 1 }, 
            { 
                unique: true, 
                sparse: true,
                name: "phone_1"
            }
        );
        console.log("✅ Sparse unique index created successfully");

        // Verify the new index
        console.log("\n📋 Updated indexes:");
        const updatedIndexes = await usersCollection.indexes();
        updatedIndexes.forEach(index => {
            console.log(`  - ${index.name}:`, JSON.stringify(index.key), 
                       index.sparse ? "(sparse)" : "(not sparse)");
        });

        console.log("\n✅ Phone index fix completed successfully!");
        console.log("✅ Google OAuth users can now sign up without phone numbers");

    } catch (error) {
        console.error("❌ Error fixing phone index:", error);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log("\n🔌 MongoDB connection closed");
    }
}

// Run the script
fixPhoneIndex();
