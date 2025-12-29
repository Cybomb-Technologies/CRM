const path = require('path');
const fs = require('fs');

console.log('🔍 Starting Server Code Diagnosis...');

const root = __dirname;
const quoteRoutesPath = path.join(root, 'routes', 'file', 'inventory', 'quoteRoutes.js');
const quoteControllerPath = path.join(root, 'controllers', 'file', 'inventory', 'quoteController.js');

// 1. Check if files exist
console.log(`\n📂 Checking files:`);
if (fs.existsSync(quoteRoutesPath)) {
    console.log(`✅ Found quoteRoutes.js at: ${quoteRoutesPath}`);
} else {
    console.error(`❌ MISSING quoteRoutes.js at: ${quoteRoutesPath}`);
}

if (fs.existsSync(quoteControllerPath)) {
    console.log(`✅ Found quoteController.js at: ${quoteControllerPath}`);
} else {
    console.error(`❌ MISSING quoteController.js at: ${quoteControllerPath}`);
}

// 2. Try to require the route file to check for import errors
console.log(`\n🔄 Testing 'require' for quoteRoutes...`);
try {
    const routeModule = require('./routes/file/inventory/quoteRoutes');
    console.log('✅ Updated quoteRoutes loaded successfully!');
} catch (error) {
    console.error('❌ FAILED to load quoteRoutes:');
    console.error(error);
}

// 3. Check server.js mounting
console.log(`\n📜 Checking server.js mounting...`);
const serverContent = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
if (serverContent.includes("app.use('/api/quotes', quoteRoutes)")) {
    console.log("✅ Route mounting found in server.js");
} else {
    console.error("❌ Route mounting MISSING in server.js");
}

console.log('\n🏁 Diagnosis Complete.');
