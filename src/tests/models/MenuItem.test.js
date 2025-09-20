const { MenuItem, sequelize } = require('../../models');

describe('MenuItem Model', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await MenuItem.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('Validation', () => {
    it('should create menu item with valid data', async () => {
      const validMenuItem = {
        name: 'Test Pizza',
        description: 'Test description',
        price: 12.99,
        category: 'main',
        dietaryTag: 'vegetarian'
      };

      const menuItem = await MenuItem.create(validMenuItem);

      expect(menuItem.id).toBeDefined();
      expect(menuItem.name).toBe(validMenuItem.name);
      expect(menuItem.price).toBe(validMenuItem.price);
      expect(menuItem.category).toBe(validMenuItem.category);
    });

    it('should require name field', async () => {
      const invalidMenuItem = {
        price: 12.99,
        category: 'main'
        // Missing name
      };

      await expect(MenuItem.create(invalidMenuItem))
        .rejects.toThrow();
    });

    it('should require price field', async () => {
      const invalidMenuItem = {
        name: 'Test Item',
        category: 'main'
        // Missing price
      };

      await expect(MenuItem.create(invalidMenuItem))
        .rejects.toThrow();
    });

    it('should require category field', async () => {
      const invalidMenuItem = {
        name: 'Test Item',
        price: 12.99
        // Missing category
      };

      await expect(MenuItem.create(invalidMenuItem))
        .rejects.toThrow();
    });

    it('should reject invalid category values', async () => {
      const invalidMenuItem = {
        name: 'Test Item',
        price: 12.99,
        category: 'invalid_category'
      };

      await expect(MenuItem.create(invalidMenuItem))
        .rejects.toThrow();
    });

    it('should reject negative prices', async () => {
      const invalidMenuItem = {
        name: 'Test Item',
        price: -5.99,
        category: 'main'
      };

      await expect(MenuItem.create(invalidMenuItem))
        .rejects.toThrow();
    });

    it('should reject empty name', async () => {
      const invalidMenuItem = {
        name: '',
        price: 12.99,
        category: 'main'
      };

      await expect(MenuItem.create(invalidMenuItem))
        .rejects.toThrow();
    });

    it('should reject name longer than 255 characters', async () => {
      const invalidMenuItem = {
        name: 'a'.repeat(256),
        price: 12.99,
        category: 'main'
      };

      await expect(MenuItem.create(invalidMenuItem))
        .rejects.toThrow();
    });

    it('should reject description longer than 1000 characters', async () => {
      const invalidMenuItem = {
        name: 'Test Item',
        description: 'a'.repeat(1001),
        price: 12.99,
        category: 'main'
      };

      await expect(MenuItem.create(invalidMenuItem))
        .rejects.toThrow();
    });

    it('should accept valid category values', async () => {
      const categories = ['appetizer', 'main', 'dessert', 'beverage'];

      for (const category of categories) {
        const menuItem = {
          name: `Test ${category}`,
          price: 12.99,
          category: category
        };

        const created = await MenuItem.create(menuItem);
        expect(created.category).toBe(category);
      }
    });

    it('should allow null dietary tag', async () => {
      const menuItem = {
        name: 'Test Item',
        price: 12.99,
        category: 'main',
        dietaryTag: null
      };

      const created = await MenuItem.create(menuItem);
      expect(created.dietaryTag).toBeNull();
    });

    it('should allow empty description', async () => {
      const menuItem = {
        name: 'Test Item',
        price: 12.99,
        category: 'main',
        description: null
      };

      const created = await MenuItem.create(menuItem);
      expect(created.description).toBeNull();
    });
  });

  describe('Database Operations', () => {
    it('should auto-increment ID', async () => {
      const item1 = await MenuItem.create({
        name: 'Item 1',
        price: 10.99,
        category: 'main'
      });

      const item2 = await MenuItem.create({
        name: 'Item 2',
        price: 12.99,
        category: 'main'
      });

      expect(item2.id).toBeGreaterThan(item1.id);
    });

    it('should include timestamps', async () => {
      const menuItem = await MenuItem.create({
        name: 'Test Item',
        price: 12.99,
        category: 'main'
      });

      expect(menuItem.createdAt).toBeDefined();
      expect(menuItem.updatedAt).toBeDefined();
      expect(menuItem.createdAt).toBeInstanceOf(Date);
      expect(menuItem.updatedAt).toBeInstanceOf(Date);
    });

    it('should update timestamp on modification', async () => {
      const menuItem = await MenuItem.create({
        name: 'Test Item',
        price: 12.99,
        category: 'main'
      });

      const originalUpdatedAt = menuItem.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      await menuItem.update({ name: 'Updated Item' });

      expect(menuItem.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});