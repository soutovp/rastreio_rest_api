import env from 'dotenv';
env.config();
import Server from './server.js';
import DB from './src/db/DB.js';
import Validation from './src/services/validation/validation.js';

export const db = new DB();
export const validation = new Validation({ user: process.env.ISET_ACCESS_USER, pass: process.env.ISET_ACCESS_KEY });
const server = new Server(process.env.PORT);

server.app.get('/token', async (req, res) => {
	console.log('Getting token');
	res.json(validation.token);
});
server.app.get('/galvanotek/:search', async (req, res) => {
	const search = req.params.search;
	// const itens = stringItens.split('\n');

	// let products = [];
	// for (let item of itens) {
	// 	let itemSplited = item.split('|');
	// 	products.push({
	// 		status: 0,
	// 		cod_ref: itemSplited[0],
	// 		name: itemSplited[1],
	// 		price: itemSplited[2],
	// 		quantity: 0,
	// 	});
	// }
	// for (let product of products) {
	// await fetch('https://www.nortondistribuidora.com.br/ws/v1/coupons/insert', {
	// 	method: 'POST',
	// 	headers: {
	// 		'Content-Type': 'application/json',
	// 	},
	// });
	// console.log(product);
	// }
	await fetch('https://www.nortondistribuidora.com.br/ws/v1/product/search', {
		method: 'POST',
		headers: {
			'access-token': validation.token,
		},
		body: JSON.stringify({
			query: search,
			limit: 10,
			img_w: 50,
			img_h: 50,
		}),
	})
		.then((response) => {
			// if (response.status === 400) return console.log(response.statusText);
			if (response.status === 200) return response.json();
			if (response.status === 403) return response.json();

			res.json({ status: response.status, message: response.statusText });
		})
		.then((data) => {
			if (data === undefined) return;
			res.json(data);
		});
});
