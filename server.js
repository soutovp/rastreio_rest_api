import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import session from 'express-session';
import fsStore from 'session-file-store';
const FileStore = fsStore(session);

let filestoreOptions = {};

export default class Server {
	constructor(port) {
		this.app = express();
		this.port = port;
		this.inicializador();
	}

	inicializador() {
		this.app.use(helmet());
		this.app.use(cors());
		this.app.set('trust proxy', 1);
		this.app.use(
			session({
				store: new FileStore(filestoreOptions),
				secret: 'nrt-dist secret',
				resave: true,
				saveUninitialized: true,
			})
		);
		this.app.use(express.json());
		this.getters();
		this.app.listen(this.port, () => {
			console.log(`Server listenning to http://127.0.0.1:${this.port}/`);
		});
		this.app.use((req, res, next) => {
			const expiryDate = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
			if (req.session.views) {
				req.session.views++;
				req.session.cookie.expires = expiryDate;
				res.setHeader('Content-Type', 'text/html');
				next();
				res.end();
			} else {
				res.redirect('/');
			}
		});
	}
	getters() {
		this.app.get('/', (req, res) => {
			res.send('Hello World');
		});
	}
}
