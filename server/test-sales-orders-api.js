const testSalesOrderAPI = async () => {
    console.log('🚀 Starting Sales Order API Tests...');
    const API_URL = 'http://localhost:5000/api/file/inventory/sales-orders';
    let createdOrderId = null;

    try {
        // 1. Create Sales Order
        console.log('\n📝 Testing Create Sales Order...');
        const newOrder = {
            subject: 'Test Order from Script',
            accountName: 'Test Corp',
            contactName: 'Tester McTest',
            customerEmail: 'test@example.com',
            items: [
                { productName: 'Widget A', quantity: 10, unitPrice: 50, amount: 500, total: 500 }
            ],
            billingAddress: {
                street: '123 Test St',
                city: 'Testville',
                country: 'Testland'
            },
            shippingAddress: {
                street: '123 Test St',
                city: 'Testville',
                country: 'Testland'
            }
        };

        let response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newOrder)
        });

        if (response.ok) {
            const data = await response.json();
            console.log('✅ Create Success:', data.salesOrderNumber);
            createdOrderId = data._id;
        } else {
            console.error('❌ Create Failed:', response.status);
            const err = await response.text();
            console.error(err);
            return;
        }

        // 2. Get All Sales Orders
        console.log('\n📋 Testing Get All Sales Orders...');
        response = await fetch(API_URL);
        if (response.ok) {
            const data = await response.json();
            const count = data.salesOrders ? data.salesOrders.length : data.length;
            console.log(`✅ Get All Success: Found ${count} orders`);
        } else {
            console.error('❌ Get All Failed');
            const err = await response.text();
            console.error(err);
        }

        // 3. Get Sales Order By ID
        console.log(`\n🔍 Testing Get Sales Order By ID (${createdOrderId})...`);
        response = await fetch(`${API_URL}/${createdOrderId}`);
        if (response.ok) {
            const data = await response.json();
            if (data._id === createdOrderId) {
                console.log('✅ Get By ID Success');
            } else {
                console.error('❌ Get By ID Mismatch');
            }
        } else {
            console.error('❌ Get By ID Failed');
            const err = await response.text();
            console.error(err);
        }

        // 4. Update Sales Order
        console.log('\n✏️ Testing Update Sales Order...');
        response = await fetch(`${API_URL}/${createdOrderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                status: 'Approved',
                notes: 'Updated via test script'
            })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.status === 'Approved') {
                console.log('✅ Update Success');
            } else {
                console.error('❌ Update Value Mismatch');
            }
        } else {
            console.error('❌ Update Failed');
            const err = await response.text();
            console.error(err);
        }

        // 5. Delete Sales Order
        console.log('\n🗑️ Testing Delete Sales Order...');
        response = await fetch(`${API_URL}/${createdOrderId}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            console.log('✅ Delete Success');
        } else {
            console.error('❌ Delete Failed');
            const err = await response.text();
            console.error(err);
        }

        console.log('\n🎉 All Sales Order API Tests Completed!');

    } catch (error) {
        console.error('\n❌ Test Failed:', error);
    }
};

testSalesOrderAPI();
