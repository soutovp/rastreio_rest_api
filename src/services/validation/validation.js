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
		return Math.floor(Date.now() / 1000);
		// return parseInt(new Date().getTime() / 1000);
	}
	async db_updateVariables() {
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
						resolve({ status: 200, message: 'Variáveis atualizadas pelo Banco de Dados.' });
					} else {
						reject({ status: 403, message: 'Não há dados salvos de acesso.\nPor favor solicite um novo Token de acesso!' });
					}
				}.bind(this)
			);
		});
	}
	async db_save(data) {
		return new Promise(async (resolve, reject) => {
			if (typeof data === 'object') fs.writeFile('./src/db/token.json', JSON.stringify(data), (err) => reject(err));
			if (typeof data === 'string') fs.writeFile('./src/db/token.json', data, (err) => reject(err));
			try {
				const response = await this.db_updateVariables();
				if (response.status === 200) resolve({ status: 200, message: 'Sucessfull DB Saved' });
			} catch (e) {
				reject(e);
			}
		});
	}
	async authenticate() {
		try {
			const response = await this.db_updateVariables();
			if (response === 200) console.log(response.message);
		} catch (e) {
			console.log(e.message);
			return;
		} finally {
			if (this.expires_in <= this.getTodaysDate()) {
				await fetch('https://www.nortondistribuidora.com.br/ws/v1/oauth', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: this[_key],
					},
				})
					.then((response) => {
						return response.json();
					})
					.then(async (data) => {
						if (data.status === 403) return console.log(data);
						if (data.status === 200) {
							try {
								console.log(data);
								const response = await this.db_save(data);
								if (response.status === 200) console.log(response.message);
							} catch (e) {
								console.log(e.message);
							}
						}
						if (data.status !== 200 && data.status !== 403) console.log(data);
					})
					.catch((error) => console.log(error));
			} else {
				console.log('Token ainda é válido');
			}
		}
	}
}
