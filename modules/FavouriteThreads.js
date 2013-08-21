
function FavouriteThreads() {
		
	this.id = arguments.callee.name; //ModuleID
	this.name = "Hilos favoritos";
	this.author = "TheBronx";
	this.version = "0.1";
	this.description = "Mostrará un icono al lado de cada hilo para marcarlo como favorito. Los hilos favoritos destacarán entre los demás cuando el usuario entre a algún subforo.";
	this.enabledByDefault = true;
	
	
	var helper = new ScriptHelper(this.id);
	
	var favorites;
		
	this.shouldLoad = function() {
		 return page == "/forumdisplay.php";
	}
	
	this.load = function() {
	
		GM_addStyle(".favorite>td:nth-child(3) {background-color:#D5E6EE; border-right: 4px solid #528BC6}");
		GM_addStyle(".fav img {display:none;} .fav {cursor: pointer; background-repeat:no-repeat; background-position: center; background-image:url('http://salvatorelab.es/images/star.png');}");
		GM_addStyle(".not_fav img {display:none;} .not_fav {cursor: pointer; background-repeat:no-repeat; background-position: center; background-image:url('http://salvatorelab.es/images/nostar.png');}");
		
		favorites = GM_getValue("FC_FAVORITE_THREADS_" + userid); //Antiguos
		if (favorites) { //Migrar a la nueva estructura de datos
			helper.setValue("FAVOURITES", favorites);
			GM_deleteValue("FC_FAVORITE_THREADS_" + userid);
		}
		
		favorites = JSON.parse(helper.getValue("FAVOURITES", '[]'));
		favoriteThreads();
	}
		
	function favoriteThreads() {
		
	    var hilos = new Array();
	    var hilo = {};
	    //recogemos todos los hilos actuales
	    $('#threadslist tr td').each( function() {
	        var identifier = $(this).attr('id');
	        if ( identifier != undefined && identifier.indexOf('td_threadstatusicon')>=0 ) {
	            //celda icono
	            hilo.icon_td_id = identifier;
	        } else if (identifier != undefined && identifier.indexOf('td_threadtitle')>=0) {
	            //celda titulo
	            var a = $(this).find('div > a').first();
	            hilo.href = a.attr('href');
	            hilo.id = parseInt(a.attr('href').replace(/.*showthread\.php\?.*t=/,""),10);
	            hilo.title = a.html();
	            hilos.push( hilo );
	            hilo = {};
	        }
	    });
	    
	    //ahora resaltamos los hilos favoritos y mostramos los iconos correspondientes
	    for (var i=0; i<hilos.length; i++) {
	        var hilo = hilos[i];
	        var icon_td = jQuery( "#"+hilo.icon_td_id );
	        if ( favorites.indexOf( hilo.id ) >= 0 ) {
	            //es un hilo favorito
	            icon_td.parent().addClass("favorite");
				//evento sobre la celda del icono
	            icon_td.hover(
	                function() {//mouse in
	                    $(this).addClass("fav");
	                },
	                function() {//mouse out
	                    $(this).removeClass("fav");
	                }
	            );
				//evento sobre la celda del titulo
				jQuery( "#"+hilo.icon_td_id.replace("threadstatusicon","threadtitle") ).hover(
	                function() {//mouse in
	                    $("#"+$(this).attr("id").replace("threadtitle","threadstatusicon") ).addClass("fav");
	                },
	                function() {//mouse out
	                    $("#"+$(this).attr("id").replace("threadtitle","threadstatusicon") ).removeClass("fav");
	                }
	            );
	        } else {
	            //es un hilo normal
				//evento sobre la celda del icono
	            icon_td.hover(
	                function() {//mouse in
	                    $(this).addClass("not_fav");
	                },
	                function() {//mouse out
	                    $(this).removeClass("not_fav");
	                }
	            );
				//evento sobre la celda del titulo
				jQuery( "#"+hilo.icon_td_id.replace("threadstatusicon","threadtitle") ).hover(
	                function() {//mouse in
	                    $("#"+$(this).attr("id").replace("threadtitle","threadstatusicon") ).addClass("not_fav");
	                },
	                function() {//mouse out
	                    $("#"+$(this).attr("id").replace("threadtitle","threadstatusicon") ).removeClass("not_fav");
	                }
	            );
	        }
	        //en ambos casos al hacer clic se cambia su estado (fav->no_fav y viceversa) y se guarda/elimina de favoritos
	        icon_td.click( function(e) {
	            var id = parseInt($( this ).attr('id').replace("td_threadstatusicon_",""),10);
				var celda_titulo = $( "#"+$(this).attr("id").replace("threadstatusicon","threadtitle"));
	            //si no era favorito...
	            if (favorites.indexOf(id) < 0) {
	                //lo agregamos a favoritos
	                favorites.push(id);
	                //quitamos el class antiguo
	                $( this ).removeClass("not_fav");
	                //cambiamos los eventos hover
	                $( this ).unbind('mouseenter mouseleave');
					celda_titulo.unbind('mouseenter mouseleave');
	                //nuevos eventos
					//evento sobre la celda icono
	                $( this ).hover(
	                    function() {//mouse in
	                        $(this).addClass("fav");
	                    },
	                    function() {//mouse out
	                        $(this).removeClass("fav");
	                    }
	                );
					//evento sobre la celda titulo
					celda_titulo.hover(
	                    function() {//mouse in
	                        $("#"+$(this).attr("id").replace("threadtitle","threadstatusicon") ).addClass("fav");
	                    },
	                    function() {//mouse out
	                        $("#"+$(this).attr("id").replace("threadtitle","threadstatusicon") ).removeClass("fav");
	                    }
	                );
	                $( this ).parent().addClass("favorite");
	            } else {
	                //lo borramos de favoritos
	                favorites.splice(favorites.indexOf(id),1);
	                //quitamos el class antiguo
	                $( this ).removeClass("fav");
	                //cambiamos los eventos hover
	                $( this ).unbind('mouseenter mouseleave');
					celda_titulo.unbind('mouseenter mouseleave');
	                //nuevos eventos
					//evento sobre la celda icono
	                $( this ).hover(
	                    function() {//mouse in
	                        $(this).addClass("not_fav");
	                    },
	                    function() {//mouse out
	                        $(this).removeClass("not_fav");
	                    }
	                );
					//evento sobre la celda titulo
					celda_titulo.hover(
	                    function() {//mouse in
	                        $("#"+$(this).attr("id").replace("threadtitle","threadstatusicon") ).addClass("not_fav");
	                    },
	                    function() {//mouse out
	                        $("#"+$(this).attr("id").replace("threadtitle","threadstatusicon") ).removeClass("not_fav");
	                    }
	                );
	                $( this ).parent().removeClass("favorite");
	            }
	            saveFavorites();
	        });
	    }
	}
	
	function saveFavorites() {
		helper.setValue("FAVOURITES", JSON.stringify(favorites));
	}

}

