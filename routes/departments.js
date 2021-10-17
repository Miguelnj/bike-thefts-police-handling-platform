const {Router} = require('express');
const {getDepartments, createDepartment, updateDepartment, deleteDepartment} = require("../controllers/departments");

const router = Router();

router.get('/', getDepartments);

router.post('/', createDepartment);

router.put('/:id', updateDepartment);

router.delete('/:id', deleteDepartment);

module.exports = router;