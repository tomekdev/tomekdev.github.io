window.en_words = [];
window.en_words.length = 0;
window.pl_words = [];
window.pl_words.length = 0;
window.de_words = [];
window.de_words.length = 0;
window.de_partizip = [];
window.de_partizip.length = 0;
window.config_structure = [];
window.config_structure_level = -1;
window.user_created_list = [];
window.user_created_list.length = 0;

function Load(path, id) {
	var file = new XMLHttpRequest();
	file.open('GET', path, false);
	file.onreadystatechange = function()
	{
		if(file.readyState == 4)
		{
			if(file.status == 200 || file.status == 0)
			{
				document.getElementById(id).innerHTML = file.responseText;
			}
			else
			{
				document.getElementById(id).innerHTML = "Coś poszło nie tak";
			}
		}
	}
	file.send(null);
}

function parse_config_file(pth, id, go_back)
{
	/* Reset globals */
	for(var i = 0; i < window.pl_words.length; i++)
	{
		window.pl_words[i].length = 0;
	}
	window.pl_words.length = 0;
	window.en_words.length = 0;
	window.de_words.length = 0;
	window.de_partizip.length = 0;
	window.user_created_list.length = 0;
	document.getElementById(id).innerHTML = "Wczytywanie...";
	var file = new XMLHttpRequest();
	file.open('GET', pth, false);
	file.onreadystatechange = function()
	{
		if(file.readyState == 4)
		{
			if(file.status == 200 || file.status == 0)
			{
				if(go_back == true)
				{
					console.log("Popping element \"" + window.config_structure[window.config_structure.length - 1] + "\"");
					window.config_structure.pop();
					window.config_structure.pop();
					window.config_structure_level -= 2;
				}
				window.config_structure.push(pth);
				window.config_structure_level++;
				console.log("Pushed \"" + pth + "\" in position " + (window.config_structure.length - 1));
				console.log("File: " + pth + " has status 200 or 4");
				var loop_iterations = 0;
				var i = 0;
				var line = "";
				var returnstr = "";
				document.getElementById(id).innerHTML = "";
				while(i < file.responseText.length)
				{
					if(loop_iterations >= 1000)
					{
						console.log("INFINITE LOOP!!! BREAKING! i: " + i);
						break;
					}
					loop_iterations++;
					/* Fill line buffer */
					while(i < file.responseText.length && file.responseText[i] != '\n')
					{
						line += file.responseText[i];
						i++;
					}
					i++;
					if(line.length > 0)
					{
						if(pth.includes("/config"))
						{
							/* Interpret line buffer */
							var english_name = "";
							var polish_name = "";
							var path = "";
							for(var j = 0; j < line.length; j++)
							{
								var k = 0;
								while(k < line.length && line[k] != '/')
								{
									english_name += line[k];
									k++;
								}
								k++; /* Skip '/' */
								while(k < line.length && line[k] != '=')
								{
									polish_name += line[k];
									k++;
								}
								k++;
								while(k < line.length)
								{
									while(k < line.length && line[k] == ' ') k++;
									path += line[k];
									k++;
								}
								j = k + 1;
							}
							returnstr += "<button type=\"button\" onclick=\"parse_config_file(\'";
							returnstr += path;
							returnstr += "\', \'";
							returnstr += id;
							returnstr += "\', false)\">";
							returnstr += english_name;
							returnstr += " [ ";
							returnstr += polish_name;
							returnstr += " ] </button><br>\n";
							console.log("path: " + path + " english_name: " + english_name + " polish_name: " + polish_name);
						}
						else
						{
							if(pth.includes("/irregular_verbs_list"))
							{
								console.log("File has irregular verbs definitions");
								var german = "";
								var pol_word = "";
								var partizip = "";
								var k = 0;
								while(k < line.length && line[k] != '/')
								{
									german += line[k];
									k++;
								}
								german = german.trim();
								while(k < line.length && line[k] == ' ') k++;
								k++;
								while(k < line.length ** line[k] == '/') k++;
								/* Push german word */
								window.de_words.push(german);
								/* Load partizip */
								while(k < line.length && line[k] != '=')
								{
									partizip += line[k];
									k++;
								}
								partizip = partizip.trim();
								while(k < line.length && line[k] == ' ') k++;
								k++;
								while(k < line.length && line[k] == '=') k++;
								/* Push partizip word */
								window.de_partizip.push(partizip);
								var pol = [];
								while(k < line.length)
								{
									while(line[k] != '/' && k < line.length)
									{
										pol_word += line[k];
										k++;
									}
									k++;
									pol_word = pol_word.trim();
									pol.push(pol_word);
									pol_word = "";
								}
								window.pl_words.push(pol);
							}
							else
							{
								var eng = "";
								var pol = [];
								/* Line buffer contains word definitions */
								var k = 0;
								while(k < line.length && line[k] != '=')
								{
									eng += line[k];
									k++;
								}
								eng = eng.trim();
								while(k < line.length && line[k] == ' ') k++;
								k++;
								while(k < line.length && line[k] == '=') k++;
								/* Push english word */
								window.en_words.push(eng);
								var pol_word = "";
								while(k < line.length)
								{
									while(line[k] != '/' && k < line.length)
									{
										pol_word += line[k];
										k++;
									}
									k++;
									pol_word = pol_word.trim();
									pol.push(pol_word);
									pol_word = "";
								}
								window.pl_words.push(pol);
							}
						}
					}
					line = "";
				}
				if(!pth.includes("/config") && !pth.includes("/irregular_verbs_list"))
				{
					returnstr = "<font face=\"Cantarell\" size=5 color=\"white\">Wybierz tryb</font><br>\n" + returnstr;
					returnstr += "<button type=\"button\" onclick=\"appmain(\'pl-en\', \'contents\')\">[ Polski ---> Angielski ]</button><br>";
					returnstr += "<button type=\"button\" onclick=\"appmain(\'en-pl\', \'contents\')\">[ Angielski ---> Polski ]</button><br>";
					/* DEBUG: print data */
					var str = "Word definition data:\n";
					for(var a = 0; a < window.en_words.length; a++)
					{
						str += "en: " + window.en_words[a] + ", pl: ";
						for(var b = 0; b < window.pl_words[a].length; b++)
						{
							str += window.pl_words[a][b] + ", ";
						}
						str += '\n';
					}
					console.log(str);
					console.log("en_words: " + window.en_words.length + ", pl_words: " + window.pl_words.length);
				}
				else if(pth.includes("/irregular_verbs_list"))
				{
					returnstr += "<font face=\"Cantarell\" size=5 color=\"white\">Wybierz tryb</font><br>\n" + returnstr;
					returnstr += "<button type=\"button\" onclick=\"appmain(\'pl-de\', \'contents\')\">[ Polski ---> Partizip ---> Niemiecki ]</button><br>";
					returnstr += "<button type=\"button\" onclick=\"appmain(\'de-pl\', \'contents\')\">[ Niemiecki ---> Partizip ---> Polski ]</button><br>";
					/* DEBUG: print data */
					var str = "Word definition data:\n";
					for(var a = 0; a < window.de_words.length; a++)
					{
						str += "de: " + window.de_words[a] + ", partizip: " + window.de_partizip[a] +  ", pl: ";
						for(var b = 0; b < window.pl_words[a].length; b++)
						{
							str += window.pl_words[a][b] + ", ";
						}
						str += '\n';
					}
					console.log(str);
					console.log("de_words: " + window.de_words.length + ", pl_words: " + window.pl_words.length);

				}
				document.getElementById(id).innerHTML = returnstr;
			}
			else
			{
				document.getElementById(id).innerHTML = "Coś poszło nie tak (status " + file.status + ')';
			}
			if(window.config_structure.length > 1)
			{
				document.getElementById(id).innerHTML += "<br><button type=\"button\" onclick=\"parse_config_file(\'" + window.config_structure[window.config_structure_level - 1] + "\', \'" + id + "\', true)\">Wstecz</button><br>";
			}
		}
	}
	file.send(null);
}

function InitialLoad()
{
	parse_config_file("data/config", "contents", false);
}
window.onload = InitialLoad();

