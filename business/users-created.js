//ROUTES
const globalApiGetModulesPerRol = 'https://api-residenciales-cerro-alto.onrender.com/api/v1/modules/rol/';
const globalApiGetRols = 'https://api-residenciales-cerro-alto.onrender.com/api/v1/rol/';
const globalApiGetHouses = 'https://api-residenciales-cerro-alto.onrender.com/api/v1/houses/';
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



//GET ROLS
const getRols = async () => {

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
            let rols = '';
            for (let i = 0; i < dataObtained.body.length; i++) {
                // Verifica si el rol es igual a 1 o si es diferente
                if (rol === 1 || dataObtained.body[i].id !== 1) {
                    rols += `
                        <option value="${dataObtained.body[i].id}">${dataObtained.body[i].name}</option>
                    `;
                }
            }
            document.getElementById('rol').innerHTML = rols;
        } catch (error) {
            console.error(error);
        }
    };

    try {
        const response = await fetch(globalApiGetRols, requestOptions);
        const dataObtained = await response.json();
        showData(dataObtained);
    } catch (error) {
        console.log('Error: ' + error);
    }
}
getRols();


//GET HOUSES
const getHouses = async () => {

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
            let houses = '';
            for (let i = 0; i < dataObtained.body.length; i++) {
                houses += `
                        <option value="${dataObtained.body[i].id}">${dataObtained.body[i].address}, ${dataObtained.body[i].housenumber}</option>
                    `;
            }
            document.getElementById('houses').innerHTML = houses;
        } catch (error) {
            console.error(error);
        }
    };

    try {
        const response = await fetch(globalApiGetHouses, requestOptions);
        const dataObtained = await response.json();
        showData(dataObtained);
    } catch (error) {
        console.log('Error: ' + error);
    }
}
getHouses();



//CREATE NEW USER
const createUser = () => {

    let fullname = document.getElementById('fullname').value;
    let address = document.getElementById('address').value;
    let phonenumber = document.getElementById('phonenumber').value;
    let email = document.getElementById('email').value;
    let nit = document.getElementById('nit').value;
    let idrol = document.getElementById('rol').value;
    let idhouse = document.getElementById('houses').value;
    let gender = document.getElementById('gender').value;
    let password = document.getElementById('password').value;
    let err = 'Error Interno';

    if (fullname === '' || phonenumber === '' || address === '' || nit === '' || idrol === '' || idhouse === '' || email === '' || gender === '' || password === '') {
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
            "fullname": fullname,
            "address": address,
            "phonenumber": phonenumber,
            "email": email,
            "nit": nit,
            "idrol": idrol,
            "idhouse": idhouse,
            "status": 1,
            "gender": gender,
            "user": email,
            "password": password
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(globalApiUsers, requestOptions)
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

// GET USERS
const getAllUsers = async () => {

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
                        <td>${dataObtained.body[i].fullname}</td>
                        <td>${dataObtained.body[i].address}</td>
                        <td>${dataObtained.body[i].phonenumber}</td>
                        <td>${dataObtained.body[i].email}</td>
                        <td>${dataObtained.body[i].nit}</td>
                        <td>${dataObtained.body[i].housenumber}</td>
                        <td>${dataObtained.body[i].status === 1 ? 'ACTIVO' : 'INACTIVO'}</td>
                        <td>${dataObtained.body[i].gender === 1 ? 'Masculino' : 'Femenino'}</td>
                        <td><button class="btn btn-danger" title="Inactivar Usuario" onclick="inactiveUser('${dataObtained.body[i].fullname}','${dataObtained.body[i].address}',
                        '${dataObtained.body[i].phonenumber}','${dataObtained.body[i].email}','${dataObtained.body[i].nit}',
                        ${dataObtained.body[i].idrol},${dataObtained.body[i].idhouse},${dataObtained.body[i].gender},
                        ${dataObtained.body[i].id})"><i class="mdl-color-text--gray-100 material-icons"
                                    role="presentation">close</i></button></td>
                        <td><button class="btn btn-success" title="Activar Usuario" onclick="activeUser('${dataObtained.body[i].fullname}','${dataObtained.body[i].address}',
                        '${dataObtained.body[i].phonenumber}','${dataObtained.body[i].email}','${dataObtained.body[i].nit}',
                        ${dataObtained.body[i].idrol},${dataObtained.body[i].idhouse},${dataObtained.body[i].gender},
                        ${dataObtained.body[i].id})"><i class="mdl-color-text--gray-100 material-icons"
                        role="presentation">done</i></button></td>
                    </tr>
                `;
            }
            document.getElementById('bodydata').innerHTML = bodydata;
        } catch (err) {
            console.log(err);
        }
    }

    try {
        const response = await fetch(globalApiUsers, requestOptions);
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
getAllUsers();



//INACTIVE USER
const inactiveUser = (fullname, address, phonenumber, email, nit, idrol, idhouse, gender, id) => {

    Swal.fire({
        icon: 'info',
        title: '¿Deseas inactivar el usuario ' + fullname + '?',
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
                "id": id,
                "fullname": fullname,
                "address": address,
                "phonenumber": phonenumber,
                "email": email,
                "nit": nit,
                "idrol": idrol,
                "idhouse": idhouse,
                "status": 0,
                "gender": gender
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


//ACTIVE USER
const activeUser = (fullname, address, phonenumber, email, nit, idrol, idhouse, gender, id) => {

    Swal.fire({
        icon: 'info',
        title: '¿Deseas activar el usuario ' + fullname + '?',
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
                "id": id,
                "fullname": fullname,
                "address": address,
                "phonenumber": phonenumber,
                "email": email,
                "nit": nit,
                "idrol": idrol,
                "idhouse": idhouse,
                "status": 1,
                "gender": gender
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
