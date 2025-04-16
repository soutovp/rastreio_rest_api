import crypto from 'crypto';
export default function code() {
	let uuid = crypto.randomUUID();
	let code = uuid.replaceAll('-', '');
	code = code.slice(0, 6);
	return `NRT-${code.toUpperCase()}`;
}
