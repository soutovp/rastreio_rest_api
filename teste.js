function testeFunc() {
	return new Promise((resolve, reject) => {
		resolve({ status: 200, message: 'Teste message' });
		// reject({ status: 400, message: 'Infelizmente não foi possível testar' });
	});
}

// testeFunc()
// 	.then((response) => {
// 		if (response.status === 200) return console.log(response.message);
// 	})
// 	.catch((e) => console.log(e.message));
try {
	const response = await testeFunc();
	if (response.status === 200) console.log(response.message);
} catch (e) {
	console.log(e);
}
console.log(Date.now() / 1000);
