import {Router} from 'express';
import {showIncome, showIncomeId, addIncome, updateIncome, deleteIncome} from '../controllers/Income.Controller.js';

const router = Router();
const apiName ='/Income';

router.route(apiName)
    .get(showIncome)
    .post(addIncome);

router.route(`${apiName}/:id`)
    .get(showIncomeId)
    .put(updateIncome)
    .delete(deleteIncome);
 
export default router;
