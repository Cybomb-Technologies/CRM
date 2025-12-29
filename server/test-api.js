const http = require('http');

function testApi() {
    console.log('🧪 Testing Security API (using native http)...');

    const options = {
        hostname: 'localhost',
        port: 5000,
        path: '/api/security/change-password',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const req = http.request(options, (res) => {
        console.log(`📥 Status: ${res.statusCode} ${res.statusMessage}`);

        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log('� Body:', data);
            if (res.statusCode === 404) {
                console.log('❌ Endpoint NOT FOUND (404) - Server code is likely STALE.');
            } else if (res.statusCode === 401) {
                console.log('✅ Endpoint FOUND (401) - Server is updated!');
            } else if (res.statusCode === 200 || res.statusCode === 400) {
                console.log('✅ Endpoint FOUND and responding!');
            }
        });
    });

    req.on('error', (e) => {
        console.error(`❌ Connection error: ${e.message}`);
    });

    // Write data to request body
    req.write(JSON.stringify({
        currentPassword: 'test',
        newPassword: 'test'
    }));

    req.end();
}

testApi();
