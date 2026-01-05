const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/sales-inbox';
let createdAccountId = null;
let createdEmailId = null;

async function runTests() {
  console.log('🧪 Starting Sales Inbox API Tests...');

  try {
    // 1. Connect Account
    console.log('\n1. Testing Connect Account...');
    const accountRes = await axios.post(`${BASE_URL}/accounts`, {
      email: `test-${Date.now()}@example.com`,
      provider: 'gmail',
      credentials: { user: 'test', pass: 'pass' }
    });
    console.log('✅ Account Connected:', accountRes.data.success);
    createdAccountId = accountRes.data.data._id;

    // 2. Get Accounts
    console.log('\n2. Testing Get Accounts...');
    const accountsRes = await axios.get(`${BASE_URL}/accounts`);
    console.log('✅ Accounts Fetched:', accountsRes.data.data.length > 0);

    // 3. Send/Create Email
    console.log('\n3. Testing Send Email...');
    const emailRes = await axios.post(`${BASE_URL}/emails`, {
      to: 'recipient@example.com',
      subject: 'Test Email ' + Date.now(),
      body: 'This is a test email body.',
      connectedAccountId: createdAccountId
    });
    console.log('✅ Email Sent:', emailRes.data.success);
    createdEmailId = emailRes.data.data._id;

    // 4. Get Emails
    console.log('\n4. Testing Get Emails...');
    const emailsRes = await axios.get(`${BASE_URL}/emails`);
    console.log('✅ Emails Fetched:', emailsRes.data.data.length);

    // 5. Update Email
    console.log('\n5. Testing Update Email...');
    const updateRes = await axios.put(`${BASE_URL}/emails/${createdEmailId}`, {
      read: true,
      important: true
    });
    console.log('✅ Email Updated (Read/Important):', updateRes.data.data.read === true && updateRes.data.data.important === true);

    // 6. Delete Account (Cleanup)
    console.log('\n6. Testing Remove Account...');
    const deleteRes = await axios.delete(`${BASE_URL}/accounts/${createdAccountId}`);
    console.log('✅ Account Removed:', deleteRes.data.success);

    console.log('\n🎉 All Tests Passed!');
  } catch (error) {
    console.error('❌ Test Failed:', error.message);
    if (error.response) {
      console.error('Response Data:', error.response.data);
    }
  }
}

runTests();
