(function () {
  'use strict';

  angular
    .module('core')
    .controller('HomeController', HomeController);
  HomeController.$inject = ['CarsService'];

  function HomeController(CarsService) {
    var vm = this;
    vm.cars = CarsService.query();
  }
}());