#!/usr/bin/env node
/**
 * Production Configuration Check Script
 * Verifies that the production build has the required environment variables
 */

const fs = require('fs');
const path = require('path');

// Check if production build exists
const prodBuildPath = path.join(__dirname, 'builds/prod');
if (!fs.existsSync(prodBuildPath)) {
    console.error('❌ Production build not found. Run npm run build:prod first.');
    process.exit(1);
}

// Check if main JS file contains Supabase URL
const jsFiles = fs.readdirSync(path.join(prodBuildPath, 'assets/js'))
    .filter(file => file.startsWith('index-') && file.endsWith('.js'));

if (jsFiles.length === 0) {
    console.error('❌ No main JS file found in production build.');
    process.exit(1);
}

const mainJsFile = path.join(prodBuildPath, 'assets/js', jsFiles[0]);
const jsContent = fs.readFileSync(mainJsFile, 'utf8');

// Check for Supabase configuration in the built file
const hasSupabaseUrl = jsContent.includes('syxygcrxrldnhlcnpbyr.supabase.co');
const hasSupabaseKey = jsContent.includes('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');

console.log('🔍 Production Build Configuration Check:');
console.log('─'.repeat(50));
console.log(`📁 Build Directory: ${prodBuildPath}`);
console.log(`📄 Main JS File: ${jsFiles[0]}`);
console.log(`🔗 Supabase URL embedded: ${hasSupabaseUrl ? '✅' : '❌'}`);
console.log(`🔑 Supabase Key embedded: ${hasSupabaseKey ? '✅' : '❌'}`);

if (hasSupabaseUrl && hasSupabaseKey) {
    console.log('\n🎉 Production build is properly configured!');
    console.log('✅ Supabase credentials are embedded in the build.');
    console.log('📤 Ready for deployment to hosting provider.');
} else {
    console.log('\n⚠️ Production build may have configuration issues.');
    console.log('Please check your environment variables and rebuild.');
    process.exit(1);
}

// Additional checks
console.log('\n📊 Build Analysis:');
console.log(`📦 Total JS files: ${fs.readdirSync(path.join(prodBuildPath, 'assets/js')).length}`);
console.log(`🎨 Total CSS files: ${fs.readdirSync(path.join(prodBuildPath, 'assets/css')).length}`);

const htmlFile = path.join(prodBuildPath, 'index.html');
if (fs.existsSync(htmlFile)) {
    const htmlContent = fs.readFileSync(htmlFile, 'utf8');
    const hasJsImport = htmlContent.includes('assets/js/index-');
    const hasCssImport = htmlContent.includes('assets/css/index-');
    console.log(`📄 HTML file references JS: ${hasJsImport ? '✅' : '❌'}`);
    console.log(`📄 HTML file references CSS: ${hasCssImport ? '✅' : '❌'}`);
}

console.log('\n🚀 Deployment Instructions:');
console.log('1. Upload the entire builds/prod/ directory to your hosting provider');
console.log('2. Ensure your web server points to builds/prod/ as the document root');
console.log('3. The .htaccess file should handle routing for React Router');