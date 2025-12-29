const http = require('http');

function makeRequest(path, method, data = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.headers['Content-Length'] = Buffer.byteLength(data);
        }

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: body
                });
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        if (data) {
            req.write(data);
        }
        req.end();
    });
}

async function verify() {
    console.log('🔍 Starting Backend Verification...');

    // 1. Check Health
    try {
        console.log('\nChecking /api/health...');
        const health = await makeRequest('/api/health', 'GET');
        console.log(`Status: ${health.statusCode}`);
        console.log(`Response: ${health.body.substring(0, 100)}...`);

        if (health.statusCode !== 200) {
            console.error('❌ Server health check failed! Is the server running?');
            return;
        }
        console.log('✅ Server is UP');
    } catch (e) {
        console.error('❌ Could not connect to server:', e.message);
        return;
    }

    // 2. Check Pricebooks GET
    try {
        console.log('\nChecking GET /api/price-books...');
        const list = await makeRequest('/api/price-books', 'GET');
        console.log(`Status: ${list.statusCode}`);

        if (list.statusCode === 404) {
            console.error('❌ GET /api/price-books returned 404. Route is not mounted!');
        } else if (list.statusCode === 200) {
            console.log('✅ GET /api/price-books is reachable');
        } else {
            console.log(`⚠️ Received status ${list.statusCode}`);
        }
    } catch (e) {
        console.error('❌ GET Request failed:', e.message);
    }

    // 3. Check Pricebooks POST
    try {
        console.log('\nChecking POST /api/price-books...');
        const mockData = JSON.stringify({
            priceBookName: "Test Pricebook " + Date.now(),
            name: "Test Pricebook",
            status: "Active"
        });

        const create = await makeRequest('/api/price-books', 'POST', mockData);
        console.log(`Status: ${create.statusCode}`);
        console.log(`Response: ${create.body}`);

        if (create.statusCode === 404) {
            console.error('❌ POST /api/price-books returned 404. Route is not mounted!');
        } else if (create.statusCode === 201 || create.statusCode === 400 || create.statusCode === 401) {
            console.log('✅ POST /api/price-books is reachable (Auth/Validation might fail, but route exists)');
        }
    } catch (e) {
        console.error('❌ POST Request failed:', e.message);
    }
}

verify();
