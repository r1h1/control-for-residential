//ROUTES
const globalApiGetModulesPerRol = 'https://api-residenciales-cerro-alto.onrender.com/api/v1/modules/rol/';
const globalApiUsers = 'https://api-residenciales-cerro-alto.onrender.com/api/v1/users/';


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


//SET USER INFORMATION IN FIELDS
const setUserInfo = () => {
    document.getElementById('fullname').value = userInformation[0].fullname;
    document.getElementById('address').value = userInformation[0].address;
    document.getElementById('phonenumber').value = userInformation[0].phonenumber;
    document.getElementById('email').value = userInformation[0].email;
    document.getElementById('nit').value = userInformation[0].nit;
}
setUserInfo();



//EDIT USER INFO
const editUserInfo = () => {

    let fullname = document.getElementById('fullname').value;
    let address = document.getElementById('address').value;
    let phonenumber = document.getElementById('phonenumber').value;
    let email = document.getElementById('email').value;
    let nit = document.getElementById('nit').value;

    if (fullname === '' || address === '' || phonenumber === '' || email === '' || nit === '') {
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

        var bodyToDelete = JSON.stringify({
            "id": userInformation[0].id,
            "fullname": fullname,
            "address": address,
            "phonenumber": phonenumber,
            "email": email,
            "nit": nit,
            "idrol": userInformation[0].idrol,
            "idhouse": userInformation[0].idhouse,
            "status": 1,
            "gender": userInformation[0].gender
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: bodyToDelete,
            redirect: 'follow'
        };

        fetch(globalApiUsers, requestOptions)
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
                                closeSession();
                            } else if (result.isDenied) {
                                closeSession();
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
    }
}


//CHANGE PASSWORD
const changePassword = () => {

    let password = document.getElementById('password').value;
    let newpassword = document.getElementById('newpassword').value;

    if (password === '' || newpassword === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Llena todos los datos que se te solicitan',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else if (password != newpassword || newpassword != password) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Las contraseñas no coinciden, intenta nuevamente',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else {

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        var bodyToDelete = JSON.stringify({
            "id": userInformation[0].id,
            "fullname": userInformation[0].fullname,
            "address": userInformation[0].address,
            "phonenumber": userInformation[0].phonenumber,
            "email": userInformation[0].email,
            "nit": userInformation[0].nit,
            "idrol": userInformation[0].idrol,
            "idhouse": userInformation[0].idhouse,
            "status": 1,
            "gender": userInformation[0].gender,
            "user": userInformation[0].email,
            'password': newpassword
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: bodyToDelete,
            redirect: 'follow'
        };

        fetch(globalApiUsers, requestOptions)
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
                                closeSession();
                            } else if (result.isDenied) {
                                closeSession();
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
    }
}