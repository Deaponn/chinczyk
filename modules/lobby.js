class Lobby {
    constructor(gameId) {
        this.gameId = gameId
        this.playerList = []
        this.remainingColors = ["red", "green", "blue", "yellow"]
        this.full = false
        this.detectedAFK = 0
        this.gameEnded = false
        this.rolled = false
        this.previousRoll = 0
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
        this.playerList[0].state = 2
        this.playerList[0].turnBegin = Date.now()
        this.detectedAFK = setTimeout(function () {
            this.playerList[this.currentPlayer].state = -1
            this.nextPlayer()
        }.bind(this), 30000)
        this.currentPlayer = 0
    }

    nextPlayer() {
        clearTimeout(this.detectedAFK)
        let nextPlayer = this.nextValidPlayer()
        if (nextPlayer != -1 && this.countActivePlayers() > 1) {
            if (this.playerList[this.currentPlayer].state == 2) { this.playerList[this.currentPlayer].state = 1 }
            this.currentPlayer = nextPlayer
            this.playerList[this.currentPlayer].state = 2
            this.playerList[this.currentPlayer].turnBegin = Date.now()
            this.detectedAFK = setTimeout(function () {
                this.playerList[this.currentPlayer].state = -1
                this.currentPlayer = nextPlayer
                this.rolled = false
                this.nextPlayer()
            }.bind(this), 30000)
        } else {
            this.gameEnded = true
        }
    }

    nextValidPlayer() {
        let nextPlayer = -1
        for (let i = this.currentPlayer; i < this.playerList.length; i++) {
            if (nextPlayer == -1 && this.playerList[i].state == 1) {
                nextPlayer = i
            } else if (nextPlayer != -1) {
                break
            }
        }
        for (let i = 0; i < this.currentPlayer; i++) {
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

    whoWon(color) {
        if (this.gameEnded) {
            for (let i = 0; i < this.playerList.length; i++) {
                if (this.playerList[i].state == 1) return this.playerList[i].nickname
            }
        }
        for (let i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].color == color) return this.playerList[i].nickname
        }
    }
}

module.exports = Lobby