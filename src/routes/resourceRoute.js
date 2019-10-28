const express = require("express");
const router = express.Router();
const resourceController = require('../controllers/resourceController');

router.get('/:pathId', resourceController.getAllResourcesByPathId);
router.post('/create', resourceController.createNewResource);
router.get('/delete/:resourceId', resourceController.deleteResource);

module.exports = router;