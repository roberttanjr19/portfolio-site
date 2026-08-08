const express = require('express');
const router = express.Router();
const qualificationController = require('../controllers/qualification.controller');
const { requireSignin } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/admin.middleware');

router.get('/',     requireSignin, qualificationController.getAll);
router.get('/:id',  requireSignin, qualificationController.getById);
router.post('/',    requireSignin, qualificationController.create);
router.put('/:id',  requireSignin, requireAdmin, qualificationController.updateById);
router.delete('/:id', requireSignin, requireAdmin, qualificationController.deleteById);
router.delete('/',  requireSignin, requireAdmin, qualificationController.deleteAll);

module.exports = router;
