import fs from 'fs';
const _key = Symbol();
// const _token = Symbol('token');
// const _expires_in = Symbol('expires_in');
export default class Validation {
	constructor(key) {
		this[_key] = `Basic ${btoa(`${key.user}:${key.pass}`)}`;
		this._token = '';
		this._expires_in = '';
	}
	get token() {
		return this._token;
	}
	set token(value) {
		this._token = value;
	}
	get expires_in() {
		return this._expires_in;
	}
	set expires_in(value) {
		this._expires_in = value;
	}
	getTodaysDate() {
		return parseInt(new Date().getTime() / 1000);
	}
	getSavedData() {
		return new Promise((resolve, reject) => {
			fs.readFile(
				'./src/db/token.json',
				'utf-8',
				function (err, data) {
					if (err) console.log(`Erro: ${err}`);
					if (data) {
						const parsedData = JSON.parse(data);
						this.token = parsedData.token;
						this.expires_in = parsedData.expires_in;
						resolve();
					} else {
						reject({ status: 403, message: 'Não há dados salvos de acesso.\nPor favor solicite um novo Token de acesso!' });
					}
				}.bind(this)
			);
		});
	}
	saveDataDB(data) {
		if (typeof objetosDados !== 'object') {
			console.log(`DB		| Salvando dados no Banco de Dados`);
			fs.writeFile('./src/db/token.json', JSON.stringify(data), (err) => {
				console.error(err);
			});
		} else {
			console.log(`DB		| Salvando dados no Banco de Dados`);
			fs.writeFile('./src/db/token.json', data, (err) => {
				console.error(err);
			});
		}
	}
	authenticate = async function () {
		await this.getSavedData();
		if (this.expires_in < this.getTodaysDate()) {
			console.log(`Authentication	| Token is expired, getting a new one.`);
			return fetch('https://www.nortondistribuidora.com.br/ws/v1/oauth', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: this[_key],
				},
			})
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					if (data.status === 200) {
						console.log(data);
						this.saveDataDB(data);
						return data.token;
					}
					if (data.status === 403) return this.token;
					return this.token;
				})
				.catch((error) => error);
		} else {
			console.log(`Authentication	| Token is valid.`);
			return this.token;
		}
	};
}
