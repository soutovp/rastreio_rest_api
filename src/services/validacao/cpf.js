export default function validateCPF(cpf) {
	if (typeof cpf !== 'string') throw new Error('CPF não é uma string');
	let newCpf = cpf.replace(/\D+/g, '');
	if (newCpf.length !== 11) throw new Error('CPF não possui 11 digitos');
	if (cpf.charAt(0).repeat(11) === cpf) throw new Error('CPF não é válido');
	console.log(gerarNovoCpf(newCpf));
	// if (gerarNovoCpf(newCpf) !== newCpf) throw new Error('CPF não é válido');
	return;
}
function gerarNovoCpf(cpf) {
	console.log('cpf sem digitos', cpf);
	const digito1 = geraDigito(cpf);
	const digito2 = geraDigito(cpf + digito1);
	return cpf + digito1 + digito2;
}
function geraDigito(cpfSemDigitos) {
	// console.log(cpfSemDigitos);
	let total = 0;
	let reverso = cpfSemDigitos.length + 1;

	for (let stringNumerica of cpfSemDigitos) {
		total += reverso * Number(stringNumerica);
		reverso--;
	}

	const digito = 11 - (total % 11);
	console.log(digito);
	return digito <= 9 ? String(digito) : '0';
}
