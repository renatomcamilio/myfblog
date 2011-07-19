var accessToken = '202413536445428%7Cf6603c428e38e77e46096006.1-100000732180990%7Cp6TKxT-JIY65VB3Ep87scfOLbm0&expires_in=0',
    offset = 0,
    total = 0,
    num_comments = 1,
    notes_per_page = 2,
    user_id = 're.camilio',
    graph_note = 'https://graph.facebook.com/'+ user_id +'/notes?access_token='+ accessToken +'&date_format=r&limit='+notes_per_page+'&offset=%OFFSET%';
    
var graph_url = 'https://graph.facebook.com/',
    feed_url = graph_url + '%PAGE%' + '/feed',
    feed_url = graph_url + '%PAGE%' + '/feed';

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

function monta_pagina(dom_id,options) {
    var url = graph_url + options.id + '?fields=' + options.fields + '&access_token='+accessToken;
    console.log("Fazendo uma pagina!");
    $.ajax({
        url: url,
        dataType: 'jsonp',
        success: function(json){
             $(dom_id + " ul.presentation").append(
                '<li id="page_'+options.id+'">' +
                '<div class="title_page" onclick="mostra_opcoes(this)">' + options.name + '</div>' +
                '<div><img style="float:left;padding-right:5px;" src="' + json.picture + '" />'+
                   '<ul style="float:left" class="page_options">'+
                   '<li><a href="javascript:load_feed('+options.id+')">- feed</a></li>' +
                   '<li><a href="javascript:load_notes('+options.id+')">- notes</a></li>' +
                   '</ul>' +
                '</div>' +
                '<div style="clear:both"></div>'+
                '<div class="feed">'+
                    '<h4>Feed</h4>' +
                '</div>' +
                '<div class="notes">'+
                    '<h4>Notas</h4>' +
                '</div>' +
                '</li>'
            );
                
            /*var feed_html = '';
            for (var i=0, max = json.feed.data.length; i<max; i += 1) {
                var atom = json.feed.data[i];
                feed_html += '<div>'+atom.message+'</div>';
            }
            $(dom_id + " ul div.feed").append(feed_html);
            */
        } 
    });
}
function load_feed(id) {
    if($("#page_"+id).find('div.feed').val()=='') {
        $("#page_"+id).find('div.feed').val('1');
        $.ajax({
            url: graph_url + id + '/feed?access_token=' + accessToken,
            dataType: 'jsonp',
            success: function(json){
                $(json.data).each(function(i,val){
                    console.log(val);
                   $("#page_"+id).find('div.feed').append('<div><span>'+val.message+'</span><br/><span class="feed_by">'+val.from.name+'</span><div style="clear:both"></div></div>');
                });
                $("#page_"+id).find('div.feed').slideDown();
            }
        });
    } else {
        $("#page_"+id).find('div.feed').slideToggle();
    }
}
function load_notes(id) {
    if($("#page_"+id).find('div.notes').val()=='') {
        $("#page_"+id).find('div.notes').val('1');
        $.ajax({
            url: graph_url + id + '/notes?access_token=' + accessToken,
            dataType: 'jsonp',
            success: function(json){
                console.log("Sucesso do load_notes");
                console.log(json);
                $(json.data).each(function(i,val){
                   $("#page_"+id).find('div.notes').append('<div><span>'+val.message+'</span><br/><span class="feed_by">'+val.from.name+'</span><div style="clear:both"></div></div>');
                });
                $("#page_"+id).find('div.notes').slideDown();
            }
        });
    } else {
        $("#page_"+id).find('div.notes').slideToggle();
    }
}
function mostra_opcoes (objeto){
   console.log("Clicou!");
   $(objeto).parent().find('div ul.page_options').toggle(); 
}

//Box user, sidebar
function getInfo(){
	$.ajax({
		url: 'https://graph.facebook.com/'+ user_id +'?access_token='+ accessToken +'&fields=name,work,location,birthday,events,picture,music,movies,television,books,feed&limit=3',
		dataType: 'jsonp',
		success: 
                    function(json){
                        var bday = new Date(json.birthday),
                        today = new Date(),
                        bday = Math.round((((((today.valueOf() - bday.valueOf())/1000)/60)/60)/24)/365);

                        $('#users').append(
                            '<div class="user">' +
                                '<img class="avatar" src="'+ json.picture +'" />' +
                                '<div id="fb_infos">' +
                                        '<ul><li><span class="name"></span>'+ json.name +'</li>' +
                                        '<li><span class="location"></span>'+ json.location.name +'</li>' +
                                        '<li><span class="work"></span>'+ json.work[0].employer.name +'</li>' +
                                        '<li><span class="age"></span>'+ bday +' anos</li></ul>' +
                                '</div>' +
                                '<div id="timeline"></div>' +
                            '</div>');
                        
                         $("#likebox").append(
                                
                        );
				
			//timeline 
                        var tmline = json.feed.data;
                        for(var i = 0, max = tmline.length; i < max; i++){
                            //console.log(tmline[i]);
                            $('#timeline').append('<strong>' + tmline[i].from.name + '</strong><br />'+ tmline[i].message + '<br />');
                        }
                        //likebox
                        
                        var liketv = json.television.data;
                        for(var i = 0, max = liketv.length; i < max; i += 1){
                            monta_pagina("#tv",{
                                'id': liketv[i].id ,
                                'name': liketv[i].name,
                                'fields':'feed,notes,picture'
                            });
                        }
                        
                        var likemusic = json.music.data;
                        for(var i = 0, max = likemusic.length; i < max; i++){
                            monta_pagina("#music",{
                                'id': likemusic[i].id ,
                                'name': likemusic[i].name,
                                'fields':'feed,notes,picture'
                            });
                        }
                        
                        var likebook = json.books.data;
                        for(var i = 0, max = likebook.length; i < max; i++){
                            monta_pagina("#book",{
                                'id': likebook[i].id ,
                                'name': likebook[i].name,
                                'fields':'feed,notes,picture'
                            });
                        }
                        
                        var likemovie = json.movies.data;
                        for(var i = 0, max = likemovie.length; i < max; i++){
                            monta_pagina("#movie",{
                                'id': likemovie[i].id ,
                                'name': likemovie[i].name,
                                'fields':'feed,notes,picture'
                            });
                        }
                }
	});
}

	
$('document').ready(function(){
	getNotes();
	getInfo();
    $("h4.category_title").click(function(){
        $(this).siblings("ul").slideToggle();
    });
});
