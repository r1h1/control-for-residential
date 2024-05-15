const express = require('express');
const router = express.Router();
const security = require('./security');
const responses = require('../../network/responses');
const controller = require('./index');

//RUTAS PARA CONSULTAR
router.get('/', security(), completeUserPaymentInformation);
router.get('/:id', security(), oneData);
router.get('/onlyuser/:id', security(), completeOnlyUserPaymentInformation);
router.get('/dates/:startDate/:finishDate', security(), paymentsWithDates);
router.post('/', addData);
router.put('/', security(), deleteData);


//CONSULTAR TODOS LOS ÍTEMS
async function completeUserPaymentInformation(req, res, next) {
    try {
        const items = await controller.completeUserPaymentInformation().then((items) => {
            responses.success(req, res, items, 200);
        });
    }
    catch (err) {
        next(err);
    }
};

//CONSULTAR ÍTEMS POR USUARIO
async function completeOnlyUserPaymentInformation(req, res, next) {
    try {
        const items = await controller.completeOnlyUserPaymentInformation(req.params.id).then((items) => {
            responses.success(req, res, items, 200);
        });
    }
    catch (err) {
        next(err);
    }
};


//CONSULTAR UN SOLO ÍTEM
async function oneData(req, res, next) {
    try {
        const items = await controller.oneData(req.params.id).then((items) => {
            responses.success(req, res, items, 200);
        });
    }
    catch (err) {
        next(err);
    }
};


//CONSULTAR ÍTEMS POR FECHAS
async function paymentsWithDates(req, res, next) {
    try {
        const items = await controller.paymentsWithDates(req.params.startDate, req.params.finishDate).then((items) => {
            responses.success(req, res, items, 200);
        });
    }
    catch (err) {
        next(err);
    }
};


//CREAR UN NUEVO ITEM
async function addData(req, res, next) {
    try {
        const items = await controller.addData(req.body);
        if (req.body.id == 0) {
            message = 'Created OK';
        }
        else {
            message = 'Updated OK';
        }
        responses.success(req, res, items, 201);
    }
    catch (err) {
        next(err);
    }
};

//ELIMINAR ITEM
async function deleteData(req, res, next) {
    try {
        const items = await controller.deleteData(req.body).then((items) => {
            responses.success(req, res, 'Dropped OK', 200);
        });
    }
    catch (err) {
        next(err);
    }
};


//EXPORTA LOS DATOS
module.exports = router;