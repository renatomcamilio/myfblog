var accessToken = '202413536445428%7Cf6603c428e38e77e46096006.1-100000732180990%7Cp6TKxT-JIY65VB3Ep87scfOLbm0&expires_in=0';
var offset = 0;
var total = 0;
var num_comments = 1;
var notes_per_page = 2;
var user_id = 're.camilio';
var graph_note = 'https://graph.facebook.com/'+ user_id +'/notes?access_token='+ accessToken +'&date_format=r&limit='+notes_per_page+'&offset=%OFFSET%';

//Busca os notes do usuario
function getNotes(){
	$.ajax({
		url: 'https://graph.facebook.com/'+ user_id +'/notes?access_token='+ accessToken +'&limit=0',
		dataType: 'jsonp',
		async: true,
		success: 
			function(json){
				total = json.data.length;
				notesData(graph_note.replace('%OFFSET%', offset));
			}
	});
}

//Formata o conteúdo do note para ficar com 'look' de post
function notesData(url){
	$.ajax({
		url: url,
		dataType: 'jsonp',
		async: true,
		success: 
			function(json){
				$('#content').empty();

				$.each(json.data, function(i, note){
					var dt = new Date(note.created_time);
					var dia = (dt.getDate() < 10 ? '0'+(dt.getDate()) : dt.getDate());
					var mes = dt.getMonth()+1;
					var ano = dt.getFullYear();
					var hora = dt.getHours();
					var minuto = (dt.getMinutes() < 10 ? '0'+(dt.getMinutes()) : dt.getMinutes());
					
					$('#content').append(
						'<div id="'+ note.id +'" class="note">' +
							'<h2>'+ note.subject +'</h2>' +
							'<div class="note-date">Postado em '+ dia + '/' + mes + '/' + ano + ' às ' + hora + 'h' + minuto +'.</div>' +
							'<br />' +
							'<div>'+ note.message + '</div>' +
						'</div>');
					
				});
				
				FB.init({appId  : '202413536445428', status : true, cookie : true, xfbml  : true});
				
				$('#paginacao').empty();
					
				if(offset >= notes_per_page){
					$('<a id="bt-ant" class="bt-paginacao anterior" href="#">anterior</a>').click(function(){
						offset -= notes_per_page;	
						notesData(graph_note.replace('%OFFSET%', offset));
					}).appendTo('#paginacao');
				}
				
				if((total - offset) > notes_per_page){
					$('<a id="bt-prox" class="bt-paginacao proximo" href="#">próximo</a>').click(function(){
						offset += notes_per_page;
						notesData(graph_note.replace('%OFFSET%', offset));
					}).appendTo('#paginacao');
				}
			}
	});
}

//Box user, sidebar
function getInfo(){
	$.ajax({
		url: 'https://graph.facebook.com/'+ user_id +'?access_token='+ accessToken +'&fields=name,work,location,birthday,events,picture,music,movies,television,books,feed&limit=3',
		dataType: 'jsonp',
		async: true,
		success: 
			function(json){
				var bday = new Date(json.birthday),
				today = new Date(),
				bday = Math.round((((((today.valueOf() - bday.valueOf())/1000)/60)/60)/24)/365);
				
				$('#sidebar')
				.append('<div id="users">' +
							'<div class="user">' +
								'<img class="avatar" src="'+ json.picture +'" />' +
								'<div id="fb_infos">' +
									'<ul><li><span class="name"></span>'+ json.name +'</li>' +
									'<li><span class="location"></span>'+ json.location.name +'</li>' +
									'<li><span class="work"></span>'+ json.work[0].employer.name +'</li>' +
									'<li><span class="age"></span>'+ bday +' anos</li></ul>' +
								'</div>' +
								'<div id="timeline"></div>' +
							'</div>' +
						'</div>' +
						'<div id="likebox">' +
							'<div class="tv"><ul></ul></div>' +
							'<div class="music"><ul></ul></div>' +
							'<div class="book"><ul></ul></div>' +
							'<div class="movie"><ul></ul></div>' +
						'</div>');
				
				//timeline 
				var tmline = json.feed.data;
				for(var i = 0, max = tmline.length; i < max; i++){
					$('.user #timeline')
					.append('<strong>' + tmline[i].from.name + '</strong><br />'+ tmline[i].message + '<br />');
				}
				//likebox
				//tv-show likes
				var liketv = json.television.data;
				console.log(liketv);
				//for(var i = 0, max = liketv.length; i < max; i++){
					$('#likebox .tv ul')
					.append('<li>'+ liketv[0].name +'</li>');
				//}
				//musics likes
				var likemusic = json.music.data;
				//for(var i = 0, max = likemusic.length; i < max; i++){
					$('#likebox .music ul')
					.append('<li>'+ likemusic[0].name +'</li>');
				//}
				//books likes
				var likebook = json.books.data;
				//for(var i = 0, max = likebook.length; i < max; i++){
					$('#likebox .book ul')
					.append('<li>'+ likebook[0].name +'</li>');
				//}
				//movies likes
				var likemovie = json.movies.data;
				//for(var i = 0, max = likemovie.length; i < max; i++){
					$('#likebox .movie ul')
					.append('<li>'+ likemovie[0].name +'</li>');
				//}
			}
	});
}

	
$('document').ready(function(){
	getNotes();
	getInfo();
});
