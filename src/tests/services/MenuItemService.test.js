const MenuItemService = require('../../services/MenuItemService');
const { MenuItem, sequelize } = require('../../models');

describe('MenuItemService', () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    // Wait a bit for database to be ready
    await new Promise(resolve => setTimeout(resolve, 100));
  });

  // Global cleanup to ensure test isolation
  beforeEach(async () => {
    await MenuItem.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('createMenuItem', () => {
    it('should create a new menu item with valid data', async () => {
      const menuItemData = {
        name: 'Test Pizza',
        description: 'Test description',
        price: 12.99,
        category: 'main',
        dietaryTag: 'vegetarian'
      };

      const result = await MenuItemService.createMenuItem(menuItemData);

      expect(result).toHaveProperty('id');
      expect(result.name).toBe(menuItemData.name);
      expect(result.price).toBe(menuItemData.price);
      expect(result.category).toBe(menuItemData.category);
    });

    it('should throw error for invalid menu item data', async () => {
      const invalidData = {
        name: '', // Empty name
        price: 12.99,
        category: 'main'
      };

      await expect(MenuItemService.createMenuItem(invalidData))
        .rejects.toThrow('Validation error');
    });
  });

  describe('getAllMenuItems', () => {
    beforeEach(async () => {
      // Create test data for this specific test suite
      await MenuItem.bulkCreate([
        {
          name: 'Pizza',
          price: 12.99,
          category: 'main',
          dietaryTag: 'vegetarian'
        },
        {
          name: 'Salad',
          price: 8.99,
          category: 'appetizer',
          dietaryTag: 'vegan'
        }
      ]);
    });

    it('should return all menu items', async () => {
      const result = await MenuItemService.getAllMenuItems();

      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('name');
    });

    it('should filter by category', async () => {
      const result = await MenuItemService.getAllMenuItems({ category: 'main' });

      expect(result).toHaveLength(1);
      expect(result[0].category).toBe('main');
    });

    it('should filter by dietary tag', async () => {
      const result = await MenuItemService.getAllMenuItems({ dietaryTag: 'vegan' });

      expect(result).toHaveLength(1);
      expect(result[0].dietaryTag).toBe('vegan');
    });
  });

  describe('getMenuItemById', () => {
    let testMenuItem;

    beforeEach(async () => {
      // Create test data for this specific test suite
      testMenuItem = await MenuItem.create({
        name: 'Test Item',
        price: 10.99,
        category: 'main'
      });
    });

    it('should return menu item for valid ID', async () => {
      // Ensure the test item was created and has an ID
      expect(testMenuItem).toBeDefined();
      expect(testMenuItem.id).toBeDefined();
      
      const result = await MenuItemService.getMenuItemById(testMenuItem.id);

      expect(result).not.toBeNull();
      expect(result.id).toBe(testMenuItem.id);
      expect(result.name).toBe(testMenuItem.name);
    });

    it('should return null for non-existent ID', async () => {
      const result = await MenuItemService.getMenuItemById(99999);

      expect(result).toBeNull();
    });
  });

  describe('updateMenuItem', () => {
    let testMenuItem;

    beforeEach(async () => {
      // Create test data for this specific test suite
      testMenuItem = await MenuItem.create({
        name: 'Original Name',
        price: 10.99,
        category: 'main'
      });
    });

    it('should update menu item with valid data', async () => {
      const updateData = {
        name: 'Updated Name',
        price: 12.99
      };

      const result = await MenuItemService.updateMenuItem(testMenuItem.id, updateData);

      expect(result).not.toBeNull();
      expect(result.name).toBe(updateData.name);
      expect(result.price).toBe(updateData.price);
    });

    it('should return null for non-existent ID', async () => {
      const updateData = {
        name: 'Updated Name'
      };

      const result = await MenuItemService.updateMenuItem(99999, updateData);

      expect(result).toBeNull();
    });

    it('should throw error for invalid update data', async () => {
      const invalidData = {
        price: -5.99 // Invalid negative price
      };

      await expect(MenuItemService.updateMenuItem(testMenuItem.id, invalidData))
        .rejects.toThrow('Validation error');
    });
  });

  describe('deleteMenuItem', () => {
    let testMenuItem;

    beforeEach(async () => {
      // Create test data for this specific test suite
      testMenuItem = await MenuItem.create({
        name: 'Item to Delete',
        price: 10.99,
        category: 'main'
      });
    });

    it('should delete existing menu item', async () => {
      const result = await MenuItemService.deleteMenuItem(testMenuItem.id);

      expect(result).toBe(true);

      // Verify item is deleted
      const deletedItem = await MenuItem.findByPk(testMenuItem.id);
      expect(deletedItem).toBeNull();
    });

    it('should return false for non-existent ID', async () => {
      const result = await MenuItemService.deleteMenuItem(99999);

      expect(result).toBe(false);
    });
  });

  describe('searchMenuItems', () => {
    beforeEach(async () => {
      // Create test data for this specific test suite
      await MenuItem.bulkCreate([
        {
          name: 'Margherita Pizza',
          price: 12.99,
          category: 'main'
        },
        {
          name: 'Pepperoni Pizza',
          price: 14.99,
          category: 'main'
        },
        {
          name: 'Caesar Salad',
          price: 8.99,
          category: 'appetizer'
        }
      ]);
    });

    it('should find items matching search term', async () => {
      const result = await MenuItemService.searchMenuItems('Pizza');

      expect(result).toHaveLength(2);
      result.forEach(item => {
        expect(item.name.toLowerCase()).toContain('pizza');
      });
    });

    it('should return empty array for no matches', async () => {
      const result = await MenuItemService.searchMenuItems('NonExistent');

      expect(result).toHaveLength(0);
    });

    it('should be case insensitive', async () => {
      const result = await MenuItemService.searchMenuItems('pizza');

      expect(result).toHaveLength(2);
    });
  });
});