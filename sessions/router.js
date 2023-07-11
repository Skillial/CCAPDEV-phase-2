//might delete
const express = require('express');
const authController = require('./controller');
const router = express.Router();

router.get('/', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/login', authController.getLogin);
router.get('/index', authController.getLogin); // Update the route handler for '/index'
router.get('/logout', authController.getLogout);

module.exports = router;
