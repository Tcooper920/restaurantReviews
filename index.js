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

const restaurantContainer = document.getElementsByClassName("restaurant-container")[0];

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
			Stars: <span class='stars'>${review.stars}</span></p>`;
		});

		restaurant.restaurantReviews = restaurantReviews;
		
		// Find average
		const averageRatingRounded = Math.round((totalStars / restaurantReviews.length) * 10) / 10;
		restaurant.average = averageRatingRounded;

		// Sort based on average stars
		restaurants.sort((a, b) => b.average - a.average);

	});

	findAverageAndSort();

	return restaurants.map((thisRestaurant) => {

		thisRestaurant.code = `<div class='restaurant-wrapper'>
		<div class='restaurant-info-container'>
		<div class='restaurant-image' style="background: url('${thisRestaurant.imgUrl}'); background-size: cover;"></div>
		<p><span class='name'>${thisRestaurant.name}</span><br>
		<span class='address-label'>Address:</span> ${thisRestaurant.address}<br>
		<span class='average-rating-label'>Average Rating:</span> <span class='average-stars'>${thisRestaurant.average}</span> Stars</div>
		Reviews: 
		<span class='review-container' id='review-container-${thisRestaurant.id}'>${thisRestaurant.restaurantReviews.join("")}</span>
		<form>
		<input class='review-text' id='review-text-${thisRestaurant.id}'>
		</input><input class='review-stars' id='review-stars-${thisRestaurant.id}'></input>
		<button class='submit-review-button' id='${thisRestaurant.id}'>Submit Review</button>
		</form>
		</div>`

		return thisRestaurant.code;
	}).join("");
};

// Print the restaurant info to the page
const printRestaurantInfoToPage = async () => {
	restaurantContainer.innerHTML = await prepareRestaurantInfo();
	window.location = "#/"
};

printRestaurantInfoToPage();

// Add a review to a restaurant
const createReview = async (thisRestaurantId, thisRestaurantStars, thisRestaurantReviewText) => {
	const newReview = {
    	restaurantId: thisRestaurantId,
    	stars: thisRestaurantStars,
    	text: thisRestaurantReviewText,
	};

  // POST request - create a restaurant review record in the database
  await fetch("http://localhost:3000/reviews/", {
    method: "POST",
    body: JSON.stringify(newReview),
    headers: {
		Accept: "application/json",
		"Content-Type": "application/json",
    },
  });
  printRestaurantInfoToPage();
};

// Review button onclick functionality
const reviewButtons = async () => {
	await prepareRestaurantInfo();
	
	const reviewButtons = [...document.getElementsByClassName("submit-review-button")];

	document.addEventListener("click", (event) => {
		if (event.target.matches(".submit-review-button")) {
			let thisButtonId = parseInt(event.target.id);
			let thisReviewTextInputField = document.getElementById(`review-text-${event.target.id}`);
			let thisReviewText = thisReviewTextInputField.value;
			let thisReviewStarRatingField = document.getElementById(`review-stars-${event.target.id}`);
			let thisReviewStarRating = parseInt(thisReviewStarRatingField.value);

			// If fields aren't empty
			if (thisReviewText && thisReviewStarRating) {
				createReview(thisButtonId, thisReviewStarRating, thisReviewText);
			}
		};
	});
};

reviewButtons();






