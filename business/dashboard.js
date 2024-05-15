//ROUTES
const globalApiGetModulesPerRol = 'https://api-residenciales-cerro-alto.onrender.com/api/v1/modules/rol/';
const globalApiGetUsersReport = 'https://api-residenciales-cerro-alto.onrender.com/api/v1/expensereport/dates/';
const globalApiGetExpenseReport = 'https://api-residenciales-cerro-alto.onrender.com/api/v1/userspayments/dates/';


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


//SET USER INFO IN ADMIN PANEL
const setUserInfo = () => {
    document.getElementById('fullName').innerHTML = userInformation[0].fullname;
}
setUserInfo();


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




const obtainDates = () => {
    let fechaActual = new Date();
    let año = fechaActual.getFullYear();
    let mes = fechaActual.getMonth() + 1;
    let día = fechaActual.getDate();
    let dia1 = "1";
    let mes1 = fechaActual.getMonth();
    let fecha1 = año + '-' + (mes1 < 10 ? '0' : '') + mes1 + '-' + (dia1 < 10 ? '0' : '') + dia1;
    let fecha2 = año + '-' + (mes1 < 10 ? '0' : '') + mes1 + '-' + (día < 10 ? '0' : '') + día;
    let fecha3 = año + '-' + (mes < 10 ? '0' : '') + mes + '-' + (dia1 < 10 ? '0' : '') + dia1;
    let fechaFormateada = año + '-' + (mes < 10 ? '0' : '') + mes + '-' + (día < 10 ? '0' : '') + día;
    document.getElementById('startDateBalance').value = fecha1;
    document.getElementById('finishDateBalance').value = fecha2;
    document.getElementById('startDateMonth').value = fecha3;
    document.getElementById('finishDateMonth').value = fechaFormateada;
}
obtainDates();


const generateBalance = async () => {

    let existingChart = Chart.getChart("myChartBalance");
    if (existingChart) {
        existingChart.destroy();
    }

    let startDate = document.getElementById('startDateBalance').value;
    let finishDate = document.getElementById('finishDateBalance').value;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(globalApiGetUsersReport + startDate + '/' + finishDate, requestOptions);
        const dataObtained = await response.json();
        const response2 = await fetch(globalApiGetExpenseReport + startDate + '/' + finishDate, requestOptions);
        const dataObtained2 = await response2.json();

        if (dataObtained.body.length === 0 && dataObtained2.body.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Sin datos',
                text: 'No se encontraron datos con este rango de fechas',
                footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                confirmButtonText: 'Entendido'
            });
        } else {
            document.getElementById('grafica1').style.display = 'block';

            let totalPayment = 0;
            let totalExpensed = 0;
            for (let i = 0; i < dataObtained.body.length; i++) {
                totalPayment = parseFloat(totalPayment) + parseFloat(dataObtained.body[i].totalpay);
                totalExpensed = parseFloat(totalExpensed) + parseFloat(dataObtained2.body[i].totalpay);
            }

            const ctx = document.getElementById('myChartBalance');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Ingresos', 'Egresos'],
                    datasets: [{
                        label: 'Cantidad de Dinero',
                        data: [totalPayment, totalExpensed],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)', // Color para ingresos
                            'rgba(255, 99, 132, 0.2)'  // Color para egresos
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
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


const generateActualMonth = async() => {

    let existingChart = Chart.getChart("myChartActualMonth");
    if (existingChart) {
        existingChart.destroy();
    }

    let startDate = document.getElementById('startDateMonth').value;
    let finishDate = document.getElementById('finishDateMonth').value;

    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    try {
        const response = await fetch(globalApiGetUsersReport + startDate + '/' + finishDate, requestOptions);
        const dataObtained = await response.json();
        const response2 = await fetch(globalApiGetExpenseReport + startDate + '/' + finishDate, requestOptions);
        const dataObtained2 = await response2.json();

        if (dataObtained.body.length === 0 && dataObtained2.body.length === 0) {
            Swal.fire({
                icon: 'info',
                title: 'Sin datos',
                text: 'No se encontraron datos con este rango de fechas',
                footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                confirmButtonText: 'Entendido'
            });
        } else {
            document.getElementById('grafica2').style.display = 'block';

            let totalPayment = 0;
            let totalExpensed = 0;
            for (let i = 0; i < dataObtained.body.length; i++) {
                totalPayment = parseFloat(totalPayment) + parseFloat(dataObtained.body[i].totalpay);
                totalExpensed = parseFloat(totalExpensed) + parseFloat(dataObtained2.body[i].totalpay);
            }

            const ctx = document.getElementById('myChartActualMonth');

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Ingresos', 'Egresos'],
                    datasets: [{
                        label: 'Cantidad de Dinero',
                        data: [totalPayment, totalExpensed],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.2)', // Color para ingresos
                            'rgba(255, 99, 132, 0.2)'  // Color para egresos
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
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