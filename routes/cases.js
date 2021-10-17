const {Router} = require('express');
const {getBikeCases, postBikeCase, updateBikeCase, deleteCase} = require("../controllers/cases");

const router = Router();

router.get('/', getBikeCases);

router.post('/', postBikeCase);

router.put('/:id', updateBikeCase);

router.delete('/:id', deleteCase);

module.exports = router;

