module.exports = getMailOptions = (to, subject, message) => {
	return {
		from: 'simplyapp1@gmail.com',
		to,
		subject,
		html: message,
	};
};