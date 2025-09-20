const request = require('supertest');
const app = require('../../app');
const { sequelize } = require('../../models');
const MenuItem = require('../../models/MenuItem');

describe('MenuItem Controller', () => {
  // Setup and teardown
  beforeAll(async () => {
    await sequelize.sync({ force: true });
  });

  beforeEach(async () => {
    await MenuItem.destroy({ where: {} });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  describe('POST /api/menu-items', () => {
    it('should create a new menu item successfully', async () => {
      const newMenuItem = {
        name: 'Margherita Pizza',
        description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
        price: 12.99,
        category: 'main',
        dietaryTag: 'vegetarian'
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(newMenuItem)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.name).toBe(newMenuItem.name);
      expect(response.body.data.price).toBe(newMenuItem.price);
      expect(response.body.data.category).toBe(newMenuItem.category);
    });

    it('should fail to create menu item without required fields', async () => {
      const incompleteMenuItem = {
        name: 'Test Item'
        // Missing price and category
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(incompleteMenuItem)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Validation error');
    });

    it('should fail to create menu item with invalid category', async () => {
      const invalidMenuItem = {
        name: 'Test Item',
        price: 10.99,
        category: 'invalid_category'
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(invalidMenuItem)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail to create menu item with negative price', async () => {
      const invalidMenuItem = {
        name: 'Test Item',
        price: -5.99,
        category: 'main'
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(invalidMenuItem)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/menu-items', () => {
    beforeEach(async () => {
      // Create test data
      await MenuItem.bulkCreate([
        {
          name: 'Caesar Salad',
          description: 'Fresh romaine lettuce with caesar dressing',
          price: 8.99,
          category: 'appetizer',
          dietaryTag: 'vegetarian'
        },
        {
          name: 'Grilled Chicken',
          description: 'Seasoned grilled chicken breast',
          price: 15.99,
          category: 'main',
          dietaryTag: null
        },
        {
          name: 'Chocolate Cake',
          description: 'Rich chocolate cake with fudge frosting',
          price: 6.99,
          category: 'dessert',
          dietaryTag: 'vegetarian'
        }
      ]);
    });

    it('should return all menu items', async () => {
      const response = await request(app)
        .get('/api/menu-items')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(3);
      expect(response.body.data).toHaveLength(3);
    });

    it('should filter menu items by category', async () => {
      const response = await request(app)
        .get('/api/menu-items?category=main')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(1);
      expect(response.body.data[0].category).toBe('main');
    });

    it('should filter menu items by dietary tag', async () => {
      const response = await request(app)
        .get('/api/menu-items?dietaryTag=vegetarian')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      response.body.data.forEach(item => {
        expect(item.dietaryTag).toBe('vegetarian');
      });
    });
  });

  describe('GET /api/menu-items/:id', () => {
    let testMenuItem;

    beforeEach(async () => {
      testMenuItem = await MenuItem.create({
        name: 'Test Pizza',
        description: 'Test description',
        price: 12.99,
        category: 'main',
        dietaryTag: 'vegetarian'
      });
    });

    it('should return menu item by valid ID', async () => {
      const response = await request(app)
        .get(`/api/menu-items/${testMenuItem.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testMenuItem.id);
      expect(response.body.data.name).toBe(testMenuItem.name);
    });

    it('should return 404 for non-existent menu item', async () => {
      const response = await request(app)
        .get('/api/menu-items/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Menu item not found');
    });
  });

  describe('PUT /api/menu-items/:id', () => {
    let testMenuItem;

    beforeEach(async () => {
      testMenuItem = await MenuItem.create({
        name: 'Original Pizza',
        description: 'Original description',
        price: 12.99,
        category: 'main',
        dietaryTag: 'vegetarian'
      });
    });

    it('should update menu item successfully', async () => {
      const updateData = {
        name: 'Updated Pizza',
        price: 14.99,
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/menu-items/${testMenuItem.id}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(updateData.name);
      expect(response.body.data.price).toBe(updateData.price);
      expect(response.body.data.description).toBe(updateData.description);
    });

    it('should return 404 when updating non-existent menu item', async () => {
      const updateData = {
        name: 'Updated Pizza',
        price: 14.99
      };

      const response = await request(app)
        .put('/api/menu-items/99999')
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Menu item not found');
    });

    it('should fail to update with invalid data', async () => {
      const invalidUpdateData = {
        price: -5.99 // Invalid negative price
      };

      const response = await request(app)
        .put(`/api/menu-items/${testMenuItem.id}`)
        .send(invalidUpdateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/menu-items/:id', () => {
    let testMenuItem;

    beforeEach(async () => {
      testMenuItem = await MenuItem.create({
        name: 'Pizza to Delete',
        description: 'This will be deleted',
        price: 12.99,
        category: 'main',
        dietaryTag: 'vegetarian'
      });
    });

    it('should delete menu item successfully', async () => {
      const response = await request(app)
        .delete(`/api/menu-items/${testMenuItem.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Menu item deleted successfully');

      // Verify item is actually deleted
      const deletedItem = await MenuItem.findByPk(testMenuItem.id);
      expect(deletedItem).toBeNull();
    });

    it('should return 404 when deleting non-existent menu item', async () => {
      const response = await request(app)
        .delete('/api/menu-items/99999')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Menu item not found');
    });
  });

  describe('GET /api/menu-items/search', () => {
    beforeEach(async () => {
      await MenuItem.bulkCreate([
        {
          name: 'Margherita Pizza',
          description: 'Classic pizza',
          price: 12.99,
          category: 'main'
        },
        {
          name: 'Pepperoni Pizza',
          description: 'Pizza with pepperoni',
          price: 14.99,
          category: 'main'
        },
        {
          name: 'Caesar Salad',
          description: 'Fresh salad',
          price: 8.99,
          category: 'appetizer'
        }
      ]);
    });

    it('should search menu items by name', async () => {
      const response = await request(app)
        .get('/api/menu-items/search?q=Pizza')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      response.body.data.forEach(item => {
        expect(item.name.toLowerCase()).toContain('pizza');
      });
    });

    it('should return empty array for no matches', async () => {
      const response = await request(app)
        .get('/api/menu-items/search?q=NonExistent')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });

    it('should return 400 for missing search term', async () => {
      const response = await request(app)
        .get('/api/menu-items/search')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Search term is required');
    });
  });

  describe('Health Check', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body.status).toBe('OK');
      expect(response.body.message).toBe('QuickBite API is running');
    });
  });
});