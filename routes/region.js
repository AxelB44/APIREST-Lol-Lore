const express = require('express');
const router = express.Router(); // router intégré au framework

// import des middlewares qui seront appelés avant la méthode finale
const logger = require('../middlewares/logger');
const auth = require('../middlewares/auth');

// import des controllers
// ils contiennent les méthodes vers lesquelles doivent pointer les requêtes
const regionCtrl = require('../controllers/region');

// routes CRUD disponibles
router.get('/', [auth, logger], regionCtrl.getRegionList);
router.get('/:id', [auth,logger], regionCtrl.getRegion);
router.post('/', [auth, logger], regionCtrl.createRegion);
router.put('/:id', [auth, logger], regionCtrl.updateRegion);
router.delete('/:id', [auth, logger], regionCtrl.deleteRegion);

module.exports = router;