import fs from 'fs';
const _key = Symbol();
export default class Validation {
	constructor(key) {
		this[_key] = `Basic ${btoa(`${key.user}:${key.pass}`)}`;
		this._token = '';
		this._expires_in = '';
		this.authenticate();
		setInterval(() => this.authenticate(), 60000);
	}
	get token() {
		return this._token;
	}
	get expires_in() {
		return this._expires_in;
	}
	getTodaysDate() {
		return parseInt(new Date().getTime() / 1000);
	}
	db_updateVariables() {
		console.log('Atualizando variáveis de Validation');
		return new Promise((resolve, reject) => {
			fs.readFile(
				'./src/db/token.json',
				'utf-8',
				function (err, data) {
					if (err) reject({ status: 403, message: err.message });
					if (data) {
						const parsedData = JSON.parse(data);
						if (parsedData.status === 403) resolve({ status: 200, message: parsedData.message });
						this._token = parsedData.token;
						this._expires_in = parsedData.expires_in;
						resolve({ status: 200, message: 'OK' });
					} else {
						reject({ status: 403, message: 'Não há dados salvos de acesso.\nPor favor solicite um novo Token de acesso!' });
					}
				}.bind(this)
			);
		});
	}
	db_save(data) {
		return new Promise((resolve, reject) => {
			if (typeof data === 'object') fs.writeFile('./src/db/token.json', JSON.stringify(data), (err) => reject(err));
			if (typeof data === 'string') fs.writeFile('./src/db/token.json', data, (err) => reject(err));
			this.db_updateVariables();
			resolve();
		});
	}
	async authenticate() {
		await this.db_updateVariables();
		if (this.expires_in < this.getTodaysDate()) {
			return await fetch('https://www.nortondistribuidora.com.br/ws/v1/oauth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: this[_key],
				},
			})
				.then((response) => {
					if (response.status === 403) console.error(response.statusText);
					return response.json();
				})
				.then((data) => {
					if (data.status === 403) return console.log(data);
					if (data.status === 200) {
						console.log(data);
						this.db_save(data);
						this.db_updateVariables();
						return data.token;
					}
					if (data.status === 403) return this.token;
					if (data.status !== 200 && data.status !== 403) console.log(data);
				})
				.catch((error) => error);
		} else {
			return this.token;
		}
	}
}
