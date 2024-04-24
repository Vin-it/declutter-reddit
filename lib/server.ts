import 'dotenv/config'
import config from "config";
import express, { type Express } from "express";
import connectSessionKnex from "connect-session-knex";
import path from "path";
import session from "express-session";

import {
  init as initKnex,
  getInstance as getKnexInstance,
} from "./database/knex";
import { init as initObjection } from "./database/objection";
import { init as initDebug, logServer, logDatabase, getLogger } from "./utils/debug";
import router from "./router";
import errorHandler from "./middleware/error-handler";
import Knex from "knex";
import { User } from "./database/models";

declare module "express-session" {
  interface SessionData {
    user: Partial<User> & { username: string; accessToken: string; expiresOn: string | Date };
    destroy: () => void;
  }
}

function initMiddlewares(app: Express) {
  const knex = getKnexInstance();
  const KnexSessionStore = connectSessionKnex(session);

  app.set("view engine", "ejs");
  app.use(
    session({
      secret: process.env.SESS_SECRET ?? "default",
      resave: false,
      saveUninitialized: true,
      store: new KnexSessionStore({
        knex,
        tablename: "sessions",
        createtable: true,
      }),
      cookie: { secure: false },
    })
  );
  app.use("/static", express.static(path.join(__dirname, process.env.DECLUTTER_ENV === 'local' ? "../public" : "../../public")));
  app.use("/static", express.static(path.join(__dirname, process.env.DECLUTTER_ENV === 'local' ? '../build' : '../../build')));
  app.use(router);
  app.use(errorHandler);
}

async function initMigrations(knex: ReturnType<typeof Knex>, retryCount: number) {
  if (retryCount === 3) {
    throw Error("Failed to run migrations after 3 retries");
  }

  return knex.migrate
    .latest({
      directory: "lib/database/migrations",
    })
    .then(() => {
      logDatabase("Migrations ran succcessfully");
    })
    .catch((error: unknown) => {
      if (error instanceof Error)
        logDatabase(
          "Error running migrations, retrying in 10 seconds...",
          error.message
        );
      setTimeout(() => initMigrations(knex, retryCount + 1), 10000);
    });
}

async function initApp() {
  const { PORT } = config.get<{ PORT: number }>("app");
  const app = express();
  const knex = getKnexInstance;
  const RETRY_COUNT = 0;

  initDebug();
  initKnex();
  initObjection(knex());
  await initMigrations(knex(), RETRY_COUNT);
  initMiddlewares(app);

  app.listen(PORT, () => {
    logServer("App is listening to", String(PORT));
  });
}

export default initApp;
