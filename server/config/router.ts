import { Router } from "express";
import { configureAuthRoutes } from "../routers/auth-routes";
import { configurePlantRoutes } from "../routers/plant-routes";

const configureRouter = (router: Router) => {
  configureAuthRoutes(router);
  configurePlantRoutes(router);
  return router;
}

export default configureRouter