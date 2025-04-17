import env from 'dotenv';
// import axios from 'axios';
env.config();
import Server from './server.js';
// import DB from './src/db/DB.js';
// import Validation from './src/services/validation/validation.js';
// import { stringItens } from './src/services/changeProducts/change.js';
// import Rastreio from './src/models/Orders/Rastreio.js';

// export const db = new DB();
// export const validation = new Validation({ user: process.env.ISET_ACCESS_USER, pass: process.env.ISET_ACCESS_KEY });
const server = new Server(process.env.PORT);
// let newTrack = new Rastreio({
// 	client: {
// 		name: 'Fernando Souto',
// 		cpf: '156.595.587-04',
// 		whatsapp: '5521970769075',
// 	},
// 	idIset: 1326,
// 	status: 'Pedido em Separação',
// });
server.app.get('/track', async (req, res) => {
	let result = db.saveTrack([newTrack.getRastreio]);
	res.json(result);
});

// server.app.get('/token', async (req, res) => {
// 	console.log('Getting token');
// 	res.json(validation.token);
// });

// server.app.get('/search/:sku', async (req, res) => {
// 	const sku = req.params.sku;
// 	const body = {
// 		search: sku,
// 		limit: 10,
// 		offset: 0,
// 	};
// 	console.log(`Tentando consultar SKU:${sku}`);
// 	axios
// 		.post('https://www.nortondistribuidora.com.br/ws/v1/product/search', body, {
// 			headers: {
// 				'access-token': validation.token,
// 			},
// 		})
// 		.then((response) => {
// 			console.log(response);
// 			res.json({});
// 		})
// 		.catch((e) => {
// 			if (e.status === 400) res.json({ status: 400, message: `Requisição falhou com code 400` });
// 			res.send('No data');
// 		});
// 	// await fetch('https://www.nortondistribuidora.com.br/ws/v1/product/search', {
// 	// 	method: 'POST',
// 	// 	headers: {
// 	// 		'access-token': validation.token,
// 	// 	},
// 	// 	body: JSON.stringify(body),
// 	// })
// 	// 	.then((response) => {
// 	// 		if (response.status === 400) return { status: response.status, message: response.statusText };
// 	// 		response.json();
// 	// 	})
// 	// 	.then((data) => {
// 	// 		console.log(data);
// 	// 		if (data.status === 400) console.log(data.message);
// 	// 		res.json(data);
// 	// 	})
// 	// 	.catch((e) => {
// 	// 		console.log(e);
// 	// 	});
// });

// server.app.get('/galvanotek', async (req, res) => {
// 	const itens = stringItens.split('\n');

// 	let products = [];
// 	for (let item of itens) {
// 		let itemSplited = item.split('|');
// 		products.push({
// 			status: 0,
// 			cod_ref: itemSplited[0],
// 			name: itemSplited[1],
// 			price: itemSplited[2],
// 			quantity: 0,
// 		});
// 	}
// 	for (let product of products) {
// 		console.log(product);
// 		await axios({
// 			method: 'post',
// 			url: 'https://www.nortondistribuidora.com.br/ws/v1/product/search',
// 			data: product,
// 		})
// 			.then((data) => {
// 				if (data.response.status === 400) console.log(data.response.message);
// 			})
// 			.catch((e) => {
// 				console.log(e.response.message);
// 			});
// 	}
// 	res.json({ status: 200, message: 'Dados inseridos com sucesso!' });
// });
// server.app.get('/entregas', (req, res) => {
// 	axios({
// 		method: 'get',
// 		url: 'https://www.nortondistribuidora.com.br/ws/v1/shipping/list',
// 		headers: {
// 			'access-token': validation.token,
// 		},
// 	}).then((data) => {
// 		console.log(data);

// 		res.json(data.data);
// 	});
// });
