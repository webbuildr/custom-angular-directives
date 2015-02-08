angular.module('app', []);
angular.module('app').controller('MainCtrl', function($scope) {
	$scope.data = {
		hummer: {shortName: 'hummer', fullName: 'Hummer Stretch Limo', parts: ['img/hummer-front.jpg', 'img/hummer-middle-black.jpg', 'img/hummer-back.jpg']}
	};
});
angular.module('app').directive('stretchyLimo', function() {
	return {
		restrict: 'E',
		scope: {
			limo: '='
		},
		controller: function($scope) {
			$scope.limoSections = $scope.limo.parts.slice(0);
			var add = function(limoType, sectionColor) {
				var len = $scope.limoSections.length;
				$scope.limoSections.splice(len-1, 0, 'img/' + limoType + '-middle-' + sectionColor +'.jpg' );
			};		
			$scope.addPurple = function(limoType) {
				add(limoType, 'purple');
			};
			$scope.addGreen = function(limoType) {
				add(limoType, 'green');
			};
			$scope.addBlack = function(limoType) {
				add(limoType, 'black');
			};			
			$scope.remove = function() {
				var len = $scope.limoSections.length;
				if (len >= 3) {
					$scope.limoSections.splice(len-2, 1);
				}
			};			
		},
		templateUrl: 'partials/stretchy-limo.html'
	};
});

angular.module('app').directive('limoConstructor', function() {
	return {
		restrict: 'A',
		transclude: 'element',
		link: function(scope, el, attrs, ctrl, transclude) {

			var parts = attrs.limoConstructor.split(' '),
					elem = parts[0]
					arr = parts[2]
					garbageTrack = [];

			scope.$watchCollection(arr, function(limoSections) {
				if (garbageTrack) {
					for (var i=0, len = garbageTrack.length; i < len; i++) {
						garbageTrack[i].elem.remove();
						garbageTrack[i].scope.$destroy();
					}
					garbageTrack = [];
				}

				for(var i=0, len = limoSections.length; i < len; i++) {
					var childScope = scope.$new();
					childScope[elem] = limoSections[i];
					transclude(childScope, function(clone) {
						el.before(clone);

						var gItem = {};
						gItem.elem = clone;
						gItem.scope = childScope;
						garbageTrack.push(gItem);
					});
				}
			});
		}
	};
});