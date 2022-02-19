import express from 'express';
import mongoose from 'mongoose';
import { getDBConnectionURI } from './config/utils';
import { CRUDController } from './common/typings';

export default class App {
  public app: express.Application;
  public port: number;

  constructor(controllers: CRUDController[], port: number) {
    this.app = express();
    this.port = port;

    this.initializeMiddlewares();
    this.initializeControllers(controllers);
    this.initializeDBConnection();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
  }

  private initializeControllers(controllers: CRUDController[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  private initializeDBConnection(): void {
    const DBConnectionURI = getDBConnectionURI();
    mongoose.connect(DBConnectionURI);
  }

  public listen() {
    this.app.listen(this.port, () => {
      console.log(`App listening on the port ${this.port}`);
    });
  }
}

