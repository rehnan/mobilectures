$(document).ready(function (){  ml.doubts.load() });

ml.doubts = {

	load: function () {
		ml.doubts.modal();
		ml.doubts.show_doubt_description();
		ml.doubts.destroy_doubt();
		ml.doubts.check_doubt();
		ml.doubts.subscribeAndListen();
		ml.doubts.update_doubt_count();
	},

	modal: function(){
		$("[data-toggle=tooltip]").tooltip();
	},

	show_doubt_description: function () {
		$('#doubts-table table tbody').on('click', 'button.show_doubt',function (event) {
			event.preventDefault();
			var id = $(this).attr('href');
			var msg = $(this).closest('tbody').find(id);
			msg.toggleClass('hidden');
		});
	},

	destroy_doubt: function () {
		$('#doubts-table table tbody').on('click', 'button.destroy_doubt', function(event) {
			event.preventDefault();
			var btn_destroy = $(this);

			var session_id = $('#session-open').attr('data-session_id');
			var doubt_id = btn_destroy.attr('name');

			url = '/speaker/sessions/'+session_id+'/doubts/'+doubt_id;
			io.socket.delete(url, function (data){
				//Recarregar página
				window.location.reload();
				console.log('Doubt deleted!');
			});
		});
	},

	check_doubt: function () {
		$('#doubts-table table tbody').on('click', 'button.check_doubt', function(event) {
			event.preventDefault();
			var btn_check = $(this);

			var session_id = $('#session-open').attr('data-session_id');
			var doubt_id = btn_check.attr('doubt_id');

			var url = '/speaker/sessions/'+session_id+'/doubts/check/'+doubt_id;

			io.socket.post(url, function (data){
				//Recarregar página
				window.location.reload();
				console.log('Doubt checked!');
			});
			/*
			if(btn_check.attr('answered') === 'no') {
				//btn_check.removeClass("btn-warning").addClass("btn-success");
				//btn_check.parents('tr').removeClass("warning").addClass("success");
				//btn_check.text('Respondida');
				//btn_check.append(' <span class="glyphicon glyphicon-check"></span>')
				btn_check.attr('answered', 'yes');
			} else {
				//btn_check.removeClass("btn-success").addClass("btn-warning");
				//btn_check.parents('tr').removeClass("success").addClass("warning");
				//btn_check.text('Responder');
				//btn_check.append(' <span class="glyphicon glyphicon-check"></span>')
				btn_check.attr('answered', 'no');
			}
			*/ 
		});
	},

	subscribeAndListen: function () {
		if ($('#session-open').length <= 0) {return;}
		var session_id = $('#session-open').attr('data-session_id');
		
		url = '/speaker/sessions/'+session_id+'/doubts/subscribe';
		io.socket.post(url, function (data){
			console.log('Doubts Subscribed!');
			console.log(data);
		});

		io.socket.on('doubt',function(obj){
			console.log('Doubt Verb: '+obj.verb);
			if(obj.verb == 'created') {
				//A página atualiza se tabela de dúvidas estiver sendo exibida
				($('#doubts-table').length <= 0) ? ml.doubts.update_doubt_count() :  window.location.reload(); 
				console.log(obj.verb);
			}
			//if(obj.verb == 'updated')
		});
	},

	update_doubt_count: function () {
		if ($('#badge_doubt_count').length <= 0) {return;}
		var doubt_badge = $('#badge_doubt_count');
		var session_id = $('#session-open').attr('data-session_id');

		var url = '/speaker/sessions/'+session_id+'/doubts/count'

		$.ajax({
			type: 'GET',
			dataType: 'json',
			url: url,
			success: function(doubts, status) { 
				console.log(JSON.stringify(doubts.count));
				doubt_badge.text(doubts.count);
			},
			error: function(doubts, status) {
				console.log(JSON.stringify(doubts));
			},
		});

		return false;
	}
}