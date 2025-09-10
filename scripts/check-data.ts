import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  console.log('🔍 Checking database data...\n');

  try {
    // Check categories
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
        type: true,
        userId: true
      },
      take: 10
    });

    console.log('📁 Categories:');
    console.log(`Found ${categories.length} categories`);
    categories.forEach(cat => {
      console.log(`  - ${cat.name} (${cat.slug}) - ${cat.type} - ${cat.color} - User: ${cat.userId.slice(0, 8)}...`);
    });

    // Check budgets
    const budgets = await prisma.budget.findMany({
      select: {
        id: true,
        category: true,
        amount: true,
        month: true,
        year: true,
        userId: true
      },
      take: 10
    });

    console.log('\n💰 Budgets:');
    console.log(`Found ${budgets.length} budgets`);
    budgets.forEach(budget => {
      console.log(`  - Category: ${budget.category}, Amount: ${budget.amount}, Period: ${budget.month}/${budget.year} - User: ${budget.userId.slice(0, 8)}...`);
    });

    // Check transactions
    const transactions = await prisma.transactions.findMany({
      select: {
        id: true,
        category: true,
        amount: true,
        description: true,
        userId: true
      },
      take: 5
    });

    console.log('\n💳 Transactions:');
    console.log(`Found ${transactions.length} transactions`);
    transactions.forEach(tx => {
      console.log(`  - ${tx.description} - Category: ${tx.category}, Amount: ${tx.amount} - User: ${tx.userId.slice(0, 8)}...`);
    });

    // Check users
    const uniqueUsers = await prisma.category.findMany({
      select: { userId: true },
      distinct: ['userId']
    });

    console.log(`\n👥 Unique users: ${uniqueUsers.length}`);
    uniqueUsers.forEach(user => {
      console.log(`  - ${user.userId.slice(0, 8)}...`);
    });

  } catch (error) {
    console.error('❌ Error checking data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();