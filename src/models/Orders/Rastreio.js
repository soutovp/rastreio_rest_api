import code from '../../services/track/code.js';
import validateCNPJ from '../../services/validacao/cnpj.js';
import validateCPF from '../../services/validacao/cpf.js';
export default class Rastreio {
	constructor({ idIset, client, status, obs = '' }) {
		validateCNPJ(client.cnpj);
		validateCPF(client.cpf);
		this.code = code();
		this._date = new Date();
		this.idIset = idIset;
		this.client = {
			name: client.name,
			cnpj: client.cnpj,
			whatsapp: client.whatsapp ? client.whatsapp : false,
		};
		this.status = status;
		this.obs = obs;
	}
	get date() {
		return `${this._date.getDate().toString().padStart(2, '0')}/${(this._date.getDay() + 1).toString().padStart(2, '0')}/${this._date.getFullYear()} ${this._date.getHours()}:${this._date.getMinutes()}`;
	}
	get getRastreio() {
		return {
			code: this.code,
			date: this._date,
			idIset: this.idIset,
			client: this.client,
			status: this.status,
			obs: this.obs,
		};
	}
}
