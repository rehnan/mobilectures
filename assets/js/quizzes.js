
$(document).ready(function (){  ml.quizzes.load() });

ml.quizzes = {

	load: function () {
		ml.quizzes.addAndRemove_inputs();
		ml.quizzes.sortable_inputs();
		ml.quizzes.remove_empty_alternatives();
		ml.quizzes.pending_info();
		ml.quizzes.reports.chart.render(null);
		ml.quizzes.reports.chart.render_all();
		ml.quizzes.reports.chart.resize(null);
		ml.quizzes.reports.tabbed.update(null);
		ml.quizzes.subscribeAndListen();
	},

	addAndRemove_inputs: function () {
		if ($('#form_question').length <= 0) {return;}

		    var max_fields      = 10; //maximum input boxes allowed
		    var wrapper         = $(".input_fields_wrap"); //Fields wrapper
		    var add_button      = $(".add_field_button"); //Add button ID
		    
		    var x = 1; //initlal text box count
		    $(add_button).click(function(e){ //on add input button click
		    	e.preventDefault();
		        if(x < max_fields){ //max input box allowed
		            x++; //text box increment
		            $(wrapper).append('<div class="input-group alternative glyphicon glyphicon-move order_alternative"><span class="input-group-addon"><input type="radio" name="correct_alternative" value="'+x+'"></span><input style="max-width:100%;float:right" class="form-control" name="alternatives[]" type="text" placeholder="Descrição da alternativa..." /><span class="input-group-btn remove_field"><button class="btn btn-danger" type="button"><span class="glyphicon glyphicon-remove"></span></button></span></div>'); //add input box
		         }
		         $('.input_fields_wrap div input').focus();
		      });
		    

		    $(wrapper).on("click",".remove_field", function(e){ //user click on remove text
		    	e.preventDefault(); $(this).parent('div').remove(); x--;
		    })
		 },

		 sortable_inputs: function () {
		 	if ($('#form_question').length <= 0) {return;}

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
		 	if ($('#form_question').length <= 0) {return;}

		 	$(".btn_save_altvs").click(function() {
		 		var form = $("#form_question");
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

		 pending_info: function () {
		 	if ($('#table_questions').length <= 0) {return;}
		 	$('.popoverInfo').popover({ trigger: "hover" });
		 },

		 reports: {
		//Gerencia atualização do relatório gráfico
		chart: {	 
			render: function(question_id) {
			 		if ($('#chart_div_'+question_id).length === 0) return false;
			  		
			  		$('#chart_div_'+question_id).removeData("chart-json");
			  	    var jsonData = $('#chart_div_'+question_id).data('chart-json'); 
			  	    jsonData.unshift(['Alternativas', 'Votos']);

			  	    /*var jsonGraph = ['Alternativas', 'Votos'];
			  	    jsonGraph.push(jsonData);*/
			  	    console.log(jsonData);
			  	    var data = google.visualization.arrayToDataTable(jsonData);

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

				var chart_div = document.getElementById('chart_div_'+question_id);
        		var chart = new google.visualization.PieChart(chart_div);

        		chart.draw(data, options);

        		
				google.visualization.events.addListener(chart, 'ready', function() {
		            // Do something like ...
		            //$('#chart_div').css('visibility', 'visible'); // provided this was already hidden
		            $('.loading-icon').show(); // if it exists in your HTML */
		        });
			},


			resize: function () {
				if ($('#quiz-open').length === 0) { return false; }
			    	$(window).resize('.chart_div', function() {
			    		for (i = 0; i < $('.chart_div').length; i++) { 
				  			var question_id = $("div[index_"+i+"]").attr("index_"+i)
				  			ml.quizzes.reports.chart.render(question_id);
						}
			    	});
			},

			render_all: function () {
				if ($('#quiz-open').length === 0) { return false };
			  	
			  	for (i = 0; i < $('.chart_div').length; i++) { 
		  			var question_id = $("div[index_"+i+"]").attr("index_"+i)
		  			ml.quizzes.reports.chart.render(question_id);
				}
			}
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
		 	if ($('#quiz-open').length <= 0) {return;}
		 	
		 	var session_id = $('#session-open').data('session_id');
		 	var quiz_id = $('#quiz-open').data('quiz_id');

		 	url = '/speaker/sessions/'+session_id+'/quizzes/'+quiz_id+'/quizanswers/subscribe';
		 	io.socket.post(url, function (data){
		 		console.log('QuizAnswers Subscribed!');
		 	});

		 	io.socket.on('quizanswer',function(obj){
		 		console.log('Quizanswer Verb: '+obj.verb);
		 		if(obj.verb == 'created') {
		 			console.log(obj.data);
		 			var new_statistics = obj.data.statistics;
		 			var question_id = obj.data.id;
		 			$('#chart_div_'+question_id).attr('data-chart-json', JSON.stringify(new_statistics));
		 			ml.quizzes.reports.chart.render(question_id);
		 			//ml.polls.reports.tabbed.update(obj.data);

		 			var notification = ml.toast.new('info', 'Quiz', 'Uma nova resposta de quiz recebida!');

		 			ml.toast.show(notification);
		 		}
		 	});
		 },


		};