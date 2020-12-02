angular.module("Validators", ["ngMessages"])
    .directive('celular', function () {
        var CELULAR_REGEXP = /[3][0-9]{9}$/;
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                function custonValidator(ngModelValue) {
                    var valid = CELULAR_REGEXP.test(ngModelValue);
                    if (valid)
                        ctrl.$setValidity('CelularMsg', false);
                    else
                        ctrl.$setValidity('CelularMsg', true);

                    return ngModelValue;
                }
                ctrl.$parsers.push(custonValidator);
            }
        };

    })
    .directive('numberOnly', function () {
        var NUMBER_REGEXP = /^(\d+)$/;
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                function custonValidator(ngModelValue) {
                    var valid = NUMBER_REGEXP.test(ngModelValue);
                    if (valid)
                        ctrl.$setValidity('numberOnlyMsg', true);
                    else
                        ctrl.$setValidity('numberOnlyMsg', false);
                }
                ctrl.$parsers.push(custonValidator);
            }
        };
    })
    .directive('mileskeypress', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                var validateNumber = function (inputValue) {
                    if (inputValue === undefined) {
                        return '';
                    }
                    inputValue = inputValue.replace(/\,/g, "");
                    var transformedInput = inputValue.replace(/[^0-9,]/g, '');
                    if (transformedInput !== inputValue) {
                        ctrl.$setViewValue(transformedInput);
                        ctrl.$render();
                    }
                    else {
                        if (transformedInput > 999) {
                            var transformedInputTemp = parseInt(transformedInput).toString().split("");
                            var count = 0;
                            var result = [];
                            var length = transformedInputTemp.length - 1;
                            for (var i = length; i >= 0; i--) {
                                var temp = transformedInputTemp[i].replace(/\,/g, "");
                                if (temp != "") {
                                    if (length >= 3) {
                                        if (count == 2 && i != 0) {
                                            result[i] = "," + temp;
                                            count = 0;
                                        }
                                        else {
                                            result[i] = temp;
                                            count += 1;
                                        }
                                    }
                                    else {
                                        result[i] = temp;
                                    }
                                }
                            }
                            transformedInput = result.join("");
                        }
                        ctrl.$setViewValue(transformedInput);
                        ctrl.$render();
                        ctrl.$setValidity('onlyNumbers', true);
                    }
                    return transformedInput;
                };
                ctrl.$parsers.unshift(validateNumber);
                ctrl.$parsers.push(validateNumber);
                attr.$observe('onlyNumbers', function () {
                    validateNumber(ctrl.$ViewValue)
                });
            }
        };
    })
    .directive('letterkeypress', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                var validateletter = function (inputValue) {
                    if (inputValue === undefined) {
                        return '';
                    }
                    var transformedInput = inputValue.replace(/[^A-Za-z ]/g, '');
                    if (transformedInput !== inputValue) {
                        ctrl.$setViewValue(transformedInput);
                        ctrl.$render();
                    }
                    else {
                        ctrl.$setValidity('onlyLetters', true);
                    }
                    return transformedInput;
                }

                ctrl.$parsers.unshift(validateletter);
                ctrl.$parsers.push(validateletter);
                attr.$observe('onlyLetters', function () {
                    validateletter(ctrl.$ViewValue)
                });
            }
        };
    })
    .directive('numberkeypress', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, element, attr, ctrl) {
                var validateNumber = function (inputValue) {
                    if (inputValue === undefined) {
                        return '';
                    }
                    var transformedInput = inputValue.replace(/[^0-9]/g, '');
                    if (transformedInput !== inputValue) {
                        ctrl.$setViewValue(transformedInput);
                        ctrl.$render();
                    }
                    else {
                        ctrl.$setValidity('onlyNumbers', true);
                    }
                    return transformedInput;
                }

                ctrl.$parsers.unshift(validateNumber);
                ctrl.$parsers.push(validateNumber);
                attr.$observe('onlyLetters', function () {
                    validateNumber(ctrl.$ViewValue)
                });
            }
        };
    });


