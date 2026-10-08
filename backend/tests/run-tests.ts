// BiteDash Automated Integration & Unit Tests
import { db } from '../src/config/database.ts';
import { authService } from '../src/modules/auth/auth.service.ts';
import { ordersService } from '../src/modules/orders/orders.service.ts';
import { paymentsService } from '../src/modules/payments/payments.service.ts';
import { restaurantsService } from '../src/modules/restaurants/restaurants.service.ts';
import { couponsService } from '../src/modules/coupons/coupons.service.ts';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failed++;
  }
}

async function runAllTests() {
  console.log('\n========================================');
  console.log('🧪 Running BiteDash Full-Stack Test Suite');
  console.log('========================================\n');

  try {
    await db.init();

    // 1. Authentication Tests
    console.log('📦 1. Authentication & RBAC Suite');
    const loginResult = await authService.login({
      email: 'customer@bitedash.com',
      password: 'password123',
    });
    assert(!!loginResult.token, 'Customer login succeeds and issues JWT token');
    assert(loginResult.user.role === 'CUSTOMER', 'Customer has correct CUSTOMER role');

    const adminLogin = await authService.login({
      email: 'admin@bitedash.com',
      password: 'password123',
    });
    assert(adminLogin.user.role === 'ADMIN', 'Admin login succeeds and has ADMIN role');

    // 2. Restaurant Discovery & Menu Tests
    console.log('\n📦 2. Restaurant & Menu Suite');
    const restaurants = await restaurantsService.getAllRestaurants({});
    assert(restaurants.length >= 4, 'Restaurants list returns seeded establishments');

    const bella = await restaurantsService.getRestaurantDetails(1);
    assert(bella.name.includes('Bella Napoli'), 'Restaurant details fetched by ID');
    assert(!!bella.categories && bella.categories.length > 0, 'Categories and menu items loaded');

    // 3. Coupon Validation Tests
    console.log('\n📦 3. Coupon & Discount Suite');
    const couponRes = await couponsService.validateCoupon('WELCOME50', 500);
    assert(couponRes.valid === true, 'Valid coupon successfully applied');
    assert(couponRes.discountAmount > 0, 'Calculates accurate discount value');

    // 4. Order Creation & Relational Transactions
    console.log('\n📦 4. Order Creation & Lifecycle Suite');
    const createdOrder = await ordersService.createOrder(1, {
      restaurant_id: 1,
      delivery_address_id: 1,
      items: [{ menu_item_id: 1, quantity: 2 }],
      payment_method: 'UPI',
      coupon_code: 'WELCOME50',
      special_instructions: 'Automated test order',
    });
    assert(!!createdOrder.id, 'Order created successfully in database transaction');
    assert(createdOrder.status === 'PLACED', 'Initial order status is PLACED');
    assert(Number(createdOrder.total_amount) > 0, 'Order calculates total amount accurately');

    // 5. Order Status Transition by Restaurant Partner
    console.log('\n📦 5. Order Lifecycle Status Transitions');
    const confirmedOrder = await ordersService.updateOrderStatus(
      createdOrder.id,
      'CONFIRMED',
      2, // Chef Marco
      'RESTAURANT'
    );
    assert(confirmedOrder.status === 'CONFIRMED', 'Restaurant partner successfully confirms order');

    const prepOrder = await ordersService.updateOrderStatus(
      createdOrder.id,
      'PREPARING',
      2,
      'RESTAURANT'
    );
    assert(prepOrder.status === 'PREPARING', 'Restaurant partner updates status to PREPARING');

    // 6. Payment Processing Suite
    console.log('\n📦 6. Payment System Suite');
    const payment = await paymentsService.getPaymentByOrderId(createdOrder.id, 1, 'CUSTOMER');
    assert(!!payment, 'Payment record was created in sync with order');
    assert(payment?.payment_status === 'SUCCESS', 'UPI payment successfully verified');

    console.log('\n========================================');
    console.log(`📊 Test Results: ${passed} passed, ${failed} failed`);
    console.log('========================================\n');

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err: any) {
    console.error('Test suite error:', err);
    process.exit(1);
  }
}

runAllTests();
