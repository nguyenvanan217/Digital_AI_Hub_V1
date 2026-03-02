import { Router } from 'express';
import { changePasswordController, getAccount, logoutController } from 'src/controllers/authController';
import resourceController from 'src/controllers/resourceController';
import topicController from 'src/controllers/topicController';
import typeController from 'src/controllers/typeController';
import { uploadFileController } from 'src/controllers/uploadController';
import userController from 'src/controllers/userController';
import { checkUserJWT } from 'src/middleware/jwtAction';
import { upload } from 'src/middleware/upload';

const protectedRouter = Router();
protectedRouter.use(checkUserJWT);

protectedRouter.put('/user/:id', userController.updateUser);
protectedRouter.get('/user', userController.getUsers);

protectedRouter.post('/upload', upload.single('file'), uploadFileController);

protectedRouter.post('/logout', logoutController);
protectedRouter.get('/get-account', getAccount);
protectedRouter.post('/change-password', changePasswordController);

// RESOURCE
protectedRouter.post('/resource', resourceController.createResource);
protectedRouter.put('/resource/:id', resourceController.updateResource);
protectedRouter.delete('/resource/:id', resourceController.deleteResource);

export default protectedRouter;
