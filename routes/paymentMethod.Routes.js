import {Router} from 'express';
import {showPaymentMethod, showPaymentMethodId, addPaymentMethod, updatePaymentMethod, deletePaymentMethod} from '../controllers/paymentMethod.Controller.js';

const router = Router();
const apiName ='/PaymentMethod';

router.route(apiName)
    .get(showPaymentMethod)
    .post(addPaymentMethod);

router.route(`${apiName}/:id`)
    .get(showPaymentMethodId)
    .put(updatePaymentMethod)
    .delete(deletePaymentMethod);
 
export default router;
