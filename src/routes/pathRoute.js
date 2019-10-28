const express = require("express");
const router = express.Router();
const pathController = require('../controllers/pathController');

router.get('/', pathController.getAllPaths);
router.post('/create', pathController.createNewPath);
router.get('/delete/:pathId', pathController.deletePathWithAllItsRecources);

module.exports = router;