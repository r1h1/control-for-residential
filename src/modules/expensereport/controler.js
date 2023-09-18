const dataTable = 'administrationpayments';
const auth = require('../auth');

module.exports = function (dbInjected) {

    let db = dbInjected;

    if (!db) {
        db = require("../../db/mysql");
    }

    //VER TODOS LOS DATOS
    const data = (table) => {
        return db.data(dataTable)
    }

    //VER UN DATO
    const oneData = (id) => {
        return db.oneData(dataTable, id);
    }

    //VER DATOS POR FECHAS
    const paymentsWithDates = (startDate, finishDate) => {
        return db.paymentsWithDates(dataTable, startDate, finishDate);
    }

    //AÑADIR DATOS
    const addData = (body) => {
        return db.addData(dataTable, body);
    }

    //BORRAR DATOS
    const deleteData = (body) => {
        return db.deleteData(dataTable, body);
    }

    return {
        data,
        oneData,
        deleteData,
        addData,
        paymentsWithDates
    }
}