export default function validateCNPJ(cnpj) {
	if (typeof cnpj !== 'string') return;
	let _cnpj = cnpj.replace(/\D+/g, '');
	if (_cnpj.length !== 14) return false;
	_cnpj = _cnpj.slice(0, -2);
	_cnpj = _cnpj + adicionarDigito(_cnpj);
	_cnpj = _cnpj + adicionarDigito(_cnpj);
	if (_cnpj !== cnpj) throw new Error('CNPJ é diferente');
	return;
}
function adicionarDigito(cnpj) {
	console.log(cnpj);
	let digitos = cnpj.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
	let total = 0;
	let indice = 0;
	for (let numeroMultiplicador of digitos) {
		total += numeroMultiplicador * Number(cnpj[indice]);
		indice++;
	}
	let resultado = total % 11;
	if (resultado < 2) return 0;
	if (resultado >= 3) return 11 - resultado;
}
