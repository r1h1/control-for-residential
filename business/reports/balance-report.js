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
        window.location.href = '../../../views/login.html';
    }
    else if (userInformation == null || userInformation.length == 0 || userInformation == '') {
        sessionStorage.removeItem('signInToken');
        sessionStorage.removeItem('sessionInfo');
        window.location.href = '../../../views/login.html';
    }
    else {
        console.log('sesión activa');
    }
}
validateToken();


//EXECUTE LOOP 1 MINUTE FUNCTION VALIDATE TOKEN
setInterval(validateToken, 60000);


//GENERATE REPORT WITH DATES SELECTED
const generateReport = async () => {

    let startDate = document.getElementById('startDate').value;
    let finishDate = document.getElementById('finishDate').value;

    if (startDate === '' || finishDate === '') {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'Llena todos los datos que se te solicitan',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else if (startDate > finishDate) {
        Swal.fire({
            icon: 'warning',
            title: 'Advertencia',
            text: 'La fecha de inicio no puede ser mayor a la fecha fin',
            footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
            confirmButtonText: 'Entendido'
        });
    }
    else {

        let myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", "Bearer " + sessionStorage.getItem('signInToken'));

        let requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        const showData = (dataObtained, dataObtained2) => {
            try {
                if (dataObtained.body.length === 0 && dataObtained2.body.length === 0) {
                    Swal.fire({
                        icon: 'info',
                        title: 'Sin datos',
                        text: 'No se encontraron datos con este rango de fechas',
                        footer: 'Si el problema persiste, por favor comunicarse con el administrador o enviar un mensaje usando la opción de soporte indicando el error.',
                        confirmButtonText: 'Entendido'
                    });
                }
                else {
                    document.getElementById('dataTableReport').style.display = 'block';
                    let bodydata = '';
                    let totalPayment = 0;
                    let totalExpensed = 0;
                    for (let i = 0; i < Math.min(dataObtained.body.length, dataObtained2.body.length); i++) {
                        bodydata += `
                                        <tr>
                                            <td>${dataObtained.body[i].createddate}</td>
                                            <td>Q${dataObtained.body[i].totalpay.toFixed(2)}</td>
                                            <td>Q${dataObtained2.body[i].totalpay.toFixed(2)}</td>
                                        </tr>
                                    `;
                    totalPayment = parseFloat(totalPayment) + parseFloat(dataObtained.body[i].totalpay);
                    totalExpensed = parseFloat(totalExpensed) + parseFloat(dataObtained2.body[i].totalpay);
                    }
                    document.getElementById('dataTableBody').innerHTML = bodydata;
                    document.getElementById('totalPay').innerHTML = totalPayment.toFixed(2);
                    document.getElementById('totalExpensed').innerHTML = totalExpensed.toFixed(2);

                }
            } catch (err) {
                console.log(err);
            }
        }

        try {
            const response = await fetch(globalApiGetUsersReport + startDate + '/' + finishDate, requestOptions);
            const dataObtained = await response.json();
            const response2 = await fetch(globalApiGetExpenseReport + startDate + '/' + finishDate, requestOptions);
            const dataObtained2 = await response2.json();
            showData(dataObtained, dataObtained2);
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
}