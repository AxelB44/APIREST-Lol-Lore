const express = require('express');
const router = express.Router(); // router intégré au framework

// import des middlewares qui seront appelés avant la méthode finale
const logger = require('../middlewares/logger');
const auth = require('../middlewares/auth');
const notification = require('../middlewares/notification');

// import des controllers
// ils contiennent les méthodes vers lesquelles doivent pointer les requêtes
const historyCtrl = require('../controllers/history');

// routes CRUD disponibles
router.get('/', [auth, logger], historyCtrl.getHistoryList);
router.get('/:id', [auth, logger], historyCtrl.getHistory);
router.post('/', [auth,logger,notification.sendNewHistory], historyCtrl.createHistory);
router.put('/:id', [auth, logger], historyCtrl.updateHistory);
router.delete('/:id', [auth, logger], historyCtrl.deleteHistory);

module.exports = router;