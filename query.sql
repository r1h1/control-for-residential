-- CREACION Y USO DE BASE DE DATOS
CREATE DATABASE plutondb;

USE plutondb;

-- CREACION DE TABLA ROL
CREATE TABLE rol (
    id INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(50) NOT NULL
);

INSERT INTO `rol` (`id`, `name`) VALUES
(1, 'Super Administrador'),
(2, 'Administrador'),
(3, 'Residente');

-- CREACION DE TABLA MÓDULOS
CREATE TABLE modules (
    id INT PRIMARY KEY NOT NULL auto_increment,
    menu TEXT NOT NULL,
    idrol INT NOT NULL,
    FOREIGN KEY (idrol) REFERENCES rol(id)
);

-- INSERTADO DE MENU SEGUN ROL
INSERT INTO
    `modules`(`id`, `menu`, `idrol`)
VALUES
    (
        '',
        '<a class="mdl-navigation__link" href="dashboard.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">
        dashboard</i><span class="mdl-color-text--grey-100">Dashboard</span></a>
        <a class="mdl-navigation__link" href="pay-reported.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">shopping_cart</i>
        <span class="mdl-color-text--grey-100">Reportar pago</span></a>
        <a class="mdl-navigation__link" href="pending-pay-approve.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">payments</i>
        <span class="mdl-color-text--grey-100">Aprobación de pagos</span></a>
        <a class="mdl-navigation__link" href="expense-reported.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">local_offer</i>
        <span class="mdl-color-text--grey-100">Reportar gasto</span></a>
        <a class="mdl-navigation__link" href="view-reports.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">people</i>
        <span class="mdl-color-text--grey-100">Reportes generales</span></a>
        <a class="mdl-navigation__link" href="send-message.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">report</i>
        <span class="mdl-color-text--grey-100">Enviar mensaje general</span></a>
        <a class="mdl-navigation__link" href="view-message.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">forum</i>
        <span class="mdl-color-text--grey-100">Mensajes generales</span></a>
        <a class="mdl-navigation__link" href="users-created.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">person</i>
        <span class="mdl-color-text--grey-100">Creación de usuarios</span></a>
        <a class="mdl-navigation__link" href="house-created.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">house</i>
        <span class="mdl-color-text--grey-100">Creación de casas</span></a>
        <div class="mdl-layout-spacer"></div>',
        1
    );

INSERT INTO
    `modules`(`id`, `menu`, `idrol`)
VALUES
    (
        '[value-1]',
        '<a class="mdl-navigation__link" href="dashboard.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">dashboard</i>
        <span class="mdl-color-text--grey-100">Dashboard</span></a>
        <a class="mdl-navigation__link" href="pending-pay-approve.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">payments</i>
        <span class="mdl-color-text--grey-100">Aprobación de pagos</span></a>
        <a class="mdl-navigation__link" href="pay-reported.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">shopping_cart</i>
        <span class="mdl-color-text--grey-100">Reportar pago</span></a>
        <a class="mdl-navigation__link" href="expense-reported.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">local_offer</i>
        <span class="mdl-color-text--grey-100">Reportar gasto</span></a>
        <a class="mdl-navigation__link" href="view-reports.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">people</i>
        <span class="mdl-color-text--grey-100">Reportes generales</span></a>   
        <a class="mdl-navigation__link" href="send-message.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">report</i>
        <span class="mdl-color-text--grey-100">Enviar mensaje general</span></a>
        <a class="mdl-navigation__link" href="view-message.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">forum</i>
        <span class="mdl-color-text--grey-100">Mensajes generales</span></a>
        <a class="mdl-navigation__link" href="users-created.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">person</i>
        <span class="mdl-color-text--grey-100">Creación de usuarios</span></a>
        <a class="mdl-navigation__link" href="house-created.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">house</i>
        <span class="mdl-color-text--grey-100">Creación de casas</span></a>     
        <div class="mdl-layout-spacer"></div>',
        2
    );

INSERT INTO
    `modules`(`id`, `menu`, `idrol`)
VALUES
    (
        '[value-1]',
        '<a class="mdl-navigation__link" href="dashboard.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">dashboard</i>
        <span class="mdl-color-text--grey-100">Dashboard</span></a>
        <a class="mdl-navigation__link" href="pay-reported.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">shopping_cart</i>
        <span class="mdl-color-text--grey-100">Reportar pago</span></a>
        <a class="mdl-navigation__link" href="view-reports.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">people</i>
        <span class="mdl-color-text--grey-100">Reportes generales</span></a>
        <a class="mdl-navigation__link" href="view-message.html"><i class="mdl-color-text--grey-100 material-icons" role="presentation">forum</i>
        <span class="mdl-color-text--grey-100">Mensajes generales</span></a>
        <div class="mdl-layout-spacer"></div>',
        3
    );

-- CREATE HOUSES
CREATE TABLE houses(
    id INT PRIMARY KEY NOT NULL auto_increment,
    address VARCHAR(250),
    housenumber VARCHAR(20),
    statuspay INT
);

-- CREACION DE TABLA USUARIO
CREATE TABLE users (
    id INT PRIMARY KEY NOT NULL auto_increment,
    fullname VARCHAR(250),
    address VARCHAR(250),
    phonenumber VARCHAR(20),
    email VARCHAR(100),
    nit VARCHAR(50),
    idrol INT,
    idhouse INT,
    status INT,
    gender INT,
    FOREIGN KEY (idrol) REFERENCES rol(id),
    FOREIGN KEY (idhouse) REFERENCES houses(id)
);

-- CREACION DE TABLA AUTENTICACION
CREATE TABLE auth (
    id INT PRIMARY KEY NOT NULL auto_increment,
    user varchar(100),
    password varchar(250)
);

INSERT INTO `auth` (`id`, `user`, `password`) VALUES
(1, 'carriaza@bdg.com.gt', '$2b$05$ZvQya7Q4OXBvrXKZEZdkVe3tJWe42DyO5NmLSLPkRrqmezQvDg1LO'),
(2, 'drivas@bdg.com.gt', '$2b$05$XQA2QoPxQ5h0ws2VLcsry.5LTRirtGecKO/iHfOeYNzTF0cz4sKpO'),
(3, 'A3', '$2b$05$LA9EbYDl2hUGUugWxYxcPud/t9PHVnubaYs3/fVs6TJO6m8yGZn5y');

INSERT INTO `houses` (`id`, `address`, `housenumber`, `statuspay`) VALUES
(1, '4av 6-03', 'A1', 1),
(2, '1-52 Av', 'A2', 0),
(3, 'A3', 'A3', 0);

INSERT INTO `users` (`id`, `fullname`, `address`, `phonenumber`, `email`, `nit`, `idrol`, `idhouse`, `status`, `gender`) VALUES
(1, 'Cristian Arriaza', 'Ciudad', '45024363', 'carriaza@bdg.com.gt', '104223510', 1, 1, 1, 1),
(2, 'Daniel Rivas ', '7ma calle 1-52 ', '45024363', 'drivas@bdg.com.gt', '2623623920101', 3, 3, 1, 1),
(3, 'Cristian Arriaza', '4ta avenida 6-03', '53336654', 'carriazac@bdg.com.gt', '2326623620101', 2, 1, 1, 0);

-- CREACION DE MENSAJES
CREATE TABLE messages (
    id INT PRIMARY KEY NOT NULL auto_increment,
    idusersend int,
    context VARCHAR(100),
    description VARCHAR(250),
    createdate VARCHAR(50),
    FOREIGN KEY (idusersend) REFERENCES users(id)
);

-- REPORTE DE PAGOS USUARIOS
CREATE TABLE userspayments(
    id INT PRIMARY KEY NOT NULL auto_increment,
    iduserpay INT,
    typeofpayment INT,
    paymentmethod INT,
    filepayment TEXT,
    authorizationcode VARCHAR(50),
    totalpay NUMERIC(10, 2),
    comment VARCHAR(250),
    createddate VARCHAR(50),
    paymentdateandhour VARCHAR(50),
    paystatus INT,
    FOREIGN KEY (iduserpay) REFERENCES users(id)
);

-- REPORTE DE GASTOS ADMINSITRATIVOS
CREATE TABLE administrationpayments(
    id INT PRIMARY KEY NOT NULL auto_increment,
    idadminpay INT,
    paymentmethod INT,
    totalpay NUMERIC(10, 2),
    comment VARCHAR(250),
    createddate VARCHAR(50),
    paymentdateandhour VARCHAR(50),
    FOREIGN KEY (idadminpay) REFERENCES users(id)
);