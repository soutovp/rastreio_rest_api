import app from 'express';
export const router = app.Router();
import { db, validation } from '../../services/start/inicialization.js';
router.get('/', async (req, res) => {
	console.log('ORDERS		| Sending list to the client..');
	res.json(db.orders);
});
router.post('/query', async (req, res) => {
	const bodyData = req.body;
	if (typeof bodyData === 'undefined') res.send(JSON.stringify({ status: 403, message: 'Body is missing on the request.\n undefined' }));
	console.log(bodyData);
	const validationResponse = await validation.authenticate();
	if (validationResponse.error) response.json({ error: validationResponse.error });
	await fetch('https://www.nortondistribuidora.com.br/ws/v1/order/list', {
		method: 'POST',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			'access-token': validationResponse,
		},
		body: JSON.stringify(bodyData),
	})
		.then((resp) => {
			return resp.json();
		})
		.then((data) => {
			console.log('PEDIDOS	| ENVIANDO DADOS PARA A REQUISIÇÃO.');
			console.log(data);
			if (data === undefined) return res.json({ message: 'No data...' });
			if (data.status === 403 && data.reason === 'Forbidden') return { status: 403, message: data.message };
			res.json(JSON.stringify({ status: 200, data: data.orders }));
		});
});
router.get('/:id', async (req, res) => {
	await validation.validate();
	res.json({ message: validation.token });
});
