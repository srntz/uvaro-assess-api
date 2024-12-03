import {questionTable} from "./db/schemas/question.js";
import {DatabaseConnection} from "./db/DatabaseConnection.js";
import dotenv from "dotenv";
dotenv.config({path: '../.env'});

let db = DatabaseConnection.getInstance()

const testdata = await db.select().from(questionTable)

console.log(testdata);
