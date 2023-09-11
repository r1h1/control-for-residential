//SE REALIZAN CONSTANTES PARA SU RESPECTIVA IMPORTACIÓN
const mysql = require('mysql');
const config = require('../config');

//CONSTANTE DE CONEXIÓN A BASE DE DATOS
const dbConfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
}

//STRING PARA CADENA DE CONEXIÓN
let stringConnection;


//FUNCIÓN PARA CONECTAR Y DETECTAR ERRORES DE CONEXIÓN
const mysqlConnection = () => {
    stringConnection = mysql.createConnection(dbConfig);

    stringConnection.connect((err) => {
        if (err) {
            console.log("Warning!: ", '[db err]', err);
            setTimeout(mysqlConnection, 200);
        }
        else {
            console.log("Welcome, Connect");
        }
    });

    stringConnection.on('Warning!: ', err => {
        console.log('[db err]', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            mysqlConnection();
        }
        else {
            throw err;
        }
    });
}


//ENCENDEMOS LA CONEXIÓN
mysqlConnection();


//PROTOCOLOS PARA MANEJO DE INFORMACIÓN
//DEVOLVER TODOS LOS DATOS
const data = (table) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT DISTINCT * FROM ${table} ORDER BY id DESC`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


//VER USUARIOS CON ROL, CASA Y DEMÁS
const completeUserData = (table) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT users.id, users.fullname, users.address, users.phonenumber, users.email, users.nit, 
        users.idrol, users.idhouse, users.status, users.gender, rol.name AS namerol, 
        CONCAT(houses.housenumber,' ',houses.address) AS housenumber 
        FROM ${table}
        INNER JOIN rol ON users.idrol = rol.id
        INNER JOIN houses ON users.idhouse = houses.id`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


//VER PAGOS DE USUARIO CON TODA LA INFORMACIÓN REQUERIDA
const completeUserPaymentInformation = (table) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT userspayments.id, userspayments.iduserpay, userspayments.typeofpayment, userspayments.paymentmethod, 
        userspayments.filepayment, userspayments.authorizationcode, userspayments.totalpay, userspayments.comment, 
        userspayments.createddate, userspayments.paymentdateandhour, userspayments.paystatus, users.fullname, 
        CONCAT(houses.housenumber, ' ', houses.address) AS housenumber 
        FROM ${table}
        INNER JOIN users ON userspayments.iduserpay = users.id 
        INNER JOIN houses ON users.idhouse = houses.id
        ORDER BY userspayments.paystatus ASC`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


//VER PAGOS DE USUARIO CON TODA LA INFORMACIÓN REQUERIDA SOLAMENTE UN USUARIO
const completeOnlyUserPaymentInformation = (table, id) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT userspayments.id, userspayments.iduserpay, userspayments.typeofpayment, userspayments.paymentmethod, 
        userspayments.filepayment, userspayments.authorizationcode, userspayments.totalpay, userspayments.comment, 
        userspayments.createddate, userspayments.paymentdateandhour, userspayments.paystatus, users.fullname, 
        CONCAT(houses.housenumber, ' ', houses.address) AS housenumber 
        FROM ${table}
        INNER JOIN users ON userspayments.iduserpay = users.id 
        INNER JOIN houses ON users.idhouse = houses.id
        WHERE userspayments.iduserpay=${id}
        ORDER BY userspayments.paystatus ASC`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


//DEVOLVER UN SOLO DATO POR ID
const oneData = (table, id) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT DISTINCT * FROM ${table} WHERE id=${id} ORDER BY id DESC`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


//DEVOLVER DATOS DE MODULOS POR ROL ID
const rolData = (table, idrol) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT * FROM ${table} WHERE idrol=${idrol}`, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}


//INSERTAR UN REGISTRO DE LA BASE DE DATOS
const addData = (table, data) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`INSERT INTO ${table} SET ? ON DUPLICATE KEY UPDATE ?`, [data, data], (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

//BORRAR UN REGISTRO DE LA BASE DE DATOS
const deleteData = (table, data) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`DELETE FROM ${table} WHERE id=?`, data.id, (error, result) => {
            return error ? reject(error) : resolve(result);
        });
    });
}

//CONSULTAR POR QUERY
const query = (table, query) => {
    return new Promise((resolve, reject) => {
        stringConnection.query(`SELECT * FROM ${table} WHERE ? ORDER BY id DESC`, query, (error, result) => {
            return error ? reject(error) : resolve(result[0]);
        });
    });
}

//SE EXPORTAN LOS PROTOCOLOS PARA MANEJO DE INFO
module.exports = {
    completeUserData,
    data,
    oneData,
    addData,
    deleteData,
    query,
    rolData,
    completeUserPaymentInformation,
    completeOnlyUserPaymentInformation
}