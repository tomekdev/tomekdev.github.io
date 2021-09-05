function fetch_file(path, callback)
{
	let request = new XMLHttpRequest();
	request.open("GET", path);
	request.responseType = "text";
	request.send();
	request.onreadystatechange = function() {
		if(request.readyState == 4)
		{
			if(request.status == 200)
			{
				callback(request.response);
				return 200;
			}
			else
			{
				console.log("Failed to fetch " + path + ": error code: " + request.status);
				callback("Coś poszło nie tak: " + request.status);
				return request.status;
			}
		}
	}
}

function load_booklist_callback(response)
{
	var handle = document.getElementById("booklist");
	var lines = response.split('\n');
	for(var i = 0; i < lines.length - 1; i++)
	{
		if(i == 0)
			handle.innerHTML = "";

		var pair = lines[i].split(" = ");
		handle.innerHTML += `<input type=\"button\" id=\"book_button\" name=\"book_button\" value=\"${pair[0]}\" onclick=load_test(\"${pair[1]}\")><br>`;
	}
}

function load_booklist()
{
	//fetch_file("/tomekdev.github.io/MaturaBzdura/data/files/booklist", load_booklist_callback);
	fetch_file("/MaturaBzdura/data/files/booklist", load_booklist_callback);
}

var Question = function() {
	this.question = "";
	this.answers = [];
	this.correct_answers_indices = [];
	this.type = "";
	this.randomized_answers_order = [];
};

window.questions = [];
window.max_score = 0;

function test_fetch_callback(response)
{
	var questions_and_answers = response.split("#");
	for(var i = 0; i < questions_and_answers.length; i++)
	{
		if(questions_and_answers[i].length > 1)
		{
			var question = questions_and_answers[i].split('\n');
			var q = new Question();
			for(var j = 0; j < question.length; j++)
			{
				if(question[j].length != 0)
				{
					if(question[j].substr(0, 2) == "1:")
					{
						q.question = question[j];
						q.type = "radio";
					}
					else if(question[j].substr(0, 2) == "2:")
					{
						q.question = question[j];
						q.type = "checkbox";
					}
					else
					{
						q.answers.push(question[j]);
						if(question[j][0] == '=')
						{
							q.correct_answers_indices.push(q.answers.length - 1);
							window.max_score++;
						}
					}
				}
			}
			window.questions.push(q);
		}
	}
	console.log(`Loaded ${window.questions.length} questions`);
	show_questions();
}

function load_test(path)
{
	fetch_file(path, test_fetch_callback);
}
