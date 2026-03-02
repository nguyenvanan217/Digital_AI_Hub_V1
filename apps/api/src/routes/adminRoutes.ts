import { Router } from 'express';
import userController from '../controllers/userController';
import bannerController from '../controllers/bannerController';
import { checkUserJWT } from '../middleware/jwtAction';
import { checkIsAdmin } from 'src/middleware/isAdmin';
import topicController from 'src/controllers/topicController';
import typeController from 'src/controllers/typeController';
import resourceController from 'src/controllers/resourceController';

const adminRouter = Router();
adminRouter.use(checkUserJWT, checkIsAdmin);
// USER
adminRouter.post('/user', userController.createUser);
adminRouter.delete('/user/:id', userController.deleteUser);

// BANNER
adminRouter.post('/banner', bannerController.createBanner);
adminRouter.put('/banner/:id', bannerController.updateBanner);
adminRouter.delete('/banner/:id', bannerController.deleteBanner);

// TOPIC
adminRouter.post('/topic', topicController.createTopic);
adminRouter.put('/topic/:id', topicController.updateTopic);
adminRouter.delete('/topic/:id', topicController.deleteTopic);

// TYPE
adminRouter.post('/type', typeController.createType);
adminRouter.put('/type/:id', typeController.updateType);
adminRouter.delete('/type/:id', typeController.deleteType);

//RESOURCE
adminRouter.post('/resource/approve/:id', resourceController.approveResource);

export default adminRouter;
