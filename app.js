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
			html += `
			<div class="inline1"><h2>I am a </h2></div> 
			<div class="inline2"><form class="js-form"><select class="select" id="userCategory">
			<option value=" " disabled selected>Select your option</option>
  			<option value="cosplay costume"><p>Cosplayer</p></option>
  			<option value="collectible prop"><p>Prop Collector</p></option>
  			<option value="vintage rare collectible"><p>Vintage Enthusiast</p></option>
  			<option value=" "><p>General Consumer</p></option>
			</select> <h2>and I am a fan of </h2>
			<input type="text" class="js-query input">
			</form></div><div id="button-container"><button class="button" type="submit">Search</button></div> `;
			$('.js-filters').html(html);
	} else if (state.pageView===1) {
		appState.results.forEach(function(object){
			html += `<div class="entry">
				<div class="entry-title"><p>${object.title}</p></div>
				<div class="entry-img"><a href="${object.url}" target="_blank" ><img class="img-render" src="${object.image}"></a></div>
				</div>`;
	})
	$('#js-etsy-results').html(html);
	}
}


const listeners = ()=>{
	$('#button-container').on('click', (event)=>{
		event.preventDefault();
		let checkedVal =$("#userCategory option:selected" ).val();
		const userInput = $('.js-query').val();
		console.log(userInput);
		categoryMod(appState, checkedVal);
		pageViewCounter(appState);
		getDataFromApi(userInput, modState);
	})
}


$(function(){
renderState(appState);
listeners();
})