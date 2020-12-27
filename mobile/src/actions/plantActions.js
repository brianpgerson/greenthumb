export const LOAD_PLANTS = 'LOAD_PLANTS';

export const loadPlants = (plants) => {
  return {
    type: LOAD_PLANTS,
    plants
  };
};