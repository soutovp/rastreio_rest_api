import express from 'express';
import env from 'dotenv';
env.config();
import cors from 'cors';
import { router as ordersRouter } from './src/routes/orders/index.js';
import Validation from './src/services/validation/validation.js';
import DB from './src/db/BD.js';
export const app = express();
export const db = new DB();
export const validation = new Validation({ user: process.env.ISET_ACCESS_USER, pass: process.env.ISET_ACCESS_KEY });
import Orders from './src/models/Orders/Orders.js';
export const orders = new Orders();
validation.getSavedData();
setInterval(async () => {
	await orders.update();
}, 60000);
await orders.update();
db.saveData(orders.list);

app.use(express.json());
app.use(cors());
app.use('/orders', ordersRouter);

app.get('/', async (req, res) => {
	const token = await validation.authenticate();
	if (typeof token === 'object') return res.send(token.message);
	console.log(`GET		| Token é: ${token}`);
	res.json({ token: token });
});

app.listen(process.env.PORT, () => {
	console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
