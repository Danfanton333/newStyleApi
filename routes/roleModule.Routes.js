import {Router} from 'express';
import {showRoleModule, showRoleModuleId, addRoleModule, updateRoleModule, deleteRoleModule} from '../controllers/roleModule.Controller.js';

const router = Router();
const apiName ='/RoleModule';

router.route(apiName)
    .get(showRoleModule)
    .post(addRoleModule);

router.route(`${apiName}/:id`)
    .get(showRoleModuleId)
    .put(updateRoleModule)
    .delete(deleteRoleModule);
 
export default router;
