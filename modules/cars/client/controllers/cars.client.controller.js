(function () {
  'use strict';

  angular
    .module('cars').constant("IMG_UPLOAD", {
      "PATH": "uploads/" })
    .controller('CarsController', CarsController);

  CarsController.$inject = ['$scope', '$state', 'carResolve', '$window', 'Authentication', '$location', 'Upload', '$timeout', 'IMG_UPLOAD'];

  function CarsController($scope, $state, car, $window, Authentication, $location, Upload, $timeout, IMG_UPLOAD) {
    var vm = this;
    vm.car = car;
    vm.authentication = Authentication;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;
    $scope.fileReaderSupported = window.FileReader !== null;
    $scope.path = IMG_UPLOAD;
//    $scope.create = function(imageurl) {
//          console.log('create');
//                      console.log(imageurl);
//        var car = new Cars({
//            title: this.title,
//            image: null
//        });
//
//         console.log(car);
//         Upload.upload({
//           url: '/articleupload',
//           method: 'POST',
//           headers: {'Content-Type': 'multipart/form-data'},
//           fields: {car: car},
//           file: imageurl,  
//        }).success(function (response, status) {
//              $location.path('cars/' + response._id);
//
//            $scope.title = '';
//            $scope.content = '';
//        }).error(function (err) {
//                $scope.error = err.data.message;
//        });
//    }
//
//
//       $scope.uploadFiles = function(file, errFiles) {
//       $scope.f = file;
//       $scope.errFile = errFiles && errFiles[0];
//
//        if (file) {
//
//            file.upload = Upload.upload({
//                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
//                data: {file: file}
//            });
//
//            file.upload.then(function (response) {
//                console.log(response);
//                $timeout(function () {
//                    file.result = response.data;
//                });
//            }, function (response) {
//                if (response.status > 0)
//                    $scope.errorMsg = response.status + ': ' + response.data;
//            }, function (evt) {
//              file.progress = Math.min(100, parseInt(100.0 *
//                                         evt.loaded / evt.total));
//            });
//        }
//    }
//
//     $scope.doTimeout = function(file) {
//         console.log('do timeout');
//        $timeout( function() {
//                var fileReader = new FileReader();
//                fileReader.readAsDataURL(file);
//             console.log('read');
//                fileReader.onload = function(e) {
//                    $timeout(function() {
//                        file.dataUrl = e.target.result;
//                         console.log('set url');
//                    });
//                };
//            });
//    };
//
//
//     $scope.generateThumb = function(file) {
//        console.log('generate Thumb');
//    if (file) {
//        console.log('not null');
//         console.log(file);
//        if ($scope.fileReaderSupported && file.type.indexOf('image') > -1) {
//            $scope.doTimeout(file);
//          }
//      }
//   };

    // Remove existing Car
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.car.$remove($state.go('cars.list'));
      }
    }
    
    // Save Car
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.carForm');
        return false;
      }
      
     
      if (vm.form.carForm.imageurl.$valid && vm.car.imageurl) { // check if from is valid
            vm.car.upload(vm.car.imageurl); // call upload function
      }     
      
     // Create a new car, or update the current instance
      $timeout(function () {
            vm.car.createOrUpdate()
              .then(successCallback)
              .catch(errorCallback);
        },5000);
         
      
    
     function successCallback(res) {
        $state.go('cars.view', {
          carId: res._id
        });
      }

      function errorCallback(res) {
          console.log(res);
        vm.error = res.data.message;
      }
    }
     
    
    vm.car.upload = function (file) {
            Upload.upload({
                url: 'http://localhost:3000/upload', // webAPI exposed to upload the file
                data:{file:file} // pass file as data, should be user ng-model
            }).then(function (resp) { // upload function returns a promise
                if(resp.data.error_code === 0){ // validate success
                   
                   // $window.alert('Success ' + resp.config.data.file.name + 'uploaded. Response: ');
                  console.log(resp.data.filedesc.filename);
                  vm.car.imageurl = resp.data.filedesc.filename;
                   // vm.imagepath = resp.data.filedesc.path;
                } else {
                  $window.alert('an error occured');
                }
            }, function (resp) { // catch error
              console.log('Error status: ' + resp.status);
              $window.alert('Error status: ' + resp.status);
            }, function (evt) { 
              console.log(evt);
              var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
              console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
              vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
            });
    };
}
}());
