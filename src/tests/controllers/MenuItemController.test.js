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

    // Additional Edge Cases for POST
    it('should fail to create menu item with zero price', async () => {
      const invalidMenuItem = {
        name: 'Free Item',
        price: 0,
        category: 'main'
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(invalidMenuItem)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail to create menu item with extremely large price', async () => {
      const invalidMenuItem = {
        name: 'Expensive Item',
        price: 999999999.99,
        category: 'main'
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(invalidMenuItem)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail to create menu item with non-numeric price', async () => {
      const invalidMenuItem = {
        name: 'Test Item',
        price: 'not-a-number',
        category: 'main'
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(invalidMenuItem)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail to create menu item with empty name', async () => {
      const invalidMenuItem = {
        name: '',
        price: 12.99,
        category: 'main'
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(invalidMenuItem)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail to create menu item with name exceeding 255 characters', async () => {
      const invalidMenuItem = {
        name: 'a'.repeat(256),
        price: 12.99,
        category: 'main'
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(invalidMenuItem)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail to create menu item with description exceeding 1000 characters', async () => {
      const invalidMenuItem = {
        name: 'Test Item',
        description: 'a'.repeat(1001),
        price: 12.99,
        category: 'main'
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(invalidMenuItem)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail to create menu item with dietary tag exceeding 50 characters', async () => {
      const invalidMenuItem = {
        name: 'Test Item',
        price: 12.99,
        category: 'main',
        dietaryTag: 'a'.repeat(51)
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(invalidMenuItem)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail to create menu item with null as name', async () => {
      const invalidMenuItem = {
        name: null,
        price: 12.99,
        category: 'main'
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(invalidMenuItem)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail to create menu item with undefined fields', async () => {
      const invalidMenuItem = {
        name: undefined,
        price: undefined,
        category: undefined
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(invalidMenuItem)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle malformed JSON gracefully', async () => {
      const response = await request(app)
        .post('/api/menu-items')
        .send('invalid-json')
        .expect(400);
    });

    it('should create menu item with minimum valid data', async () => {
      const minimalMenuItem = {
        name: 'A',
        price: 0.01,
        category: 'main'
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(minimalMenuItem)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe(minimalMenuItem.name);
    });

    it('should create menu item with maximum valid name length', async () => {
      const maxNameMenuItem = {
        name: 'a'.repeat(100),
        price: 12.99,
        category: 'main'
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(maxNameMenuItem)
        .expect(201);

      expect(response.body.success).toBe(true);
    });

    it('should create menu item with maximum valid description length', async () => {
      const maxDescriptionMenuItem = {
        name: 'Test Item',
        description: 'a'.repeat(500),
        price: 12.99,
        category: 'main'
      };

      const response = await request(app)
        .post('/api/menu-items')
        .send(maxDescriptionMenuItem)
        .expect(201);

      expect(response.body.success).toBe(true);
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

    // Additional Edge Cases for GET All
    it('should return empty array when no menu items exist', async () => {
      await MenuItem.destroy({ where: {} });

      const response = await request(app)
        .get('/api/menu-items')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });

    it('should handle invalid category filter gracefully', async () => {
      const response = await request(app)
        .get('/api/menu-items?category=invalid_category')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
      expect(response.body.data).toHaveLength(0);
    });

    it('should handle empty category filter', async () => {
      const response = await request(app)
        .get('/api/menu-items?category=')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should handle empty dietary tag filter', async () => {
      const response = await request(app)
        .get('/api/menu-items?dietaryTag=')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should handle multiple query parameters', async () => {
      const response = await request(app)
        .get('/api/menu-items?category=main&dietaryTag=vegetarian')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should handle special characters in query parameters', async () => {
      const response = await request(app)
        .get('/api/menu-items?dietaryTag=%20special%20chars%20')
        .expect(200);

      expect(response.body.success).toBe(true);
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

    // Additional Edge Cases for GET by ID
    it('should return 404 for negative ID', async () => {
      const response = await request(app)
        .get('/api/menu-items/-1')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Menu item not found');
    });

    it('should return 404 for zero ID', async () => {
      const response = await request(app)
        .get('/api/menu-items/0')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Menu item not found');
    });

    it('should handle non-numeric ID gracefully', async () => {
      const response = await request(app)
        .get('/api/menu-items/not-a-number')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should handle extremely large ID', async () => {
      const response = await request(app)
        .get('/api/menu-items/999999999999999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should handle special characters in ID', async () => {
      const response = await request(app)
        .get('/api/menu-items/abc!@#$%^&*()')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should handle empty ID path', async () => {
      const response = await request(app)
        .get('/api/menu-items/')
        .expect(200); // This should route to GET all items

      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('count');
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

    // Additional Edge Cases for PUT operations
    it('should reject PUT with zero price', async () => {
      const menuItem = await MenuItem.create({
        name: 'Test Item',
        description: 'Test description',
        price: 10.99,
        category: 'appetizer',
        availability: true
      });

      const updateData = {
        name: 'Updated Item',
        description: 'Updated description',
        price: 0,
        category: 'appetizer',
        availability: true
      };

      const response = await request(app)
        .put(`/api/menu-items/${menuItem.id}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('price');
    });

    it('should reject PUT with extremely large price', async () => {
      const menuItem = await MenuItem.create({
        name: 'Test Item',
        description: 'Test description',
        price: 10.99,
        category: 'appetizer',
        availability: true
      });

      const updateData = {
        name: 'Updated Item',
        description: 'Updated description',
        price: 999999999.99,
        category: 'appetizer',
        availability: true
      };

      const response = await request(app)
        .put(`/api/menu-items/${menuItem.id}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject PUT with oversized name', async () => {
      const menuItem = await MenuItem.create({
        name: 'Test Item',
        description: 'Test description',
        price: 10.99,
        category: 'appetizer',
        availability: true
      });

      const updateData = {
        name: 'a'.repeat(256), // Oversized name
        description: 'Updated description',
        price: 15.99,
        category: 'appetizer',
        availability: true
      };

      const response = await request(app)
        .put(`/api/menu-items/${menuItem.id}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should reject PUT with invalid category', async () => {
      const menuItem = await MenuItem.create({
        name: 'Test Item',
        description: 'Test description',
        price: 10.99,
        category: 'appetizer',
        availability: true
      });

      const updateData = {
        name: 'Updated Item',
        description: 'Updated description',
        price: 15.99,
        category: 'invalid-category',
        availability: true
      };

      const response = await request(app)
        .put(`/api/menu-items/${menuItem.id}`)
        .send(updateData)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle PUT to negative ID', async () => {
      const updateData = {
        name: 'Updated Item',
        description: 'Updated description',
        price: 15.99,
        category: 'appetizer',
        availability: true
      };

      const response = await request(app)
        .put('/api/menu-items/-1')
        .send(updateData)
        .expect(404);

      expect(response.body.success).toBe(false);
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

    // Additional Edge Cases for DELETE operations
    it('should return 404 when deleting with negative ID', async () => {
      const response = await request(app)
        .delete('/api/menu-items/-1')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Menu item not found');
    });

    it('should return 404 when deleting with zero ID', async () => {
      const response = await request(app)
        .delete('/api/menu-items/0')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Menu item not found');
    });

    it('should handle non-numeric ID in DELETE request', async () => {
      const response = await request(app)
        .delete('/api/menu-items/not-a-number')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should handle extremely large ID in DELETE request', async () => {
      const response = await request(app)
        .delete('/api/menu-items/999999999999999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    it('should handle special characters in DELETE ID', async () => {
      const response = await request(app)
        .delete('/api/menu-items/abc!@#$%')
        .expect(404);

      expect(response.body.success).toBe(false);
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

    // Additional Edge Cases for Search operations
    it('should handle empty search query gracefully', async () => {
      const response = await request(app)
        .get('/api/menu-items/search?q=')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle search with only whitespace', async () => {
      const response = await request(app)
        .get('/api/menu-items/search?q=   ')
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should handle search with special characters', async () => {
      const response = await request(app)
        .get('/api/menu-items/search?q=!@#$%^&*()')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
    });

    it('should handle search with SQL injection attempt', async () => {
      const response = await request(app)
        .get("/api/menu-items/search?q=' OR '1'='1")
        .expect(200);

      expect(response.body.success).toBe(true);
      // Should return 0 results, not all results (SQL injection prevention)
      expect(response.body.count).toBe(0);
    });

    it('should handle search with script tags', async () => {
      const response = await request(app)
        .get('/api/menu-items/search?q=<script>alert("xss")</script>')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
    });

    it('should handle extremely long search query', async () => {
      const longQuery = 'a'.repeat(1000);
      const response = await request(app)
        .get(`/api/menu-items/search?q=${longQuery}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
    });

    it('should handle search with unicode characters', async () => {
      const response = await request(app)
        .get('/api/menu-items/search?q=' + encodeURIComponent('🍕🍔🍟'))
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(0);
    });

    it('should handle case insensitive search properly', async () => {
      const response = await request(app)
        .get('/api/menu-items/search?q=PIZZA')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBeGreaterThan(0);
    });

    it('should handle search with multiple parameters', async () => {
      const response = await request(app)
        .get('/api/menu-items/search?q=pizza&extra=param')
        .expect(200);

      expect(response.body.success).toBe(true);
    });

    it('should handle URL encoded search terms', async () => {
      const response = await request(app)
        .get('/api/menu-items/search?q=pizza%20burger')
        .expect(200);

      expect(response.body.success).toBe(true);
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