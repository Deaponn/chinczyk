class Lobby {
    constructor(gameId, unrollTheDice) {
        this.gameId = gameId
        this.unrollTheDice = unrollTheDice
        this.playerList = []
        this.remainingColors = ["red", "green", "blue", "yellow"]
        this.full = false
        this.detectedAFK = 0
        this.gameEnded = false
    }

    newPlayer(newPlayerToken, nickname) {
        let color = Math.floor(Math.random() * this.remainingColors.length)
        this.playerList.push({ token: newPlayerToken, nickname: nickname.length > 0 ? nickname : "pusto", state: 0, color: this.remainingColors[color], turnBegin: 0 })
        this.remainingColors.splice(color, 1)
        if (this.playerList.length == 4) {
            for (let i = 0; i < 4; i++) {
                this.playerList[i].state = 1
            }
            this.full = true;
            this.beginGame()
        }
    }

    getPlayer(playerId) {
        return playerList[playerId]
    }

    getGameAndPlayer(playerToken) {
        for (let i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].token == playerToken) {
                return { gameId: this.gameId, playerId: i, state: this.playerList[i].state, color: this.playerList[i].color }
            }
        }
        return 0
    }

    info(playerId) {
        let playerList = []
        for (let i = 0; i < this.playerList.length; i++) {
            playerList.push(i == playerId ? this.playerList[i] : Object.assign({}, this.playerList[i], { token: null }))
        }
        return playerList
    }

    changeReadyState(playerId) {
        if (!this.full) { this.playerList[playerId].state == 0 ? this.playerList[playerId].state = 1 : this.playerList[playerId].state = 0 }
        let closed = false
        for (let i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].state == 1) { closed = true } else { closed = false; break }
        }
        if (closed && this.playerList.length >= 2) {
            this.full = true
            this.beginGame()
        }
        return { color: this.playerList[playerId].color, state: this.playerList[playerId].state }
    }

    beginGame() {
        console.log("game began")
        this.playerList[0].state = 2
        this.playerList[0].turnBegin = Date.now()
        // this.detectedAFK = setTimeout(function () {
        //     this.playerList[this.currentPlayer].state = -1
        //     console.log("afk detected, setting his state to -1", this.playerList)
        //     this.nextPlayer()
        // }.bind(this), 15000)
        this.currentPlayer = 0
    }

    nextPlayer() {
        console.log("mextplayer")
        clearTimeout(this.detectedAFK)
        let nextPlayer = this.nextValidPlayer()
        console.log(this.playerList, this.currentPlayer, nextPlayer)
        if (nextPlayer != -1 && this.countActivePlayers() > 1) {
            if (this.playerList[this.currentPlayer].state == 2) { this.playerList[this.currentPlayer].state = 1 }
            this.currentPlayer = nextPlayer
            this.playerList[this.currentPlayer].state = 2
            this.playerList[this.currentPlayer].turnBegin = Date.now()
            // this.detectedAFK = setTimeout(function () {
            //     this.playerList[this.currentPlayer].state = -1
            //     this.currentPlayer = nextPlayer
            //     this.unrollTheDice()
            //     console.log("afk detected, setting his state to -1", this.playerList)
            //     this.nextPlayer()
            // }.bind(this), 15000)
        } else {
            console.log("koniec")
            this.gameEnded = true
        }
    }

    nextValidPlayer() {
        let nextPlayer = -1
        for (let i = this.currentPlayer; i < this.playerList.length; i++) {
            console.log(74, i)
            if (nextPlayer == -1 && this.playerList[i].state == 1) {
                nextPlayer = i
            } else if (nextPlayer != -1) {
                break
            }
        }
        for (let i = 0; i < this.currentPlayer; i++) {
            console.log(82, i)
            if (nextPlayer == -1 && this.playerList[i].state == 1) {
                nextPlayer = i
            } else if (nextPlayer != -1) {
                break
            }
        }
        return nextPlayer
    }

    countActivePlayers() {
        let counter = 0
        for (let i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].state > 0) {
                counter++
            }
        }
        return counter
    }

    isGameEnded() {
        return this.gameEnded
    }
}

module.exports = Lobby