import { Schedule } from '../database';
import { Transaction } from 'sequelize/types';

export interface ScheduleRequest {
  ruleNumber: number,
  rangeEnd: number,
  ruleCategory: string,
  plantId: number,
}

export const createSchedule = async (scheduleRequest: ScheduleRequest, txn?: Transaction) => {
  try {
    console.log(scheduleRequest);
    return await Schedule.create(scheduleRequest, { transaction: txn });
  } catch (e) {
    console.error('Could not create rule! Error: ', e);
    return null;
  }
}
