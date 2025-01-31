import { Router } from "express";
import protectRoute from "../middleware/auth";
import { createCertificate, getCertificatebyuseID, getCertificatebyId, deletecertificate } from "../controllers/certificate.contoller";

const router = Router();

router.post("/create", protectRoute(), createCertificate);
router.get("/:id", protectRoute(), getCertificatebyuseID);
router.get("/:id", protectRoute(), getCertificatebyId);
router.delete("/:id", protectRoute(), deletecertificate);


export default router;
