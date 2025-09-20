const MenuItemService = require('../services/MenuItemService');

class MenuItemController {
  /**
   * Get all menu items
   * @swagger
   * /api/menu-items:
   *   get:
   *     summary: Get all menu items
   *     tags: [Menu Items]
   *     parameters:
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *           enum: [appetizer, main, dessert, beverage]
   *         description: Filter by category
   *       - in: query
   *         name: dietaryTag
   *         schema:
   *           type: string
   *         description: Filter by dietary tag
   *     responses:
   *       200:
   *         description: List of menu items
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/MenuItem'
   *       500:
   *         description: Server error
   */
  async getAllMenuItems(req, res) {
    try {
      const { category, dietaryTag } = req.query;
      const filters = {};
      
      if (category) filters.category = category;
      if (dietaryTag) filters.dietaryTag = dietaryTag;

      const menuItems = await MenuItemService.getAllMenuItems(filters);
      
      res.status(200).json({
        success: true,
        count: menuItems.length,
        data: menuItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server Error',
        message: error.message
      });
    }
  }

  /**
   * Get menu item by ID
   * @swagger
   * /api/menu-items/{id}:
   *   get:
   *     summary: Get menu item by ID
   *     tags: [Menu Items]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Menu item ID
   *     responses:
   *       200:
   *         description: Menu item details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MenuItem'
   *       404:
   *         description: Menu item not found
   *       500:
   *         description: Server error
   */
  async getMenuItemById(req, res) {
    try {
      const { id } = req.params;
      const menuItem = await MenuItemService.getMenuItemById(id);

      if (!menuItem) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Menu item not found'
        });
      }

      res.status(200).json({
        success: true,
        data: menuItem
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server Error',
        message: error.message
      });
    }
  }

  /**
   * Create new menu item
   * @swagger
   * /api/menu-items:
   *   post:
   *     summary: Create new menu item
   *     tags: [Menu Items]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - price
   *               - category
   *             properties:
   *               name:
   *                 type: string
   *               description:
   *                 type: string
   *               price:
   *                 type: number
   *               category:
   *                 type: string
   *                 enum: [appetizer, main, dessert, beverage]
   *               dietaryTag:
   *                 type: string
   *     responses:
   *       201:
   *         description: Menu item created successfully
   *       400:
   *         description: Invalid input
   *       500:
   *         description: Server error
   */
  async createMenuItem(req, res) {
    try {
      const menuItemData = req.body;
      const newMenuItem = await MenuItemService.createMenuItem(menuItemData);

      res.status(201).json({
        success: true,
        message: 'Menu item created successfully',
        data: newMenuItem
      });
    } catch (error) {
      const statusCode = error.message.includes('Validation error') ? 400 : 500;
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 400 ? 'Bad Request' : 'Server Error',
        message: error.message
      });
    }
  }

  /**
   * Update menu item
   * @swagger
   * /api/menu-items/{id}:
   *   put:
   *     summary: Update menu item
   *     tags: [Menu Items]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Menu item ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/MenuItem'
   *     responses:
   *       200:
   *         description: Menu item updated successfully
   *       404:
   *         description: Menu item not found
   *       400:
   *         description: Invalid input
   *       500:
   *         description: Server error
   */
  async updateMenuItem(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updatedMenuItem = await MenuItemService.updateMenuItem(id, updateData);

      if (!updatedMenuItem) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Menu item not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Menu item updated successfully',
        data: updatedMenuItem
      });
    } catch (error) {
      const statusCode = error.message.includes('Validation error') ? 400 : 500;
      
      res.status(statusCode).json({
        success: false,
        error: statusCode === 400 ? 'Bad Request' : 'Server Error',
        message: error.message
      });
    }
  }

  /**
   * Delete menu item
   * @swagger
   * /api/menu-items/{id}:
   *   delete:
   *     summary: Delete menu item
   *     tags: [Menu Items]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Menu item ID
   *     responses:
   *       200:
   *         description: Menu item deleted successfully
   *       404:
   *         description: Menu item not found
   *       500:
   *         description: Server error
   */
  async deleteMenuItem(req, res) {
    try {
      const { id } = req.params;
      const deleted = await MenuItemService.deleteMenuItem(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          error: 'Not Found',
          message: 'Menu item not found'
        });
      }

      res.status(200).json({
        success: true,
        message: 'Menu item deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server Error',
        message: error.message
      });
    }
  }

  /**
   * Search menu items
   * @swagger
   * /api/menu-items/search:
   *   get:
   *     summary: Search menu items by name
   *     tags: [Menu Items]
   *     parameters:
   *       - in: query
   *         name: q
   *         required: true
   *         schema:
   *           type: string
   *         description: Search term
   *     responses:
   *       200:
   *         description: Search results
   *       400:
   *         description: Missing search term
   *       500:
   *         description: Server error
   */
  async searchMenuItems(req, res) {
    try {
      const { q } = req.query;

      if (!q || q.trim() === '') {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Search term is required'
        });
      }

      const menuItems = await MenuItemService.searchMenuItems(q.trim());

      res.status(200).json({
        success: true,
        count: menuItems.length,
        data: menuItems
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Server Error',
        message: error.message
      });
    }
  }
}

module.exports = new MenuItemController();