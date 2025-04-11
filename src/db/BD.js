import fs from 'fs';
let _orders = Symbol('orders');
export default class DB {
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
					save ? this.saveData(dataBase) : '';
				}
			}
		});
		return;
	}
	saveData(data) {
		this[_orders] = data;
		fs.writeFile('./src/db/orders.json', JSON.stringify(data), (err) => console.log(err));
	}
}
