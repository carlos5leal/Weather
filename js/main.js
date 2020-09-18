
$(function(){
    
    // **************** COLOCAR SUAS API KEYS ABAIXO PARA CONSEGUIR RODAR O PROJETO *****************

    var accuweatherAPIKey = "2wmWk7ABtSvJZWrxwEIaGCBGwya9lypX";
    var mapboxToken ="pk.eyJ1IjoiY2FybG9zbGVhbCIsImEiOiJja2V4ODJ5MGM0YjdkMnhwaTYxMXV6Yzl3In0.yqjRuixeikuI-AquzKi13A";
	var unsplashKey = "F67DqbBwqTH9TuSBxMsYtz3kMjJkR8gsrruPTPdqtTI";
	var ipgeolocationkey = "77dbe351c5c342fe877db22c53307081";

   // ************************************************************************************************


    var weatherObject = {
        cidade: "",
        estado: "",
        pais : "",
        temperatura: "",
        texto_clima: "",
        icone_clima: ""
    };

    function preencherClimaAgora(cidade,estado,pais,temperatura, texto_clima, icone_clima) {

        var texto_local = cidade + ", " + estado + ". " + pais;
        $("#texto_local").text(texto_local);
        $("#texto_clima").text(texto_clima);
        $("#texto_temperatura").html( String(temperatura) + "&deg; C" );
        $("#icone_clima").html('<i class="wi icon-accu' + weatherObject.icone_clima + '"></i>' );

    }
	
	function preencherFoto(data) {
		$(".cityImage").css("background-image", "url('" + data + "'");
	}

    function gerarGrafico(horas, temperaturas) {
        Highcharts.setOptions({
			colors: ['#FFF']
		});
		Highcharts.chart('hourly_chart', {
            chart: {
                type: 'line',
				backgroundColor: '#3e8ef7'
            },
            title: {
                text: 'Hourly Temperature',
				style: {
					color: "#FFF"
				}
            },
            xAxis: {
                categories: horas,
				labels: {
					style: {
						color: "#FFF"
					}
                }
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)',
					style: {
						color: "#FFF"
					}
                },
				labels: {
					style: {
						color: "#FFF"
					}
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: [{
                showInLegend: false,
                data: temperaturas
            }]
        });
    }
	function gerarGraficoPast(horas, temperaturas) {
        Highcharts.setOptions({
			colors: ['#FFF']
		});
		Highcharts.chart('past_chart', {
            chart: {
                type: 'line',
				backgroundColor: '#3e8ef7'
            },
            title: {
                text: 'Past 24 Hours Temperature',
				style: {
					color: "#FFF"
				}
            },
            xAxis: {
                categories: horas,
				labels: {
					style: {
						color: "#FFF"
					}
                }
            },
            yAxis: {
                title: {
                    text: 'Temperature (°C)',
					style: {
						color: "#FFF"
					}
                },
				labels: {
					style: {
						color: "#FFF"
					}
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    },
                    enableMouseTracking: false
                }
            },
            series: [{
                showInLegend: false,
                data: temperaturas
            }]
        });
    }

    

    function pegarPrevisãoHoraAHora(localCode) {
        
        $.ajax({
            url : "https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/" + localCode + "?apikey=" + accuweatherAPIKey +"&language=en-us&metric=true",
            type: "GET",
            dataType: "json",
            success: function(data){
                //console.log("hourly forecast: ", data);

                var horarios = [];
                var temperaturas = [];

                for (var a = 0; a < data.length; a++) {

                    var hora = new Date( data[a].DateTime ).getHours();

                    horarios.push( String(hora) + "h" );
                    temperaturas.push( data[a].Temperature.Value )
                    
                    gerarGrafico(horarios, temperaturas);
                    $('.refresh-loader').fadeOut();

                }
                
            },
            error: function(){
                console.log("Erro");
                gerarErro("Error getting hourly forecast");
            
            }  
        });
    
    }
	
	function pegarUltimashoras(localCode) {
        
        $.ajax({
            url : "https://dataservice.accuweather.com/currentconditions/v1/" + localCode + "/historical/24?apikey=" + accuweatherAPIKey +"&language=en-us&metric=true",			
            type: "GET",
            dataType: "json",
            success: function(data){
                //console.log("hourly forecast: ", data);

                var horarios = [];
                var temperaturas = [];

                for (var a = 0; a < data.length; a++) {

                    var hora = new Date( data[a].LocalObservationDateTime ).getHours();

                    horarios.push( String(hora) + "h" );
                    temperaturas.push( data[a].Temperature.Metric.Value )
                    
                    gerarGraficoPast(horarios, temperaturas);
                    $('.refresh-loader').fadeOut();

                }
                
            },
            error: function(){
                console.log("Erro");
                gerarErro("Error getting last hours forecast");
            
            }  
        });
    
    }

    function preencherPrevisao5Dias(previsoes) {

        $("#info_5dias").html("");
        var diasSemana = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

        for (var a = 0; a < previsoes.length; a++) {

            var dataHoje = new Date(previsoes[a].Date);
            var dia_semana = diasSemana[ dataHoje.getDay() ];

            var iconNumber = previsoes[a].Day.Icon <= 9 ? "0" + String(previsoes[a].Day.Icon) : String(previsoes[a].Day.Icon);

            iconeClima = "<i class=\"wi icon-accu" + iconNumber + "\"></i>";
            maxima = String(previsoes[a].Temperature.Maximum.Value);
            minima = String(previsoes[a].Temperature.Minimum.Value);

            elementoHTMLDia =  '<div class="daybyday">';
            elementoHTMLDia +=    '<h2>';
            elementoHTMLDia +=        dia_semana;
			elementoHTMLDia +=    '</h2>';
			elementoHTMLDia +=    iconeClima;
            elementoHTMLDia +=    '<div class="tempdaybyday">';
            elementoHTMLDia +=        minima + '&deg; C / ' + maxima + '&deg; C';  
			elementoHTMLDia +=    '</div>';  
            elementoHTMLDia += '</div>';       
                
            $("#info_5dias").append(elementoHTMLDia);
            elementoHTMLDia = "";
        

        }

    }

    function pegarPrevisao5Dias(localCode) {
    
        $.ajax({
            url : "https://dataservice.accuweather.com/forecasts/v1/daily/5day/" + localCode + "?apikey=" + accuweatherAPIKey + "&language=en-us&metric=true",
            type: "GET",
            dataType: "json",
            success: function(data){
                //console.log("5 day forecast: ", data);

                $("#texto_max_min").html("<i class=\"fas fa-chevron-down\"></i> " + String(data.DailyForecasts[0].Temperature.Minimum.Value) + "&deg; C <i class=\"fas fa-chevron-up\"></i> " + String(data.DailyForecasts[0].Temperature.Maximum.Value) + "&deg; C");

                preencherPrevisao5Dias(data.DailyForecasts);
                
            },
            error: function(){
                console.log("Erro");
                gerarErro("Error getting 5-day forecast");
            
            }  
        });
    
    }
	function pegarFoto(district) {
    
        $.ajax({
            url : "https://api.unsplash.com/search/photos?page=1&query=" + district + "&client_id=" + unsplashKey,
            type: "GET",
            dataType: "json",
            success: function(data){
                //console.log("pegarFoto: ", data);
                preencherFoto(data.results[0].urls.full);
                
            },
            error: function(){
                console.log("Erro");
                gerarErro("Error fetching region photo");
            
            }  
        });
    
    }

    function pegarTempoAtual(localCode) {
        
        $.ajax({
            url : "https://dataservice.accuweather.com/currentconditions/v1/" + localCode + "?apikey=" + accuweatherAPIKey + "&language=en-us",
            type: "GET",
            dataType: "json",
            success: function(data){
                // console.log("current conditions: ", data);

                weatherObject.temperatura = data[0].Temperature.Metric.Value;
                weatherObject.texto_clima = data[0].WeatherText;

                var iconNumber = data[0].WeatherIcon <= 9 ? "0" + String(data[0].WeatherIcon) : String(data[0].WeatherIcon);

                weatherObject.icone_clima = iconNumber;

                preencherClimaAgora(weatherObject.cidade,weatherObject.estado,weatherObject.pais,weatherObject.temperatura, weatherObject.texto_clima, weatherObject.icone_clima);
            },
            error: function(){
                console.log("Erro");
                gerarErro("Error getting current weather");
            
            }  
        });

    }

    function pegarLocalUsuario(lat, long) {
        $.ajax({
            url : "https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=" + accuweatherAPIKey + "&q=" + lat + "%2C" + long +"&language=en-us",
            type: "GET",
            dataType: "json",
            success: function(data){
                //console.log("geposition: ", data);
                
                try {
                    weatherObject.cidade = data.ParentCity.LocalizedName;
                }
                catch {
                    weatherObject.cidade = data.LocalizedName;
                }

                weatherObject.estado = data.AdministrativeArea.LocalizedName;
                weatherObject.pais = data.Country.LocalizedName;

                var localCode = data.Key;
                pegarTempoAtual(localCode);
                pegarPrevisao5Dias(localCode);
                pegarPrevisãoHoraAHora(localCode);
				pegarUltimashoras(localCode);
				pegarFoto(weatherObject.estado);


            },
            error: function(){
            console.log("Erro");
            gerarErro("Location code error");
            
            }  
        });
    }

    function pegarCoordenadasDaPesquisa(input) {
        input = encodeURI(input);
        $.ajax({
            url : "https://api.mapbox.com/geocoding/v5/mapbox.places/" + input + ".json?access_token=" + mapboxToken,
            type: "GET",
            dataType: "json",
            success: function(data){
                // console.log("mapbox: ", data);
                try {
                    var long = data.features[0].geometry.coordinates[0];
                    var lat = data.features[0].geometry.coordinates[1];
                    pegarLocalUsuario(lat, long);
                } catch {
                    gerarErro("Location search error");
                }

            },
            error: function(){
            console.log("Erro no Mapbox");
            gerarErro("Location search error");
            
            }  
        });
    }

    

    function pegarCoordenadasDoIP() {

            var lat_padrao = 41.191143;
            var long_padrao = -8.497839;

        $.ajax({
            //url : "https://www.geoplugin.net/json.gp",
			url : "https://ipgeolocation.abstractapi.com/v1/?api_key=" + ipgeolocationkey,
            type: "GET",
            dataType: "json",
            success: function(data){
                //console.log("coordenadas: ", data);
                if (data.latitude && data.longitude) {
                    pegarLocalUsuario(data.latitude,data.longitude);
                } else {
                    pegarLocalUsuario(lat_padrao,long_padrao);
                }

            },
            error: function(){
                console.log("Erro");
                pegarLocalUsuario(lat_padrao,long_padrao);
            
            }  
        });

    }

    function gerarErro(mensagem) {

        if(!mensagem) {
            mensagem = "Request error";
        }

        $('.refresh-loader').hide();
        $("#aviso-erro").text(mensagem);
        $("#aviso-erro").slideDown();
        window.setTimeout(function(){
            $("#aviso-erro").slideUp();
        },4000);


    }

    pegarCoordenadasDoIP();

    $("#search-button").click(function(){
        $('.refresh-loader').show();
        var local = $("input#local").val();
        if (local) {
            pegarCoordenadasDaPesquisa(local);
        } else {
            alert('Invalid location');
        }
    });

    $("input#local").on('keypress', function(e){
        
        if(e.which == 13) {
            $('.refresh-loader').show();
            var local = $("input#local").val();
            if (local) {
                pegarCoordenadasDaPesquisa(local);
            } else {
                alert('Invalid location');
            }
        }
        
    });


});