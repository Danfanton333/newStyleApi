import {Router} from 'express';
import {showUpdateExit, showUpdateExitId, addUpdateExit, updateUpdateExit, deleteUpdateExit} from '../controllers/updateExit.Controller.js';

const router = Router();
const apiName ='/UpdateExit';

router.route(apiName)
    .get(showUpdateExit)
    .post(addUpdateExit);

router.route(`${apiName}/:id`)
    .get(showUpdateExitId)
    .put(updateUpdateExit)
    .delete(deleteUpdateExit);
 
export default router;
