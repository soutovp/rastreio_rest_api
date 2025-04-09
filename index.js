import express from 'express';
import env from 'dotenv';
env.config();
import cors from 'cors';
import { router as orders } from './src/routes/orders/index.js';
import Validation from './src/services/validation/validation.js';
export const app = express();
export const validation = new Validation({ user: process.env.ISET_ACCESS_USER, pass: process.env.ISET_ACCESS_KEY });
validation.getSavedData();
app.use(express.json());
app.use(cors());
app.use('/orders', orders);

app.get('/', async (req, res) => {
	const token = await validation.authenticate();
	if (typeof token === 'object') return res.send(token.message);
	console.log(`GET		| Token é: ${token}`);
	res.json({ token: token });
});
// app.post('/pedidos', async (req, res) => {
// 	const bodyData = req.body;
// 	if (typeof bodyData === 'undefined') res.send(JSON.stringify({ status: 403, message: 'Body is missing on the request.\n undefined' }));
// 	// res.json(bodyData);
// 	const validationResponse = await validation.validate();
// 	console.log('PEDIDOS | Token é: ', validationResponse.token);
// 	if (validationResponse.error) response.json({ error: validationResponse.error });
// 	await fetch('https://www.nortondistribuidora.com.br/ws/v1/order/list', {
// 		method: 'POST',
// 		mode: 'cors',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'access-token': validationResponse.token,
// 		},
// 		body: JSON.stringify(bodyData),
// 	})
// 		.then((resp) => {
// 			console.log('--- RESPONSE ---');
// 			console.log(response);
// 			return resp.json();
// 		})
// 		.then((data) => {
// 			console.log('--- DATA ---');
// 			console.log(data);
// 			if (data === undefined) return res.json({ message: 'No data...' });
// 			if (data.status === 403 && data.reason === 'Forbidden') return { status: 403, message: data.message };
// 			res.json(JSON.stringify({ status: 200, data: data.orders }));
// 		});
// });

app.listen(process.env.PORT, () => {
	console.log(`Servidor rodando na porta ${process.env.PORT}`);
});
