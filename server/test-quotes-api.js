const http = require('http');

function testQuotesApi() {
    console.log('🧪 Testing Quotes API...');

    const quoteData = {
        subject: "Test Quote via Script",
        accountName: "Test Account",
        contactName: "Test Contact",
        items: [
            {
                productName: "Test Product",
                quantity: 2,
                listPrice: 100,
                amount: 200,
                total: 200
            }
        ],
        grandTotal: 200
    };

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/quotes',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    console.log('📝 Creating Quote...');

    const req = http.request(options, (res) => {
        console.log(`📥 Create Quote Status: ${res.statusCode}`);

        let data = '';
        res.on('data', (chunk) => { data += chunk; });

        res.on('end', () => {
            const result = JSON.parse(data);
            if (result.success) {
                console.log('✅ Quote Created Successfully:', result.data.quoteNumber);
                const quoteId = result.data.id || result.data._id;

                // Now test Get
                testGetQuote(quoteId);
            } else {
                console.error('❌ Failed to create quote:', result.message);
            }
        });
    });

    req.on('error', (e) => {
        console.error(`❌ Connection error: ${e.message}`);
    });

    req.write(JSON.stringify(quoteData));
    req.end();
}

function testGetQuote(id) {
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: `/api/quotes/${id}`,
        method: 'GET'
    };

    const req = http.request(options, (res) => {
        console.log(`📥 Get Quote Status: ${res.statusCode}`);
        let data = '';
        res.on('data', (chunk) => { data += chunk; });

        res.on('end', () => {
            const result = JSON.parse(data);
            if (result.success) {
                console.log('✅ Quote Retrieved Successfully');
                testDeleteQuote(id);
            } else {
                console.error('❌ Failed to get quote:', result.message);
            }
        });
    });

    req.on('error', (e) => console.error(e));
    req.end();
}

function testDeleteQuote(id) {
    const options = {
        hostname: 'localhost',
        port: 5000,
        path: `/api/quotes/${id}`,
        method: 'DELETE'
    };

    const req = http.request(options, (res) => {
        console.log(`📥 Delete Quote Status: ${res.statusCode}`);
        let data = '';
        res.on('data', (chunk) => { data += chunk; });

        res.on('end', () => {
            const result = JSON.parse(data);
            if (result.success) {
                console.log('✅ Quote Deleted Successfully');
            } else {
                console.error('❌ Failed to delete quote:', result.message);
            }
        });
    });

    req.on('error', (e) => console.error(e));
    req.end();
}

testQuotesApi();
