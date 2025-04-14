import express from 'express';
import cors from 'cors';

export default class Server {
	constructor(port) {
		this.app = express();
		this.port = port;
		this.inicializador();
	}

	inicializador() {
		this.app.use(cors());
		this.app.use(express.json());
		this.getters();
		this.app.listen(this.port, () => {
			console.log(`Server listenning to http://127.0.0.1:${this.port}/`);
		});
	}
	getters() {
		this.app.get('/', (req, res) => {
			res.send('Hello World');
		});
	}
}
