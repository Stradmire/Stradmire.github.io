var gameData = {
    food: 0,
    foodCents: 0,
    foodPerClick: 1,
    foodPerClickCost: 10,
    foodForagingEfficiency: 15,
    population: 50,
    populationMax: 52,
    dryWood: 0,
    dryWoodPerClick: 1,
    broadLeaves: 0,
    broadLeavesPerClick: 1,
    inspiration: 0,
    day: 1
}

// Main loop timer
var mainGameLoop = window.setInterval(function() {
update()
}, 1000)

// Main loop
function update() {
	autoForage()
	incrementDay()
}

function incrementFood(amount) {
	gameData.foodCents += amount
	gameData.food += Math.floor(gameData.foodCents/100)
	gameData.foodCents = gameData.foodCents % 100
}

function incrementDay() {
	if (gameData.day > 400) {gameData.day = 1}
	if(gameData.day <= 100){
		gameData.season = "Spring"
	} else if (gameData.day <= 200) {
		gameData.season = "Summer"
	} else if (gameData.day <= 300) {
		gameData.season = "Fall"
	} else {
		gameData.season = "Winter"
	}
	document.getElementById("seasonLabel").innerHTML = "Current Season: " + gameData.season
	if(gameData.day % 100 == 0){
		document.getElementById("seasonProgress").value = 100
	} else {
		document.getElementById("seasonProgress").value = gameData.day % 100
	}
	gameData.day += 1
}

function updateForageRate() {
document.getElementById("forageRate").innerHTML = gameData.population * gameData.foodForagingEfficiency + " Food/100s"
}

function updateFoodCount() {
document.getElementById("foodForaged").innerHTML = gameData.food + " Food Foraged"
}

function updateDryWoodCount() {
document.getElementById("dryWoodForaged").innerHTML = gameData.dryWood + " Dry Wood Foraged"
}

function updateBroadLeavesCount() {
document.getElementById("broadLeavesForaged").innerHTML = gameData.broadLeaves + " Broad Leaves Foraged"
}

function updatePopulationCount() {
document.getElementById("population").innerHTML = gameData.population + "/" + gameData.populationMax + " Population"
}

function updateInspirationCount() {
	document.getElementById("inspirationGained").innerHTML = gameData.inspiration + " Inspiration Gained"
}

function autoForage() {
	incrementFood(gameData.population * gameData.foodForagingEfficiency)
	updateFoodCount()
}

function forageFood() {
	gameData.food += gameData.foodPerClick
updatepdateFoodCount()
}

function forageDryWood() {
	if (gameData.food >= 1) {
		gameData.food -= 1
		gameData.dryWood += gameData.dryWoodPerClick
		updateDryWoodCount()
		updateFoodCount()
	}
}

function forageBroadLeaves() {
	if (gameData.food >= 1) {
		gameData.food -= 1
		gameData.broadLeaves += gameData.broadLeavesPerClick
		updateBroadLeavesCount()
		updateFoodCount()
	}
}

function buyPopulation(){
	if (gameData.food >= 75 && gameData.population < gameData.populationMax) {
	  gameData.food -= 75
	  gameData.population += 1
	  updateFoodCount()
	  updateForageRate()
	  updatePopulationCount()
	}
}

function constructLeanTo() {
	if(gameData.dryWood >= 40 && gameData.broadLeaves >= 40) {
		gameData.populationMax += 1
		gameData.dryWood -= 40
		gameData.broadLeaves -= 40
		updateDryWoodCount()
		updateBroadLeavesCount()
		updatePopulationCount()
	}
}

function gainInspiration() {
	if(gameData.food >= 10){
		gameData.food -= 10
		gameData.inspiration += 1
		updateInspirationCount()
		updateFoodCount()
	}
}

function buyFoodPerClick() {
	if (gameData.food >= gameData.foodPerClickCost) {
	  gameData.food -= gameData.foodPerClickCost
	  gameData.foodPerClick += 1
	  gameData.foodPerClickCost *= 2
	  updateFoodCount()
	  document.getElementById("perClickUpgrade").innerHTML = "Upgrade Food Foraging (Currently Level " + gameData.foodPerClick + ") Cost: " + gameData.foodPerClickCost + " Food"
	}
}

function learnFire() {
	createLabor("Test labor", "Test Resource")
	if(gameData.inspiration >= 10){
		gameData.inspiration -= 10
		updateInspirationCount()
		var element = document.getElementById("learnFire")
		element.parentNode.removeChild(element)
		document.getElementById("researchContainer").innerHTML = "<button>Cook Food</button>"
	}
}

function createLabor(name, resource){
	var labor = {
		name: "unassigned",
		resource: "unassigned"
	}
	labor.name = name
	labor.resource = resource
	createElementFromLabor(labor)
}

function createElementFromLabor(labor){
	newDiv = document.createElement("div")
	button1 = document.createElement("button")
	button1.innerHTML = "Get " + labor.resource

	newDiv.appendChild(button1)
	document.body.appendChild(newDiv)
}