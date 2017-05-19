const appState = {
	pageView: 0, //defines what the user is looking at, at any given time. Updated using the pageViewUpdater function, referred to by the render function in its logic.
	category: "", //updated using the updateCategory function, helping to refine our search results given the user's needs. 
	results: [] //an array that will hold a series of objects pushed in by the modState function, and rendered by the renderState function.

}

const getDataFromApi = (searchTerm, callback)=>{ //gets data from etsy API, passes that data along to the callback (modState)
	api_key = "detvzuhzwwcbxd902sabhaf6";
    searched = searchTerm; //the term the user writes into our input field.
    category = appState.category; //the category is updated using the updateCategory function, which takes in the value of the selected choice.

    // the etsyURL, a url pieced together using template literals.
    etsyURL = `https://openapi.etsy.com/v2/listings/active.js?keywords=${searched}%20${category}&limit=16&includes=Images:1&api_key=${api_key}`;

	$.ajax({
		dataType: 'jsonp',
		url: etsyURL,
		success: function(data){
			callback(data); //call back = modState
		}
	})
}

const updateCategory = (state, checkedVal)=>{ //Updates the category key in our app state to what the user chooses from the given options.
	state.category = checkedVal;
}

const pageViewUpdater = (state)=>{ //when first called, this function changes our page view from 0 to 1. 0 = search bar and user choices, 1 = user choices, search bar, and results. 
	if(state.pageView===0){
		state.pageView=1;
	} else if (state.pageView===1){
		state.pageView=1;
	};
}

const modState = (data)=>{ //modifies the state, adding an object for each result we get back from the API.
	appState.results = [];
	data.results.forEach(function(object){
		const title = object.title;
		const image = object.Images["0"].url_170x135; //to be clear, the 0 in this case is an actual key within an object Etsy gives us, not a position in an array.
		const url = object.url;
		const etsyResult = {
			title: title,
			image: image,
			url: url
		}
		appState.results.push(etsyResult); //pushes our results to the results array in our app state.
	})
	renderState(appState);
}


// there probably is a much more elegant way of writing this render function, we began with the concept of keeping track of what page we should be seeing by using the app state as a reference.
// Although the logic in the render function is somewhat unnecessary, it would allow for easy expansion of the app.

const renderState = (state)=>{ //renders the state
	let html = ``;
	if (state.pageView===0) { //first checks what it needs to display on the page, depending on what our state looks like. (refer to updateCategory)
			html += `
			<div class="wrapper">
			<div class="inline1"><h2>I am a </h2></div> 
			<div class="inline2"><form class="js-form"><select class="select" id="userCategory">
			<option value=" " disabled selected>Select your option</option>
  			<option value="cosplay costume"><p>Cosplayer</p></option>
  			<option value="collectible prop"><p>Prop Collector</p></option>
  			<option value="vintage rare collectible"><p>Vintage Enthusiast</p></option>
  			<option value=" "><p>General Consumer</p></option>
			</select> <h2>and I am a fan of </h2>
			<input type="text" class="js-query input">
			</form></div></div><div id="button-container"><button class="button" type="submit">Search</button></div> `;
			$('.js-filters').html(html);
	} else if (state.pageView===1) { //if the user clicks the submit button, the pageViewUpdater function is called, setting the page view equal to 1.
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
	$('#button-container').on('click', (event)=>{ //listens to the submit button.
		event.preventDefault();
		let checkedVal =$("#userCategory option:selected" ).val(); //gets the value of the chosen category, giving that value to the updateCategory function.
		const userInput = $('.js-query').val(); //gets the user's input to then be passed to our getDataFromApi, that will then be used as the search term.
		updateCategory(appState, checkedVal);
		pageViewUpdater(appState); //changes the pageView from 0 to 1, when we re-render it will then show the results.
		getDataFromApi(userInput, modState);
	})

	$('.js-filters').submit((event)=>{ //listens for a submit via the enter key.
		event.preventDefault();
		let checkedVal =$("#userCategory option:selected" ).val(); //gets the value of the chosen category, giving that value to the updateCategory function.
		const userInput = $('.js-query').val(); //gets the user's input to then be passed to our getDataFromApi, that will then be used as the search term.
		updateCategory(appState, checkedVal);
		pageViewUpdater(appState); //changes the pageView from 0 to 1, when we re-render it will then show the results.
		getDataFromApi(userInput, modState);
	})
}


$(function(){ //runs when page first loads

renderState(appState); //we run this, having our pageView set to zero, therefore rendering just our user input field. 
listeners();

})