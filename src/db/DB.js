import fs from 'fs';
let _orders = Symbol('orders');
export default class DB {
	constructor() {
		this.key = '';
		this.token = '';
		this[_orders] = {};
	}
	get orders() {
		return this[_orders];
	}
	set orders(ordersArray) {
		return new Promise((resolve, reject) => {
			if (typeof ordersArray !== 'array') reject({ status: 401, message: 'Deve receber uma array de objetos.' });
			if (ordersArray.length <= 0) reject({ status: 401, message: 'A array deve conter pelo menos um item.' });
			let receivedData = ordersArray.reduce((obj, item) => {
				obj[item.orderId] = item;
				return obj;
			}, {});
			fs.readFile('./src/db/orders.json', 'utf-8', async (err, data) => {
				if (err) {
					reject('Falha na leitura do arquivo orders.json', err);
				}
				if (data) {
					let dataBase = JSON.parse(data);
					if (dataBase === receivedData) {
						resolve({ status: 200, message: 'Banco de dados já atualziado.' });
					} else {
						for (let element in receivedData) {
							if (!dataBase[element]) {
								console.log('Adicionado elemento', element);
							}
							if (dataBase[element] !== receivedData[element]) dataBase[element] = receivedData[element];
						}
						this[_orders] = dataBase;
						await this.save.orders(dataBase);
						resolve({ status: 200, message: 'Dados salvos com sucesso!' });
					}
				}
			});
		});
	}
	async getOrders() {
		const date = new Date();
		const yesterday = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${(date.getDate() - 1).toString().padStart(2, '0')}`;
		const today = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
		const autentication = await validation.authenticate();
		let newOrders = await fetch('https://www.nortondistribuidora.com.br/ws/v1/order/list', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'access-token': autentication,
			},
			body: JSON.stringify({
				date: {
					from: yesterday,
					to: today,
				},
				paid: true,
				complete: false,
			}),
		})
			.then((response) => {
				if (response.status === 400) return { status: 400, message: response.statusText };
				if (response.status === 200) return response.json();
				return { status: response.status, message: response.statusText };
			})
			.then((data) => {
				if (data.status === 200) {
					return data.orders;
				}
			});
		this[_list] = newOrders;
		return { status: 200, message: 'ok' };
	}
	saveOrders(data) {
		return new Promise((resolve, reject) => {
			if (typeof data !== 'object') reject({ status: 400, message: 'Need send a object to save data on DB.' });
			this[_orders] = data;
			fs.writeFile('./src/db/orders.json', JSON.stringify(data), (err) => console.log(err));
			resolve({ status: 200, message: 'Dados salvos com sucesso no DB' });
		});
	}
}
export class DB_old {
	constructor() {
		this.token = '';
		this[_orders] = {};
	}
	get orders() {
		return this[_orders];
	}
	set orders(arr) {
		console.log(arr);
		let receivedData = arr.reduce((acc, item) => {
			acc[item.orderId] = item;
			return acc;
		}, {});
		fs.readFile('./src/db/orders.json', 'utf-8', (err, data) => {
			if (err) {
				console.log('DB         | Falha na leitura do arquivo orders.json');
				console.log(err);
			}
			if (data) {
				let dataBase = JSON.parse(data);
				if (dataBase === receivedData) {
					console.log('DB            | Banco de dados atualziado.');
				} else {
					let save = false;
					console.log(receivedData);
					for (let element in receivedData) {
						if (!dataBase[element]) {
							save = true;
							dataBase[element] = receivedData[element];
						}
					}
					this[_orders] = dataBase;
					save ? this.save.orders(dataBase) : '';
				}
			}
		});
		return;
	}

	// saveOrders(data) {
	// 	this[_orders] = data;
	// 	fs.writeFile('./src/db/orders.json', JSON.stringify(data), (err) => console.log(err));
	// 	return { status: 200 };
	// }
}
