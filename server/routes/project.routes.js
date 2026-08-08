const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project.controller');
const { requireSignin } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

router.get('/',     requireSignin, projectController.getAll);
router.get('/:id',  requireSignin, projectController.getById);
router.post('/',    requireSignin, projectController.create);
router.put('/:id',  requireSignin, requireAdmin, projectController.updateById);
router.delete('/:id', requireSignin, requireAdmin, projectController.deleteById);
router.delete('/',  requireSignin, requireAdmin, projectController.deleteAll);

module.exports = router;
