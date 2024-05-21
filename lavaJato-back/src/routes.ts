import { Router } from "express";
import {
  createScheduling,
  getSchedules,
  getAvailableSlots,
  cancelScheduling,
  confirmScheduling,
} from "./services/agendamentoService";

const router = Router();

router.post("/agendamentos", createScheduling);
router.get("/agendamentos", getSchedules);
router.get("/agendamentos/horarios", getAvailableSlots);
router.put("/agendamentos/:id/cancelar", cancelScheduling);
router.put("/agendamentos/:id/confirmar", confirmScheduling);

export { router };
