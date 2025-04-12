import {Router} from 'express';
import {showBill, showBillId, addBill, updateBill, deleteBill} from '../controllers/bill.Controller.js';

const router = Router();
const apiName ='/Bill';

router.route(apiName)
    .get(showBill)
    .post(addBill);

router.route(`${apiName}/:id`)
    .get(showBillId)
    .put(updateBill)
    .delete(deleteBill);
 
export default router;
