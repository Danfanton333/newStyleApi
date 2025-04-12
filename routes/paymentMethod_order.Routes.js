import {Router} from 'express';
import {showPaymentMethod_Order, showPaymentMethod_OrderId, addPaymentMethod_Order, updatePaymentMethod_Order, deletePaymentMethod_Order} from '../controllers/paymentMethod_Order.Controller.js';

const router = Router();
const apiName ='/PaymentMethod_Order';

router.route(apiName)
    .get(showPaymentMethod_Order)
    .post(addPaymentMethod_Order);

router.route(`${apiName}/:id`)
    .get(showPaymentMethod_OrderId)
    .put(updatePaymentMethod_Order)
    .delete(deletePaymentMethod_Order);
 
export default router;
