
$(document).ready(function (){  ml.polls.load() });

ml.polls = {

	load: function () {
		ml.polls.addAndRemove_inputs();
		ml.polls.sortable_inputs();
		ml.polls.remove_empty_alternatives();
		ml.polls.reports.chart.render();
		ml.polls.reports.chart.resize();
		ml.polls.reports.tabbed.update(null);
		ml.polls.subscribeAndListen();
		ml.polls.pluralize();
	},

	addAndRemove_inputs: function () {
		    var max_fields      = 10; //maximum input boxes allowed
		    var wrapper         = $(".input_fields_wrap"); //Fields wrapper
		    var add_button      = $(".add_field_button"); //Add button ID
		    
		    var x = 1; //initlal text box count
		    $(add_button).click(function(e){ //on add input button click
		    	e.preventDefault();
		        if(x < max_fields){ //max input box allowed
		            x++; //text box increment
		            $(wrapper).append('<div class="input-group alternative glyphicon glyphicon-move order_alternative"><input style="max-width:93%;float:right" class="form-control" name="alternatives[]" type="text" placeholder="Descrição da alternativa..." /><span class="input-group-btn remove_field"><button class="btn btn-danger" type="button"><span class="glyphicon glyphicon-remove"></span></button></span></div>'); //add input box
		         }
		         $('.input_fields_wrap div input').focus();
		      });
		    
		    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
		    	e.preventDefault(); $(this).parent('div').remove(); x--;
		    })
		 },

		 sortable_inputs: function () {

		 	$(".question").sortable({
		 		tolerance: 'pointer',
		 		revert: 'invalid',
		 		placeholder: 'span2 alternative',
		 		sort: function( event, ui ) {
		 			console.log(event);
		 			console.log(ui);
		 		},
		 		forceHelperSize: true
		 	});
		 },

		 remove_empty_alternatives: function () {
		 	$(".btn_save_altvs").click(function() {
		 		var form = $("#form_update_altvs");
		 		$(form).find('input.form-control').each(function(){
		 			var input = $.trim($(this).val());
		 			var numbers_input = $(form).find('input.form-control').size();

		 			if(input.length === 0 && numbers_input > 2) {
					//Remove div pai do input vazio
					$(this).parents('div.alternative').remove();
				} 
			});
		 	});
		 },
		
	reports: {
		//Gerencia atualização do relatório gráfico
		chart: {	 
			render: function() {
			 		if ($('#chart_div').length === 0) return false;
			  		
			  		$('#chart_div').removeData("chart-json");
			  	    var jsonData = $('#chart_div').data('chart-json'); 

			  	    var data = new google.visualization.DataTable(jsonData);

				    // Set chart options
				    var options = {title:'Relatório',  is3D: true,
				    titlePosition: '<output></output>',
				    legend: {position: 'bottom', textStyle: {bold:true}}, 
				    width: '100%',
				    height: '100%',
				    chartArea: {
				    	left: "4%",
				    	top: "0%",
				    	height: "94%",
				    	width: "94%"}
				    };
				    var chart_div = document.getElementById('chart_div');
				    var chart  = new google.visualization.PieChart(chart_div);
			    	// google.visualization.events.addListener(chart, 'ready', function () {
			    	//        chart_div.innerHTML = '<img src="' + chart.getImageURI() + '">';
			    	//        console.log(chart_div.innerHTML);
			    	//      });
					chart.draw(data, options);

					google.visualization.events.addListener(chart, 'ready', function() {
			            // Do something like ...
			            //$('#chart_div').css('visibility', 'visible'); // provided this was already hidden
			            $('.loading-icon').show(); // if it exists in your HTML */
			        });
			},


			resize: function () {
				if ($('#chart_div').length === 0) return false;
			    	$(window).resize(function() {
			    		ml.polls.reports.chart.render();
			    	});
			},
		},

		//Gerencia atualização do relatório tabulado
		tabbed: {
	 		update: function(data) {
	 			
		 		if ($('#report-table-poll').length === 0 || data === null) return false;
		 		
		 		var poll = data;
		 		$('#participants').text(poll.id.number_participants);

		 		var total_votes = poll.id.number_votes;
		 		$('#total_votes').text(ml.polls.pluralize(total_votes, 'voto'));

		 		var a = Number($('#abstention').text());
		 		a--;
		 		$('#abstention').text(a);

				$.each(poll.statistics.rows, function(index, alternative){
				     $('#'+index).text(ml.polls.pluralize(alternative.c[1].v, 'voto'));
				});
	 		}
	 	}
	},	
 

 subscribeAndListen: function () {
 	if ($('#poll-open').length <= 0) {return;}

 	var session_id = $('#session-open').data('session_id');
 	var poll_id = $('#poll-open').data('poll_id');

 	url = '/speaker/sessions/'+session_id+'/polls/'+poll_id+'/pollanswers/subscribe';
 	io.socket.post(url, function (data){
 		console.log('PollAnswers Subscribed!');
 	});

 	io.socket.on('pollanswer',function(obj){
 		console.log('Pollanswer Verb: '+obj.verb);
 		if(obj.verb == 'created') {
				
				var new_statistics = obj.data.statistics;
				$('#chart_div').attr('data-chart-json', JSON.stringify(new_statistics));
				ml.polls.reports.chart.render();
				ml.polls.reports.tabbed.update(obj.data);
				
				var notification = ml.toast.new('info', 'Enquete', 'Uma nova resposta de enquete recebida!');
				
				ml.toast.show(notification);
			}
		});
 },

 	pluralize: function(n, context) {
 		if ($('#poll-open').length <= 0) {return;}

		 (n !== 1) ? n+=' '+context+'s' : n+=' '+context;
		 return n;
	}
};

