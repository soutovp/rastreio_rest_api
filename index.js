import express, { json } from 'express';
import env from 'dotenv';
env.config();
const app = express();

app.listen(process.env.PORT, () => {
	console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
