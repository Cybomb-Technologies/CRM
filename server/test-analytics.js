const http = require('http');

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    resolve({ statusCode: res.statusCode, body: parsed });
                } catch (e) {
                    resolve({ statusCode: res.statusCode, body: body });
                }
            });
        });

        req.on('error', (e) => reject(e));
        req.end();
    });
}

async function verify() {
    console.log('🔍 Verifying Analytics API...\n');

    const endpoints = [
        '/api/analytics/org-overview',
        '/api/analytics/leads',
        '/api/analytics/deals',
        '/api/analytics/sales-trend'
    ];

    for (const endpoint of endpoints) {
        try {
            console.log(`Checking ${endpoint}...`);
            const response = await makeRequest(endpoint);

            if (response.statusCode === 200 && response.body.success) {
                console.log(`✅ SUCCESS`);
                console.log(`   Keys: ${Object.keys(response.body.data).join(', ')}`);
            } else {
                console.log(`❌ FAILED (Status: ${response.statusCode})`);
                console.log(`   Error: ${JSON.stringify(response.body)}`);
            }
        } catch (error) {
            console.log(`❌ ERROR: ${error.message}`);
        }
        console.log('---');
    }
}

verify();
