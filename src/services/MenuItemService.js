const MenuItem = require('../models/MenuItem');
const { ValidationError, UniqueConstraintError } = require('sequelize');

class MenuItemService {
  /**
   * Get all menu items with optional filtering
   * @param {Object} filters - Optional filters (category, dietaryTag)
   * @returns {Promise<Array>} Array of menu items
   */
  async getAllMenuItems(filters = {}) {
    try {
      const whereClause = {};
      
      if (filters.category) {
        whereClause.category = filters.category;
      }
      
      if (filters.dietaryTag) {
        whereClause.dietaryTag = filters.dietaryTag;
      }

      return await MenuItem.findAll({
        where: whereClause,
        order: [['category', 'ASC'], ['name', 'ASC']]
      });
    } catch (error) {
      throw new Error(`Failed to retrieve menu items: ${error.message}`);
    }
  }

  /**
   * Get menu item by ID
   * @param {number} id - Menu item ID
   * @returns {Promise<Object|null>} Menu item or null if not found
   */
  async getMenuItemById(id) {
    try {
      return await MenuItem.findByPk(id);
    } catch (error) {
      throw new Error(`Failed to retrieve menu item: ${error.message}`);
    }
  }

  /**
   * Create new menu item
   * @param {Object} menuItemData - Menu item data
   * @returns {Promise<Object>} Created menu item
   */
  async createMenuItem(menuItemData) {
    try {
      return await MenuItem.create(menuItemData);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
      }
      if (error instanceof UniqueConstraintError) {
        throw new Error('Menu item with this name already exists');
      }
      throw new Error(`Failed to create menu item: ${error.message}`);
    }
  }

  /**
   * Update menu item by ID
   * @param {number} id - Menu item ID
   * @param {Object} updateData - Updated menu item data
   * @returns {Promise<Object|null>} Updated menu item or null if not found
   */
  async updateMenuItem(id, updateData) {
    try {
      const menuItem = await MenuItem.findByPk(id);
      
      if (!menuItem) {
        return null;
      }

      return await menuItem.update(updateData);
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`);
      }
      throw new Error(`Failed to update menu item: ${error.message}`);
    }
  }

  /**
   * Delete menu item by ID
   * @param {number} id - Menu item ID
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  async deleteMenuItem(id) {
    try {
      const menuItem = await MenuItem.findByPk(id);
      
      if (!menuItem) {
        return false;
      }

      await menuItem.destroy();
      return true;
    } catch (error) {
      throw new Error(`Failed to delete menu item: ${error.message}`);
    }
  }

  /**
   * Search menu items by name (case-insensitive)
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Array of matching menu items
   */
  async searchMenuItems(searchTerm) {
    try {
      const { Op } = require('sequelize');
      
      return await MenuItem.findAll({
        where: {
          name: {
            [Op.like]: `%${searchTerm}%`
          }
        },
        order: [['name', 'ASC']]
      });
    } catch (error) {
      throw new Error(`Failed to search menu items: ${error.message}`);
    }
  }
}

module.exports = new MenuItemService();