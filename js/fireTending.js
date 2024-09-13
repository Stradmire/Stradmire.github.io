let fireData = {
	heat: 70,
	heatPerClick: 2,
	fireXP: 0,
	fireLevel: 0,
	nextLevelXP: 7
}

function addHeat() {
	fireData.heat += fireData.heatPerClick
	fireData.fireXP += 1
	updateFireProgress()
}

function updateFireProgress() {
	document.getElementById("fireProgress").value = fireData.heat
	updateFireLevel()
	let text = getFireStatus(fireData.heat)
	document.getElementById("fireLabel").innerHTML = text

}

function getFireStatus(temp){
	if(temp <= 160){
		return "cold"
	} else if (temp <= 212) {
		return "warm"
	} else if (temp <= 451) {
		return "hot"
	} else if (temp <= 571) {
		return "very hot!"
	} else {
		return "FIRE!"
	}
}

function levelUp() {
	fireData.fireLevel += 1
	if(fireData.fireLevel > 2) {
		// Max level
		document.getElementById("fireLevelLabel").innerHTML = "Level: Max"
	} else {
		fireData.heatPerClick += 2
		fireData.fireXP = 0
		let fireMax = fireData.fireLevel * 14
		fireData.nextLevelXP = fireMax
		document.getElementById("fireLevel").max = fireMax
		document.getElementById("fireLevelLabel").innerHTML = "Level: " + fireData.fireLevel
	}	
}

function updateFireLevel() {
	document.getElementById("fireLevel").value = fireData.fireXP
	if(fireData.fireXP >= fireData.nextLevelXP){
		levelUp()
	}
}

function updateHeat() {
	if (fireData.heat < 450 && fireData.heat > 75) {
		fireData.heat -= 10
	}
	updateFireProgress()
}