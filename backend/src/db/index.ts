import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { questionnaires, questions, submissions, submissionAnswers } from './schema/questionnaires.ts';
import { Resource } from "sst";

const DATABASE_URL = `postgresql://${Resource.MyPostgres.username}:${Resource.MyPostgres.password}@${Resource.MyPostgres.host}:${Resource.MyPostgres.port}/${Resource.MyPostgres.database}`

const schema = {
  questionnaires,
  questions,
  submissions,
  submissionAnswers,
};

const { Pool } = pg;
const pool = new Pool({
  connectionString: DATABASE_URL
});

export const db = drizzle({ client: pool, schema });