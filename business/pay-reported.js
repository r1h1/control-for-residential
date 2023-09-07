//ROUTES
const globalApiGetModulesPerRol = 'http://localhost:3002/api/v1/modules/rol/';
const globalApiGetPaymentReport = 'http://localhost:3002/api/v1/userspayments/';


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
    }
}
menuForUserRol();




//CONVERT FILE CHOOSEN TO BASE64 FOR SAVE IN DB
const convertImgToBase64 = () => {

    const fileInput = document.getElementById('fileInput');

    fileInput.addEventListener("change", e => {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.addEventListener("load", () => {
            let imageRoute = reader.result;
            let sizeImage = file.size;

            if (sizeImage > 70000) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Advertencia',
                    text: 'La imagen supera el peso permitido, comprimala con la herramienta que se muestra abajo, intente de nuevo o seleccione otra imagen para continuar (MAX 70 KB)',
                    footer: '<a href="https://tinyjpg.com/" target="_blank">Presione acá para ser redirigido al compresor de imágenes</a>',
                    confirmButtonText: 'Entendido'
                });
                document.getElementById('base64paymentimage').value = '';
                document.getElementById('fileInput').value = '';
            }
            else {
                document.getElementById('base64paymentimage').value = imageRoute;
            }
        });
        reader.readAsDataURL(file);
    });
}
convertImgToBase64();



//EXPENSE REPORT
const userPaymentReport = () => {

    // Obtener la fecha actual
    const fechaActual = new Date();

    // Obtener el año, mes y día
    const año = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1;
    const dia = fechaActual.getDate();
    const hora = fechaActual.getHours();
    const minutos = fechaActual.getMinutes();
    const segundos = fechaActual.getSeconds();

    let createddate = dia + '-' + mes + '-' + año + ' ,' + hora + ':' + minutos + ':' + segundos;
    let typeofpayment = document.getElementById('paymentmethod').value;
    let paymentmethod = document.getElementById('paymentmethod').value;
    let filepayment = document.getElementById('base64paymentimage').value;
    let authorizationcode = document.getElementById('authorizationcode').value;
    let totalpay = document.getElementById('totalpay').value;
    let comment = document.getElementById('comment').value;
    let paymentdateandhour = document.getElementById('paymentdateandhour').value;

    let err = 'Error Interno';

    if (paymentmethod === '' || totalpay === '' || comment === '' || paymentdateandhour === '' || typeofpayment === '' || authorizationcode === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Llena todos los datos que se te solicitan',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else if (typeofpayment != 1 && filepayment === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'La fotografía no se pudo procesar, sube nuevamente la fotografía',
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
            "iduserpay": userInformation[0].id,
            "typeofpayment": typeofpayment,
            "paymentmethod": paymentmethod,
            "authorizationcode": authorizationcode,
            "totalpay": totalpay,
            "comment": comment,
            "createddate": createddate,
            "paymentdateandhour": paymentdateandhour,
            "paystatus": 0
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(globalApiGetPaymentReport, requestOptions)
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
                        addPhotoInUserPaymentReport(dataObtained.body.insertId);
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



//ADD TRANSFER PHOTO
const addPhotoInUserPaymentReport = (id) => {

    let filepayment = document.getElementById('base64paymentimage').value;
    let err = 'Error Interno';

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    var raw = JSON.stringify({
        "id": id,
        "filepayment": filepayment === '' ? 'NO APLICA' : filepayment
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(globalApiGetPaymentReport, requestOptions)
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
                        text: 'Sa ha generado un error interno, no se pudo subir la fotografía',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
            }
            else {
                Swal.fire({
                    icon: 'error',
                    title: '¡Lo Sentimos!',
                    text: 'Sa ha generado un error interno, no se pudo subir la fotografía',
                    footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                    confirmButtonText: 'Entendido'
                });
            }
        }
    }
}