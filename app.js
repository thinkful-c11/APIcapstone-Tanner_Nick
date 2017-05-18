const appState = {
	results: []
	// searchTerm: "star wars",
	// category: " props",
	// api_key: "detvzuhzwwcbxd902sabhaf6",
	// etsyURL: "https://openapi.etsy.com/v2/listings/active.js?keywords="+terms+category"&limit=12&includes=Images:1&api_key="+api_key;
}


const getDataFromApi = (searchTerm, checkedVal, callback)=>{
	api_key = "detvzuhzwwcbxd902sabhaf6";
    searched = searchTerm;
    category = checkedVal;
    etsyURL = `https://openapi.etsy.com/v2/listings/active.js?keywords=${searched}%20${category}&limit=12&includes=Images:1&api_key=${api_key}`;

	$.ajax({
		method: 'GET',
		dataType: 'jsonp',
		url: etsyURL,
		success: function(data){
			callback(data);
		}
	})
}

const modState = (data)=>{
	appState.results = [];
	data.results.forEach(function(object){
		const title = object.title;
		const image = object.Images["0"].url_170x135;
		console.log(image);
		const etsyResult = {
			title: title,
			image: image
		}
		appState.results.push(etsyResult);
	})
	renderState(appState);
}

const renderState = (state)=>{
	let html = ``;
	appState.results.forEach(function(object){
		html += `<div class="entry">
		<h2>${object.title}</h2>
		<img class="img-render" src="${object.image}">
		</div>
		`
	})
	$('#js-etsy-results').html(html);
}

const listeners = ()=>{
	$('.js-form').submit((event)=>{
		event.preventDefault();
		let checkedVal = $('input[name="Answers"]:checked').val();
		const userInput = $(event.target).find('.js-query').val();
		console.log(userInput);
		getDataFromApi(userInput, checkedVal, modState);
		console.log(appState.results);
	} )
}


$(function(){

listeners();


})