import fs from 'fs'; // FILESYSTEM ENTREGA DADOS STRINGFIED. NEED TO BE PARSED TO JSON.
export default function Validation(key) {
	/**
	 * Crie uma validação sempre que for acessar alguma rota.
	 * É necessário se passar uma chave de acesso da iSet para acessar as rotas que precisam ser validadas.
	 */
	const _key = `Basic ${btoa(`${process.env.ISET_ACCESS_USER}:${process.env.ISET_ACCESS_KEY}`)}`;
	const salvarDadosMemoria = function () {
		fs.readFile(
			'./src/db/token.json',
			'utf-8',
			function (err, data) {
				if (err) console.log(`Erro: ${err}`);
				if (data) {
					const parsedData = JSON.parse(data);
					const token = parsedData.iSet.token;
					const expires_in = parsedData.iSet.expires_in;

					if (token) this.token = token;
					if (expires_in) this.expires_in = expires_in;
				} else {
					console.log('Não há dados saldos de acesso.\nPor favor solicite um novo Token de acesso!');
					return;
				}
			}.bind(this)
		);
	}.bind(this);

	const salvarDadosBD = function (objetoDados) {
		if (typeof objetoDados !== 'string') {
			console.log('Salvando no BD');
			console.log(JSON.stringify(objetoDados));
			fs.writeFile('./src/db/token.json', JSON.stringify(objetoDados), (err) => {
				console.log(err);
			});
		} else {
			console.log('Salvando no BD');
			console.log(objetoDados);
			fs.writeFile('./src/db/token.json', objetoDados, (err) => {
				console.log(err);
			});
		}
	};
	this.teste = function () {
		salvarDadosBD({
			iSet: {
				token: '18a3d7ee1717c094e37297c39ab5bedfedc1cc51c73fc1ebfa099f19',
				expires_in: 1743797106,
				teste: 'teste',
			},
		});
	};
	this.token = '';
	this.expires_in = '';
	this.getDate = function () {
		return (new Date().getTime() / 1000).toFixed(0);
	};
	this.validate = async function () {
		console.log('Acessando validação ==============');
		if (this.expires_in < this.getDate()) {
			console.log('Será emitido um novo token...');
			console.log(`Atual: ${this.expires_in}`);
			console.log(`Antigo: ${this.getDate()}`);
			fetch('https://www.nortondistribuidora.com.br/ws/v1/oauth', {
				method: 'POST',
				headers: {
					Authorization: _key,
				},
			})
				.then((res) => {
					return res.json();
				})
				.then((data) => {
					let _token = data.iSet.token ? data.iSet.token : 'N/A';
					let _expires_in = data.iSet.expires_in ? data.iSet.expires_in : 'N/A';
					const newData = {
						iSet: {
							token: _token,
							expires_in: _expires_in,
						},
					};
					console.log(newData);
					salvarDadosBD(newData);
					const inf = JSON.stringify(newData.iSet.token);
					console.log('Token finalizado ============\n', inf);
				})
				.catch((err) => {
					console.log(err);
				});
		} else {
			console.log('O token ainda é válido...');
		}
	};
	salvarDadosMemoria();
}
