const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');
const { requireSignin } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

router.get('/',     requireSignin, contactController.getAll);
router.get('/:id',  requireSignin, contactController.getById);
router.post('/',    requireSignin, contactController.create);
router.put('/:id',  requireSignin, requireAdmin, contactController.updateById);
router.delete('/:id', requireSignin, requireAdmin, contactController.deleteById);
router.delete('/',  requireSignin, requireAdmin, contactController.deleteAll);

module.exports = router;
