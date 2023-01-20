const express = require('express');
const router = express.Router(); // router intégré au framework

// import des middlewares qui seront appelés avant la méthode finale
const logger = require('../middlewares/logger');
const auth = require('../middlewares/auth');

// import des controllers
// ils contiennent les méthodes vers lesquelles doivent pointer les requêtes
const cityCtrl = require('../controllers/city');

// routes CRUD disponibles
router.get('/', [auth, logger], cityCtrl.getCityList);
router.get('/:id', [auth,logger], cityCtrl.getCity);
router.post('/', [auth, logger], cityCtrl.createCity);
router.put('/:id', [auth, logger], cityCtrl.updateCity);
router.delete('/:id', [auth, logger], cityCtrl.deleteCity);

module.exports = router;