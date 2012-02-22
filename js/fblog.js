var offset = 0,
	total = 0,
	connected = false,
	notes_per_page = 2;

$( function () {
	FB.init({
		appId: '202413536445428',
		status: true,
		cookie: true,
		oauth: true
	});

	$( '#bt-login' ).click( function () {
		if ( connected == false ) {
			FB.login( function ( response ) {
				if ( response.authResponse ) {
					connected = true;

					$( '#bt-login span' ).html( 'Log Out' );
					$( '#container' ).fadeIn( 'slow' );
					$( 'h4.category_title' ).click( function () {
						$( this ).siblings( 'ul' ).slideToggle();
					});
					getNotes();
					getInfo();
				} else {
					alert( 'User cancelled login or did not fully authorize.' );
					$( '#bt-login span' ).html( 'Log In' );
				}
			}, { scope: 'user_notes,user_events,read_stream,user_work_history,user_location,user_birthday,user_likes' });
		} else {
			$( '#bt-login span' ).html( 'Log Out' );
			FB.logout( function () {
				$( '#container' ).fadeOut( 'slow', function () {
					window.location.assign( 'http://myfblog.com.local' );
				});
			});
		}

	});
});

//fetch user's notes
function getNotes () {
	FB.api( '/me/notes', { limit: 0 }, function ( notes ) {
		total = notes.data.length;
		notesData( offset );
	});
}

//format note's content to look like a post
function notesData ( offset ) {
	FB.api( '/me/notes', { limit: notes_per_page, date_format: 'r', offset: offset }, function ( json ) {
		$( '#content' ).empty();

		$.each( json.data, function( i, note ) {
			var dt = new Date( note.created_time ),
				day = ( dt.getDate() < 10 ? '0' + ( dt.getDate() ) : dt.getDate() ),
				month = dt.getMonth() + 1,
				year = dt.getFullYear(),
				hour = dt.getHours(),
				minute = ( dt.getMinutes() < 10 ? '0' + ( dt.getMinutes() ) : dt.getMinutes() );

			$( '#content' ).append(
				'<div id="' + note.id + '" class="note">\
					<h2>' + note.subject + '</h2>\
					<div class="note-date">Postado em ' + day + '/' + month + '/' + year + ' às ' + hour + 'h' + minute +'.</div>\
					<br />\
					<div>' + note.message + '</div>\
				</div>'
			);
		});

		$( '#paginacao' ).empty();

		if( offset >= notes_per_page ){
			$( '<a id="bt-ant" class="bt-paginacao anterior" href="#">anterior</a>' ).click( function () {
				offset -= notes_per_page;   
				notesData( offset );
			}).appendTo( '#paginacao' );
		}

		if ( ( total - offset ) > notes_per_page ) {
			$( '<a id="bt-prox" class="bt-paginacao proximo" href="#">próximo</a>' ).click( function () {
				offset += notes_per_page;
				notesData( offset );
			}).appendTo( '#paginacao' );
		}
	});
}

function monta_pagina ( dom_id, options ) {
	FB.api( '/' + options.id, { fields: options.fields }, function ( json ) {
		$( dom_id + ' ul.presentation' ).append(
			'<li id="page_' + options.id + '">\
				<div class="title_page" onclick="mostra_opcoes(this)">' + options.name + '</div>\
				<div><img style="float:left;padding-right:5px;" src="' + json.picture + '" />\
					<ul style="float:left" class="page_options">\
					<li><a href="javascript:load_feed(' + options.id + ')">- feed</a></li>\
					<li><a href="javascript:load_notes(' + options.id + ')">- notes</a></li>\
					</ul>\
				</div>\
				<div style="clear:both"></div>\
				<div class="feed">\
					<h4>Feed</h4>\
				</div>\
				<div class="notes">\
					<h4>Notas</h4>\
				</div>\
			</li>'
		);
	});
}

function load_feed ( id ) {
	if ( $( '#page_' + id ).find( 'div.feed' ).val() == '' ) {
		$( '#page_' + id ).find( 'div.feed' ).val( '1' );
		FB.api( '/' + id + '/feed', function ( json ) {
			$( json.data ).each( function ( i, val ) {
				$( '#page_' + id ).find( 'div.feed' ).append( '<div><span>' + val.message + '</span><br/><span class="feed_by">' + val.from.name + '</span><div style="clear:both"></div></div>' );
			});
			$( '#page_' + id ).find( 'div.feed' ).slideDown();
		});
	} else {
		$( '#page_' + id ).find( 'div.feed' ).slideToggle();
	}
}

function load_notes ( id ) {
	if( $( '#page_' + id ).find( 'div.notes' ).val() == '' ) {
		$( '#page_' + id ).find( 'div.notes' ).val( '1' );
		FB.api( '/' + id + '/notes', function ( json ) {
			$( json.data ).each( function ( i, val ) {
			   $( '#page_' + id ).find( 'div.notes' ).append( '<div><span>' + val.message + '</span><br/><span class="feed_by">' + val.from.name + '</span><div style="clear:both"></div></div>' );
			});
			$( '#page_' + id ).find( 'div.notes' ).slideDown();
		});
	} else {
		$( '#page_' + id ).find( 'div.notes' ).slideToggle();
	}
}

function mostra_opcoes ( objeto ) {
   $( objeto ).parent().find( 'div ul.page_options' ).toggle(); 
}

//Box user, sidebar
function getInfo () {
	FB.api( '/me', { fields: 'name,work,location,birthday,events,picture,music,movies,television,books,feed', limit: 3 }, function ( json ) {
		var bday = new Date( json.birthday ),
		today = new Date(),
		bday = Math.floor( ( ( ( ( (today.valueOf() - bday.valueOf() ) /1000 ) /60 ) /60 ) /24 ) /365 );

		$( '#users' ).append(
			'<div class="user">\
				<img class="avatar" src="' + json.picture + '" />\
				<div id="fb_infos">\
						<ul><li><span class="name"></span>' + json.name + '</li>\
						<li><span class="location"></span>' + ( ( json.hasOwnProperty( 'location' ) === true ) ? json.location.name : 'Nárnia' ) + '</li>\
						<li><span class="work"></span>' + json.work[0].employer.name + '</li>\
						<li><span class="age"></span>' + bday + ' anos</li></ul>\
				</div>\
				<div id="timeline"></div>\
			</div>'
		);
			
		//timeline 
		var tmline = json.feed.data;
		for ( var i = 0, max = tmline.length; i < max; i++){
			if ( tmline[i].message == undefined ) {
			   
			} else {
				$( '#timeline' ).append( '<strong>' + tmline[i].from.name + '</strong><br />' + tmline[i].message + '<br />' );
			}
		}
		$( '#users .user' ).animate({
			height: '+=' + $( '#timeline' ).css( 'height' )
		}, 500 );
		
		//likebox
		var liketv = json.television.data;
		for( var i = 0, max = liketv.length; i < max; i += 1 ) {
			monta_pagina( '#tv', {
				'id': liketv[i].id ,
				'name': liketv[i].name,
				'fields':'feed,notes,picture'
			});
		}
		
		var likemusic = json.music.data;
		for ( var i = 0, max = likemusic.length; i < max; i++ ) {
			monta_pagina( '#music', {
				'id': likemusic[i].id ,
				'name': likemusic[i].name,
				'fields':'feed,notes,picture'
			});
		}
		
		var likebook = json.books.data;
		for ( var i = 0, max = likebook.length; i < max; i++ ) {
			monta_pagina( '#book', {
				'id': likebook[i].id ,
				'name': likebook[i].name,
				'fields':'feed,notes,picture'
			});
		}
		
		var likemovie = json.movies.data;
		for ( var i = 0, max = likemovie.length; i < max; i++ ) {
			monta_pagina( '#movie', {
				'id': likemovie[i].id ,
				'name': likemovie[i].name,
				'fields':'feed,notes,picture'
			});
		}
	});
}