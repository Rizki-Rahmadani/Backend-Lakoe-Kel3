import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Seed Roles
  await seedRoles();

  // Seed Categories
  await seedCategories();
}

async function seedRoles() {
  // Check if the default roles already exist
  const adminRole = await prisma.roles.findFirst({
    where: { name: 'admin' },
  });

  const sellerRole = await prisma.roles.findFirst({
    where: { name: 'seller' },
  });

  // If the roles don't exist, create them
  if (!adminRole) {
    await prisma.roles.create({
      data: {
        name: 'admin',
      },
    });
    console.log('Admin role created');
  } else {
    console.log('Admin role already exists');
  }

  if (!sellerRole) {
    await prisma.roles.create({
      data: {
        name: 'seller',
      },
    });
    console.log('Seller role created');
  } else {
    console.log('Seller role already exists');
  }
}

async function seedCategories() {
  // Seed Common Categories
  const categories = [
    { name: 'Electronics', parentId: null },
    { name: 'Laptops', parentId: null },
    { name: 'Mobile Phones', parentId: null },
    { name: 'Fashion', parentId: null },
    { name: 'Clothing', parentId: null },
    { name: 'Men\'s Clothing', parentId: null },
    { name: 'Women\'s Clothing', parentId: null },
    { name: 'Home & Living', parentId: null },
    { name: 'Furniture', parentId: null },
    { name: 'Kitchen Appliances', parentId: null },
    { name: 'Toys & Games', parentId: null },
    { name: 'Sports & Outdoors', parentId: null },
    { name: 'Beauty & Health', parentId: null },
    { name: 'Books', parentId: null },
    { name: 'Pet Supplies', parentId: null },
    { name: 'Food & Beverages', parentId: null },
  ];

  // Loop through the categories and create them if they do not already exist
  for (const category of categories) {
    const existingCategory = await prisma.categories.findFirst({
      where: { name: category.name, parentId: category.parentId },
    });

    if (!existingCategory) {
      await prisma.categories.create({
        data: category,
      });
      console.log(`Category '${category.name}' created`);
    } else {
      console.log(`Category '${category.name}' already exists`);
    }
  }

  // Seed Subcategories (Make sure the parent categories exist first)
  const subcategories = [
    { name: 'Gaming Laptops', parentId: await getCategoryId('Laptops') },
    { name: 'Smartphones', parentId: await getCategoryId('Mobile Phones') },
    { name: 'Men\'s T-shirts', parentId: await getCategoryId('Men\'s Clothing') },
    { name: 'Women\'s Dresses', parentId: await getCategoryId('Women\'s Clothing') },
    { name: 'Living Room Furniture', parentId: await getCategoryId('Furniture') },
    { name: 'Cooking Appliances', parentId: await getCategoryId('Kitchen Appliances') },
  ];

  for (const subcategory of subcategories) {
    const existingSubcategory = await prisma.categories.findFirst({
      where: { name: subcategory.name, parentId: subcategory.parentId },
    });

    if (!existingSubcategory) {
      await prisma.categories.create({
        data: subcategory,
      });
      console.log(`Subcategory '${subcategory.name}' created`);
    } else {
      console.log(`Subcategory '${subcategory.name}' already exists`);
    }
  }
}

async function getCategoryId(categoryName: string) {
  const category = await prisma.categories.findFirst({
    where: { name: categoryName },
  });
  return category ? category.id : null;
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
