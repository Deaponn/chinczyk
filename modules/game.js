class Game {
    constructor() {
        this.board = {}
        this.bases = {}
        this.homes = {}
        this.finished = false
        this.winner = ""
        this.init()
    }

    init() {
        let colors = ["red", "green", "blue", "yellow"]
        for (let i = 0; i < colors.length; i++) {
            let pawns = []
            for (let j = 0; j < 4; j++) {
                let pawn = {
                    color: colors[i],
                    position: j,
                    id: j,
                    calcAbsolutePosition: function () {
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

    smallOffset(color) {
        let offset = 0
        switch (color) {
            case "blue": {
                offset = 4
                break
            }
            case "green": {
                offset = 8
                break
            }
            case "yellow": {
                offset = 12
            }
        }
        return offset
    }

    bigOffset(color, position) {
        let offset = 0
        switch (color) {
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
        if (offset + position > 39) {
            offset -= 40
        }
        return position + offset
    }

    movePawn(which, where, color, moves) {
        switch (where) {
            case "homes": {
                if (moves == 1 || moves == 6) {
                    this.board[color][which] = this.homes[color][which]
                    this.board[color][which].position = 0
                    this.killThem(color, this.board[color][which].calcAbsolutePosition())
                    this.homes[color][which] = null
                    this.checkForWin()
                    return true
                } else { return false }
            }
            case "board": {
                if (this.board[color][which].position + moves < 40) {
                    this.board[color][which].position += moves
                    this.killThem(color, this.board[color][which].calcAbsolutePosition())
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
                if (this.homes[color][i]) { return true }
            }
        }
        for (let i = 0; i < this.board[color].length; i++) {
            if (this.board[color][i]) {
                if (this.board[color][i].position + moves < 40) {
                    return true
                } else {
                    let baseSteps = this.board[color][i].position + moves - 40
                    if (baseSteps < 4 && !this.bases[color][baseSteps]) {
                        return true
                    }
                }
            }
        }
        for (let i = 0; i < this.bases[color].length; i++) {
            if (this.bases[color][i]) { if (this.bases[color][i].position + moves < 4 && !this.bases[color][this.bases[color][i].position + moves]) { return true } }
        }
        return false
    }

    killThem(color, position) {
        for (const enemies in this.board) {
            if (color == enemies) { continue }
            for (let i = 0; i < this.board[enemies].length; i++) {
                if (this.board[enemies][i]) {
                    if (position == this.board[enemies][i].calcAbsolutePosition()) {
                        this.homes[enemies][this.board[enemies][i].id] = this.board[enemies][i]
                        this.homes[enemies][this.board[enemies][i].id].position = this.board[enemies][i].id
                        this.board[enemies][i] = null
                    }
                }
            }
        }
    }

    checkForWin() {
        for (const color in this.bases) {
            for (let i = 0; i < this.bases[color].length; i++) {
                if (!this.bases[color][i]) { break } else {
                    if (i == this.bases[color].length - 1) {
                        this.winner = color
                        this.finished = true
                        return 0
                    }
                }
            }
        }
    }

    whoWon() {
        return this.winner
    }

    isGameEnded() {
        return this.finished
    }

    sendGameState() {
        return "game state is working"
    }

    basesData() {
        let result = JSON.parse(JSON.stringify(this.bases))
        for (const color in result) {
            for (let i = 0; i < result[color].length; i++) {
                result[color][i] ? result[color][i].absolutePosition = result[color][i].position + this.smallOffset(color) : undefined
            }
        }
        return result
    }

    homesData() {
        let result = JSON.parse(JSON.stringify(this.homes))
        for (const color in result) {
            for (let i = 0; i < result[color].length; i++) {
                result[color][i] ? result[color][i].absolutePosition = result[color][i].position + this.smallOffset(color) : undefined
            }
        }
        return result
    }

    boardData() {
        let result = JSON.parse(JSON.stringify(this.board))
        for (const color in result) {
            for (let i = 0; i < result[color].length; i++) {
                result[color][i] ? result[color][i].absolutePosition = this.bigOffset(color, result[color][i].position) : undefined
            }
        }
        return result
    }

    info() {
        return { bases: this.basesData(), homes: this.homesData(), board: this.boardData() }
    }
}

module.exports = Game