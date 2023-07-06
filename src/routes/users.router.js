import { Router } from "express";
import usersController from "../controllers/users.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyDocuments } from "../middlewares/upgrade.middleware.js";

const router = Router();

router.get("/", usersController.getAllUsers);
router.get("/premium/decrease/:uid", usersController.decreaseUser);
router.get("/premium/:uid", verifyDocuments, usersController.upgradeUser);
router.delete("/:uid", usersController.deleteUser);
router.delete("/", usersController.deleteInactiveUsers);
router.post(
  "/:uid/documents",
  upload.fields([
    { name: "profile-avatar", maxCount: 1 },
    { name: "product-product", maxCount: 1 },
    { name: "document-identification", maxCount: 1 },
    { name: "document-address", maxCount: 1 },
    { name: "document-account", maxCount: 1 },
  ]),
  usersController.saveDocuments
);

export default router;
