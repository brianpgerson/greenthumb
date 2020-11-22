import { Router, Request, Response } from "express";

import { createPlant, PlantRequest } from '../services/plant-service';
import { createSchedule, ScheduleRequest } from '../services/schedule-service';
import { createWatering, WateringRequest } from '../services/watering-service';
import { verifyJwt } from "../middleware/auth/jwt-middleware";
import { RULE_CATEGORIES } from "../database/models/Schedule";

export const configurePlantRoutes = async (router: Router) => {
  router.post('/plants', verifyJwt, async (req: Request, res: Response) => {  
    const plantRequest: PlantRequest = req.body.plantRequest;
    const scheduleRequest: ScheduleRequest = req.body.scheduleRequest;
    const startDate: Date = req.body.startDate;
    console.log(req.user)
    const { user: { id: userId } } = req;

    try {
      const plant = await createPlant({...plantRequest, userId })
      let schedule = null;
      let nextWatering = null;
      if (plant === null) {
        return res.status(500).json({ errors: `Couldn't create plant!`})
      }
      if (scheduleRequest !== null) {
        schedule = await createSchedule({ ...scheduleRequest, plantId: plant.id })
        if (schedule === null) {
          return res.status(500).json({ errors: `Couldn't create watering schedule!`})
        }

        let endDate;
        if (schedule.rangeEnd) {
          const days = schedule.ruleCategory === RULE_CATEGORIES.DAYS ? 1 : 7;
          endDate = new Date();
          endDate.setDate(endDate.getDate() + (schedule.rangeEnd * days));
        }

        nextWatering = await createWatering({ 
          plantId: plant.id, 
          startDate,
          endDate,
        });

        if (nextWatering === null) {
          return res.status(500).json({ errors: `Couldn't create upcoming watering!`})
        }
      }
      return res.status(200).json({ plant, schedule, nextWatering })
    } catch (e) {
      return res.status(500).json({ errors: e })
    }
  })

  return router;
}