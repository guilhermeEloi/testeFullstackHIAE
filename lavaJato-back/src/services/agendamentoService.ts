import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

const MERCOSUL_REGEX = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

const validSlots = [
  "10:00",
  "10:15",
  "10:30",
  "10:45",
  "11:00",
  "11:15",
  "11:30",
  "11:45",
  "13:00",
  "13:15",
  "13:30",
  "13:45",
  "14:00",
  "14:15",
  "14:30",
  "14:45",
  "15:00",
  "15:15",
  "15:30",
  "15:45",
  "16:00",
  "16:15",
  "16:30",
  "16:45",
  "17:00",
  "17:15",
  "17:30",
  "17:45",
];

const SLOT_DURATIONS = {
  SIMPLES: 30,
  COMPLETA: 45,
};

export const createScheduling = async (req: Request, res: Response) => {
  try {
    const { placa, data, horario, tipo } = req.body;

    if (!MERCOSUL_REGEX.test(placa)) {
      return res.status(400).json({ error: "Placa inválida" });
    }

    const slotIndex = validSlots.indexOf(horario);
    if (slotIndex === -1) {
      return res.status(400).json({ error: "Horário inválido" });
    }

    const duration = SLOT_DURATIONS[tipo as keyof typeof SLOT_DURATIONS];
    const endSlotIndex = slotIndex + duration / 15 - 1;
    if (
      endSlotIndex >= validSlots.length ||
      validSlots[endSlotIndex].startsWith("12")
    ) {
      return res.status(400).json({ error: "Horário de fim inválido" });
    }

    const conflictingSchedules = await prisma.agendamento.findMany({
      where: {
        data,
        status: "CONFIRMADO",
      },
    });

    const schedulingStartTime = validSlots.indexOf(horario);
    const schedulingEndTime = schedulingStartTime + duration / 15 - 1;

    const conflictExists = conflictingSchedules.some((scheduling) => {
      const schedulingStartIndex = validSlots.indexOf(scheduling.horario);
      const schedulingDuration = SLOT_DURATIONS[scheduling.tipo];
      const schedulingEndIndex =
        schedulingStartIndex + schedulingDuration / 15 - 1;

      return (
        (schedulingStartTime >= schedulingStartIndex &&
          schedulingStartTime <= schedulingEndIndex) ||
        (schedulingEndTime >= schedulingStartIndex &&
          schedulingEndTime <= schedulingEndIndex)
      );
    });

    if (conflictExists) {
      const canScheduleSimple = conflictingSchedules.every((scheduling) => {
        const schedulingStartIndex = validSlots.indexOf(scheduling.horario);
        const schedulingDuration = SLOT_DURATIONS[scheduling.tipo];
        const schedulingEndIndex =
          schedulingStartIndex + schedulingDuration / 15 - 1;

        const simpleEndSlotIndex =
          schedulingStartTime + SLOT_DURATIONS.SIMPLES / 15 - 1;

        return !(
          (schedulingStartTime >= schedulingStartIndex &&
            schedulingStartTime <= schedulingEndIndex) ||
          (simpleEndSlotIndex >= schedulingStartIndex &&
            simpleEndSlotIndex <= schedulingEndIndex)
        );
      });

      const canScheduleComplete = conflictingSchedules.every((scheduling) => {
        const schedulingStartIndex = validSlots.indexOf(scheduling.horario);
        const schedulingDuration = SLOT_DURATIONS[scheduling.tipo];
        const schedulingEndIndex =
          schedulingStartIndex + schedulingDuration / 15 - 1;

        const completeEndSlotIndex =
          schedulingStartTime + SLOT_DURATIONS.COMPLETA / 15 - 1;

        return !(
          (schedulingStartTime >= schedulingStartIndex &&
            schedulingStartTime <= schedulingEndIndex) ||
          (completeEndSlotIndex >= schedulingStartIndex &&
            completeEndSlotIndex <= schedulingEndIndex)
        );
      });

      if (!canScheduleSimple && !canScheduleComplete) {
        return res
          .status(400)
          .json({
            error: "Conflito de agendamento para todos os tipos de lavagem.",
          });
      }

      let conflictMessage = "Conflito de agendamento. ";

      if (!canScheduleSimple && canScheduleComplete) {
        conflictMessage +=
          "Não é possível fazer agendamento de uma lavagem simples devido ao agendamento seguinte, mas é possível uma completa.";
      } else if (canScheduleSimple && !canScheduleComplete) {
        conflictMessage +=
          "Não é possível fazer agendamento de uma lavagem completa devido ao agendamento seguinte, mas é possível uma simples.";
      } else {
        conflictMessage +=
          "Não é possível fazer agendamento de nenhum tipo de lavagem.";
      }

      return res.status(400).json({ error: conflictMessage });
    }

    const scheduling = await prisma.agendamento.create({
      data: {
        placa,
        data,
        horario,
        tipo,
        status: "PENDENTE",
      },
    });

    res
      .status(201)
      .json({ message: "Agendamento criado com sucesso", scheduling });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao criar agendamento", message: error.message });
  }
};

export const getAvailableSlots = async (req: Request, res: Response) => {
  try {
    const { data } = req.query as { data: string };

    const existingSchedules = await prisma.agendamento.findMany({
      where: {
        data: data,
        status: "CONFIRMADO",
      },
    });

    const occupiedSlots = new Set<string>();
    existingSchedules.forEach((scheduling) => {
      const schedulingStartIndex = validSlots.indexOf(scheduling.horario);
      const schedulingDuration = SLOT_DURATIONS[scheduling.tipo];
      for (let i = 0; i < schedulingDuration / 15; i++) {
        occupiedSlots.add(validSlots[schedulingStartIndex + i]);
      }
    });

    const availableSlots = validSlots.filter(
      (slot) => !occupiedSlots.has(slot)
    );

    res.json({ availableSlots });
  } catch (error: any) {
    res.status(500).json({
      error: "Erro ao recuperar horários disponíveis",
      message: error.message,
    });
  }
};

export const getSchedules = async (req: Request, res: Response) => {
  try {
    const schedules = await prisma.agendamento.findMany();
    res.json(schedules);
  } catch (error: any) {
    res.status(500).json({
      error: "Erro ao recuperar agendamentos",
      message: error.message,
    });
  }
};

export const cancelScheduling = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const scheduling = await prisma.agendamento.update({
      where: { id: parseInt(id) },
      data: { status: "CANCELADO" },
    });

    res.json({ message: "Agendamento cancelado com sucesso", scheduling });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao cancelar agendamento", message: error.message });
  }
};

export const confirmScheduling = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const scheduling = await prisma.agendamento.update({
      where: { id: parseInt(id) },
      data: { status: "CONFIRMADO" },
    });

    res.json({ message: "Agendamento confirmado com sucesso", scheduling });
  } catch (error: any) {
    res
      .status(500)
      .json({ error: "Erro ao confirmar agendamento", message: error.message });
  }
};
