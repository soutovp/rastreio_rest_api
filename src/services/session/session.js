export default function session(req, res, next) {
	if (req.session) {
		console.log(req.session);
		next();
	} else {
		res.send('Must be logged-in');
	}
}
