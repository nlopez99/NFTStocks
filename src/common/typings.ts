import { Router } from 'express';

export interface CRUDController {
  path: string;
  router: Router;
}
