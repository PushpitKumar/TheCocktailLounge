$(document).ready(function() {  
    //Navbar scroll color change
    $(window).on("scroll", function() {
        var scrollTop = $(window).scrollTop();
        if (scrollTop > 80) {
            $("body").addClass("fixed-header");
        } else {
            $("body").removeClass("fixed-header");
        }
    });

    $(".welcome-title").hide().fadeIn(2000);
    $(".welcome-msg").hide().fadeIn(3000);

    function toggleLetters() {
        if ($("#filter").val() === "Name") {
            $(".letters").addClass("d-flex justify-content-center").show();
        } else {
            $(".letters").removeClass("d-flex justify-content-center").hide();
            $(".filter-options").css("margin-bottom", "30px");
        }
    }

    //Activate 'A' letter by default on page load
    if ($(".letters a.active").length === 0) {
        activateLetter("A");
    }

    function activateLetter(letter) {
        $(".letters a").removeClass("active"); //Remove active state from all letters
        //Apply active state to the currently active letter
        $(".letters a").filter(function() {
            return $(this).text() === letter;
        }).addClass("active");
    }

    function showLoadingOverlay() {
        document.querySelector('.loading-overlay').style.display = 'flex';
        document.querySelector('.loading-dots').style.display = 'block';
    }

    function hideLoadingOverlay() {
        document.querySelector('.loading-overlay').style.display = 'none';
        document.querySelector('.loading-dots').style.display = 'none';
    }

    //Handle click event for letters
    $(".letters a").on("click", function(e) {
        e.preventDefault(); //Prevent default behaviour of anchor tags
        const selectedLetter = $(this).text();
        activateLetter(selectedLetter);
        //console.log("Fetching coctails starting with:", selectedLetter);
        showLoadingOverlay();
        setTimeout(() => { //Simulate a 3 second delay before fetching the data
            $.ajax({
                url: `/cocktails/${selectedLetter}`,
                method: 'GET',
                success: function(result) {
                    //console.log("Cocktails Received:", result);
                    $(".cocktail-container").empty(); //Clear the previous drinks
                    if (result.drinks) {
                        updateCocktailsContainer(result.drinks, "name");
                    } else {
                        $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>No Cocktail Found!</p>");
                    }
                },
                complete: function() {
                    hideLoadingOverlay();
                },
                error: function(xhr, status, error) {
                    console.error("Error fetching cocktails:", error);
                    $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>Oops! Something went wrong. Please try again later!</p>");
                    hideLoadingOverlay();
                }
            });
        }, 3000);
    });

    //Run on Page Load
    $.ajax({
        url: `/specialDrink`,
        method: 'GET',
        success: function(result) {
            //console.log("Drink of the day Received", result);
            const drink = result.drinks[0];
            const drinkCardHtml = `
                <div class="col-12 d-flex justify-content-center px-0">
                    <div class="d-flex justify-content-center">
                        <div class="card flex-fill drink-card" data-id="${drink.idDrink}">
                            <img src="${drink.strDrinkThumb}" class="card-img-top" alt="Cocktail Image" />
                            <div class="card-body gradient-background d-flex flex-column">
                                <h5 class="card-title">${drink.strDrink}</h5>
                                <div class="card-text lead">
                                    ${drink.strCategory} | ${drink.strAlcoholic} <br/>
                                    Served in: ${drink.strGlass}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            $(".special-container").html(drinkCardHtml);
        },
        error: function(xhr, status, error) {
            console.error("Error fetching drink of the day:", error);
            $(".special-container").html("<p class='text-center' style='color: #FFCC80'>Oops! Something went wrong. Please try again later!</p>");
        }
    });
    toggleLetters();
    
    $("#filter").on("change", toggleLetters);

    //Display the modal for a drink
    $(document).on("click", ".drink-card", function() {
        const drinkId = $(this).data("id");
        //console.log("Selected Drink ID:", drinkId);

        //Check if a modal is already open
        if ($("#drink-modal").hasClass("show")) {
            //Close the current modal before opening a new one
            $("#drink-modal").modal("hide");

            //optional: wait a bit before opening the next modal
            setTimeout(() => {
                fetchDrinkDetails(drinkId)
            }, 300);
        } else { //if no modal is open, immediately open the new one upon clicking
            fetchDrinkDetails(drinkId);
        }
    });

    function updateCocktailsContainer(drinks, filter) {
        let cocktailHtml = "";
        if (filter === "name") {
            drinks.forEach(drink => {
                const cardHtml = `
                    <div class="col-lg-4 col-md-6 col-sm-6 col-4 d-flex justify-content-center px-0 main-div">
                        <div class="d-flex justify-content-center">
                            <div class="card flex-fill drink-card" data-id="${drink.idDrink}">
                                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="Cocktail Image" />
                                <div class="card-body gradient-background d-flex flex-column">
                                    <h5 class="card-title">${drink.strDrink}</h5>
                                    <div class="card-text lead">
                                        ${drink.strCategory} | ${drink.strAlcoholic} <br/>
                                        Served in: ${drink.strGlass}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cocktailHtml += cardHtml;
            });
        } else if (filter === "alcoholic") {
            drinks.forEach(drink => {
                const cardHtml = `
                    <div class="col-lg-4 col-md-6 col-sm-6 col-4 d-flex justify-content-center px-0 main-div">
                        <div class="d-flex justify-content-center">
                            <div class="card flex-fill drink-card" data-id="${drink.idDrink}">
                                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="Cocktail Image" />
                                <div class="card-body gradient-background d-flex flex-column">
                                    <h5 class="card-title">${drink.strDrink}</h5>
                                    <div class="card-text lead">
                                        Alcoholic Drink
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cocktailHtml += cardHtml;
            });
        } else if (filter === "nonalcoholic") {
            drinks.forEach(drink => {
                const cardHtml = `
                    <div class="col-lg-4 col-md-6 col-sm-6 col-4 d-flex justify-content-center px-0 main-div">
                        <div class="d-flex justify-content-center">
                            <div class="card flex-fill drink-card" data-id="${drink.idDrink}">
                                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="Cocktail Image" />
                                <div class="card-body gradient-background d-flex flex-column">
                                    <h5 class="card-title">${drink.strDrink}</h5>
                                    <div class="card-text lead">
                                        Non-Alcoholic Drink
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cocktailHtml += cardHtml;
            });
        } else if (filter === "ordinary") {
            drinks.forEach(drink => {
                const cardHtml = `
                    <div class="col-lg-4 col-md-6 col-sm-6 col-4 d-flex justify-content-center px-0 main-div">
                        <div class="d-flex justify-content-center">
                            <div class="card flex-fill drink-card" data-id="${drink.idDrink}">
                                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="Cocktail Image" />
                                <div class="card-body gradient-background d-flex flex-column">
                                    <h5 class="card-title">${drink.strDrink}</h5>
                                    <div class="card-text lead">
                                        Ordinary Drink
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cocktailHtml += cardHtml;
            });
        } else if (filter === "cocktail") {
            drinks.forEach(drink => {
                const cardHtml = `
                    <div class="col-lg-4 col-md-6 col-sm-6 col-4 d-flex justify-content-center px-0 main-div">
                        <div class="d-flex justify-content-center">
                            <div class="card flex-fill drink-card" data-id="${drink.idDrink}">
                                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="Cocktail Image" />
                                <div class="card-body gradient-background d-flex flex-column">
                                    <h5 class="card-title">${drink.strDrink}</h5>
                                    <div class="card-text lead">
                                        Cocktail Drink
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cocktailHtml += cardHtml;
            });
        } else if (filter === "cocktailGlassDrinks") {
            drinks.forEach(drink => {
                const cardHtml = `
                    <div class="col-lg-4 col-md-6 col-sm-6 col-4 d-flex justify-content-center px-0 main-div">
                        <div class="d-flex justify-content-center">
                            <div class="card flex-fill drink-card" data-id="${drink.idDrink}">
                                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="Cocktail Image" />
                                <div class="card-body gradient-background d-flex flex-column">
                                    <h5 class="card-title">${drink.strDrink}</h5>
                                    <div class="card-text lead">
                                        Served in: Cocktail Glass
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cocktailHtml += cardHtml;
            });
        } else if (filter === "champagneFluteDrinks") {
            drinks.forEach(drink => {
                const cardHtml = `
                    <div class="col-lg-4 col-md-6 col-sm-6 col-4 d-flex justify-content-center px-0 main-div">
                        <div class="d-flex justify-content-center">
                            <div class="card flex-fill drink-card" data-id="${drink.idDrink}">
                                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="Cocktail Image" />
                                <div class="card-body gradient-background d-flex flex-column">
                                    <h5 class="card-title">${drink.strDrink}</h5>
                                    <div class="card-text lead">
                                        Served in: Champagne Flute
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cocktailHtml += cardHtml;
            });
        } else if (filter === "popularDrinks") {
            drinks.forEach(drink => {
                const cardHtml = `
                    <div class="col-lg-4 col-md-6 col-sm-6 col-4 d-flex justify-content-center px-0 main-div">
                        <div class="d-flex justify-content-center">
                            <div class="card flex-fill drink-card" data-id="${drink.idDrink}">
                                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="Cocktail Image" />
                                <div class="card-body gradient-background d-flex flex-column">
                                    <h5 class="card-title">${drink.strDrink}</h5>
                                    <div class="card-text lead">
                                        ${drink.strCategory} | ${drink.strAlcoholic} <br/>
                                        Served in: ${drink.strGlass}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cocktailHtml += cardHtml;
            });
        } else if (filter === "latestDrinks") {
            drinks.forEach(drink => {
                const cardHtml = `
                    <div class="col-lg-4 col-md-6 col-sm-6 col-4 d-flex justify-content-center px-0 main-div">
                        <div class="d-flex justify-content-center">
                            <div class="card flex-fill drink-card" data-id="${drink.idDrink}">
                                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="Cocktail Image" />
                                <div class="card-body gradient-background d-flex flex-column">
                                    <h5 class="card-title">${drink.strDrink}</h5>
                                    <div class="card-text lead">
                                        ${drink.strCategory} | ${drink.strAlcoholic} <br/>
                                        Served in: ${drink.strGlass}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cocktailHtml += cardHtml;
            });
        } else if (filter === "ginBasedDrinks") {
            drinks.forEach(drink => {
                const cardHtml = `
                    <div class="col-lg-4 col-md-6 col-sm-6 col-4 d-flex justify-content-center px-0 main-div">
                        <div class="d-flex justify-content-center">
                            <div class="card flex-fill drink-card" data-id="${drink.idDrink}">
                                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="Cocktail Image" />
                                <div class="card-body gradient-background d-flex flex-column">
                                    <h5 class="card-title">${drink.strDrink}</h5>
                                    <div class="card-text lead">
                                        Gin Based Drink
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cocktailHtml += cardHtml;
            });
        } else if (filter === "vodkaBasedDrinks") {
            drinks.forEach(drink => {
                const cardHtml = `
                    <div class="col-lg-4 col-md-6 col-sm-6 col-4 d-flex justify-content-center px-0 main-div">
                        <div class="d-flex justify-content-center">
                            <div class="card flex-fill drink-card" data-id="${drink.idDrink}">
                                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="Cocktail Image" />
                                <div class="card-body gradient-background d-flex flex-column">
                                    <h5 class="card-title">${drink.strDrink}</h5>
                                    <div class="card-text lead">
                                        Vodka Based Drink
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cocktailHtml += cardHtml;
            });
        } else if (filter === "rumBasedDrinks") {
            drinks.forEach(drink => {
                const cardHtml = `
                    <div class="col-lg-4 col-md-6 col-sm-6 col-4 d-flex justify-content-center px-0 main-div">
                        <div class="d-flex justify-content-center">
                            <div class="card flex-fill drink-card" data-id="${drink.idDrink}">
                                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="Cocktail Image" />
                                <div class="card-body gradient-background d-flex flex-column">
                                    <h5 class="card-title">${drink.strDrink}</h5>
                                    <div class="card-text lead">
                                        Rum Based Drink
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cocktailHtml += cardHtml;
            });
        } else if (filter === "tequilaBasedDrinks") {
            drinks.forEach(drink => {
                const cardHtml = `
                    <div class="col-lg-4 col-md-6 col-sm-6 col-4 d-flex justify-content-center px-0 main-div">
                        <div class="d-flex justify-content-center">
                            <div class="card flex-fill drink-card" data-id="${drink.idDrink}">
                                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="Cocktail Image" />
                                <div class="card-body gradient-background d-flex flex-column">
                                    <h5 class="card-title">${drink.strDrink}</h5>
                                    <div class="card-text lead">
                                        Tequila Based Drink
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cocktailHtml += cardHtml;
            });
        } else if (filter === "scotchBasedDrinks") {
            drinks.forEach(drink => {
                const cardHtml = `
                    <div class="col-lg-4 col-md-6 col-sm-6 col-4 d-flex justify-content-center px-0 main-div">
                        <div class="d-flex justify-content-center">
                            <div class="card flex-fill drink-card" data-id="${drink.idDrink}">
                                <img src="${drink.strDrinkThumb}" class="card-img-top" alt="Cocktail Image" />
                                <div class="card-body gradient-background d-flex flex-column">
                                    <h5 class="card-title">${drink.strDrink}</h5>
                                    <div class="card-text lead">
                                        Scotch Based Drink
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                cocktailHtml += cardHtml;
            });
        }
        
        $(".cocktail-container").append(cocktailHtml);
    }

    function fetchDrinkDetails(drinkId) {
        $.ajax({
            url: `/drink/${drinkId}`,
            method: 'GET',
            success: function(result) {
                //console.log("Drink Details Received:", result);
                if (result.drinks && result.drinks.length > 0) {
                    const drink = result.drinks[0];
                    let ingredientList = "";
                    for(let i = 1; i <= 15; i++) { /*Each drink has max 15 ingredients*/
                        const ingredient = drink[`strIngredient${i}`];
                        const measure = drink[`strMeasure${i}`]|| "";
                        if (ingredient) {
                            ingredientList += `<li>${measure} ${ingredient}</li>`;
                        }
                    } 
                    const modalContent = `
                    <div class="modal-content gradient-background" aria-live="assertive" aria-labelledby="drink-title">
                        <div class="modal-header">
                            <h3 class="modal-title" id="drink-title" aria-hidden="true">${drink.strDrink}</h3>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true"></span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="text-center">
                                <img id="drink-image" src="${drink.strDrinkThumb}" class="img-fluid rounded" alt="Drink Image" />
                            </div>
                            <p id="drink-category" class="mt-3"><strong>Category:</strong> ${drink.strCategory}</p>
                            <p id="drink-type"><strong>Type:</strong> ${drink.strAlcoholic}</p>
                            <p id="drink-glass"><strong>Served In:</strong> ${drink.strGlass}</p>
                            <p id="drink-instructions"><strong>Instructions: </strong>${drink.strInstructions}</p>
                            <p id="drink-ingredientspara"><strong>Ingredients</strong></p>
                            <ul id="drink-ingredients">${ingredientList}</ul>
                        </div>
                    </div>
                    `
                    $("#drink-modal .modal-dialog").html(modalContent);
                    $("#drink-modal").modal("show");
                }
            },
            error: function(xhr, status, error) {
                console.error("Error fetching drink details:", error);
            }
        });
    }

    //Fetch Drinks based on filter/selection
    $("#filter").on("change", function() {
        if ($(this).val() === "Name") {
            //console.log("Fetching Drinks starting with A");
            activateLetter("A");
            toggleLetters();
            showLoadingOverlay();
            setTimeout(() => {
                $.ajax({
                    url: `/cocktails/${"A"}`,
                    method: 'GET',
                    success: function(result) {
                        //console.log("Recieved Cocktails starting with A", result);
                        $(".cocktail-container").empty();
                        if (result.drinks) {
                            updateCocktailsContainer(result.drinks, "name");
                        } else {
                            $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>No Cocktail Found!</p>");
                        }
                    },
                    complete: function() {
                        hideLoadingOverlay();
                    },
                    error: function(xhr, status, error) {
                        console.error("Error fetching cokctails", error);
                        $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>Oops! Something went wrong. Please try again later!");
                        hideLoadingOverlay();
                    }
                });
            }, 3000);
        } else if ($(this).val() === "Alcoholic") {
            //console.log("Fetching Alcoholic Drinks");
            showLoadingOverlay();
            setTimeout(() => {
                $.ajax({
                    url: `/alcoholic`,
                    method: 'GET',
                    success: function(result) {
                        //console.log("Alcholic Drinks Recieved:", result);
                        $(".cocktail-container").empty();
                        if (result.drinks) {
                            updateCocktailsContainer(result.drinks, "alcoholic");
                        } else {
                            $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>No Cocktail Found!</p>");
                        }
                    },
                    complete: function() {
                        hideLoadingOverlay();
                    },
                    error: function(xhr, status, error) {
                        console.error("Error fetching cocktails", error);
                        $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>Oops! Something went wrong. Please try again later!</p>");
                        hideLoadingOverlay();
                    }
                });
            }, 3000);
        } else if ($(this).val() === "Non_Alcoholic") {
            //console.log("Fetching Non-Alcoholic Drinks");
            showLoadingOverlay();
            setTimeout(() => {
                $.ajax({
                    url: '/nonalcoholic',
                    method: 'GET',
                    success: function(result) {
                        //console.log("Non-Alcoholic Drinks Received", result);
                        $(".cocktail-container").empty();
                        if (result.drinks) {
                            updateCocktailsContainer(result.drinks, "nonalcoholic");
                        } else {
                            $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>No Cocktail Found!</p>");
                        }
                    },
                    complete: function() {
                        hideLoadingOverlay();
                    },
                    error: function(xhr, status, error) {
                        console.error("Error fetching cocktails", error);
                        $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>Oops! Something went wrong. Please try again later!");
                    }
                });
            }, 3000);
        } else if ($(this).val() === "Ordinary_Drink") {
            //console.log("Fetching Ordinary Drinks");
            showLoadingOverlay();
            setTimeout(() => {
                $.ajax({
                    url: '/ordinary',
                    method: 'GET',
                    success: function(result) {
                        //console.log("Ordinary Drinks Received", result);
                        $(".cocktail-container").empty();
                        if (result.drinks) {
                            updateCocktailsContainer(result.drinks, "ordinary");
                        } else {
                            $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>No Cocktail Found!</p>");
                        }
                    },
                    complete: function() {
                        hideLoadingOverlay();
                    },
                    error: function(xhr, status, error) {
                        console.error("Error fetching cocktails", error);
                        $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>Oops! Something went wrong. Please try again later!");
                    }
                });
            }, 3000);
        } else if ($(this).val() === "Cocktail") {
            //console.log("Fetching Cocktails");
            showLoadingOverlay();
            setTimeout(() => {
                $.ajax({
                    url: '/cocktaildrinks',
                    method: 'GET',
                    success: function(result) {
                        //console.log("Cocktails Drinks Received", result);
                        $(".cocktail-container").empty();
                        if (result.drinks) {
                            updateCocktailsContainer(result.drinks, "cocktail");
                        } else {
                            $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>No Cocktail Found!</p>");
                        }
                    },
                    complete: function() {
                        hideLoadingOverlay();
                    },
                    error: function(xhr, status, error) {
                        console.error("Error fetching cocktails", error);
                        $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>Oops! Something went wrong. Please try again later!");
                    }
                });
            }, 3000);
        } else if ($(this).val() === "Cocktail_Glass") {
            //console.log("Fetching Drinks served in cocktail glass");
            showLoadingOverlay();
            setTimeout(() => {
                $.ajax({
                    url: '/cocktailglassdrinks',
                    method: 'GET',
                    success: function(result) {
                        //console.log("Drinks served in Cocktail Glass Received", result);
                        $(".cocktail-container").empty();
                        if (result.drinks) {
                            updateCocktailsContainer(result.drinks, "cocktailGlassDrinks");
                        } else {
                            $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>No Cocktail Found!</p>");
                        }
                    },
                    complete: function() {
                        hideLoadingOverlay();
                    },
                    error: function(xhr, status, error) {
                        console.error("Error fetching cocktails", error);
                        $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>Oops! Something went wrong. Please try again later!");
                    }
                });
            }, 3000);
        } else if ($(this).val() === "Champagne_flute") {
            //console.log("Fetching Drinks served in champagne flute");
            showLoadingOverlay();
            setTimeout(() => {
                $.ajax({
                    url: '/champagneflutedrinks',
                    method: 'GET',
                    success: function(result) {
                        //console.log("Drinks served in Champagne Flute Received", result);
                        $(".cocktail-container").empty();
                        if (result.drinks) {
                            updateCocktailsContainer(result.drinks, "champagneFluteDrinks");
                        } else {
                            $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>No Cocktail Found!</p>");
                        }
                    },
                    complete: function() {
                        hideLoadingOverlay();
                    },
                    error: function(xhr, status, error) {
                        console.error("Error fetching cocktails", error);
                        $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>Oops! Something went wrong. Please try again later!");
                    }
                });
            }, 3000);
        } else if ($(this).val() === "Popular") {
            //console.log("Fetching Popular Drinks");
            showLoadingOverlay();
            setTimeout(() => {
                $.ajax({
                    url: '/populardrinks',
                    method: 'GET',
                    success: function(result) {
                        //console.log("Popular drinks received", result);
                        $(".cocktail-container").empty();
                        if (result.drinks) {
                            updateCocktailsContainer(result.drinks, "popularDrinks");
                        } else {
                            $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>No Cocktail Found!</p>");
                        }
                    },
                    complete: function() {
                        hideLoadingOverlay();
                    },
                    error: function(xhr, status, error) {
                        console.error("Error fetching cocktails", error);
                        $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>Oops! Something went wrong. Please try again later!");
                    }
                });
            }, 3000);
        } else if ($(this).val() === "New") {
            //console.log("Fetching Latest Drinks");
            showLoadingOverlay();
            setTimeout(() => {
                $.ajax({
                    url: '/latestdrinks',
                    method: 'GET',
                    success: function(result) {
                        //console.log("Latest drinks received", result);
                        $(".cocktail-container").empty();
                        if (result.drinks) {
                            updateCocktailsContainer(result.drinks, "latestDrinks");
                        } else {
                            $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>No Cocktail Found!</p>");
                        }
                    },
                    complete: function() {
                        hideLoadingOverlay();
                    },
                    error: function(xhr, status, error) {
                        console.error("Error fetching cocktails", error);
                        $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>Oops! Something went wrong. Please try again later!");
                    }
                });
            }, 3000);
        } else if ($(this).val() === "Gin") {
            //console.log("Fetching Gin Based Drinks");
            showLoadingOverlay();
            setTimeout(() => {
                $.ajax({
                    url: '/ginbaseddrinks',
                    method: 'GET',
                    success: function(result) {
                        //console.log("Gin based drinks received", result);
                        $(".cocktail-container").empty();
                        if (result.drinks) {
                            updateCocktailsContainer(result.drinks, "ginBasedDrinks");
                        } else {
                            $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>No Cocktail Found!</p>");
                        }
                    },
                    complete: function() {
                        hideLoadingOverlay();
                    },
                    error: function(xhr, status, error) {
                        console.error("Error fetching cocktails", error);
                        $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>Oops! Something went wrong. Please try again later!");
                    }
                });
            }, 3000);
        } else if ($(this).val() === "Vodka") {
            //console.log("Fetching Vodka Based Drinks");
            showLoadingOverlay();
            setTimeout(() => {
                $.ajax({
                    url: '/vodkabaseddrinks',
                    method: 'GET',
                    success: function(result) {
                        //console.log("Vodka based drinks received", result);
                        $(".cocktail-container").empty();
                        if (result.drinks) {
                            updateCocktailsContainer(result.drinks, "vodkaBasedDrinks");
                        } else {
                            $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>No Cocktail Found!</p>");
                        }
                    },
                    complete: function() {
                        hideLoadingOverlay();
                    },
                    error: function(xhr, status, error) {
                        console.error("Error fetching cocktails", error);
                        $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>Oops! Something went wrong. Please try again later!");
                    }
                });
            }, 3000);
        } else if ($(this).val() === "Rum") {
            //console.log("Fetching Rum Based Drinks");
            showLoadingOverlay();
            setTimeout(() => {
                $.ajax({
                    url: '/rumbaseddrinks',
                    method: 'GET',
                    success: function(result) {
                        //console.log("Rum based drinks received", result);
                        $(".cocktail-container").empty();
                        if (result.drinks) {
                            updateCocktailsContainer(result.drinks, "rumBasedDrinks");
                        } else {
                            $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>No Cocktail Found!</p>");
                        }
                    },
                    complete: function() {
                        hideLoadingOverlay();
                    },
                    error: function(xhr, status, error) {
                        console.error("Error fetching cocktails", error);
                        $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>Oops! Something went wrong. Please try again later!");
                    }
                });
            }, 3000);
        } else if ($(this).val() === "Tequila") {
            //console.log("Fetching Tequila Based Drinks");
            showLoadingOverlay();
            setTimeout(() => {
                $.ajax({
                    url: '/tequilabaseddrinks',
                    method: 'GET',
                    success: function(result) {
                        //console.log("Tequila based drinks received", result);
                        $(".cocktail-container").empty();
                        if (result.drinks) {
                            updateCocktailsContainer(result.drinks, "tequilaBasedDrinks");
                        } else {
                            $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>No Cocktail Found!</p>");
                        }
                    },
                    complete: function() {
                        hideLoadingOverlay();
                    },
                    error: function(xhr, status, error) {
                        console.error("Error fetching cocktails", error);
                        $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>Oops! Something went wrong. Please try again later!");
                    }
                });
            }, 3000);
        } else if ($(this).val() === "Scotch") {
            //console.log("Fetching Scotch Based Drinks");
            showLoadingOverlay();
            setTimeout(() => {
                $.ajax({
                    url: '/scotchbaseddrinks',
                    method: 'GET',
                    success: function(result) {
                        //console.log("Scotch based drinks received", result);
                        $(".cocktail-container").empty();
                        if (result.drinks) {
                            updateCocktailsContainer(result.drinks, "scotchBasedDrinks");
                        } else {
                            $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>No Cocktail Found!</p>");
                        }
                    },
                    complete: function() {
                        hideLoadingOverlay();
                    },
                    error: function(xhr, status, error) {
                        console.error("Error fetching cocktails", error);
                        $(".cocktail-container").html("<p class='text-center' style='color: #FFCC80'>Oops! Something went wrong. Please try again later!");
                    }
                });
            }, 3000);
        }
    });

    let debounceTimeout;

    //Search for drinks
    $("#search").on("input", function() {
        const input = $(this).val().trim();
        if (input.length >= 3) {
            clearTimeout(debounceTimeout); //Clear the previous timeout
            debounceTimeout = setTimeout(() => {
                $.ajax({
                    url: '/search',
                    method: 'GET',
                    data: { q: input },
                    success: function(data) {
                        const drinks = data.drinks || [];
                        showSuggestions(drinks);
                    },
                    error: function(error) {
                        console.error("Error  fetching search results", error);
                    }
                });
            }, 500);
        } else {
            $("#suggestions").empty().fadeOut(); //Clear suggestions if the input is too short
        }
    });

    function showSuggestions(drinks) {
        const suggestionsContainer = $("#suggestions");
        suggestionsContainer.empty(); //Clear previous suggestions

        if (drinks.length > 0) {
            suggestionsContainer.fadeIn();
            drinks.forEach(drink => {
                const suggestion = 
                `<div class="suggestion" data-id="${drink.idDrink}"
                    <p>${drink.strDrink}</p>
                 </div>
                `;
                suggestionsContainer.append(suggestion);
            });

            $('.suggestion').on('click', function () {
                $("#search").val('');
                suggestionsContainer.empty().fadeOut();
                const drinkId = $(this).data('id');
                fetchDrinkDetails(drinkId);
            });
        } else {
            suggestionsContainer.append(`<p>No Drinks Found!</p>`).fadeIn();
        }
    }

    if (history.pushState) { //Keeps the url clean when navigating from about.ejs back to index.ejs
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }    
});