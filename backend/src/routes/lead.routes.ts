import { Router } from "express";
import {
  createLead,
  deleteLead,
  exportCSV,
  getLeadById,
  getLeads,
  updateLead,
} from "../controllers/lead.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { requireRole } from "../middleware/role.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", createLead);
router.get("/", getLeads);
router.get("/export", requireRole("admin"), exportCSV);
router.get("/:id", getLeadById);
router.put("/:id", updateLead);
router.delete("/:id", requireRole("admin"), deleteLead);

export default router;
