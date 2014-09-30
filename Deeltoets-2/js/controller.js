/*global routie, Transparency, data */

/* controller.js */
var MOVIEWEB;
MOVIEWEB = MOVIEWEB || {};

(function () {

	MOVIEWEB.controller = {
		init: function () {
			MOVIEWEB.router.init();   
		}
	};

	MOVIEWEB.config = {
		JsonBaseURL: "http://api.themoviedb.org/3/", //My api
		JsonApiKey: "?api_key=VUL-HIER-JE-API-KEY-IN" //My personal API key 

	};

	MOVIEWEB.router = {
		init: function () {

			routie({
				'': function () {
					MOVIEWEB.templates.default("home");
					MOVIEWEB.getContent.genreHtml();
				},

				'/about': function () {
					MOVIEWEB.templates.default("about");
				},

				'/movies': function () {
					MOVIEWEB.templates.default("movies");
				},
				'/movies/:name': function (name) {
					MOVIEWEB.templates.movie(name);
				},

				'/contact': function () {
					MOVIEWEB.templates.default("contact");
				},

				'*': function () {
					MOVIEWEB.templates.default("notfound");
				}
			});
		}
	};


	MOVIEWEB.templates = {
		default: function (page) {
			console.log("Current page: " + page);

			//hide the stuff we don't need
			MOVIEWEB.helpers.containerSelector.className = "";
			MOVIEWEB.helpers.movieContainerSelector.className = "hidden";

			var directives = {
				content: {
					html: function () {
						return this.content;
					}
				}
			};
			Transparency.render(MOVIEWEB.helpers.containerSelector, MOVIEWEB.dataBase.defaultPages[page], directives);
		},

		movie: function (page) {
			console.log("Current page: Movies / " + page);
			
			//hide the stuff we don't need
			MOVIEWEB.helpers.containerSelector.className = "hidden";
			MOVIEWEB.helpers.movieContainerSelector.className = "";

			var directives = {
				image: {
					src: function () {
						return this.image;
					}
				}
			};

			Transparency.render(MOVIEWEB.helpers.movieContainerSelector, MOVIEWEB.dataBase.moviePages[page], directives);
		}
	};


	MOVIEWEB.helpers = {
		containerSelector: document.getElementById('container'),
		movieContainerSelector: document.getElementById('movieContainer')
	};

	MOVIEWEB.getContent = {
		json: function(path, success, error) {
			//This is the xhr function, I called it json. Nothing changed here.
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {
					if (xhr.status === 200) {
						if (success) {
							success(JSON.parse(xhr.responseText));
						}
					} else {
						if (error) {
							error(xhr);
						}
					}
				}
			};
			xhr.open("GET", path, true);
			xhr.send();
		},
		
		genreHtml: function() {
			//this is the function that generates the HTML for a list of genres.
			var url = "genre/movie/list";
 			var fullUrl = MOVIEWEB.config.JsonBaseURL+url+MOVIEWEB.config.JsonApiKey;
 			
 			//load the list of genres
			MOVIEWEB.getContent.json(fullUrl,
				function(data) {
					var htmlBuffer = "";
					var key;
					data = data.genres;

					//for each genre, add a <li> element
					for(key in data) {
						if (data.hasOwnProperty(key)) {
							htmlBuffer += ('<li id="'+data[key].id+'">' + data[key].name + '</li>');
						}
					}
					
					//add the <li>'s to <ul id="genreList">
					document.querySelector("ul#genreList").innerHTML = htmlBuffer;
				},
				function(xhr) {
					console.error(xhr);
				}
			);
		},

	};

	MOVIEWEB.dataBase = {
		defaultPages: {
			home: {
				title: "What genre do you like?",
				content: "<b>Welkom.</b><ul id='genreList'></ul>"
			},
			about: {
				title: "About this app",
				content: "<p>Cities fall but they are rebuilt. heroes die but they are remembered. the man likes to play chess; let's get him some rocks. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. bruce... i'm god. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all. rehabilitated? well, now let me see. you know, i don't have any idea what that means. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. rehabilitated? well, now let me see. you know, i don't have any idea what that means. cities fall but they are rebuilt.</p><p><img src='img/popcorn.jpg'> heroes die but they are remembered. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all.I did the same thing to gandhi, he didn't eat for three weeks. bruce... i'm god. cities fall but they are rebuilt. heroes die but they are remembered. i once heard a wise man say there are no perfect men. only perfect intentions. cities fall but they are rebuilt. heroes die but they are remembered. boxing is about respect. getting it for yourself, and taking it away from the other guy. well, what is it today? more spelunking? let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. bruce... i'm god. well, what is it today? more spelunking? it only took me six days. same time it took the lord to make the world. i did the same thing to gandhi, he didn't eat for three weeks. Let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. boxing is about respect.</p><p>getting it for yourself, and taking it away from the other guy. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. you measure yourself by the people who measure themselves by you. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. you measure yourself by the people who measure themselves by you. you measure yourself by the people who measure themselves by you. that tall drink of water with the silver spoon up his ass. i once heard a wise man say there are no perfect men. only perfect intentions. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. boxing is about respect. getting it for yourself, and taking it away from the other guy. <p><p>That tall drink of water with the silver spoon up his ass. well, what is it today? more spelunking? i now issue a new commandment: thou shalt do the dance. let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. i did the same thing to gandhi, he didn't eat for three weeks. the man likes to play chess; let's get him some rocks. i now issue a new commandment: thou shalt do the dance. i now issue a new commandment: thou shalt do the dance. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. i don't think they tried to market it to the billionaire, spelunking, base-jumping crowd.that tall drink of water with the silver spoon up his ass. it only took me six days. same time it took the lord to make the world.</p>"
			},
			movies: {
				title: "Movies",
				content: "<p>Dit zijn de films:</p><ul><li><a href='#/movies/shawshankRedemption'>Shawshank Redemption</a></li><li><a href='#/movies/theGodfather'>The Godfather</a></li><li><a href='#/movies/pulpFiction'>Pulp Fiction</a></li><li><a href='#/movies/theDarkKnight'>The Dark Knight</a></li></ul>"
			},
			contact: {
				title: "Contact",
				content: "Dit is de Contact-pagina."
			},
			notfound: {
				title: "404 Error",
				content: "Deze pagina is niet gevonden."
			}
		},

		moviePages: {
			shawshankRedemption: {
				title: "ShawShank Redemption",
				date: "10/14/1994",
				image: "img/shawshank-redemption.jpg",
				content: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
			},
			theGodfather: {
				title: "The Godfather",
				date: "03/24/1972",
				image: "img/the-godfather.jpg",
				content: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son."
			},
			pulpFiction: {
				title: "Pulp Fiction",
				date: "10/14/1994",
				image: "img/pulp-fiction.jpg",
				content: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
			},
			theDarkKnight: {
				title: "The Dark Knight",
				date: "06/18/2008",
				image: "img/the-dark-knight.jpg",
				content: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency."
			}
		}
	};
	
} () );

MOVIEWEB.controller.init();