//REQUERIDOS PARA EL FUNCIONAMIENTO DEL PROYECTO
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const auth = require('./modules/auth/routes.js');
const houses = require('./modules/houses/routes.js');
const messages = require('./modules/messages/routes.js');
const modules = require('./modules/modules/routes.js');
const rol = require('./modules/rol/routes.js');
const expensereport = require('./modules/expensereport/routes.js');
const users = require('./modules/users/routes.js');
const userspayments = require('./modules/userspayments/routes.js');
const morgan = require('morgan');
const { error } = require('./network/responses');
const errors = require('./network/errors');
const app = express();

//MIDDLEWARE
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

//ROUTERS
app.set('port', config.app.port);
app.use('/api/v1/auth', auth);
app.use('/api/v1/houses', houses);
app.use('/api/v1/messages', messages);
app.use('/api/v1/modules', modules);
app.use('/api/v1/rol', rol);
app.use('/api/v1/expensereport', expensereport);
app.use('/api/v1/users', users);
app.use('/api/v1/userspayments', userspayments);

app.use(errors);

module.exports = app;