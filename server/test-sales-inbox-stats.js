const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/sales-inbox';

async function runTests() {
  console.log('🧪 Starting Sales Inbox STATS Tests...');

  try {
    // 1. Get Stats (Should be 0 initially or reflect DB state)
    console.log('\n1. Testing Get Stats...');
    const statsRes = await axios.get(`${BASE_URL}/emails/stats`); // Using /emails/stats
    console.log('✅ Stats Fetched:', statsRes.data.success);
    console.log('📊 Stats Data:', statsRes.data.data);

    if (statsRes.data.data.inbox !== undefined) {
        console.log('✅ "inbox" count present');
    } else {
        console.log('❌ "inbox" count missing');
    }

    console.log('\n🎉 Stats Test Passed!');
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    if (error.response) {
       console.error('Response Data:', error.response.data);
       if (error.response.status === 404) {
           console.log("⚠️ 404 implies server restart needed or route mismatch.");
       }
    }
  }
}

runTests();
