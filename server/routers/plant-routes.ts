import { Router, Request, Response } from "express";

import { sequelize } from '../database/index';

import { createPlant, PlantRequest } from '../services/plant-service';
import { createSchedule, ScheduleRequest } from '../services/schedule-service';
import { createWatering } from '../services/watering-service';
import { verifyJwt } from "../middleware/auth/jwt-middleware";
import { RULE_CATEGORIES } from "../database/models/Schedule";

export const configurePlantRoutes = async (router: Router) => {
  router.post('/plants', verifyJwt, async (req: Request, res: Response) => {  
    console.log('the whoooole ass body here: ', req.body)
    const plantRequest: PlantRequest = req.body.plantRequest;
    const scheduleRequest: ScheduleRequest = req.body.scheduleRequest;
    const startDate: Date = new Date(req.body.startDate);
    const { user: { id: userId } } = req;
    const txn = await sequelize.transaction();

    try {

      const plant = await createPlant({...plantRequest, userId }, txn)
      let schedule = null;
      let nextWatering = null;
      if (plant === null) {
        return res.status(500).json({ errors: `Couldn't create plant!`})
      }
      if (scheduleRequest !== null) {
        schedule = await createSchedule({ ...scheduleRequest, plantId: plant.id }, txn)
        if (schedule === null) {
          await txn.rollback();
          return res.status(500).json({ errors: `Couldn't create watering schedule!`})
        }

        let endDate;
        if (schedule.rangeEnd) {
          let daysBetween = schedule.rangeEnd - schedule.ruleNumber;
          if (schedule.ruleCategory === RULE_CATEGORIES.WEEKS) {
            daysBetween = daysBetween * 7;
          }

          endDate = new Date();
          endDate.setDate(startDate.getDate() + daysBetween);
        }

        nextWatering = await createWatering({ 
          plantId: plant.id, 
          startDate,
          endDate,
        }, txn);

        if (nextWatering === null) {
          await txn.rollback();
          return res.status(500).json({ errors: `Couldn't create upcoming watering!`})
        }
      }
      await txn.commit();
      return res.status(200).json({ plant, schedule, nextWatering })
    } catch (e) {
      await txn.rollback();
      return res.status(500).json({ errors: e.message })
    }
  })

  return router;
}