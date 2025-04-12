import {Router} from 'express';
import {showOrder, showOrderId, addOrder, updateOrder, deleteOrder} from '../controllers/order.Controller.js';

const router = Router();
const apiName ='/Order';

router.route(apiName)
    .get(showOrder)
    .post(addOrder);

router.route(`${apiName}/:id`)
    .get(showOrderId)
    .put(updateOrder)
    .delete(deleteOrder);
 
export default router;
