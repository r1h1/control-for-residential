-- CREACION Y USO DE BASE DE DATOS
CREATE DATABASE plutondb;

USE plutondb;

-- CREACION DE TABLA ROL
CREATE TABLE rol (
    id INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(50) NOT NULL
);

INSERT INTO
    `rol`(`id`, `name`)
VALUES
    (1, 'Super Administrador');

INSERT INTO
    `rol`(`id`, `name`)
VALUES
    (2, 'Administrador');

INSERT INTO
    `rol`(`id`, `name`)
VALUES
    (3, 'Cliente');

INSERT INTO
    `rol`(`id`, `name`)
VALUES
    (4, 'Cocinero');

INSERT INTO
    `rol`(`id`, `name`)
VALUES
    (5, 'Contabilidad');

-- CREACION DE TABLA MÓDULOS
CREATE TABLE modules (
    id INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(50) NOT NULL,
    route VARCHAR(500) NOT NULL,
    idrol INT,
    FOREIGN KEY (idrol) REFERENCES rol(id)
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

-- CREACION DE MENSAJES
CREATE TABLE messages (
    id INT PRIMARY KEY NOT NULL auto_increment,
    idusersend int,
    context VARCHAR(100),
    description VARCHAR(250),
    createdate VARCHAR(50),
    FOREIGN KEY (idusersend) REFERENCES users(id)
);

-- TIPOS DE PAGO AUTORIZADOS
CREATE TABLE typeofpayment(
    id INT PRIMARY KEY NOT NULL auto_increment,
    name VARCHAR(100)
);

-- REPORTE DE PAGOS USUARIOS
CREATE TABLE userspayments(
    id INT PRIMARY KEY NOT NULL auto_increment,
    iduserpay INT,
    idpaymentcontext INT,
    paymentmethod INT,
    filepayment TEXT,
    authorizationcode VARCHAR(50),
    totalpay NUMERIC(10,2),
    comment VARCHAR(250),
    createddate VARCHAR(50),
    paymentdateandhour VARCHAR(50),
    FOREIGN KEY (iduserpay) REFERENCES users(id),
    FOREIGN KEY (idpaymentcontext) REFERENCES typeofpayment(id)
);

-- REPORTE DE GASTOS ADMINSITRATIVOS
CREATE TABLE administrationpayments(
    id INT PRIMARY KEY NOT NULL auto_increment,
    idadminpay INT,
    paymentmethod INT,
    totalpay NUMERIC(10,2),
    comment VARCHAR(250),
    createddate VARCHAR(50),
    paymentdateandhour VARCHAR(50),
    FOREIGN KEY (idadminpay) REFERENCES users(id)
);