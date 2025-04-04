import app from 'express';
import fs from 'fs';
export const router = app.Router();
import { validation } from '../../../index.js';
router.get('/', (req, res) => {
	res.json({ message: 'Hello World' });
});

router.get('/:id', async (req, res) => {
	await validation.validate();
	res.json({ message: validation.token });
});
