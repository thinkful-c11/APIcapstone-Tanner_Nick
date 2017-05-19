const appState = {
	pageView: 0,
	category: "",
	results: []

}

const getDataFromApi = (searchTerm, callback)=>{
	api_key = "detvzuhzwwcbxd902sabhaf6";
    searched = searchTerm;
    category = appState.category;
    etsyURL = `https://openapi.etsy.com/v2/listings/active.js?keywords=${searched}%20${category}&limit=16&includes=Images:1&api_key=${api_key}`;

	$.ajax({
		dataType: 'jsonp',
		url: etsyURL,
		success: function(data){
			console.log(data);
			callback(data);
		}
	})
}

const categoryMod = (state, checkedVal)=>{
	state.category = checkedVal;
}

const pageViewCounter = (state)=>{
	if(state.pageView===0){
		state.pageView=1;
	} else if (state.pageView===1){
		state.pageView=1;
	};
}

const modState = (data)=>{
	appState.results = [];
	data.results.forEach(function(object){
		const title = object.title;
		const image = object.Images["0"].url_170x135;
		const url = object.url;
		console.log(image);
		const etsyResult = {
			title: title,
			image: image,
			url: url
		}
		appState.results.push(etsyResult);
	})
	renderState(appState);
}

const renderState = (state)=>{
	let html = ``;
	if (state.pageView===0) {
			html += `<h2>I am a </h2><form class="js-form">
			<select id="userCategory">
			<option value=" " disabled selected>Select your option</option>
  			<option value="cosplay">Cosplayer</option>
  			<option value="props">Prop Collector</option>
  			<option value="vintage">Vintage Enthusiast</option>
  			<option value=" ">Normie</option>
			</select> <h2>and I am a fan of </h2>
			<input type="text" class="js-query">
			</form> `;
			$('.js-filters').html(html);
	} else if (state.pageView===1) {
		appState.results.forEach(function(object){
			html += `<div class="entry">
				<h2>${object.title}</h2>
				<a href="${object.url}" target="_blank" ><img class="img-render" src="${object.image}"></a>
				</div>`;
	})
	$('#js-etsy-results').html(html);
	}
}


const listeners = ()=>{
	$('.js-form').submit((event)=>{
		event.preventDefault();
		let checkedVal =$("#userCategory option:selected" ).val();
		const userInput = $(event.target).find('.js-query').val();
		categoryMod(appState, checkedVal);
		pageViewCounter(appState);
		getDataFromApi(userInput, modState);
	})
}


$(function(){
renderState(appState);
listeners();
})