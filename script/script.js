
$(document).ready(function(){
//check browser compatibility
	window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
//check IDBTransaction
	window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
//check keyRange
	window.keyRange = window.keyRange || window.webkitKeyRange || window.msKeyRange; 

	if(!window.indexedDB)
	{
		document.querySelector('body').innerHTML = 'Please update your browser';
	}

	else{
		//start sign up coding
		$('.signup-form').on('submit',function(){
			var database = window.indexedDB.databases();
			database.then(function(db_list){
				if(db_list.length == 0)
				{
					register();
				}
				else{
					var alert = "<div class='alert alert-warning text-dark'><i class='fa fa-times-circle close' data-dismiss='alert'></i><b>For new registration you need to delete current data</b></div>";
					$('.alert-box').html(alert);
				}
			});
			return false;
		});


		function register(){
			var firstname = $('.firstname').val();
			var lastname = $('.lastname').val();
			var mobile_one = $('.mobile-one').val();
			var mobile_two = $('.mobile-two').val();
			var shop_name = $('.shop-name').val();
			var email = $('.email').val();
			var register_password = $('.password').val();
			var database = window.indexedDB.open(shop_name);
			database.onsuccess = function(){
				var alert = "<div class='alert alert-success rounded-0'><i class='fa fa-times-circle close' data-dismiss='alert'></i><b>Success! Please login...</b></div>";
				$('.alert-box').html(alert);
				$('.signup-form').trigger('reset');
			}
			database.onerror = function(){
				var alert = "<div class='alert alert-warning rounded-0'><i class='fa fa-times-circle close' data-dismiss='alert'></i><b>Something went wrong...</b></div>";
				$('.alert-box').html(alert);
			}
			database.onupgradeneeded = function(){
				var data = {
					firstname : firstname,
					lastname : lastname,
					mobile_one : mobile_one,
					mobile_two : mobile_two,
					shop_name : shop_name,
					email : email,
					register_password : register_password
				};
				var idb = this.result;
				var object = idb.createObjectStore('about_shop',{keyPath:'shop_name'});
				object.add(data);
			}
			
			
		}
		//end sign up coding

	}
});

//start login coding
$(document).ready(function(){
	$('.login-form').on('submit',function(){
		var username = $('.username').val();
		var login_password = $('.login-password').val();
		var login_object = {
			username : username,
			login_password : login_password
		};
		var json_object = JSON.stringify(login_object);
		sessionStorage.setItem('login_data',json_object);
		if(sessionStorage.getItem('login_data') != null)
		{
			//finding user database
			var user_database = window.indexedDB.databases();
			user_database.then(function(pending_status){
				var i;
				for(i=0;i<pending_status.length;i++)
				{
					var db_name = pending_status[i].name;
					var database = window.indexedDB.open(db_name);
					database.onsuccess = function(){
						var data = this.result;
						if(data)
						{
							var db_username = data.email;
							var db_password = data.register_password;
							var session_data = JSON.parse(sessionStorage.getItem('login_data'));
							if(session_data.username == db_username)
							{
								if(session_data.login_password == db_password)
								{
									var alert = "<div class='alert alert-success'><i class='fa fa-times-circle close' data-dismiss='alert'></i><b>Login success</b></div>";
									$('.alert-box').html(alert);
								}
								else{
									alert('wrong password');
								}
							}
							else{
								var alert = "<div class='alert alert-success'><i class='fa fa-times-circle close' data-dismiss='alert'></i><b>Invalid username</b></div>";
									$('.alert-box').html(alert);
							}
						}
						else{
							window.alert('database not found');
						}
					}
				}
			});
		}
		else{
			window.alert('user not found');	
		}

		return false;
	});
});
//end login coding