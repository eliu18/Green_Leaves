angular.module('GreenLeaves', [])
    .controller('Form', function ($scope, $http) {

        /* Form validate */
        $scope.hideForm = false;
        $scope.modalStatusInvalid = {
            name: { status: true, msg: "" },
            email: { status: true, msg: "" },
            date: { status: true, msg: "" },
            telephone: { status: true, msg: "" },
            city: { status: true, msg: "" }
        }

        $scope.submitForm = function submitForm() {
            $scope.submitted = true;
            $scope.form.$$controls.forEach((input) => {
                validateForm(input.$name, input.$modelValue);
            })
        }

        $scope.submitModal = function submitModal() {
            $scope.modal = false;
        }

        $scope.isInputInvalid = function isInputInvalid(input, value) {
            switch (input) {
                case 'name':
                    return value ? false : true;

                case 'city':
                    return value ? false : true;

                case 'email':
                    return value ? false : true;

                case 'telephone':
                    return value ? false : true;

                case 'date':
                    return value ? false : true;

                default:
                    return true;
            }
        }

        function validateForm(input, value) {
            if (value) {
                let regEx;
                switch (input) {
                    case 'name':
                        regEx = /\w+/;
                        if (value.match(regEx)) {
                            $scope.modalStatusInvalid[input]["status"] = false;
                            $scope.modalStatusInvalid[input]['msg'] = "";
                            formStatus();
                            break;
                        } else {
                            $scope.modalStatusInvalid[input]['msg'] = "El nombre no es valido";
                            formStatus();
                            break;
                        }

                    case 'city':
                        regEx = /\w+/;
                        if (value.match(regEx) && value.length > 2) {
                            $scope.modalStatusInvalid[input]["status"] = false;
                            $scope.modalStatusInvalid[input]['msg'] = "";
                            formStatus();
                            break;
                        } else {
                            $scope.modalStatusInvalid[input]['msg'] = "La ciudad no es valida";
                            formStatus();
                            break;
                        }

                    case 'email':
                        regEx = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{3}$/;
                        if (value.match(regEx)) {
                            $scope.modalStatusInvalid[input]["status"] = false;
                            $scope.modalStatusInvalid[input]['msg'] = "";
                            formStatus();
                            break;
                        } else {
                            $scope.modalStatusInvalid[input]['msg'] = "El e-mail no es valido";
                            formStatus();
                            break;
                        }

                    case 'telephone':
                        regEx = /\#?\+?\(?\)?\s?\-?\d+\#?\+?\(?\)?\s?\-?/;
                        if (value.match(regEx)) {
                            $scope.modalStatusInvalid[input]["status"] = false;
                            $scope.modalStatusInvalid[input]['msg'] = "";
                            formStatus();
                            break
                        } else {
                            $scope.modalStatusInvalid[input]['msg'] = "El telefono no es valido";
                            formStatus();
                            break;
                        }

                    case 'date':
                        regEx = /^\d{2}\-[A-Z]{1}[a-z]{2}\-\d{4}$/;
                        let date = new Date();
                        let year = date.getFullYear();
                        let monthDate = date.getMonth();
                        let day = date.getDate();

                        if (value.split("-")[2] >= (year - 100) &&
                            value.split("-")[2] <= year
                        ) {
                            if (value.split("-")[2] == (year - 100)) {
                                for (let i = 0; i < MONTHS.length; i++) {
                                    let month = MONTHS[i].replace(MONTHS[i].charAt(0), MONTHS[i].charAt(0).toUpperCase())
                                    if (month.indexOf(value.split("-")[1]) === 0 && i >= monthDate) {
                                        if (parseInt(value.split("-")[0]) >= day) {
                                            if (value.match(regEx)) {
                                                $scope.modalStatusInvalid[input]["status"] = false;
                                                $scope.modalStatusInvalid[input]['msg'] = "";
                                                formStatus();
                                                break
                                            } else {
                                                $scope.modalStatusInvalid[input]['msg'] = "La fecha no es valida";
                                                formStatus();
                                                break;
                                            }
                                        }
                                    }
                                    if (i === MONTHS.length - 1 && month.indexOf(value.split("-")[1]) === -1) {
                                        $scope.modalStatusInvalid[input]['msg'] = "La fecha no es valida";
                                        formStatus();
                                        break;
                                    }
                                }
                            } else {
                                if (value.match(regEx)) {
                                    $scope.modalStatusInvalid[input]["status"] = false;
                                    $scope.modalStatusInvalid[input]['msg'] = "";
                                    formStatus();
                                    break;
                                } else {
                                    $scope.modalStatusInvalid[input]['msg'] = "La fecha no es valida";
                                    formStatus();
                                    break;
                                }
                            }
                        } else {
                            $scope.modalStatusInvalid[input]['msg'] = "La fecha no es valida";
                            formStatus();
                            break;
                        }

                    default:
                        formStatus();
                        break;
                }
            } else {
                formStatus();
            }
        }

        function formStatus() {
            $scope.formStatus = [];
            let statusForm = 0;
            let input = $scope.modalStatusInvalid;



            for (const key in input) {
                if (input[key]['status'] && input[key]['msg'] == "" || input[key]['msg'] == undefined) {
                    // Faltan datos.
                    statusForm += 1;
                } else if (input[key]['status'] && input[key]['msg'] != "") {
                    // Faltan datos y algunos no son validos.
                    statusForm += 2;
                } else if (!input[key]['status']) {
                    // Datos correctos.
                    statusForm += 3;
                }

                if (input[key]['msg'] != "") {
                    $scope.formStatus.push(input[key]['msg'])
                }
            }

            if (statusForm === 15) {
                $scope.submitted = false;
                $scope.modal = false;
                $scope.hideForm = true;
                $scope.formResponse = true;
            } else {
                $scope.formStatus.unshift("Faltan datos")
                $scope.modal = true;
            }
        }
        /* Form validate */




        /* City API */
        $scope.setCityRequest = function setCityRequest() {
            if ($scope.city) {
                if ($scope.city.length > 2) {
                    let url = "http://api.geonames.org/searchJSON?name=" + $scope.city + "&maxRows=10&username=eliuj18"
                    $http.get(url).then(function (response) {
                        let cities = [];
                        response["data"]["geonames"].forEach((element) => {
                            if (element.toponymName && element.adminName1 && element.countryName) {
                                cities.push(element.toponymName + "," + element.adminName1 + "," + element.countryName);
                            }
                        })
                        $scope.cities = cities;
                        $scope.cityList = true;

                    });
                } else {
                    $scope.cityList = false;
                }
            }
        }

        $scope.setInputCity = function setInputCity(citie) {
            $scope.city = citie;
            $scope.cityList = false;
        }
        /* City API */


        /* Calendar Widget */
        $scope.calendar = false;
        $scope.DAY_NAMES = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];
        $scope.date = "";

        const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
        const currentDate = new Date();
        let currentYear = currentDate.getFullYear();
        let currentMonth = currentDate.getMonth();
        let counterDay = 1;
        let container = [];

        function getFirstDayOfMonth() {
            return new Date(currentYear, currentMonth, 1).getDay();
        }

        function getDaysPerMonth() {
            if (currentMonth === 0 || //Enero
                currentMonth === 2 || //Marzo
                currentMonth === 4 || //Mayo
                currentMonth === 6 || //Julio
                currentMonth === 7 || //Agosto
                currentMonth === 9 || //Octubre
                currentMonth === 11 //Diciembre
            ) {
                return 31;
            } else if (
                currentMonth === 3 || //Abril
                currentMonth === 5 || //Junio
                currentMonth === 8 || //Septiembre
                currentMonth === 10 //Noviembre
            ) {
                return 30;
            } else {
                return isLeap();
            }
        }

        function isLeap() {
            if ((currentYear % 4 == 0 && currentYear % 100 != 0) || currentYear % 400 == 0) {
                return 29;
            } else {
                return 28;
            }
        }

        $scope.setPrevMonth = function setPrevMonth() {
            currentMonth--;
            if (currentMonth === -1) {
                currentMonth = 11;
                currentYear--;
            }
            setCalendar();
        }

        $scope.setNextMonth = function setNextMonth() {
            currentMonth++;
            if (currentMonth === 12) {
                currentMonth = 0;
                currentYear++;
            }
            setCalendar();
        }

        function setCalendar() {
            container = [];
            counterDay = 1;
            for (let i = 0; i < 6; i++) {
                container.push([]);
                for (let j = 0; j < 7; j++) {
                    if (counterDay > getDaysPerMonth()) {
                        break;
                    } else {
                        if (i === 0) {
                            if (j >= getFirstDayOfMonth()) {
                                container[i].push(counterDay++);
                            } else {
                                container[i].push("");
                            }
                        } else {
                            container[i].push(counterDay++);
                        }
                    }
                }
            }



            $scope.month = MONTHS[currentMonth];
            $scope.year = currentYear;
            $scope.calendarDays = container;
        }

        $scope.showCalendar = function showCalendar() {
            if ($scope.calendar) {
                $scope.calendar = false;
            } else {
                setCalendar();
                $scope.calendar = true;
            }
        }

        $scope.styleOfDay = function styleOfDay(day) {
            if (day) {
                if (currentMonth == new Date().getMonth()) {
                    if (day == currentDate.getDate()) {
                        return 'calendar-current-day';
                    } else {
                        return 'calendar-days';
                    }
                } else {
                    return 'calendar-days';
                }
            } else {
                return 'calendar-days-inactive';
            }
        }

        $scope.setDate = function setDate(day) {
            if (day < 10) {
                day = "0" + day;
            }
            let month = MONTHS[currentMonth].substr(0, 3);
            $scope.date = day + "-" + month.charAt(0).toUpperCase() + month.slice(1) + "-" + currentYear;
            $scope.calendar = false;
        }
        /* Calendar Widget */
    });