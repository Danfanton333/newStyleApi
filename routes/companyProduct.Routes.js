import {Router} from 'express';
import {showCompanyProduct, showCompanyProductId, addCompanyProduct, updateCompanyProduct, deleteCompanyProduct} from '../controllers/companyProduct.Controller.js';

const router = Router();
const apiName ='/CompanyProduct';

router.route(apiName)
    .get(showCompanyProduct)
    .post(addCompanyProduct);

router.route(`${apiName}/:id`)
    .get(showCompanyProductId)
    .put(updateCompanyProduct)
    .delete(deleteCompanyProduct);
 
export default router;
