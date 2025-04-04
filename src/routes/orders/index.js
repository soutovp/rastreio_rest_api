import app from 'express';
import fs from 'fs';
export const router = app.Router();
// import Validation from '../../services/validation/validation.js';
import { validation } from '../../../index.js';
router.get('/', (req, res) => {
	res.json({ message: 'Hello World' });
});

router.get('/:id', async (req, res) => {
	await validation.validate();
	fs.readFile('./src/db/token.json', 'utf-8', (err, data) => {
		const response = JSON.parse(data);
		console.log(response.iSet.expires_in);
		console.log(response.iSet.token);
		res.json(JSON.parse(data));
	});
});
