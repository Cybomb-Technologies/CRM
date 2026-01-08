const dns = require('dns');
const imaps = require('imap-simple');

console.log('Testing DNS lookup for imap.gmail.com...');
dns.lookup('imap.gmail.com', (err, address, family) => {
    if (err) {
        console.error('❌ DNS Lookup Failed:', err);
    } else {
        console.log(`✅ DNS Lookup Success: API -> ${address} (Family: ${family})`);
        testImapConnection();
    }
});

async function testImapConnection() {
    console.log('\nTesting IMAP connection to imap.gmail.com:993 with tls: false...');
    const config = {
        imap: {
            user: 'test',
            password: 'test',
            host: 'imap.gmail.com',
            port: 993,
            tls: false, // INTENTIONALLY FALSE to reproduce error
            authTimeout: 5000,
        },
    };

    try {
        await imaps.connect(config);
        console.log('✅ Connection established (Unexpected success?)');
    } catch (err) {
        if (err.message && err.message.includes('ENOTFOUND')) {
             console.error('❌ IMAP Connect Failed with ENOTFOUND:', err);
        } else if (err.message && err.message.includes('Could not parse command')) {
             console.log('✅ REPRODUCED: "Could not parse command" error caught!');
        } else {
            console.error('❌ IMAP Connect Failed with other error:', err.message);
            // console.log(JSON.stringify(err, null, 2));
        }
    }
}
