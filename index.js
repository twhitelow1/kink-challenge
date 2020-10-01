const express = require('express');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const path = require('path');
const { stdout } = require('process');
const winston = require('winston');

const PORT = 3000;

const logger = winston.createLogger({
	transports: [new (winston.transports.Console)()],
});

const app = express();

// Static assets.
app.use(express.static(path.join(__dirname, 'public')));

// Logger.
app.use(morgan(':method :url :status :response-time ms', {
	stream: {
		write: message => logger.info(message.trim()),
	},
}));

// Set up URL Encode for form body processing
app.use(express.urlencoded({ extended: false }));

// Configure templating engine.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'njk');
nunjucks.configure(app.get('views'), {
	autoescape: true,
	express: app,
});

app.get('/', (request, response) => {
	const options = { pageTitle: 'Homepage' };
	return response.render('home', options);
});

app.post('/handler', (request, response) => {
	console.log(request.body);
	response.send(request.body);
	app.route('/');
});

app.listen(PORT, () => {
	logger.log({ level: 'info', message: `listening on ${PORT}` });
});
