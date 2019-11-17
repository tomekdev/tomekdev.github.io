var polish_translation = function()
{
	this.translations = [];
	this.add = function(translation)
	{
		this.translations.push(translation);
	}
}

var word = function()
{
	this.en = "";
	this.pl = new polish_translation;
	this.fill = function(in_english, polish_translations)
	{
		this.en = in_english;
		this.pl = polish_translations;
	}
}

function btn_nullfunc()
{
}

function update_content(in_lang_out_lang, id)
{
	console.log("in_lang_out_lang: " + in_lang_out_lang);
	if(window.correct + window.incorrect < window.pl_words.length)
	{
		var placeholder_str = "";
		var word_str = "";
		if(in_lang_out_lang == "en-pl")
		{
			placeholder_str = "Po polsku...";
			word_str = window.en_words[window.order[window.correct + window.incorrect]];
		}
		else if(in_lang_out_lang == "pl-en")
		{
			for(var i = 0; i < window.pl_words[window.order[window.correct + window.incorrect]].length; i++)
			{
				word_str += window.pl_words[window.order[window.correct + window.incorrect]][i];
				if(i < window.pl_words[window.order[window.correct + window.incorrect]].length - 1)
				{
					word_str += ", ";
				}
			}
			placeholder_str = "In english...";
		}
		else if(in_lang_out_lang == "de-pl")
		{
			placeholder_str = "Po niemiecku..."
			word_str = window.de_words[window.order[window.correct + window.incorrect]];
		}
		else if(in_lang_out_lang == "de-pl_partizip")
		{
			placeholder_str = "Przeszła forma...";
			word_str = window.de_words[window.order[window.correct + window.incorrect]];
		}
		else if(in_lang_out_lang == "pl-de_partizip")
		{
			placeholder_str = "Partizip II...";
			for(var i = 0; i < window.pl_words[window.order[window.correct + window.incorrect]].length; i++)
			{
				word_str += window.pl_words[window.order[window.correct + window.incorrect]][i];
				if(i < window.pl_words[window.order[window.correct + window.incorrect]].length - 1)
				{
					word_str += ", ";
				}
			}
		}
		else if(in_lang_out_lang == "pl-de")
		{
			for(var i = 0; i < window.pl_words[window.order[window.correct + window.incorrect]].length; i++)
			{
				word_str += window.pl_words[window.order[window.correct + window.incorrect]][i];
				if(i < window.pl_words[window.order[window.correct + window.incorrect]].length - 1)
				{
					word_str += ", ";
				}
			}
			placeholder_str = "In deutsche...";
		}
		var maxwords = 
		document.getElementById(id).innerHTML = "<font color=green>" + window.correct + "</font><font color=white> poprawnych, </font><font color=red>" + window.incorrect + "</font><font color=white> niepoprawnych na " + window.en_words.length + " możliwych.<br><font size=5 color=white face=\"Cantarell\">" + word_str + "</font><br><input type=\"text\" name=\"answer\" id=\"answer\" placeholder=\"" + placeholder_str + "\" autofocus>\n<button id=\"checkbutton\" type=\"button\" onclick=\"checkword(\'" + in_lang_out_lang + "\', \'" + id + "\', \'answer\')\">Sprawdź</button><br>";
		console.log("number: " + window.order[window.correct + window.incorrect]);
	}
	else
	{
		document.getElementById(id).innerHTML = "<font color=white face=\"Cantarell\" size=7>Twój wynik</font><br><font color=green size=5>" + window.correct + "</font><font color=white size=5> poprawnych, </font><font color=red size=5>" + window.incorrect + "</font><font color=white size=5> niepoprawnych na " + window.en_words.length + " możliwych (" + Math.round((window.correct / window.en_words.length * 100)) + " %).<br>";
	}
	/* Add "Back" button */
	document.getElementById(id).innerHTML += "<br><button type=\"button\" onclick=\"parse_config_file(\'" + window.config_structure[window.config_structure_level - 1] + "\', \'" + id + "\', true)\">Wstecz</button><br>";
}

window.lowercase_letters = "aąbcćdeęfghijklłmnńoópqrsśtuvwxyzźż";
window.uppercase_letters = "AĄBCĆDEĘFGHIJKLŁMNŃOÓPQRSŚTUVWXYZŹŻ";

function do_checkword_case_insensitive(word, correct_word)
{
	/* If correct word starts with uppercase letter it means that it is a special name and that word is incorrect */
	for(var i = 0; i < window.uppercase_letters.length; i++)
	{
		if(correct_word.charAt(0) == window.uppercase_letters.charAt(i))
		{
			return false; /* Exit function and return NULL, because the answer is wrong */
		}
	}
	/* Check if the word is correct */
	var first_letter_index = -1;
	for(var i = 0; i < window.lowercase_letters.length; i++)
	{
		if(correct_word.charAt(0) == window.lowercase_letters.charAt(i))
		{
			first_letter_index = i;
		}
	}
	console.log("lowercase letter: " + window.lowercase_letters.charAt(first_letter_index));
	/* Do the real check */
	var corrected_word = window.lowercase_letters.charAt(first_letter_index) + word.substr(1, word.length - 1);
	console.log("corrected word: " + corrected_word);

	if(corrected_word == correct_word)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function checkword(in_lang_out_lang, id, fieldname)
{
	var new_in_lang_out_lang = in_lang_out_lang;
	//document.getElementById(id).innerHTML = "<font color=white>Wpisałeś \"" + document.getElementById(fieldname).value + "\"";
	/* Check match in available translations */
	console.log("Got answer: |" + document.getElementById(fieldname).value + "|\n");
	console.log("checkword in_lang_out_lang: " + new_in_lang_out_lang);
	var str = "Possible answers: ";
	var correct_answer = false;
	if(in_lang_out_lang == "en-pl")
	{
		for(var i = 0; i < window.pl_words[window.order[window.correct + window.incorrect]].length; i++)
		{
			str += '|' + window.pl_words[window.order[window.correct + window.incorrect]][i] + "|, ";
			if(document.getElementById(fieldname).value == window.pl_words[window.order[window.correct + window.incorrect]][i] || do_checkword_case_insensitive(document.getElementById(fieldname).value, window.pl_words[window.order[window.correct + window.incorrect]][i]))
			{
				console.log("Correct answer \"" + document.getElementById(fieldname).value + "\"");
				correct_answer = true;
			}
		}
	}
	else if(in_lang_out_lang == "pl-en")
	{
		str += '|' + window.en_words[window.order[window.correct + window.incorrect]] + '|';
		if(document.getElementById(fieldname).value == window.en_words[window.order[window.correct + window.incorrect]] || do_checkword_case_insensitive(document.getElementById(fieldname).value, window.en_words[window.order[window.correct + window.incorrect]]))
		{
			console.log("Correct answer \"" + document.getElementById(fieldname).value + "\"");
			correct_answer = true;
		}
	}
	else if(in_lang_out_lang == "de-pl")
	{
		for(var i = 0; i < window.pl_words[window.order[window.correct + window.incorrect]].length; i++)
		{
			str += '|' + window.pl_words[window.order[window.correct + window.incorrect]][i] + "|, ";
			if(document.getElementById(fieldname).value == window.pl_words[window.order[window.correct + window.incorrect]][i])
			{
				console.log("Correct answer \"" + document.getElementById(fieldname).value + "\"");
				correct_answer = true;
				new_in_lang_out_lang = "de-pl_partizip";
			}
		}
	}
	else if(in_lang_out_lang == "de-pl_partizip")
	{
		str += '|' + window.de_partizip[window.order[window.correct + window.incorrect]] + '|';
		if(document.getElementById(fieldname).value == window.de_partizip[window.order[window.correct + window.incorrect]])
		{
			console.log("Correct answer \"" + document.getElementById(fieldname).value + "\"");
			correct_answer = true;
			new_in_lang_out_lang = "de-pl";
		}
	}
	else if(in_lang_out_lang == "pl-de")
	{
		str += '|' + window.de_words[window.order[window.correct + window.incorrect]] + '|';
		if(document.getElementById(fieldname).value == window.de_words[window.order[window.correct + window.incorrect]])
		{
			console.log("Correct answer \"" + document.getElementById(fieldname).value + "\"");
			correct_answer = true;
			new_in_lang_out_lang = "pl-de_partizip";
		}
	}
	else if(in_lang_out_lang == "pl-de_partizip")
	{
		str += '|' + window.de_partizip[window.order[window.correct + window.incorrect]] + '|';
		if(document.getElementById(fieldname).value == window.de_partizip[window.order[window.correct + window.incorrect]])
		{
			console.log("Correct answer \"" + document.getElementById(fieldname).value + "\"");
			correct_answer = true;
			new_in_lang_out_lang = "pl-de";
		}
	}
	console.log(str);
	if(!correct_answer)
	{
		document.getElementById(id).innerHTML = "<font face=\"Cantarell\" size=5 color=red>Zła odpowiedź</font><br><font face=\"Cantarell\" size=5 color=white>Poprawne: <b>";
		if(in_lang_out_lang == "en-pl")
		{
			for(var i = 0; i < window.pl_words[window.order[window.correct + window.incorrect]].length; i++)
			{
				document.getElementById(id).innerHTML += window.pl_words[window.order[window.correct + window.incorrect]][i];
				if(i < window.pl_words[window.order[window.correct + window.incorrect]].length - 1)
				{
					document.getElementById(id).innerHTML += "</b>, <b>";
				}
			}
		}
		else if(in_lang_out_lang == "pl-en")
		{
			document.getElementById(id).innerHTML += window.en_words[window.order[window.correct + window.incorrect]];
		}
		else if(in_lang_out_lang == "de-pl")
		{
			for(var i = 0; i < window.pl_words[window.order[window.correct + window.incorrect]].length; i++)
			{
				document.getElementById(id).innerHTML += window.pl_words[window.order[window.correct + window.incorrect]][i];
				if(i < window.pl_words[window.order[window.correct + window.incorrect]].length - 1)
				{
					document.getElementById(id).innerHTML += "</b>, <b>";
				}
			}
		}
		else if(in_lang_out_lang == "de-pl_partizip" || in_lang_out_lang == "pl-de_partizip")
		{
			document.getElementById(id).innerHTML += window.de_partizip[window.order[window.correct + window.incorrect]];
		}
		else if(in_lang_out_lang == "pl-de")
		{
			document.getElementById(id).innerHTML += window.de_words[window.order[window.correct + window.incorrect]];
		}
		document.getElementById(id).innerHTML += "</b></font><br><button type=\"button\" onclick=\"update_content(\'" + new_in_lang_out_lang + "\', \'" + id + "\')\">Dalej</button><br>";
		window.incorrect++;
	}
	else
	{
		if(in_lang_out_lang == "pl-de_partizip" || in_lang_out_lang == "de-pl_partizip" || in_lang_out_lang == "en-pl" || in_lang_out_lang == "pl-en")
		{
			window.correct++;
		}
		console.log("in_lang_out_lang: " + in_lang_out_lang);
		update_content(new_in_lang_out_lang, id);
	}
}

function randomize(start, stop)
{
	var count = stop - start + 1;
	return (Math.floor((Math.random() * count)) + start);
}

function find_in_array(arr, what)
{
	for(var i = 0; i < arr.length; i++)
	{
		if(arr[i] == what)
		{
			return true;
		}
	}
	return false;
}



function appmain(in_lang_out_lang, id)
{
	document.getElementById(id).innerHTML = "<font face=\"Cantarell\" size=3 color=white>Wczytywanie...</font>";
	document.getElementById(id).innerHTML = "<font face=\"Cantarell\" size=3 color=white>Losowe układanie wyrazów...</font>";
	window.correct = 0; /* Number of correct answers */
	window.incorrect = 0; /* Number of incorrect answers */
	if(in_lang_out_lang == "en-pl" || in_lang_out_lang == "pl-en" || in_lang_out_lang == "de-pl" || in_lang_out_lang == "pl-de")
	{
		/* Generate random indices */
		window.order = [];
		while(window.order.length < window.pl_words.length)
		{
			var num = randomize(0, window.pl_words.length - 1);
			if(!find_in_array(window.order, num))
			{
				console.log("randomized number: " + num);
				window.order.push(num);
			}
		}
		console.log("window.order.length: " + window.order.length);
		update_content(in_lang_out_lang, id);
		/* Add event listener for handling Enter kay presses */
		/* Delete event listener, causes issues 
		var inputhandle = document.getElementById(id);
		inputhandle.addEventListener("keyup", function(event) {
			if(event.keyCode === 13)
			{
				event.preventDefault();
				document.getElementById("checkbutton").click();
			}
		}); */
	}
}

