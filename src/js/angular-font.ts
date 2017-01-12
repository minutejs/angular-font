/// <reference path="../../../minute/_all.d.ts" />

module Minute {
    export class AngularFont implements ng.IDirective {
        restrict = 'A';
        replace = true;
        require = 'ngModel';
        scope: any = {font: '=?', hideFontSize: '@', hideFontColor: '@', minFontSize: '@', maxFontSize: '@', fontSizeSkip: '@'};
        template: string = `
        <div class="inline-block">
            <ol class="nya-bs-select inline" ng-model="font.font" data-live-search="true" size="10" title="Select font" >
                <li nya-bs-option="font in fonts" data-value="font.url">
                    <a>
                        <span><img src="" ng-src="{{thumb(font.url)}}" style="max-height: 32px" alt="{{font.name}}" /></span>
                        <span class="small hidden">{{ font.name }}</span>
                        <span class="glyphicon glyphicon-ok check-mark"></span>
                    </a>
                </li>
            </ol>
        
            <select class="form-control" style="display: inline; width: auto" ng-model="font.size" name="size" ng-options="item as item + ' pt' for item in fontSizes" ng-if="!hideFontSize">
                <option value="">Font size</option>
            </select>
        
            <div color-picker ng-model="font.color" ng-if="!hideFontColor"></div>
        </div>        
        `;

        constructor(private $compile: ng.ICompileService, private $timeout: ng.ITimeoutService, private $http: ng.IHttpService) {
        }

        static factory(): ng.IDirectiveFactory {
            let directive: ng.IDirectiveFactory = ($compile: ng.ICompileService, $timeout: ng.ITimeoutService, $http: ng.IHttpService) => new AngularFont($compile, $timeout, $http);
            directive.$inject = ["$compile", "$timeout", "$http"];
            return directive;
        }

        link = ($scope: any, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {
            $scope.init = () => {
                $scope.$watch('font', () => ngModel.$setViewValue($scope.font));
            };

            $scope.$watch('fonts', $scope.init);

            ngModel.$render = () => $scope.setFont(ngModel.$viewValue);

            $scope.setFont = (f) => {
                if ($scope.fonts) {
                    $scope.font = f;
                } else {
                    this.$timeout($scope.setFont.bind(null, f), 100);
                }
            };
        };

        controller = ($scope, $element) => {
            $scope.init = () => {
                this.$http.get('/stock/resources/fonts').then((obj: any) => $scope.fonts = obj.data);

                $scope.fontSizes = [];
                for (let i = (parseInt($scope.minFontSize) || 10); i <= (parseInt($scope.maxFontSize) || 40); i += (parseInt($scope.fontSizeSkip) || 1)) {
                    $scope.fontSizes.push(i);
                }
            };

            $scope.thumb = (item) => (item || '').replace(/\/(\w+)\.swf$/, '/thumbs/$1.png');
            $scope.init();
        }
    }

    angular.module('AngularFont', ['nya.bootstrap.select', 'angularColorPicker'])
        .directive('angularFont', AngularFont.factory());
}