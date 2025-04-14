import { validation } from '../../services/start/inicialization.js';

const _list = Symbol('list');
export default class Orders {
	constructor() {
		this[_list] = [];
	}
	async update() {
		console.log('ORDERS          | Updating orders...');
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
	get list() {
		return this[_list];
	}
	set orders(orders) {
		this[_list] = [...orders];
	}
}
