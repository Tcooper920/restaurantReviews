/*
  Pre-requisites: install JSON server: https://github.com/typicode/json-server#getting-started
  http://localhost:3000/restaurants
  http://localhost:3000/reviews
*/

// Fetch restaurant names and info
const getRestaurants = async () => {
	const restaurants = await fetch ("http://localhost:3000/restaurants");
	const restaurant = await restaurants.json();
	return restaurant;
};

// Fetch restaurant reviews
const getReviews = async () => {
	const reviews = await fetch ("http://localhost:3000/reviews");
	const review = await reviews.json();
	return review;
};

// Return the restaurant name, address, an image, the reviews, and the average review score.
const prepareRestaurantInfo = async () => {
	const restaurants = await getRestaurants();
	const reviews = await getReviews();

	// Return reviews, calculate average star rating, sort 
	const findAverageAndSort = async () => restaurants.map((restaurant) => {
		let totalStars = 0;

		// Return reviews
		const restaurantReviews = reviews.filter((review) => {
			return review.restaurantId === restaurant.id;
		})
		.map((review) => {
			totalStars += review.stars;
			
			return `<p class='review'>${review.text}<br>
			Stars: <span class='stars'>${review.stars}</span><p>`;
		});

		restaurant.restaurantReviews = restaurantReviews;
		
		// Find average
		const averageRatingRounded = Math.round((totalStars / restaurantReviews.length) * 10) / 10;
		restaurant.average = averageRatingRounded;

		// Sort based on average stars
		restaurants.sort((a, b) => a.average - b.average).reverse();

	});

	findAverageAndSort();

	return restaurants.map((thisRestaurant) => {
		thisRestaurant.code = `<div class='restaurant-wrapper'>
		<div class='restaurant-info-container'>
		<div class='restaurant-image' style="background: url('${thisRestaurant.imgUrl}'); background-size: cover;"></div>
		<p><span class='name'>${thisRestaurant.name}</span><br>
		<span class='address-label'>Address:</span> ${thisRestaurant.address}<br>
		<span class='average-rating-label'>Average Rating:</span> <span class='average-stars'>${thisRestaurant.average}</span> Stars</div>
		Reviews: ${thisRestaurant.restaurantReviews.join("")}
		</div>`

		return thisRestaurant.code;
	}).join("");
};

// Print the restaurant info to the page
const printRestaurantInfoToPage = async () => {
	const restaurantContainer = document.getElementsByClassName("restaurant-container")[0];

	restaurantContainer.innerHTML += await prepareRestaurantInfo();
};

printRestaurantInfoToPage();



