import {Router} from 'express';
import {showExitNs, showExitId, addExit, updateExit, deleteExit} from '../controllers/exit.Controller.js';

const router = Router();
const apiName ='/Exit';

router.route(apiName)
    .get(showExitNs)
    .post(addExit);

router.route(`${apiName}/:id`)
    .get(showExitId)
    .put(updateExit)
    .delete(deleteExit);
 
export default router;
