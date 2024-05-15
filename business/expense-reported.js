//ROUTES
const globalApiGetModulesPerRol = 'https://api-residenciales-cerro-alto.onrender.com/api/v1/modules/rol/';
const globalApiGetExpenseReport = 'https://api-residenciales-cerro-alto.onrender.com/api/v1/expensereport/';


//VALIDATE EXIST TOKEN IN SESSION STORAGE
const validateToken = () => {

    const token = sessionStorage.getItem('signInToken');
    const userInformation = sessionStorage.getItem('sessionInfo');

    if (token == null || token.length == 0 || token == '') {
        sessionStorage.removeItem('signInToken');
        sessionStorage.removeItem('sessionInfo');
        window.location.href = '../../views/login.html';
    }
    else if (userInformation == null || userInformation.length == 0 || userInformation == '') {
        sessionStorage.removeItem('signInToken');
        sessionStorage.removeItem('sessionInfo');
        window.location.href = '../../views/login.html';
    }
    else {
        console.log('sesión activa');
    }
}
validateToken();



//CLOSE SESSION AND REMOVE SESSION STORAGE ITEMS
const closeSession = () => {
    sessionStorage.removeItem('signInToken');
    sessionStorage.removeItem('sessionInfo');
    window.location.href = '../../views/login.html';
}

//EXECUTE LOOP 1 MINUTE FUNCTION VALIDATE TOKEN
setInterval(validateToken, 60000);


// GLOBAL USER INFORMATION
let userInformation = atob(sessionStorage.getItem('sessionInfo'));
userInformation = JSON.parse(userInformation);


//GET MENU FOR USER ROL
const menuForUserRol = async () => {

    let rol = userInformation[0].idrol;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const showData = (dataObtained) => {
        try {
            let menuModules = '';
            for (let i = 0; i < dataObtained.body.length; i++) {
                menuModules += `
                    ${dataObtained.body[i].menu}
                `;
            }
            document.getElementById('menuModules').innerHTML = menuModules;
        } catch (err) {
            console.log(err);
        }
    }

    try {
        const response = await fetch(globalApiGetModulesPerRol + rol, requestOptions);
        const dataObtained = await response.json();
        showData(dataObtained);
    } catch (error) {
        console.log('Error: ' + error);
        sessionStorage.removeItem('signInToken');
        sessionStorage.removeItem('sessionInfo');
        window.location.href = '../../views/login.html';
    }
}
menuForUserRol();


//EXPENSE REPORT
const expenseReport = () => {

    // Obtener la fecha actual
    const fechaActual = new Date();

    // Obtener el año, mes y día
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1;
    const dia = fechaActual.getDate();

    // Agregar ceros antes del mes y día si son menores a 10
    const mesConCeros = mes < 10 ? '0' + mes : mes;
    const diaConCeros = dia < 10 ? '0' + dia : dia;

    let createddate = año + '-' + mesConCeros + '-' + diaConCeros;
    let paymentdateandhour = document.getElementById('paymentdateandhour').value;
    let comment = document.getElementById('comment').value;
    let totalpay = document.getElementById('totalpay').value;
    let paymentmethod = document.getElementById('paymentmethod').value;

    let err = 'Error Interno';

    if (paymentmethod === '' || totalpay === '' || comment === '' || paymentdateandhour === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Llena todos los datos que se te solicitan',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else {

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        var raw = JSON.stringify({
            "id": 0,
            "idadminpay": userInformation[0].id,
            "paymentmethod": paymentmethod,
            "totalpay": totalpay,
            "comment": comment,
            "createddate": createddate,
            "paymentdateandhour": paymentdateandhour
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(globalApiGetExpenseReport, requestOptions)
            .then(response => response.json())
            .then(dataObtained => showData(dataObtained))
            .catch(error => err = error);

        const showData = (dataObtained) => {
            if (dataObtained.body === 'Error de Servidor') {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'No se pudo concretar la operación, intenta de nuevo',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
            }
            else {
                if (dataObtained.status === 200 || dataObtained.status === 201 || dataObtained.status === 304) {
                    try {
                        Swal.fire({
                            icon: 'success',
                            title: '¡Correcto!',
                            text: 'La operación se completó con éxito',
                            footer: '',
                            showDenyButton: false,
                            showCancelButton: false,
                            confirmButtonText: 'Entendido',
                        }).then((result) => {
                            if (result.isConfirmed) {
                                window.location.reload();
                            } else if (result.isDenied) {
                                window.location.reload();
                            }
                        });
                    }
                    catch (err) {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Lo Sentimos!',
                            text: 'Sa ha generado un error interno',
                            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                            confirmButtonText: 'Entendido'
                        });
                    }
                }
                else {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'Sa ha generado un error interno',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
            }
        }
    }
}


// GET ALL EXPENSED REPORT
const getAllExpensedReport = async () => {

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    const showData = (dataObtained) => {
        try {
            let bodydata = '';
            for (let i = 0; i < dataObtained.body.length; i++) {
                bodydata += `
                    <tr class="text-center">
                        <td>${dataObtained.body[i].createddate}</td>
                        <td>${dataObtained.body[i].paymentmethod === 1 ? 'Efectivo' : dataObtained.body[i].paymentmethod === 2 ? 'Tarjeta' : dataObtained.body[i].paymentmethod === 3 ? 'Transferencia Bancaria' :
                        dataObtained.body[i].paymentmethod === 4 ? 'Crédito' : 'Otro'}</td>
                        <td>${dataObtained.body[i].paymentdateandhour}</td>
                        <td>Q${dataObtained.body[i].totalpay.toFixed(2)}</td>
                        <td>${dataObtained.body[i].comment}</td>
                        <td><button class="btn btn-danger" onclick="deleteExpensedReport(${dataObtained.body[i].id})"><i class="mdl-color-text--gray-100 material-icons"
                                    role="presentation">delete</i></button></td>
                    </tr>
                `;
            }
            document.getElementById('bodydata').innerHTML = bodydata;
        } catch (err) {
            console.log(err);
        }
    }

    try {
        const response = await fetch(globalApiGetExpenseReport, requestOptions);
        const dataObtained = await response.json();
        showData(dataObtained);
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: '¡Lo Sentimos!',
            text: 'Desconexión con el servidor de datos, refresque',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
}
getAllExpensedReport();




//DELETE EXPENSED REPORT
const deleteExpensedReport = (id) => {

    Swal.fire({
        icon: 'info',
        title: '¿Seguro?',
        text: 'Al guardar los cambios estos no podrán ser recuperados',
        showDenyButton: true,
        confirmButtonText: 'Continuar',
        denyButtonText: `Cancelar`,
    }).then((result) => {
        if (result.isConfirmed) {

            let myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

            var bodyToDelete = JSON.stringify({
                "id": id
            });

            var requestOptions = {
                method: 'PUT',
                headers: myHeaders,
                body: bodyToDelete,
                redirect: 'follow'
            };

            fetch(globalApiGetExpenseReport, requestOptions)
                .then(response => response.json())
                .then(dataObtained => showData(dataObtained))
                .catch(error => console.log('Error: ' + error))

            const showData = (dataObtained) => {
                if (dataObtained.body === 'Error de Servidor') {
                    Swal.fire({
                        icon: 'error',
                        title: '¡Lo Sentimos!',
                        text: 'No se pudo concretar la operación, intenta de nuevo',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
                else {
                    if (dataObtained.status === 200 || dataObtained.status === 201 || dataObtained.status === 304) {
                        try {
                            Swal.fire({
                                icon: 'success',
                                title: '¡Correcto!',
                                text: 'La operación se completó con éxito',
                                footer: '',
                                showDenyButton: false,
                                showCancelButton: false,
                                confirmButtonText: 'Entendido',
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    window.location.reload();
                                } else if (result.isDenied) {
                                    window.location.reload();
                                }
                            })
                        }
                        catch (err) {
                            Swal.fire({
                                icon: 'error',
                                title: '¡Lo Sentimos!',
                                text: 'Sa ha generado un error interno',
                                footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                                confirmButtonText: 'Entendido'
                            });
                        }
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: '¡Lo Sentimos!',
                            text: 'Sa ha generado un error interno',
                            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                            confirmButtonText: 'Entendido'
                        });
                    }
                }
            }
        } else if (result.isDenied) {
            Swal.fire({
                position: 'top-center',
                icon: 'info',
                title: '¡No te preocupes!',
                text: 'No se modificó nada',
                showConfirmButton: false,
                timer: 2000
            });
        }
    });
}