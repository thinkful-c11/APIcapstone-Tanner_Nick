$(function(){

$.ajax({
	method: 'GET',
	dataType: 'JSON',
	url: 'https://etsy-proxy.herokuapp.com/v2',
	data: {
		limit: 5,
		catagory: "c/books-movies-and-music/movies",
		api_key: "detvzuhzwwcbxd902sabhaf6",
	},
	success: function(data){
		console.log(data);
	}
})

})