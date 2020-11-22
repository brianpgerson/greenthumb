import { Schedule } from '../database';

export interface ScheduleRequest {
  ruleNumber: number,
  rangeEnd: number,
  ruleCategory: string,
  plantId: number,
}

export const createSchedule = async (scheduleRequest: ScheduleRequest) => {
  try {
    return await Schedule.create(scheduleRequest);
  } catch (e) {
    console.error('Could not create rule! Error: ', e);
    return null;
  }
}
