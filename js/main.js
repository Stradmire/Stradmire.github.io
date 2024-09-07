var gameData = {
    food: 0,
    foodCents: 0,
    foodPerClick: 1,
    foodPerClickCost: 10,
    foodForagingEfficiency: 15,
    population: 50,
    populationMax: 52,
    inspiration: 0,
    day: 1
}

let resources = {}

let producers = {}

let crafters = {}

let labels = {}

// Main loop timer
var mainGameLoop = window.setInterval(function() {
update()
}, 1000)

// Main loop
function update() {
	autoForage()
	updateLabels()	
	incrementDay()
}

function updateLabels() {
	if (labels != null){
		Object.keys(labels).forEach((label) => {
			let producer = producers[labels[label].name]
			labels[label].reference.innerHTML = labels[label].name + " " + resources[labels[label].name].amount
		})
	}
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

function updatePopulationCount() {
	document.getElementById("population").innerHTML = gameData.population + "/" + gameData.populationMax + " Population"
}

function updateInspirationCount() {
	document.getElementById("inspirationGained").innerHTML = gameData.inspiration + " Inspiration Gained"
}

function autoForage() {
	// FIXME: Old way
	incrementFood(gameData.population * gameData.foodForagingEfficiency)
	updateFoodCount()

	if (producers != null){
		Object.keys(producers).forEach((producer) => {
			autoProduceResource(producers[producer].resource.name)
		})
	}
	if (crafters != null){
		Object.keys(crafters).forEach((crafter) => {
			autoCraftResource(crafters[crafter].resource.name)
		})
	}
}

function forageFood() {
	gameData.food += gameData.foodPerClick
	updatepdateFoodCount()
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
	if(resources["Dry Wood"].amount >= 40 && resources["Broad Leaves"].amount >= 40) {
		gameData.populationMax += 1
		resources["Dry Wood"].amount -= 40
		resources["Broad Leaves"].amount -= 40
		updateLabels()
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

function deleteElement(elementId){
	var element = document.getElementById(elementId)
	element.parentNode.removeChild(element)
}

function learnFire() {
	if(gameData.inspiration >= 10){
		gameData.inspiration -= 10
		updateInspirationCount()
		deleteElement("learnFire")
		document.getElementById("researchContainer").innerHTML = "<button>Cook Food</button>"
	}
}

function unlockProducer(name) {
	createProducer(name + " Foraging", name)
	deleteElement("unlock " + name)
}

function createProducer(name, resource){
	var producer = {
		name: "No name assigned",
		resource: {},
		amount: 0,
		rate: 1,
		clickPower: 1
	}
	producer.name = name
	producer.resource = createResource(resource)
	registerProducer(producer)
	createElementFromProducer(producer)
	createElementFromResource(producer.resource)
}

function checkCraftable(crafter){
	let craftable = true
	if (crafter.componentCost != null){
		Object.keys(crafter.componentCost).forEach((element) => {
			let resourceName = crafter.componentCost[element].name
			let resourceCost = crafter.componentCost[element].cost
			let resourceAmount = resources[resourceName].amount
			if (resourceCost > resourceAmount) {
				craftable = false
			}
		})
	}
	return craftable
}

function getAmountCraftable(crafter){
	// TODO: Test with infinity
	let highestCraftableAmount = 1000000
	if (crafter.componentCost != null){
		Object.keys(crafter.componentCost).forEach((element) => {
			let resourceName = crafter.componentCost[element].name
			let resourceCost = crafter.componentCost[element].cost
			let resourceAmount = resources[resourceName].amount
			
			if(resourceAmount < 1){
				return 0
			}
			craftableAmount = Math.floor(resourceAmount / resourceCost)
			highestCraftableAmount = craftableAmount < highestCraftableAmount ? craftableAmount : highestCraftableAmount
		})
	}
	return highestCraftableAmount
}

function subractCraftingResources(crafter, num = 1){
	if (crafter.componentCost != null){
		Object.keys(crafter.componentCost).forEach((element) => {
			let resourceName = crafter.componentCost[element].name
			let resourceCost = crafter.componentCost[element].cost
			let resourceAmount = resources[resourceName].amount
			
			resources[resourceName].amount -= resourceCost * num
		})
	}
}

function craftResource(resourceName) {
	craftItem(resourceName)
}

function autoCraftItem(resourceName){
	let crafter = crafters[resourceName]
	let amount = crafter.amount
	let craftable = getAmountCraftable(crafter)
	if(craftable >= amount){
		resources[resourceName].amount += amount
		subractCraftingResources(crafter, amount)
	}
}

function craftItem(resourceName){
	let crafter = crafters[resourceName]
	let amount = crafter.clickPower
	if(checkCraftable(crafter) == true){
		resources[resourceName].amount += amount
		subractCraftingResources(crafter)
	}
}

let ResourceRequirement = function(resourceName, cost) {
	this.name = resourceName,
	this.cost = cost
}

function unlockFlintCrafting(){
	let cost1 = new ResourceRequirement("Flint", 1)
	let componentCost = {Cost1: cost1}

	createCrafter("Flint Crafter", "Flint Craft Knowledge", componentCost)
	deleteElement("unlockFlintCrafting")
}

function createCrafter(label, resourceName, componentCost){
	let crafter = {
		label: "",
		resource: {},
		// TODO: Make an array
		componentCost: {},
		amount: 0,
		rate: 1,
		clickPower: 1
	}
	crafter.label = label
	crafter.resource = createResource(resourceName)
	crafter.componentCost = componentCost
	registerCrafter(crafter)
	createElementFromCrafter(crafter)
	createElementFromResource(crafter.resource)
}

function registerCrafter(crafter){
	crafters[crafter.resource.name] = crafter
}

function createElementFromCrafter(crafter){
	let newDiv = document.createElement("div")
	let header = document.createElement("h4")
	header.innerHTML = crafter.label
	let button1 = document.createElement("button")
	button1.innerHTML = crafter.resource.name + " Crafter (75 Food)"
	button1.onclick = function() { buyCrafter(crafter.resource.name) }
	let button2 = document.createElement("button")
	button2.innerHTML = "Craft " + crafter.resource.name
	button2.onclick = function() { craftResource(crafter.resource.name) }
	let button3 = document.createElement("button")
	button3.innerHTML = "Craft Power 1 (2 " + crafter.resource.name + ")"
	button3.onclick = function() { upgradeCraftPower(crafter.resource.name, button3) }

	newDiv.appendChild(header)
	newDiv.appendChild(button1)
	newDiv.appendChild(button2)
	newDiv.appendChild(button3)
	document.getElementById("jobContainer").appendChild(newDiv)
}

let Resource = function(name){
	this.name = name,
	this.amount = 0,
	this.cents = 0,
	this.addCents = function(num){
		this.cents += num
		amount += Math.floor(this.cents/100)
		this.cents = this.cents % 100
	}
}

function createResource(name){
	let resource = new Resource(name)
	registerResource(resource)
	return resource
}

function registerProducer(producer){
	producers[producer.resource.name] = producer
}

function registerResource(resource){
	resources[resource.name] = resource
}

function autoProduceResource(resourceName){
	let producer = producers[resourceName]
	let amount = producer.amount * producer.rate
	resources[resourceName].amount += amount
}

function autoCraftResource(resourceName){
	autoCraftItem(resourceName)
}

function gatherResource(resourceName){
	let producer = producers[resourceName]
	let amount = producer.clickPower
	resources[resourceName].amount += amount
}

function createElementFromResource(resource){
	label = document.createElement("p")
	label.innerHTML = resource.amount + " " + resource.name

	labels[resource.name] = {name: resource.name, reference: label}

	document.getElementById("resourceContainer").appendChild(label)
}

function buyCrafter(resourceName){
	if (gameData.food >= 75) {
	  gameData.food -= 75
	  updateFoodCount()

	  let crafter = crafters[resourceName]
	  crafter.amount += 1
	}
}

function buyProducer(resourceName){
	if (gameData.food >= 75) {
	  gameData.food -= 75
	  updateFoodCount()

	  let producer = producers[resourceName]
	  producer.amount += 1
	}
}

function upgradeHarvestPower(resourceName, upgradeBtn){
	let producer = producers[resourceName]
	let level = producer.clickPower
	let upgradeCost = level * Math.pow(2, level)
	if (resources[resourceName].amount >= upgradeCost) {
	  resources[resourceName].amount -= upgradeCost
	  //TODO: Update specific label only
	  updateLabels()
	  
	  producer.clickPower += 1
	  upgradeCost = (level + 1) * Math.pow(2, (level + 1))
	  upgradeBtn.innerHTML = "Harvest Power " + producer.clickPower + " (" + upgradeCost + " " + resourceName + ")"
	}
}

function upgradeCraftPower(resourceName, upgradeBtn){
	let crafter = crafters[resourceName]
	let level = crafter.clickPower
	let upgradeCost = level * Math.pow(2, level)
	if (resources[resourceName].amount >= upgradeCost) {
	  resources[resourceName].amount -= upgradeCost
	  //TODO: Update specific label only
	  updateLabels()
	  
	  crafter.clickPower += 1
	  upgradeCost = (level + 1) * Math.pow(2, (level + 1))
	  upgradeBtn.innerHTML = "Craft Power " + crafter.clickPower + " (" + upgradeCost + " " + resourceName + ")"
	}
}

function createElementFromProducer(producer){
	let newDiv = document.createElement("div")
	let header = document.createElement("h4")
	header.innerHTML = producer.name
	let button1 = document.createElement("button")
	button1.innerHTML = producer.resource.name + " Forager (75 Food)"
	button1.onclick = function() { buyProducer(producer.resource.name) }
	let button2 = document.createElement("button")
	button2.innerHTML = "Forage " + producer.resource.name
	button2.onclick = function() { gatherResource(producer.resource.name) }
	let button3 = document.createElement("button")
	button3.innerHTML = "Harvest Power 1 (2 " + producer.resource.name + ")"
	button3.onclick = function() { upgradeHarvestPower(producer.resource.name, button3) }

	newDiv.appendChild(header)
	newDiv.appendChild(button1)
	newDiv.appendChild(button2)
	newDiv.appendChild(button3)
	document.getElementById("jobContainer").appendChild(newDiv)
}