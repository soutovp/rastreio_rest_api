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
					if (data.status === 403) return this[_token];
					return data;
				})
				.catch((error) => error);
		} else {
			console.log(`Authentication	| Token is valid.`);
			return this.token;
		}
	};
}

// export default function Validation(key) {
// 	/**
// 	 * Crie uma validação sempre que for acessar alguma rota.
// 	 * É necessário se passar uma chave de acesso da iSet para acessar as rotas que precisam ser validadas.
// 	 */
// 	const _key = `Basic ${btoa(`${process.env.ISET_ACCESS_USER}:${process.env.ISET_ACCESS_KEY}`)}`;
// 	const salvarDadosMemoria = function () {
// 		fs.readFile(
// 			'./src/db/token.json',
// 			'utf-8',
// 			function (err, data) {
// 				if (err) console.log(`Erro: ${err}`);
// 				if (data) {
// 					const parsedData = JSON.parse(data);
// 					const token = parsedData.iSet.token;
// 					const expires_in = parsedData.iSet.expires_in;

// 					if (token) this.token = token;
// 					if (expires_in) this.expires_in = expires_in;
// 				} else {
// 					console.log('Não há dados salvos de acesso.\nPor favor solicite um novo Token de acesso!');
// 					return;
// 				}
// 			}.bind(this)
// 		);
// 	}.bind(this);

// 	const salvarDadosBD = function (objetoDados) {
// 		if (typeof objetoDados !== 'string') {
// 			console.log('Salvando no BD');
// 			// console.log(JSON.stringify(objetoDados));
// 			fs.writeFile('./src/db/token.json', JSON.stringify(objetoDados), (err) => {
// 				console.log(err);
// 			});
// 		} else {
// 			console.log('Salvando no BD');
// 			// console.log(objetoDados);
// 			fs.writeFile('./src/db/token.json', objetoDados, (err) => {
// 				console.log(err);
// 			});
// 		}
// 	};
// 	this.token = '';
// 	this.expires_in = '';
// 	this.getDate = function () {
// 		return parseInt(new Date().getTime() / 1000);
// 	};
// 	this.validate = async function () {
// 		return new Promise(async (resolve, reject) => {
// 			console.log('VALIDATE | Acessando validação ==============');
// 			console.log('VALIDATE |', this.expires_in, ` é menor que?`);
// 			console.log('VALIDATE |', this.getDate());
// 			if (this.expires_in < this.getDate()) {
// 				console.log('VALIDATE | Será emitido um novo token...');
// 				fetch('https://www.nortondistribuidora.com.br/ws/v1/oauth', {
// 					method: 'POST',
// 					headers: {
// 						Authorization: _key,
// 					},
// 				})
// 					.then((res) => {
// 						console.log(res);
// 						return res.json();
// 					})
// 					.then((data) => {
// 						if (data.status !== 403) {
// 							let _token = data.token ? data.token : 'N/A';
// 							let _expires_in = data.expires_in ? data.expires_in : 'N/A';
// 							const newData = {
// 								iSet: {
// 									token: _token,
// 									expires_in: _expires_in,
// 								},
// 							};
// 							salvarDadosBD(newData);
// 							const inf = JSON.stringify(newData.iSet.token);
// 							console.log('VALIDATE | Token finalizado ============\n', inf);
// 						}
// 						return resolve({ token: newData.iSet.token, expires_in: newData.iSet.expires_in });
// 					})
// 					.catch((err) => {
// 						return reject({ error: err });
// 					});
// 			} else {
// 				console.log('VALIDATE | O token ainda é válido...');
// 				return resolve({ token: this.token, expires_in: this.expires_in });
// 			}
// 		});
// 	};
// 	salvarDadosMemoria();
// }
