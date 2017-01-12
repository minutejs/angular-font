/// <reference path="../../../minute/_all.d.ts" />
var Minute;
(function (Minute) {
    var AngularFont = (function () {
        function AngularFont($compile, $timeout, $http) {
            var _this = this;
            this.$compile = $compile;
            this.$timeout = $timeout;
            this.$http = $http;
            this.restrict = 'A';
            this.replace = true;
            this.require = 'ngModel';
            this.scope = { font: '=?', hideFontSize: '@', hideFontColor: '@', minFontSize: '@', maxFontSize: '@', fontSizeSkip: '@' };
            this.template = "\n        <div class=\"inline-block\">\n            <ol class=\"nya-bs-select inline\" ng-model=\"font.font\" data-live-search=\"true\" size=\"10\" title=\"Select font\" >\n                <li nya-bs-option=\"font in fonts\" data-value=\"font.url\">\n                    <a>\n                        <span><img src=\"\" ng-src=\"{{thumb(font.url)}}\" style=\"max-height: 32px\" alt=\"{{font.name}}\" /></span>\n                        <span class=\"small hidden\">{{ font.name }}</span>\n                        <span class=\"glyphicon glyphicon-ok check-mark\"></span>\n                    </a>\n                </li>\n            </ol>\n        \n            <select class=\"form-control\" style=\"display: inline; width: auto\" ng-model=\"font.size\" name=\"size\" ng-options=\"item as item + ' pt' for item in fontSizes\" ng-if=\"!hideFontSize\">\n                <option value=\"\">Font size</option>\n            </select>\n        \n            <div color-picker ng-model=\"font.color\" ng-if=\"!hideFontColor\"></div>\n        </div>        \n        ";
            this.link = function ($scope, element, attrs, ngModel) {
                $scope.init = function () {
                    $scope.$watch('font', function () { return ngModel.$setViewValue($scope.font); });
                };
                $scope.$watch('fonts', $scope.init);
                ngModel.$render = function () { return $scope.setFont(ngModel.$viewValue); };
                $scope.setFont = function (f) {
                    if ($scope.fonts) {
                        $scope.font = f;
                    }
                    else {
                        _this.$timeout($scope.setFont.bind(null, f), 100);
                    }
                };
            };
            this.controller = function ($scope, $element) {
                $scope.init = function () {
                    _this.$http.get('/stock/resources/fonts').then(function (obj) { return $scope.fonts = obj.data; });
                    $scope.fontSizes = [];
                    for (var i = (parseInt($scope.minFontSize) || 10); i <= (parseInt($scope.maxFontSize) || 40); i += (parseInt($scope.fontSizeSkip) || 1)) {
                        $scope.fontSizes.push(i);
                    }
                };
                $scope.thumb = function (item) { return (item || '').replace(/\/(\w+)\.swf$/, '/thumbs/$1.png'); };
                $scope.init();
            };
        }
        AngularFont.factory = function () {
            var directive = function ($compile, $timeout, $http) { return new AngularFont($compile, $timeout, $http); };
            directive.$inject = ["$compile", "$timeout", "$http"];
            return directive;
        };
        return AngularFont;
    }());
    Minute.AngularFont = AngularFont;
    angular.module('AngularFont', ['nya.bootstrap.select', 'angularColorPicker'])
        .directive('angularFont', AngularFont.factory());
})(Minute || (Minute = {}));
