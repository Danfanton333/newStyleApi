import {Router} from 'express';
import {showProductOrder, showProductOrderId, addProductOrder, updateProductOrder, deleteProductOrder} from '../controllers/productOrder.Controller.js';

const router = Router();
const apiName ='/ProductOrder';

router.route(apiName)
    .get(showProductOrder)
    .post(addProductOrder);

router.route(`${apiName}/:id`)
    .get(showProductOrderId)
    .put(updateProductOrder)
    .delete(deleteProductOrder);
 
export default router;
