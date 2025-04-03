import express from 'express';
import env from 'dotenv';
import { router as orders } from './src/routes/orders/index.js';
import helmet from 'helmet';
import fs from 'fs';
import Validation from './src/services/validation/validation.js';
env.config();
export const app = express();
// app.use(helmet());

export const validation = new Validation();

app.use('/orders', orders);

app.get('/', (req, res) => {
	fs.readFile('./src/db/token.json', (err, data) => {
		res.writeHead(200, { 'content-type': 'text/html' });
		res.write(data);
		return res.end();
	});
});

app.listen(process.env.PORT, () => {
	console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
