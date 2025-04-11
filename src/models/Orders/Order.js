export default class Order {
	constructor(order) {
		this.affiliateId = order.affiliateId;
		this.channel = order.channel;
		this.clientIP = order.clientIP;
		this.currency = order.currency;
		this.currencyValue = order.currencyValue;
		this.customer = order.customer;
		this.datePaid = order.datePaid;
		this.datePurchased = order.datePurchased;
		this.lastModified = order.lastModified;
		this.nfe = order.nfe;
		this.note = order.note;
		this.orderId = order.orderId;
		this.orderIsComplete = order.orderIsComplete;
		this.orderTotal = order.orderTOtal;
		this.orderTotalPaid = order.orderTotalPaid;
		this.origin = order.origin;
		this.payment = order.payment;
		this.shipping = order.shipping;
		this.statusDescription = order.statusDescription;
		this.statusId = order.statusId;
	}
}
