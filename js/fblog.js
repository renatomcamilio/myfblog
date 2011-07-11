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
					var data = new Date(note.created_time);
					var dia = (data.getDate() < 10 ? '0'+(data.getDate()) : data.getDate());
					var mes = data.getMonth()+1;
					var ano = data.getFullYear();
					var hora = data.getHours();
					var minuto = (data.getMinutes() < 10 ? '0'+(data.getMinutes()) : data.getMinutes());
					
					$('#content').append(
						'<div id="'+ note.id +'" class="note"><h2>'+ note.subject +'</h2><div class="note-date">Postado em '+ dia + '/' + mes + '/' + ano + ' às ' + hora + 'h' + minuto +'.</div><br /><div>'+ note.message  
						+ '</div></div>');
					

					//$('#content').append('<fb:comments href="http://www.facebook.com/note.php?note_id='+ note.id +'" num_posts="'+num_comments+'"></fb:comments>');							
					
					//<fb:like href="http://www.facebook.com/note.php?note_id='+ note.id +'" send="false" layout="button_count" show_faces="false"></fb:like>
					//
					
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
		url: 'https://graph.facebook.com/'+ user_id +'?access_token='+ accessToken +'&fields=name,work,location,birthday,picture,feed&limit=3',
		dataType: 'jsonp',
		async: true,
		success: 
			function(json){
				var bday = new Date(json.birthday),
				today = new Date(),
				bday = Math.round((((((today.valueOf() - bday.valueOf())/1000)/60)/60)/24)/365);
				
				$('#sidebar').append('<div id="users"><div class="user"><img class="avatar" src="'+ json.picture +'" /><div id="fb_infos"><ul><li>'+ json.name +'</li><li>'+ json.location.name +'</li><li>'+ json.work[0].employer.name +'</li><li>'+ bday +' anos</li></ul></div></div></div>');
				console.log(json);
			}
	});
}

	
$('document').ready(function(){
	getNotes();
	getInfo();
});
