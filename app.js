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
	if(window.correct + window.incorrect < window.en_words.length)
	{
		document.getElementById(id).innerHTML = "<font color=green>" + window.correct + "</font><font color=white> poprawnych, </font><font color=red>" + window.incorrect + "</font><font color=white> niepoprawnych na " + window.en_words.length + " możliwych.<br><font size=5 color=white face=\"Cantarell\">" + window.en_words[window.order[window.correct + window.incorrect]] + "</font><br><input type=\"text\" name=\"answer\" id=\"answer\" placeholder=\"Po polsku...\" autofocus>\n<button type=\"button\" onclick=\"checkword(\'" + in_lang_out_lang + "\', \'" + id + "\', \'answer\')\">Sprawdź</button><br>";
		console.log("number: " + window.order[window.correct + window.incorrect]);
	}
	else
	{
		document.getElementById(id).innerHTML = "<font color=white face=\"Cantarell\" size=7>Twój wynik</font><br><font color=green size=5>" + window.correct + "</font><font color=white size=5> poprawnych, </font><font color=red size=5>" + window.incorrect + "</font><font color=white size=5> niepoprawnych na " + window.en_words.length + " możliwych (" + (window.correct / window.en_words.length * 100) + " %).<br>";
	}
}

function checkword(in_lang_out_lang, id, fieldname)
{
	//document.getElementById(id).innerHTML = "<font color=white>Wpisałeś \"" + document.getElementById(fieldname).value + "\"";
	/* Check match in available translations */
	console.log("Got answer: |" + document.getElementById(fieldname).value + "|\n");
	var str = "Possible answers: ";
	var correct_answer = false;
	for(var i = 0; i < window.pl_words[window.order[window.correct + window.incorrect]].length; i++)
	{
		str += '|' + window.pl_words[window.order[window.correct + window.incorrect]][i] + "|, ";
		if(document.getElementById(fieldname).value == window.pl_words[window.order[window.correct + window.incorrect]][i])
		{
			console.log("Correct answer \"" + document.getElementById(fieldname).value + "\"");
			window.correct++;
			correct_answer = true;
		}
	}
	console.log(str);
	if(!correct_answer)
	{
		document.getElementById(id).innerHTML = "<font face=\"Cantarell\" size=5 color=red>Zła odpowiedź</font><br><font face=\"Cantarell\" size=5 color=white>Poprawne: <b>";
		for(var i = 0; i < window.pl_words[window.order[window.correct + window.incorrect]].length; i++)
		{
			document.getElementById(id).innerHTML += window.pl_words[window.order[window.correct + window.incorrect]][i];
			if(i < window.pl_words[window.order[window.correct + window.incorrect]].length - 1)
			{
				document.getElementById(id).innerHTML += "</b>, <b>";
			}
		}
		document.getElementById(id).innerHTML += "</b></font><br><button type=\"button\" onclick=\"update_content(\'" + in_lang_out_lang + "\', \'" + id + "\')\">Dalej</button><br>";
		window.incorrect++;
	}
	else
	{
		update_content(in_lang_out_lang, id);
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
	window.maxfieldlength = 0;
	if(in_lang_out_lang == "en-pl")
	{
		/* Get maximum input field length */
		for(var i = 0; i < window.en_words.length; i++)
		{
			for(var j = 0; j < window.pl_words[i].length; j++)
			{
				if(window.pl_words[i][j].length > window.maxfieldlength)
				{
					window.maxfieldlength = window.pl_words[i][j].length;
				}
			}
		}
		/* Generate random indices */
		window.order = [];
		while(window.order.length < window.en_words.length)
		{
			var num = randomize(0, window.en_words.length - 1);
			if(!find_in_array(window.order, num))
			{
				window.order.push(num);
			}
		}
		update_content(in_lang_out_lang, id);
	}
}

