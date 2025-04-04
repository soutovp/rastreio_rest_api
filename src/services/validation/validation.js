import fs from 'fs';
export default function Validation(key) {
	/**
	 * Crie uma validação sempre que for acessar alguma rota.
	 * É necessário se passar uma chave de acesso da iSet para acessar as rotas que precisam ser validadas.
	 */
	const _key = `Basic ${btoa(`${process.env.ISET_ACCESS_USER}:${process.env.ISET_ACCESS_KEY}`)}`;

	this.validate = async function () {
		console.log('Acessando validação ==============');
		fs.readFile('./src/db/token.json', 'utf-8', (err, data) => {
			if (err) console.log(`Erro: ${err}`);
			if (JSON.parse(data).iSet['expires_in'] < (new Date().getTime() / 1000).toFixed(0)) {
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
						console.log(`Dataa: \n${JSON.stringify(dataa)}`);
						const newData = {
							iSet: {
								token: dataa.token,
								expires_in: dataa.expires_in,
							},
						};
						fs.writeFileSync('./src/db/token.json', JSON.stringify(newData));
						const inf = JSON.stringify(newData.iSet.token);
						console.log('Token finalizado ============\n', inf);
					})
					.catch((err) => {
						console.log(err);
					});
			}
		});
	};
	this.getToken = async function () {
		let token = fs.readFile('./src/db/token.json', 'utf-8', (err, data) => {
			return JSON.parse(data).iSet.token;
		});
		return token;
	};
}
