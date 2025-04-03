import app from 'express';
import fs from 'fs';
export const router = app.Router();
// import Validation from '../../services/validation/validation.js';
import { validation } from '../../../index.js';
router.get('/', (req, res) => {
	res.json({ message: 'Hello World' });
});

router.get('/:id', (req, res) => {
	const token = validation.getToken();
	console.log(token);
	const date = new Date().getTime();
	fs.readFile('./src/db/token.json', 'utf-8', (err, data) => {
		const response = JSON.parse(data);
		console.log(date);
		console.log(response.iSet['expires-in']);
		if (date > response.iSet['expires-in']) {
			console.log('Precisa gerar outro TOKEN');
		}
		if (err) return console.log(err);
		res.json(JSON.parse(data));
	});
});
