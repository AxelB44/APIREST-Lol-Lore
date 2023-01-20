const express = require('express');
const router = express.Router(); // router intégré au framework

// import des middlewares qui seront appelés avant la méthode finale
const logger = require('../middlewares/logger');
const auth = require('../middlewares/auth');
const notification = require('../middlewares/notification');


// import des controllers
// ils contiennent les méthodes vers lesquelles doivent pointer les requêtes
const championCtrl = require('../controllers/champion');


// routes CRUD disponibles
router.get('/', [auth, logger], championCtrl.getChampionList);
router.get('/:id', [auth, logger], championCtrl.getChampion);
router.post('/', [auth,logger,notification.sendNewChampion], championCtrl.createChampion);
router.put('/:id', [auth,logger], championCtrl.updateChampion);
router.delete('/:id', [auth,logger], championCtrl.deleteChampion);

module.exports = router;