import express from "express";
import { authenticateToken } from "./auth.ts";
import { Questionnaires } from "./questionnaires/questionnaires.ts";
import { StudentGroups } from "./questionnaires/studentGroups.ts";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const PORT = 80;
const app = express();

app.use(express.json());

app.use(authenticateToken);

// Create a new questionnaire
app.post("/questionnaires", async (req, res) => {
  const { title, description, questions } = req.body;
  try {
    const newQuestionnaire = await Questionnaires.createQuestionnaire(title, description, questions);
    res.status(201).json(newQuestionnaire);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Retrieve all questionnaires (summary)
app.get("/questionnaires", async (req, res) => {
  const allQuestionnaires = await Questionnaires.getAllQuestionnaires();
  res.json(allQuestionnaires);
});

// Retrieve a specific questionnaire (full details)
app.get("/questionnaires/:questionnaireId", async (req, res) => {
  const questionnaire = await Questionnaires.getQuestionnaire(parseInt(req.params.questionnaireId));
  if (!questionnaire) {
    res.status(404).json({ error: "Questionnaire not found." });
    return;
  }
  res.json(questionnaire);
});

// Submit answers for a specific questionnaire
app.post("/questionnaires/:questionnaireId/answers", async (req, res) => {
  const questionnaireId = req.params.questionnaireId;
  const { studentId, answers } = req.body;
  try {
    const submission = await Questionnaires.submitAnswers(parseInt(questionnaireId), studentId, answers);
    res.status(201).json(submission);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Generate groups of students based on answers to a questionnaire
app.get("/questionnaires/:questionnaireId/generate-groups", async (req, res) => {
  const questionnaireId = parseInt(req.params.questionnaireId);
  const groupSize = parseInt(req.query.groupSize as string) || 2;
  try {
    const groups = await StudentGroups.generateAndStoreGroups(questionnaireId, groupSize);
    res.json({ groups });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
