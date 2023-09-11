const dataTable = 'userspayments';
const auth = require('../auth');

module.exports = function (dbInjected) {

    let db = dbInjected;

    if (!db) {
        db = require("../../db/mysql");
    }

    //VER TODOS LOS DATOS
    const completeUserPaymentInformation = (table) => {
        return db.completeUserPaymentInformation(dataTable)
    }

    //VER TODOS LOS DATOS POR USUARIO
    const completeOnlyUserPaymentInformation = (id) => {
        return db.completeOnlyUserPaymentInformation(dataTable, id)
    }

    //VER UN DATO
    const oneData = (id) => {
        return db.oneData(dataTable, id);
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
        completeUserPaymentInformation,
        oneData,
        deleteData,
        addData,
        completeOnlyUserPaymentInformation
    }
}