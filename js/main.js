var gameData = {
        food: 0,
        foodPerClick: 1,
        foodPerClickCost: 10,
        foodForagingEfficiency: 15,
        population: 50
      }

      // Main loop
      var mainGameLoop = window.setInterval(function() {
        autoForage()
      }, 100000)

      function updateForageRate() {
        document.getElementById("forageRate").innerHTML = gameData.population * gameData.foodForagingEfficiency + " Food/100s"
      }

      function updateFoodCount() {
        document.getElementById("foodForaged").innerHTML = gameData.food + " Food Foraged"
      }

      function autoForage() {
        gameData.food += gameData.population * gameData.foodForagingEfficiency
        updateFoodCount()
      }

      function forageFood() {
        gameData.food += gameData.foodPerClick
        updateFoodCount()
      }

      function buyPopulation(){
        if (gameData.food >= 75) {
          gameData.food -= 75
          gameData.population += 1
          updateFoodCount()
          updateForageRate()
          document.getElementById("population").innerHTML = gameData.population + " Population"
        }
      }

      function buyFoodPerClick() {
        if (gameData.food >= gameData.foodPerClickCost) {
          gameData.food -= gameData.foodPerClickCost
          gameData.foodPerClick += 1
          gameData.foodPerClickCost *= 2
          updateFoodCount()
          document.getElementById("perClickUpgrade").innerHTML = "Upgrade Foraging (Currently Level " + gameData.foodPerClick + ") Cost: " + gameData.foodPerClickCost + " Food"
        }
      }