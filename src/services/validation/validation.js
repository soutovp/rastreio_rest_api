import fs from 'fs';
import request from 'request';
const key = process.env.ISET_ACCESS_KEY;
export default function Validation(key) {
	/**
	 * Crie uma validação sempre que for acessar alguma rota.
	 * É necessário se passar uma chave de acesso da iSet para acessar as rotas que precisam ser validadas.
	 */
	const _key = `Basic ${btoa(`${process.env.ISET_ACCESS_USER}:${process.env.ISET_ACCESS_KEY}`)}`;

	this.getToken = function () {
		console.log('Acessando validação ==============');
		fs.readFile('./src/db/token.json', 'utf-8', (err, data) => {
			console.log('reading file...');
			if (err) console.log(err);
			const _data = JSON.parse(data);
			console.log(`Expires in é: ${_data.iSet['expires_in']}`);
			if (_data.iSet['expires_in'] < new Date().getMilliseconds()) {
				console.log('Token expirou, solicitando um novo token...');
				fetch('https://www.nortondistribuidora.com.br/ws/v1/oauth', {
					method: 'POST',
					headers: {
						Authorization: _key,
					},
				})
					.then((res) => {
						return res.json();
					})
					.then((dataa) => {
						console.log(JSON.stringify(dataa));
						const newData = {
							iSet: {
								token: dataa.token,
								expires_in: dataa.expires_in,
							},
						};
						fs.writeFileSync('./src/db/token.json', newData);
					});
			} else {
				console.log(_data.iSet['token']);
			}
		});
	}.bind(this);
}
