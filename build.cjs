#!/usr/bin/env node

/**
 * Build Script for HydroCav Website
 * 
 * This script replaces placeholder values in HTML files with environment variables
 * for production deployment. It addresses the external reviewer's concern about
 * hardcoded configuration values.
 * 
 * Usage:
 *   node build.js
 * 
 * Environment Variables Required:
 *   SUPABASE_URL - Supabase project URL
 *   SUPABASE_ANON_KEY - Supabase anonymous/public key
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  sourceFiles: ['index.html', 'admin.html'],
  distDir: 'dist',
  placeholders: {
    SUPABASE_URL: process.env.SUPABASE_URL || 'https://icfombdnbaeckgivfkdw.supabase.co',
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '__SUPABASE_ANON_KEY_PLACEHOLDER__'
  }
};

/**
 * Ensure the dist directory exists
 */
function ensureDistDir() {
  if (!fs.existsSync(CONFIG.distDir)) {
    fs.mkdirSync(CONFIG.distDir, { recursive: true });
    console.log(`✅ Created ${CONFIG.distDir} directory`);
  }
}

/**
 * Replace placeholders in file content
 */
function replacePlaceholders(content, filename) {
  let processedContent = content;
  
  // Replace placeholders with actual values
  processedContent = processedContent.replace(
    /__SUPABASE_URL_PLACEHOLDER__/g,
    CONFIG.placeholders.SUPABASE_URL
  );
  
  processedContent = processedContent.replace(
    /__SUPABASE_ANON_KEY_PLACEHOLDER__/g,
    CONFIG.placeholders.SUPABASE_ANON_KEY
  );
  
  return processedContent;
}

/**
 * Copy and process files
 */
function processFiles() {
  let processedCount = 0;
  
  CONFIG.sourceFiles.forEach(filename => {
    const sourcePath = path.join(process.cwd(), filename);
    const destPath = path.join(CONFIG.distDir, filename);
    
    if (!fs.existsSync(sourcePath)) {
      console.warn(`⚠️  Source file not found: ${sourcePath}`);
      return;
    }
    
    try {
      // Read source file
      const content = fs.readFileSync(sourcePath, 'utf8');
      
      // Process placeholders
      const processedContent = replacePlaceholders(content, filename);
      
      // Write to dist
      fs.writeFileSync(destPath, processedContent);
      
      console.log(`✅ Processed: ${filename}`);
      processedCount++;
      
    } catch (error) {
      console.error(`❌ Error processing ${filename}:`, error.message);
    }
  });
  
  return processedCount;
}

/**
 * Copy assets directory
 */
function copyAssets() {
  const assetsSource = path.join(process.cwd(), 'assets');
  const assetsDest = path.join(CONFIG.distDir, 'assets');
  
  if (!fs.existsSync(assetsSource)) {
    console.warn('⚠️  Assets directory not found');
    return;
  }
  
  try {
    // Simple recursive copy function
    function copyRecursive(src, dest) {
      if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
      }
      
      const items = fs.readdirSync(src);
      items.forEach(item => {
        const srcPath = path.join(src, item);
        const destPath = path.join(dest, item);
        
        if (fs.statSync(srcPath).isDirectory()) {
          copyRecursive(srcPath, destPath);
        } else {
          fs.copyFileSync(srcPath, destPath);
        }
      });
    }
    
    copyRecursive(assetsSource, assetsDest);
    console.log('✅ Copied assets directory');
    
  } catch (error) {
    console.error('❌ Error copying assets:', error.message);
  }
}

/**
 * Validate environment variables
 */
function validateEnvironment() {
  const missing = [];
  
  if (!process.env.SUPABASE_URL && CONFIG.placeholders.SUPABASE_URL.includes('supabase.co')) {
    // URL is set to default, that's okay
  }
  
  if (!process.env.SUPABASE_ANON_KEY || CONFIG.placeholders.SUPABASE_ANON_KEY.includes('PLACEHOLDER')) {
    missing.push('SUPABASE_ANON_KEY');
  }
  
  if (missing.length > 0) {
    console.warn('⚠️  Missing environment variables:', missing.join(', '));
    console.warn('   The build will use placeholder values.');
    console.warn('   Set these variables for production deployment.');
  }
}

/**
 * Main build process
 */
function main() {
  console.log('🚀 Starting HydroCav website build...\n');
  
  // Validate environment
  validateEnvironment();
  
  // Setup
  ensureDistDir();
  
  // Process files
  const processedCount = processFiles();
  
  // Copy assets
  copyAssets();
  
  // Summary
  console.log('\n📊 Build Summary:');
  console.log(`   Files processed: ${processedCount}`);
  console.log(`   Output directory: ${CONFIG.distDir}/`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  
  if (processedCount > 0) {
    console.log('\n✅ Build completed successfully!');
    console.log('\n📁 Deployment files ready in dist/ directory');
    console.log('   Deploy the contents of dist/ to your hosting provider');
  } else {
    console.log('\n❌ Build failed - no files processed');
    process.exit(1);
  }
}

// Run the build
if (require.main === module) {
  main();
}

module.exports = { replacePlaceholders, CONFIG };