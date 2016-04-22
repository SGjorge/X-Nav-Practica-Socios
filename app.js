$(document).ready(function(){
	console.log("socios");

	/* ----------------- Leaflet ----------------*/

	var getMap = function(lat,lon){
		var map = L.map("map").setView([lat, lon], 15);

		L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    	attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(map);

		L.marker([lat, lon]).addTo(map)
	    	.openPopup();

	    map.on('click', function(e) {
	    	var popup = L.popup()
		    .setLatLng(e.latlng)
		    .setContent(e.latlng.toString())
		    .openOn(map);
		});
	};

	/* ----------------- JSONs ------------------ */
	var timeline = function(){
		$.getJSON("timeline.json")
		.done(function(data){
			console.log( "success" );
			var noticeTitle = [];
			var noticeContent = [];
			var autores = [];
			var date = [];
			var imgs = [];
			var attachment = [];
			var maps = [];
			$.each( data.who, function( key, val ){
				$.each(val, function( key, val ){
					if(key === "avatar"){
						imgs.push("<img class='col-md-2' src='" + val + "' height='100' width='100'></img>");
					}else if(key === "autor"){
						autores.push(val);
					}else if(key === "content"){
						noticeContent.push("<li>" + key + ":" + val + "</li>");
					}else if(key === "title"){
						noticeTitle.push( key + ":" + val);
					}else if(key === "publish"){
						date.push("<li>" + key + ":" + val + "</li>");
					}else if(key === "attachment"){
						attachment.push("<li>" + key + ": <a href='https://"+ val + "'>" + val + "</a></li>");
					}else{
						maps.push("<li hidden='hidden' class='l'>" + val.split(",") + "</li>");
					};
				});
			});
			for(var i=0; i < noticeTitle.length; i++){
				$("<h3>",{
					"class":"notice-title",
					html: noticeTitle[i],
				}).appendTo("#tl-ac");
				$("<div>",{
					class:"notice-content",
					title: noticeTitle[i],
					html: autores[i] + imgs[i] + "<ul>" + noticeContent[i] +date[i] + attachment[i] + maps[i] +"</ul><p id=''>",
				}).appendTo("#tl-ac");
			};
			lastContent = noticeTitle.length;
			$( ".accordion" ).accordion({heightStyle: "content"});
		})
		.fail(function(data){
			console.log("fail");
		});
	};

	timeline();

	var update = function(centinel){
		$.getJSON("update.json")
		.done(function(data){
			console.log( "success" );
			var noticeTitle = [];
			var noticeContent = [];
			var autores = [];
			var date = [];
			var imgs = [];
			var attachment = [];
			var maps = [];
			$.each( data.who, function( key, val ){
				$.each(val, function( key, val ){
					if(key === "avatar"){
						imgs.push("<img class='col-md-2' src='" + val + "' height='100' width='100'></img>");
					}else if(key === "autor"){
						autores.push(val);
					}else if(key === "content"){
						noticeContent.push("<li>" + key + ":" + val + "</li>");
					}else if(key === "title"){
						noticeTitle.push( key + ':' + val);
					}else if(key === "publish"){
						date.push("<li>" + key + ":" + val + "</li>");
					}else if(key === "attachment"){
						attachment.push("<li>" + key + ": <a href='https://"+ val + "'>" + val + "</a></li>");
					}else{
						maps.push("<li hidden='hidden' class='l'>" + val.split(",") + "</li>");
					};
				});
			});
			
			if(centinel){
				$("#update").html(noticeTitle.length);
				return;
			}

			$(".tl").html("");
			$("<div>",{
				id:"tl-ac",
				class:"accordion",
			}).appendTo(".tl");
			for(var i=0; i < noticeTitle.length; i++){
				$("<h3>",{
					"class":"notice-title",
					html: noticeTitle[i],
				}).appendTo("#tl-ac");
				$("<div>",{
					"class":"notice-content",
					title: noticeTitle[i],
					id:"map" + (i+lastContent),
					html: autores[i] + imgs[i] + "<ul>"+ noticeContent[i] +date[i] + attachment[i] + maps[i] + "</ul>",
				}).appendTo("#tl-ac");
			};
			timeline();
			$("#update").html("0");
		})
		.fail(function(data){
			console.log("fail");
		});
	};

	var myline = function(){
		$("#ml-ac").html("");
		$.getJSON("myline.json")
		.done(function(data){
			console.log( "success" );
			var noticeTitle = [];
			var noticeContent = [];
			var items = [];
			var img;
			var loged = $("#loged").html();
			$.each(data, function( key, val ){
				if(key != loged){
					return true;
				};
				$.each(val, function( key, val ){
					$.each(val, function( key, val ){
						if(key === "notice"){
							$.each(val, function( key, val ){
								$.each(val, function( key, val ){
									if(key === "content"){
										noticeContent.push(key + ":" + val);
									}else if(key === "title"){
										noticeTitle.push( key + ':' + val);
									}else{
										items.push(key+":"+val);
									}
								});
							});
						}else{
							img = ("<div class='col-md-2'><img src='" + val + "' height='100' width='100'></img></h2></div>");
						};
					});
				});
			});
			if(loged === ""){
				return;
			}
			$("<div>",{
				class:"row",
				html: ('<div class="col-md-2 col-md-offset-3"><h3>'+ loged + "</h3></div>" + img),
			}).appendTo(".ml");
			$("<div>",{
				id: "ml-ac",
				class:"accordion",
			}).appendTo(".ml");
			for(var i=0; i < noticeTitle.length; i++){
				$("<h3>",{
					"class":"notice-title",
					html: noticeTitle[i],
				}).appendTo("#ml-ac");
				$("<div>",{
					"class":"notice-content",
					title: noticeTitle[i],
					html: "<ul><li>" + noticeContent[i] +"</li><li>"+items[i] + "</li></ul>",
				}).appendTo("#ml-ac");
			};
			$( ".accordion" ).accordion({heightStyle: "content"});
		})
		.fail(function(data){
			console.log("fail");
		});
	};

	/* Listeners para los click en los eventos*/
	$("#update").click(function(){
		update();
	});

	$("#myline").click(function(){
		if($(".ml").html() === ""){
			myline();
		};
	});

	$("#send").click(function(){
		alert("simula el login");
		$("#register").attr("hidden","hidden");
		$("#send").hide();
		$("#close").show();
		$("#tabs").removeAttr("hidden");
		$("#add-notice").removeAttr("hidden");
		$("#loged").html($("#login").val());
		$("#site").removeAttr("hidden");
		update(true);
		myline();
	});

	$("#close").click(function(){
		$("#send").show();
		$("#close").hide();
		$("#loged").html("");
		$("#tabs").attr("hidden","hidden");
		$("#add-notice").attr("hidden","hidden");
		$("#register").removeAttr("hidden");
		$(".ml").html("");
		$("#site").attr("hidden","hidden");
		$( ".accordion" ).accordion({heightStyle: "content"});
	});

	$("#send-reg").click(function(){
		alert("simula el registro de un nuevo usuario");
		$("#register").attr("hidden","hidden");
		$("#send").hide();
		$("#close").show();
		$("#tabs").removeAttr("hidden");
		$("#map").removeAttr("hidden");
		$("#add-notice").removeAttr("hidden");
		$("#loged").html($("#login-reg").val());
		$("#site").removeAttr("hidden");
		update(true);
		myline();
	});

	$("#publish").click(function(){
		alert("simula la publicacon de una nueva noticia");
	});

	$("#locate").click(function(){
		$("#map").remove();
		$("<div>",{
			"id":"map",
		}).appendTo("#site");
		$.each($(".notice-content"), function(key,val){
			if(val.style.display === "none"){
				return true;
			};
			$("#map-title").html(val.title);
			var html = $(val).html();
			var l = html.split('<li class="l" hidden="hidden">');
			l = l[1].split("</li>")[0].split(",");
			if(l === undefined){
				$("#map").html("it hasn't location");
				return;
			};
				getMap(l[0],l[1]);
		});
	});

	$('#hide-locate').click(function(){
		$("#map").remove();
	});

	/* Modulos JQuery UI*/

	$( "#tabs" ).tabs();
});