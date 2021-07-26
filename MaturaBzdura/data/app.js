window.onload = function() {
	load_booklist();
}

window.questions_order = [];

function randomize_questions_order()
{
	var num_digits = 0;
	var num = parseInt(window.questions.length);
	while(num != 0)
	{
		num = parseInt(num / 10);
		num_digits++;
	}
	var coefficient = parseInt(Math.pow(10, num_digits + 1));
	while(window.questions_order.length != window.questions.length)
	{
		var x = Math.floor(Math.random() * coefficient) % window.questions.length;
		if(window.questions_order.find(function(z) { return x == z }) == undefined)
			window.questions_order.push(x);
	}
}

function randomize_answers_order(question)
{
	var num_digits = 0;
	var num = parseInt(question.answers.length);
	while(num != 0)
	{
		num = parseInt(num / 10);
		num_digits++;
	}
	var coefficient = parseInt(Math.pow(10, num_digits + 1));
	while(question.randomized_answers_order.length != question.answers.length)
	{
		var x = Math.floor(Math.random() * coefficient) % question.answers.length;
		if(question.randomized_answers_order.find(function(z) { return x == z }) == undefined)
			question.randomized_answers_order.push(x);
	}
}

function show_questions()
{
	var handle = document.getElementById("app_main_mobile");
	randomize_questions_order();
	for(var i = 0; i < window.questions_order.length; i++)
	{
		randomize_answers_order(window.questions[window.questions_order[i]]);
		if(i == 0)
			handle.innerHTML = "";
		var page_fragment = `<div id=\"question_field_${window.questions_order[i]}\" class=\"question_field\"\">`;
		page_fragment += "<div id=\"question_box\">";
		page_fragment += `${i + 1}. `;
		page_fragment += window.questions[window.questions_order[i]].question.substr(2);
		page_fragment += "<br>\n</div>\n<div id=\"answers_box\">";
		var q = window.questions[window.questions_order[i]];
		for(var j = 0; j < window.questions[window.questions_order[i]].randomized_answers_order.length; j++)
		{
			if(q.question.substr(0, 2) == "1:")
			{
				page_fragment += `<input type=\"radio\" value=\"${q.randomized_answers_order[j]}\" name=\"question_${window.questions_order[i]}\">`;
				if(q.answers[q.randomized_answers_order[j]].substr(0, 1) == '=')
					page_fragment += q.answers[q.randomized_answers_order[j]].substr(1);
				else
					page_fragment += q.answers[q.randomized_answers_order[j]];
			}
			if(q.question.substr(0, 2) == "2:")
			{
				page_fragment += `<input type=\"checkbox\" id=\"question_${window.questions_order[i]}_${q.randomized_answers_order[j]}\">`;
				if(q.answers[q.randomized_answers_order[j]].substr(0, 1) == '=')
					page_fragment += q.answers[q.randomized_answers_order[j]].substr(1);
				else
					page_fragment += q.answers[q.randomized_answers_order[j]];
			}
			page_fragment += "<br>";
		}
		page_fragment += "</div></div>";
		handle.innerHTML += page_fragment;
	}
	handle.innerHTML += "<br><center><input type=\"button\" id=\"checkbutton\" value=\"Sprawdź\" onclick=\"check_answers()\"></center>";
	handle.innerHTML += "<br><div id=results></div>";
}

window.once_again_questions_list = [];
window.score = 0;

function check_answers()
{
	for(var i = 0; i < window.questions.length; i++)
	{
		var handle = document.getElementById(`question_field_${i}`);
		if(window.questions[i].type == "radio")
		{
			//console.log(`question: ${window.questions[i].question}`);
			//console.log(`correct answer: ${window.questions[i].answers[window.questions[i].correct_answers_indices[0]]}`);
			var radios = document.getElementsByName(`question_${i}`);
			var scored = false;
			for(var j = 0; j < radios.length; j++)
			{
				if(radios[j].checked && radios[j].value == window.questions[i].correct_answers_indices[0])
				{
					//console.log(`scored answer: ${window.questions[i].answers[j]}`);
					window.score++;
					scored = true;
				}
			}
			if(!scored)
				handle.style.backgroundImage = "linear-gradient(to bottom right, white, red)";
			else
			{
				handle.style.backgroundImage = "linear-gradient(to bottom right, white, green)";			
			}
		}
		if(window.questions[i].type == "checkbox")
		{
			var points_scored = 0;
			for(var j = 0; j < window.questions[i].answers.length; j++)
			{
				var checkbox = document.getElementById(`question_${i}_${j}`);
				if(checkbox.checked)
				{
					if(window.questions[i].correct_answers_indices.find(function(x) {return x == j }) != undefined)
						points_scored++;
					else
					{
						points_scored = 0;
						break;
					}
				}
				else
				{
					if(window.questions[i].correct_answers_indices.find(function(x) {return x == j }) != undefined)
					{
						points_scored = 0;
						break;
					}
				}
			}
			
			if(points_scored > 0)
				handle.style.backgroundImage = "linear-gradient(to bottom right, white, green)";			
			else
				handle.style.backgroundImage = "linear-gradient(to bottom right, white, red)";			

			window.score += points_scored;
		}
	}
	document.getElementById("results").innerHTML = `<div class=\"question_field\">Punktów: <span style=\"color: green\">${window.score}</span> z <span style=\"color: red\">${window.max_score}</span></div>`;
	console.log(`Got ${window.score} score out of ${window.max_score}`);
	window.score = 0;
}
