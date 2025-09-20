const express = require('express');
const MenuItemController = require('../controllers/MenuItemController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Menu Items
 *   description: Menu item management endpoints
 */

// Search route must come before /:id route to avoid conflicts
router.get('/menu-items/search', MenuItemController.searchMenuItems);

// CRUD routes
router.get('/menu-items', MenuItemController.getAllMenuItems);
router.get('/menu-items/:id', MenuItemController.getMenuItemById);
router.post('/menu-items', MenuItemController.createMenuItem);
router.put('/menu-items/:id', MenuItemController.updateMenuItem);
router.delete('/menu-items/:id', MenuItemController.deleteMenuItem);

module.exports = router;