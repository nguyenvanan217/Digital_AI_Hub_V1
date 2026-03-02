import { Router } from 'express';
import bannerController from '../controllers/bannerController';
import { registerController, resetPasswordController } from '../controllers/authController';
import { loginController } from '../controllers/authController';
import { sendResetPassword } from 'src/controllers/emailController';
import resourceController from 'src/controllers/resourceController';
import topicController from 'src/controllers/topicController';
import typeController from 'src/controllers/typeController';
const publicRouter = Router();

publicRouter.post('/register', registerController);
publicRouter.post('/login', loginController);
publicRouter.post('/reset-password', resetPasswordController);
publicRouter.post('/send-reset-password', sendResetPassword);

publicRouter.get('/banners', bannerController.getBanners);
publicRouter.get('/resources', resourceController.getResources);
publicRouter.get('/resources/:slug', resourceController.getResourceBySlug);
publicRouter.get('/resource', resourceController.getResources);
publicRouter.get('/my-resource', resourceController.getMyResources);
publicRouter.get('/topics', topicController.getTopics);
publicRouter.get('/topics/:slug', topicController.getTopicBySlug);
publicRouter.get('/types', typeController.getTypes);
publicRouter.get('/resource/:slug', resourceController.getResourceBySlug);

export default publicRouter;
