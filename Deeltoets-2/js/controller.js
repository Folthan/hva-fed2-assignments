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
		JsonApiKey: "?api_key=VUL-HIER-JE-API-ID-IN" //My personal API key 

	};

	MOVIEWEB.router = {
		init: function () {

			routie({
				'': function () {
					MOVIEWEB.templates.default("home");
					MOVIEWEB.getContent.homeHtml();
				},

				'/genre/:id': function (id) {
					MOVIEWEB.templates.default("home");
					MOVIEWEB.getContent.homeHtml(id);
					MOVIEWEB.getContent.genreHtml(id);
				},

				'/movies': function () {
					MOVIEWEB.templates.default("movies");
				},
				'/movies/:name': function (name) {
					MOVIEWEB.templates.movie(name);
				},

				'/about': function () {
					MOVIEWEB.templates.default("about");
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

			var directives = {
				content: {
					html: function () {
						return this.content;
					}
				}
			};
			Transparency.render(MOVIEWEB.helpers.containerSelector, MOVIEWEB.dataBase.pages[page], directives);
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
		
		homeHtml: function(id) {
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
							if(id == data[key].id) {
								htmlBuffer += ('<li class="active" id="'+data[key].id+'"><a href="#/genre/'+data[key].id+'">' + data[key].name + '</li>');
							} else {
								htmlBuffer += ('<li id="'+data[key].id+'"><a href="#/genre/'+data[key].id+'">' + data[key].name + '</li>');
							}
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

		genreHtml: function(id) {
			//this is the function that generates the HTML for a list of movies.
			var url = "genre/"+id+"/movies";
 			var fullUrl = MOVIEWEB.config.JsonBaseURL+url+MOVIEWEB.config.JsonApiKey;
 			
 			//load the list of movies
			MOVIEWEB.getContent.json(fullUrl,
				function(data) {
					var htmlBuffer = "";
					var key;
					data = data.results;
					console.log(data);

					//for each movie, add a <li> element
					for(key in data) {
						if (data.hasOwnProperty(key)) {
							if(id == data[key].id) {
								htmlBuffer += ('<li class="active" id="'+data[key].id+'"><a href="#/movie/'+data[key].id+'">' + data[key].title + '</li>');
							} else {
								htmlBuffer += ('<li id="'+data[key].id+'"><a href="#/movie/'+data[key].id+'">' + data[key].title + '</li>');
							}
						}
					}
					
					//add the <li>'s to <ul id="movieList">
					document.querySelector("ul#movieList").innerHTML = htmlBuffer;
				},
				function(xhr) {
					console.error(xhr);
				}
			);
		},

	};

	MOVIEWEB.dataBase = {
		pages: {
			home: {
				content: "<div id='genres'><ul id='genreList'><li>Loading...</li></ul></div><div id='movies'><ul id='movieList'></ul></div>"
			},
			movie: {
				content: ""
			},
			notfound: {
				title: "404 Error",
				content: "Deze pagina is niet gevonden."
			},
			about: {
				title: "About this app",
				content: "<p>Cities fall but they are rebuilt. heroes die but they are remembered. the man likes to play chess; let's get him some rocks. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. bruce... i'm god. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all. rehabilitated? well, now let me see. you know, i don't have any idea what that means. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. rehabilitated? well, now let me see. you know, i don't have any idea what that means. cities fall but they are rebuilt.</p><p><img src='img/popcorn.jpg'> heroes die but they are remembered. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all.I did the same thing to gandhi, he didn't eat for three weeks. bruce... i'm god. cities fall but they are rebuilt. heroes die but they are remembered. i once heard a wise man say there are no perfect men. only perfect intentions. cities fall but they are rebuilt. heroes die but they are remembered. boxing is about respect. getting it for yourself, and taking it away from the other guy. well, what is it today? more spelunking? let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. bruce... i'm god. well, what is it today? more spelunking? it only took me six days. same time it took the lord to make the world. i did the same thing to gandhi, he didn't eat for three weeks. Let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. boxing is about respect.</p><p>getting it for yourself, and taking it away from the other guy. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. you measure yourself by the people who measure themselves by you. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. you measure yourself by the people who measure themselves by you. you measure yourself by the people who measure themselves by you. that tall drink of water with the silver spoon up his ass. i once heard a wise man say there are no perfect men. only perfect intentions. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. boxing is about respect. getting it for yourself, and taking it away from the other guy. <p><p>That tall drink of water with the silver spoon up his ass. well, what is it today? more spelunking? i now issue a new commandment: thou shalt do the dance. let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. i did the same thing to gandhi, he didn't eat for three weeks. the man likes to play chess; let's get him some rocks. i now issue a new commandment: thou shalt do the dance. i now issue a new commandment: thou shalt do the dance. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. i don't think they tried to market it to the billionaire, spelunking, base-jumping crowd.that tall drink of water with the silver spoon up his ass. it only took me six days. same time it took the lord to make the world.</p>"
			},
			contact: {
				title: "Contact",
				content: "Dit is de Contact-pagina."
			},
		}
	};
	
} () );

MOVIEWEB.controller.init();