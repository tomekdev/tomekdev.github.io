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
		{
			console.log(`pushing ${x}`);
			window.questions_order.push(x);
		}
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
		randomize_answers_order(window.questions[i]);
		if(i == 0)
			handle.innerHTML = "";
		var page_fragment = "<div id=\"question_field\">";
		page_fragment += "<div id=\"question_box\">";
		page_fragment += `${i + 1}. `;
		page_fragment += window.questions[window.questions_order[i]].question.substr(2);
		page_fragment += "<br>\n</div>\n<div id=\"answers_box\">";
		for(var j = 0; j < window.questions[window.questions_order[i]].randomized_answers_order.length; j++)
		{
			if(window.questions[window.questions_order[i]].question.substr(0, 2) == "1:")
			{
				page_fragment += `<input type=\"radio\" value=\"${j}\" name=\"question_${i}\">`;
				page_fragment += window.questions[window.questions_order[i]].answers[window.questions[window.questions_order[i]].randomized_answers_order[j]];
			}
			if(window.questions[i].question.substr(0, 2) == "2:")
			{
				page_fragment += `<input type=\"checkbox\" id=\"question_${i}_${j}\">`;
				page_fragment += window.questions[window.questions_order[i]].answers[window.questions[window.questions_order[i]].randomized_answers_order[j]];
			}
			page_fragment += "<br>";
		}
		page_fragment += "</div></div>";
		handle.innerHTML += page_fragment;
	}
	handle.innerHTML += "<br><center><input type=\"button\" id=\"checkbutton\" value=\"Sprawdź\" onclick=\"check_answers()\"></center>";
}

window.once_again_questions_list = [];
window.score = 0;

function check_answers()
{
	for(var i = 0; i < window.questions.length; i++)
	{
		if(window.questions[i].type == "radio")
		{
			var radios = document.getElementsByName(`question_${i}`);
			for(var j = 0; j < radios.length; j++)
			{
				if(radios[j].checked && j == window.questions[i].correct_answers_indices[0])
					window.score++;
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
			}
			window.score += points_scored;
		}
	}
	console.log(`Got ${window.score} score out of ${window.max_score}`);
}
