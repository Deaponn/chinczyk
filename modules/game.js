class Game {
    constructor() {
        this.board = {}
        this.bases = {}
        this.homes = {}
        this.finished = false
        this.init()
    }

    init() {
        let colors = ["red", "green", "blue", "yellow"]
        for (let i = 0; i < colors.length; i++) {
            let pawns = []
            for (let j = 0; j < 4; j++) {
                let pawn = {
                    color: colors[i],
                    position: -1,
                    id: j,
                    absolutePosition: function () {
                        let offset = 0
                        switch (this.color) {
                            case "blue": {
                                offset = 10
                                break
                            }
                            case "green": {
                                offset = 20
                                break
                            }
                            case "yellow": {
                                offset = 30
                            }
                        }
                        if (offset + this.position > 39) {
                            offset -= 40
                        }
                        return this.position + offset
                    }
                }
                pawns.push(pawn)
            }
            this.homes[colors[i]] = pawns
            this.board[colors[i]] = [null, null, null, null]
            this.bases[colors[i]] = [null, null, null, null]
        }
    }

    movePawn(which, where, color, moves) {
        console.log(which, where, color, moves)
        switch (where) {
            case "homes": {
                if (moves == 1 || moves == 6) {
                    this.board[color][which] = this.homes[color][which]
                    this.board[color][which].position = 0
                    this.killThem(color, this.board[color][which].absolutePosition())
                    this.homes[color][which] = null
                    this.checkForWin()
                    return true
                } else { return false }
            }
            case "board": {
                if (this.board[color][which].position + moves < 40) {
                    this.board[color][which].position += moves
                    this.killThem(color, this.board[color][which].absolutePosition())
                    this.checkForWin()
                    return true
                } else {
                    let baseSteps = this.board[color][which].position + moves - 40
                    if (baseSteps < 4 && !this.bases[color][baseSteps]) {
                        this.bases[color][baseSteps] = this.board[color][which]
                        this.bases[color][baseSteps].position = baseSteps
                        this.board[color][which] = null
                        this.checkForWin()
                        return true
                    } else { return false }
                }
            }
            case "bases": {
                if (which + moves < 4) {
                    if (!this.bases[color][which + moves]) {
                        this.bases[color][which + moves] = this.bases[color][which]
                        this.bases[color][which + moves].position += moves
                        this.bases[color][which] = null
                        this.checkForWin()
                        return true
                    }
                }
                return false
            }
        }
    }

    possibleMove(moves, color) {
        if (moves == 1 || moves == 6) {
            for (let i = 0; i < this.homes[color].length; i++) {
                if (this.homes[color][i]) { console.log(moves, i, color, this.homes); return true }
            }
        }
        for (let i = 0; i < this.board[color].length; i++) {
            if (this.board[color][i]) {
                if (this.board[color][i].position + moves < 40) {
                    console.log(moves, i, color, this.board);
                    return true
                } else {
                    let baseSteps = this.board[color][i].position + moves - 40
                    if (baseSteps < 4 && !this.bases[color][baseSteps]) {
                        console.log(moves, i, color, this.board, this.bases);
                        return true
                    }
                }
            }
        }
        for (let i = 0; i < this.bases[color].length; i++) {
            if (this.bases[color][i]) { if (this.bases[color][i].position + moves < 4) { console.log(moves, i, color, this.bases); return true } }
        }
        return false
    }

    killThem(color, position) {
        console.log(`killing ${color} at ${position}`);
        for (const enemies in this.board) {
            console.log(enemies);
            if (color == enemies) { continue }
            for (let i = 0; i < this.board[enemies].length; i++) {
                if (this.board[enemies][i]) {
                    console.log(`enemy exists at i = ${i}, absolute position is ${this.board[enemies][i].absolutePosition()}`);
                    if (position == this.board[enemies][i].absolutePosition()) {
                        console.log("KILLLLLL")
                        this.homes[enemies][this.board[enemies][i].id] = this.board[enemies][i]
                        this.homes[enemies][this.board[enemies][i].id].position = -1
                        this.board[enemies][i] = null
                    }
                }
            }
        }
    }

    checkForWin() {
        console.log("checking for win")
        for (const color in this.bases) {
            for (let i = 0; i < this.bases[color].length; i++) {
                if (!this.bases[color][i]) { break } else { if (i == this.bases[color].length - 1) { this.playerWon(color); return 0 } }
            }
        }
    }

    playerWon(color) {
        console.log(color)
        this.finished = true
    }

    isGameEnded() {
        return this.finished
    }

    sendGameState() {
        return "game state is working"
    }

    info() {
        return { bases: this.bases, homes: this.homes, board: this.board }
    }
}

module.exports = Game