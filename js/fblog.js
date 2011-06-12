		var accessToken = '202413536445428%7C86a78b7d6b72166f5784c3a2.1-100000089354350%7CMt0KOirRFQi6P4c1TAR9wteyzOw';
		var offset = 0;
		var total = 0;
		var num_comments = 1;
		var notes_per_page = 3;
		var fb_url = 'https://graph.facebook.com/portalnaturamusical/notes?access_token='+ accessToken +'&date_format=r&limit='+notes_per_page+'&expires_in=0&offset=%OFFSET%';
		
		function getNotes(){
			$.ajax({
				url: 'https://graph.facebook.com/portalnaturamusical/notes?access_token='+ accessToken +'&limit=0&expires_in=0',
				dataType: 'jsonp',
				async: true,
				success: 
					function(json){
						total = json.data.length;
						notesData(fb_url.replace('%OFFSET%', offset));
					}
			});
		}
		
		function notesData(url){
			$.ajax({
				url: url,
				dataType: 'jsonp',
				async: true,
				success: 
					function(json){
						$('#tl-response').empty();
						$.each(json.data, function(i, note){
							var data = new Date(note.created_time);
							var dia = (data.getDate() < 10 ? '0'+(data.getDate()) : data.getDate());
							var mes = data.getMonth()+1;
							var ano = data.getFullYear();
							var hora = data.getHours();
							var minuto = (data.getMinutes() < 10 ? '0'+(data.getMinutes()) : data.getMinutes());
							
							$('#tl-response').append(
								'<div id="'+ note.id +'" class="note"><h2>'+ note.subject +'</h2><div class="note-date">Postado em '+ dia + '/' + mes + '/' + ano + ' às ' + hora + 'h' + minuto +'.</div><br /><div>'+ note.message  
								+ '</div></div>');
							

							//$('#tl-response').append('<fb:comments href="http://www.facebook.com/note.php?note_id='+ note.id +'" num_posts="'+num_comments+'"></fb:comments>');							
							
							//<fb:like href="http://www.facebook.com/note.php?note_id='+ note.id +'" send="false" layout="button_count" show_faces="false"></fb:like>
							//
							
						});
						
						FB.init({appId  : '202413536445428', status : true, cookie : true, xfbml  : true});
						
						$('#paginacao').empty();
							
						if(offset >= notes_per_page){
							$('<a id="bt-ant" class="bt-paginacao anterior" href="#sobre-festival">anterior</a>').click(function(){
								offset -= notes_per_page;	
								notesData(fb_url.replace('%OFFSET%', offset));
							}).appendTo('#paginacao');
						}
						
						if((total - offset) > notes_per_page){
							$('<a id="bt-prox" class="bt-paginacao proximo" href="#sobre-festival">próximo</a>').click(function(){
								offset += notes_per_page;
								notesData(fb_url.replace('%OFFSET%', offset));
							}).appendTo('#paginacao');
						}
					}
			});
		}
			
		$('document').ready(function(){
			getNotes();
		});