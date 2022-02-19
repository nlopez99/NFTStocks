import App from './src/app';

const controllers: any[] = [];
const port = 5000;

const app = new App(controllers, port);

app.listen();
