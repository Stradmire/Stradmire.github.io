let fireData = {
	heat: 70,
	heatPerClick: 2,
	fireXP: 0
}

function addHeat() {
	fireData.heat += fireData.heatPerClick
	updateFireProgress()
}

function updateFireProgress() {
	document.getElementById("fireProgress").value = fireData.heat
}

function updateHeat() {
	if (fireData.heat < 450 && fireData.heat > 75) {
		fireData.heat -= 10
	}
	updateFireProgress()
}