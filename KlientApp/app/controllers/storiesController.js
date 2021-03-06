angular
	.module('clientApp')
	.controller('storiesController', ['$scope', 'StoriesService', 'TagsService', 'CreatorsService', '$rootScope', 'localStorageService', function($scope, storiesService, tagsService, creatorsService, $rootScope, localStorage) {
		var vm = this;
		
		// For search functionality
		vm.searchVisible = true;
		vm.searchToggleText = "göm sökfältet";
		
		vm.query = "";
		
		vm.searchCreatorOptions = [
			{ email: 'Alla', id: 0 }
		];
		vm.searchCreatorValue = vm.searchCreatorOptions[0];
		
		vm.searchTagOptions = [
			{ name: 'Alla', id: 0 }
		];
		vm.searchTagValue = vm.searchTagOptions[0];
		
		vm.toggleSearch = function() {
			vm.searchVisible = !vm.searchVisible;
			if (vm.searchVisible) {
				vm.searchToggleText = "göm sökfältet";
			} else {
				vm.searchToggleText = "visa sökfältet";
			}
		};

		vm.searchStories = function() {
			storiesService.search(vm.query, vm.searchCreatorValue, vm.searchTagValue).then(function(data) {
				vm.stories = data;
			});
		};
		
		vm.destroy = function(id) {
			if (confirm("Är du säker?")) {
				var authToken = localStorage.get("authToken").auth_token;
				
				storiesService.destroy(id, authToken).then(function(data) {
					$rootScope.listUpdated = true;
					$rootScope.myListUpdated = true;
					
					var currentUser = localStorage.get("currentUser");
					storiesService.search(null, currentUser, 0, $rootScope.myListUpdated).then(function(data) {
						vm.myStories = data;
						$rootScope.myListUpdated = false;
					});
				});
			}
		};
		
		// For map
		$scope.$on('mapInitialized', function (event, map) {
            vm.map = map;
        });
        var infoWindow = new google.maps.InfoWindow();
		vm.showInfoWindow = function(event, story) {
			var center = new google.maps.LatLng(story.position.latitude, story.position.longitude);
			var tagsString = "";
			story.tags.forEach(function(element, index, array) {
				tagsString += element.name + " ";
			});
			
			infoWindow.setContent(	
				'<div>' +
					'<h3>' + story.name + '</h3>' +
					'<p><strong>Författare: </strong>' + story.creator.email + '</p>' +
					'<p><strong>Berättelse: </strong>' + story.description + '</p>' +
					'<p><strong>Taggar: </strong>' + tagsString + '</p>' +
				'</div>'
			);
			
			infoWindow.setPosition(center);
			infoWindow.open(vm.map);
		};
		
		// if user is logged in
		if ($rootScope.isLoggedIn)  {
			var currentUser = localStorage.get("currentUser");
			var flag = $rootScope.myListUpdated || false;
			storiesService.search(null, currentUser, 0, flag).then(function(data) {
				vm.myStories = data;
				$rootScope.myListUpdated = false;
			});
		}
		
		// Gets and display all stories
		var flag = $rootScope.listUpdated || false;
		storiesService.get(flag).then(function(data) {
			vm.stories = data;
			$rootScope.listUpdated = false;
		});

		// Gets all creators for select box
		creatorsService.get().then(function(data) {
			vm.searchCreatorOptions = vm.searchCreatorOptions.concat(data);
		});
		
		// Gets all tags for select box
		tagsService.get().then(function(data) {
			vm.searchTagOptions = vm.searchTagOptions.concat(data);
		});
	}]);