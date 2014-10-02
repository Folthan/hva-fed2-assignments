/*global routie, Transparency, data, _ */

/* controller.js */
var MOVIEWEB;
MOVIEWEB = MOVIEWEB || {};

(function () {

	MOVIEWEB.config = {
		JsonBaseURL: "http://api.themoviedb.org/3/", //My api
		JsonApiKey: "?api_key=9bc143343c69c1a55c7c76cb204e9e1d", //My personal API key 
		imgBaseURL: "http://image.tmdb.org/t/p/w500/" //The base URL for images
	};

	MOVIEWEB.controller = {
		init: function () {
			MOVIEWEB.router.init();
		}
	};

	MOVIEWEB.router = {
		init: function () {
			
			
			routie({
				'': function () {
					//home
					console.log("page: Genres");
					MOVIEWEB.loadSection.genres();
				},

				'/movies/:genreID': function (genreID) {
					//genre gekozen
					console.log("page: Movies");
					MOVIEWEB.loadSection.genres();
					MOVIEWEB.loadSection.movies(genreID);
				},
				'/movies/:genreID/:movieID': function (genreID, movieID) {
					console.log("page: Details");
					//The genre and the movie have been chosen.
					MOVIEWEB.loadSection.genres();
					MOVIEWEB.loadSection.movies(genreID);
					MOVIEWEB.loadSection.details(movieID);
				},

				'/about': function () {
					//text-pagina: about
					MOVIEWEB.loadSection.genres();
					MOVIEWEB.renderHtml.textPage("about");
				},

				'/contact': function () {
					//text-pagina: contact
					MOVIEWEB.loadSection.genres();
					MOVIEWEB.renderHtml.textPage("contact");
				},

				'*': function () {
					MOVIEWEB.loadSection.genres();
					MOVIEWEB.renderHtml.textPage("notfound");
				}
			});
		}
	};

	MOVIEWEB.loadSection = {
		genres: function(){
			if(document.querySelector("#genres ul").innerHTML === "") {
				console.log("Genres are being loaded...");
				MOVIEWEB.getJson.genres();
				document.getElementById('genres').className = "animated fadeInLeft";
			}
		},
		movies: function(genreID){
			if(MOVIEWEB.router.currentGenre !== genreID || document.querySelector("#movies ul").innerHTML === "") {
				console.log("Movies are being loaded...");
				MOVIEWEB.getJson.movies(genreID);
				MOVIEWEB.router.currentGenre = genreID;
				document.getElementById('movies').className = "animated fadeInLeft";
			}
		},
		details: function(movieID){
			console.log("Details are being loaded...");
			MOVIEWEB.getJson.details(movieID);
			MOVIEWEB.router.currentMovie = movieID;
			document.getElementById('details').className = "animated fadeIn";
		}
	};

	/*
	* This function returns the data requested
	* Example:    MOVIEWEB.getJson.genres();
	*/

	MOVIEWEB.getJson = {
		genres: function () {
			//Grab the list of genres
			MOVIEWEB.json.init(
				/* URL */
				"genre/movie/list",

				/* Extra parameters */
				"",

				/* Succes function */
				function(data) {
					MOVIEWEB.convertAndSave.genres(data);
					MOVIEWEB.renderHtml.genres();
				},

				/* Error function*/
				function(xhr) {
					console.error(xhr);
				}
			);

		},
		movies: function (id) {
			//Grab the list of genres
			MOVIEWEB.json.init(
				/* URL */
				"genre/"+id+"/movies",

				/* Extra parameters */
				"",

				/* Succes function */
				function(data) {
					MOVIEWEB.convertAndSave.movies(data);
					MOVIEWEB.renderHtml.movies(data);
				},

				/* Error function*/
				function(xhr) {
					console.error(xhr);
				}
			);
			
			/*    BEGINSEL INFINITE SCROLLING
			console.log("er passen: " + Math.ceil(  (window.innerHeight-60) / 34));


			var elem = document.getElementById("movies");
			if(elem.length > 19) {
				console.log("offsetHeight: "+elem.offsetHeight+"  | scrollHeight: "+elem.scrollHeight);
				
				while(elem.offsetHeight < elem.scrollHeight) {
					console.log("meer content laden!");
					
					
				}
			}
		*/	
		},
		details: function (id) {
			//Grab the list of genres
			MOVIEWEB.json.init(
				/* URL */
				"movie/"+id,

				/* Extra parameters */
				"",

				/* Succes function */
				function(data) {
					MOVIEWEB.convertAndSave.details(data);
					MOVIEWEB.renderHtml.details(data);
				},

				/* Error function*/
				function(xhr) {
					console.error(xhr);
				}
			);
		}
	};


	MOVIEWEB.convertAndSave = {
		genres: function (data) {
			MOVIEWEB.dataBase.html._genres = "";

			_.each(data.genres, function(i){
				if(i.id === MOVIEWEB.router.currentMovie) {i.current = true;}
				MOVIEWEB.dataBase.html._genres += MOVIEWEB._templates.genre({genreID: i.id, genreName: i.name, current: i.current});
			});
		},
		movies: function (data) {
			MOVIEWEB.dataBase.html._movies = "";

			_.each(data.results, function(i){
				MOVIEWEB.dataBase.html._movies += MOVIEWEB._templates.movie({genreID: MOVIEWEB.router.currentGenre, movieID: i.id, movieName: i.title});
			});
		},
		details: function (data) {
			MOVIEWEB.dataBase.html.details = data;
		}
	};

	MOVIEWEB.renderHtml = {
		genres: function () {

			Transparency.render(
				/*Element*/
				document.getElementById('genres'),

				/*Data*/
				MOVIEWEB.dataBase.html,

				/*Directives*/
				{
					_genres: {
						html: function () {
							return this._genres;
						}
					}
				}
			);
		},
		movies: function () {

			Transparency.render(
				/*Element*/
				document.getElementById('movies'),

				/*Data*/
				MOVIEWEB.dataBase.html,

				/*Directives*/
				{
					_movies: {
						html: function () {
							return this._movies;
						}
					}
				}
			);
		},
		details: function () {

			var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			var date = new Date(Date.parse(MOVIEWEB.dataBase.html.details.release_date));
			date = months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();

			var companies = "<ul>";

			_.each(MOVIEWEB.dataBase.html.details.production_companies, function(i){
				companies += MOVIEWEB._templates.li({name: i.name});
			});

			 companies += "<ul>";

			MOVIEWEB.dataBase.html.details = {
				_title: 	  MOVIEWEB.dataBase.html.details.title, 
				_tagline: 	  MOVIEWEB.dataBase.html.details.tagline, 
				_date: 	  	  date,
				_movieGenres: MOVIEWEB.dataBase.html.details.genres,
				_backdrop: 	  MOVIEWEB.config.imgBaseURL + MOVIEWEB.dataBase.html.details.backdrop_path,
				_poster: 	  MOVIEWEB.config.imgBaseURL + MOVIEWEB.dataBase.html.details.poster_path,
				_overview: 	  MOVIEWEB.dataBase.html.details.overview,
				_grade: 	  MOVIEWEB.dataBase.html.details.vote_average,
				_companies:	  companies
			};

			Transparency.render(
				/*Element*/
				document.getElementById('details'),

				/*Data*/
				MOVIEWEB.dataBase.html.details,

				/*Directives*/
				{
					_movies: {
						html: function () {
							return this._movies;
						}
					},
					_poster: {
						src: function () {
							return this._poster;
						}
					},
					_backdrop: {
						src: function () {
							return this._backdrop;
						}
					},
					_companies: {
						html: function () {
							return this._companies;
						}
					}
				}
			);
		},
		textPage: function (page) {
			console.log("Current page: " + page);
			var background = document.getElementById("textPage");
			var lightbox = document.getElementById("lightbox");
			var close = document.getElementById("close");

			close.addEventListener("click", function(){
				background.className = "animated fadeOut";
				lightbox.className = "animated fadeOutDown";
				window.location.href = "#/";

				setTimeout(function(){
					background.className = "hidden";
					lightbox.className = "hidden";
				}, 1000);
			});

			background.className = "animated fadeIn";
			lightbox.className = "animated fadeInDown";
						
			var directives = {
				_content: {
					html: function () {
						return this._content;
					}
				}
			};
			Transparency.render(background, MOVIEWEB.dataBase.html[page], directives);

		}
	};


	MOVIEWEB._templates = {
		genre: _.template('<li id="genre-<%- genreID %>"><a href="#/movies/<%- genreID %>/"><%- genreName %></a></li>'),
		movie: _.template('<li id="movie-<%- movieID %>"><a href="#/movies/<%- genreID %>/<%- movieID %>"><%- movieName %></a></li>'),
		li:    _.template('<li><%- name %></li>')
	};



	MOVIEWEB.json = {
		init: function(path, params, success, error) {
			//This is the xhr function, I called it json. Nothing changed here.
			path = MOVIEWEB.config.JsonBaseURL
				 + path
				 + MOVIEWEB.config.JsonApiKey
				 + params;

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
		}
	};

	MOVIEWEB.dataBase = {
		html: {
			notfound: {
				_title: "404 Error",
				_content: "Deze pagina is niet gevonden."
			},
			about: {
				_title: "About this app",
				_content: "<p>Cities fall but they are rebuilt. heroes die but they are remembered. the man likes to play chess; let's get him some rocks. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. bruce... i'm god. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all. rehabilitated? well, now let me see. you know, i don't have any idea what that means. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. rehabilitated? well, now let me see. you know, i don't have any idea what that means. cities fall but they are rebuilt.</p><p><img src='img/popcorn.jpg'> heroes die but they are remembered. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all.I did the same thing to gandhi, he didn't eat for three weeks. bruce... i'm god. cities fall but they are rebuilt. heroes die but they are remembered. i once heard a wise man say there are no perfect men. only perfect intentions. cities fall but they are rebuilt. heroes die but they are remembered. boxing is about respect. getting it for yourself, and taking it away from the other guy. well, what is it today? more spelunking? let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. bruce... i'm god. well, what is it today? more spelunking? it only took me six days. same time it took the lord to make the world. i did the same thing to gandhi, he didn't eat for three weeks. Let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. boxing is about respect.</p><p>getting it for yourself, and taking it away from the other guy. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. you measure yourself by the people who measure themselves by you. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. you measure yourself by the people who measure themselves by you. you measure yourself by the people who measure themselves by you. that tall drink of water with the silver spoon up his ass. i once heard a wise man say there are no perfect men. only perfect intentions. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. boxing is about respect. getting it for yourself, and taking it away from the other guy. <p><p>That tall drink of water with the silver spoon up his ass. well, what is it today? more spelunking? i now issue a new commandment: thou shalt do the dance. let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. i did the same thing to gandhi, he didn't eat for three weeks. the man likes to play chess; let's get him some rocks. i now issue a new commandment: thou shalt do the dance. i now issue a new commandment: thou shalt do the dance. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. i don't think they tried to market it to the billionaire, spelunking, base-jumping crowd.that tall drink of water with the silver spoon up his ass. it only took me six days. same time it took the lord to make the world.</p>"
			},
			contact: {
				_title: "Contact",
				_content: "Dit is de Contact-pagina."
			},
		}
	};
	
	MOVIEWEB.controller.init();

} () );
