import { User } from '../database';

export interface UserRequest {
  email: string,
  password: string,
}

export const createUser = async (userRequest: UserRequest) => {
  try {
    const user = await User.create(userRequest);
    return user;
  } catch (e) {
    console.error('Could not create user! Error: ', e);
    return null;
  }
}

export const findUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (e) {
    console.error('Could not find user! Error: ', e);
    return null;
  }
}