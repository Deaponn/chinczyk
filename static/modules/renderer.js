export default class Renderer {

    constructor() {
        this.tileList = []
        this.homeList = []
        this.baseList = []
        this.highlight = true
        this.speak = window.speechSynthesis
        this.voice = []
        this.init()
    }

    init() {
        this.voice = this.speak.getVoices()[0]
        console.log(this.voice)
    }

    addManager(manager) {
        this.manager = manager
    }

    boardSetup() {
        let tileMap = [{ x: 0, y: 4, type: "enter", color: "red" }, { x: 1, y: 4, type: "tile" }, { x: 2, y: 4, type: "tile" }, { x: 3, y: 4, type: "tile" }, { x: 4, y: 4, type: "tile" },
        { x: 4, y: 3, type: "tile" }, { x: 4, y: 2, type: "tile" }, { x: 4, y: 1, type: "tile" }, { x: 4, y: 0, type: "tile" }, { x: 5, y: 0, type: "tile" },
        { x: 6, y: 0, type: "enter", color: "blue" }, { x: 6, y: 1, type: "tile" }, { x: 6, y: 2, type: "tile" }, { x: 6, y: 3, type: "tile" }, { x: 6, y: 4, type: "tile" },
        { x: 7, y: 4, type: "tile" }, { x: 8, y: 4, type: "tile" }, { x: 9, y: 4, type: "tile" }, { x: 10, y: 4, type: "tile" }, { x: 10, y: 5, type: "tile" },
        { x: 10, y: 6, type: "enter", color: "green" }, { x: 9, y: 6, type: "tile" }, { x: 8, y: 6, type: "tile" }, { x: 7, y: 6, type: "tile" }, { x: 6, y: 6, type: "tile" },
        { x: 6, y: 7, type: "tile" }, { x: 6, y: 8, type: "tile" }, { x: 6, y: 9, type: "tile" }, { x: 6, y: 10, type: "tile" }, { x: 5, y: 10, type: "tile" },
        { x: 4, y: 10, type: "enter", color: "yellow" }, { x: 4, y: 9, type: "tile" }, { x: 4, y: 8, type: "tile" }, { x: 4, y: 7, type: "tile" }, { x: 4, y: 6, type: "tile" },
        { x: 3, y: 6, type: "tile" }, { x: 2, y: 6, type: "tile" }, { x: 1, y: 6, type: "tile" }, { x: 0, y: 6, type: "tile" }, { x: 0, y: 5, type: "tile" }]

        let homeMap = [{ x: 0, y: 0, color: "red" }, { x: 1, y: 0, color: "red" }, { x: 0, y: 1, color: "red" }, { x: 1, y: 1, color: "red" },
        { x: 9, y: 0, color: "blue" }, { x: 10, y: 0, color: "blue" }, { x: 9, y: 1, color: "blue" }, { x: 10, y: 1, color: "blue" },
        { x: 9, y: 9, color: "green" }, { x: 10, y: 9, color: "green" }, { x: 9, y: 10, color: "green" }, { x: 10, y: 10, color: "green" },
        { x: 0, y: 9, color: "yellow" }, { x: 1, y: 9, color: "yellow" }, { x: 0, y: 10, color: "yellow" }, { x: 1, y: 10, color: "yellow" }]

        let baseMap = [{ x: 1, y: 5, color: "red" }, { x: 2, y: 5, color: "red" }, { x: 3, y: 5, color: "red" }, { x: 4, y: 5, color: "red" },
        { x: 5, y: 1, color: "blue" }, { x: 5, y: 2, color: "blue" }, { x: 5, y: 3, color: "blue" }, { x: 5, y: 4, color: "blue" },
        { x: 9, y: 5, color: "green" }, { x: 8, y: 5, color: "green" }, { x: 7, y: 5, color: "green" }, { x: 6, y: 5, color: "green" },
        { x: 5, y: 9, color: "yellow" }, { x: 5, y: 8, color: "yellow" }, { x: 5, y: 7, color: "yellow" }, { x: 5, y: 6, color: "yellow" }]

        let boardDiv = document.getElementById("board")
        boardDiv.style.visibility = "visible"

        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 11; j++) {
                let tile = document.createElement("div")
                tile.dataset.cords = j + " " + i
                boardDiv.append(tile)
            }
        }
        for (let i = 0; i < tileMap.length; i++) {
            let tile = document.querySelector("[data-cords='" + tileMap[i].x + " " + tileMap[i].y + "']")
            this.tileList.push(tile)
            tile.className = "basic"
            if (tileMap[i].type == "enter") {
                tile.classList.add("enter" + tileMap[i].color)
            }
            tile.innerHTML = i
        }
        console.log(this.tileList)
        for (let i = 0; i < homeMap.length; i++) {
            let tile = document.querySelector("[data-cords='" + homeMap[i].x + " " + homeMap[i].y + "']")
            this.homeList.push(tile)
            tile.classList.add("base")
            tile.innerHTML = i
        }
        console.log(this.homeList)
        for (let i = 0; i < baseMap.length; i++) {
            let tile = document.querySelector("[data-cords='" + baseMap[i].x + " " + baseMap[i].y + "']")
            this.baseList.push(tile)
            tile.classList.add("basic", baseMap[i].color)
            tile.innerHTML = i
        }
        console.log(this.baseList)
    }

    showGameState(data) {
        document.getElementById("main").innerHTML = ""
        let lobby = document.createElement("div")
        lobby.id = "lobby"
        let time = document.createElement("div")
        let switchElem = document.createElement("label")
        let switchInput = document.createElement("input")
        let slider = document.createElement("span")
        switchElem.classList.add("switch")
        switchInput.classList.add("checkbox")
        slider.classList.add("slider", "round")
        switchInput.setAttribute("type", "checkbox")
        switchElem.append(switchInput)
        switchElem.append(slider)
        switchInput.onchange = this.manager.changeReadyState
        for (let i = 0; i < 4; i++) {
            let player = document.createElement("div")
            player.style.backgroundColor = "grey"
            lobby.append(player)
        }
        lobby.append(switchElem)
        let activeColor = "none"
        for (let i = 0; i < data.lobby.length; i++) {
            let selected = 0
            switch (data.lobby[i].color) {
                case "red": {
                    break
                }
                case "green": {
                    selected = 1
                    break
                }
                case "blue": {
                    selected = 2
                    break
                }
                case "yellow": {
                    selected = 3
                }
            }
            if (data.lobby[i].state > 0) lobby.childNodes[selected].style.backgroundColor = data.lobby[i].color
            lobby.childNodes[selected].innerHTML = data.lobby[i].nickname
            lobby.childNodes[selected].style.visibility = "visible"
            if (data.lobby[i].state == 2) {
                switchElem.style.display = "none"
                time.innerHTML = 30 - Math.floor((Date.now() - data.lobby[i].turnBegin) / 1000)
                time.style.visibility = "visible"
                lobby.childNodes[selected].append(time)
                lobby.childNodes[selected].classList.add("active")
            }
            if (data.lobby[i].token) {
                switchInput.checked = data.lobby[i].state > 0
                data.lobby[i].state == 2 ? activeColor = data.lobby[i].color : undefined
            }
        }
        document.getElementById("main").append(lobby)
        this.clear()
        this.populate(data.game)
        this.highlightPawns(activeColor, data.game)
        if (activeColor != "none") { this.showRoll({ roll: data.roll, speak: data.speak }) }
        if (data.finished) { alert("Wygral " + data.winner + ". Gratulacje!") }
    }

    clear() {
        for (let i = 0; i < this.homeList.length; i++) {
            this.homeList[i].innerHTML = ""
        }
        for (let i = 0; i < this.tileList.length; i++) {
            this.tileList[i].innerHTML = ""
        }
        for (let i = 0; i < this.baseList.length; i++) {
            this.baseList[i].innerHTML = ""
        }
    }

    populate(data) {
        for (const color in data.homes) {
            for (let i = 0; i < data.homes[color].length; i++) {
                if (data.homes[color][i]) {
                    let pawn = document.createElement("div")
                    pawn.classList.add("pawn", "single", color)
                    pawn.onclick = () => {
                        this.hideTheHighlight()
                        this.manager.moveThePawn(i, "homes", color)
                    }
                    this.homeList[data.homes[color][i].absolutePosition].append(pawn)
                }
            }
        }
        for (const color in data.board) {
            for (let i = 0; i < data.board[color].length; i++) {
                if (data.board[color][i]) {
                    let pawn = document.createElement("div")
                    pawn.classList.add("pawn", color)
                    pawn.onclick = () => {
                        this.hideTheHighlight()
                        this.manager.moveThePawn(i, "board", color)
                    }
                    this.tileList[data.board[color][i].absolutePosition].append(pawn)
                    switch (this.tileList[data.board[color][i].absolutePosition].childNodes.length) {
                        case 0: {
                            break
                        }
                        case 1: {
                            this.tileList[data.board[color][i].absolutePosition].childNodes[0].classList.add("single")
                            break
                        }
                        default: {
                            this.tileList[data.board[color][i].absolutePosition].childNodes.forEach((pawn) => pawn.classList.add("more"))
                            break
                        }
                    }
                }
            }
        }
        for (const color in data.bases) {
            for (let i = 0; i < data.bases[color].length; i++) {
                if (data.bases[color][i]) {
                    let pawn = document.createElement("div")
                    pawn.classList.add("pawn", "single", color)
                    pawn.onclick = () => {
                        this.hideTheHighlight()
                        this.manager.moveThePawn(i, "bases", color)
                    }
                    this.baseList[data.bases[color][i].absolutePosition].append(pawn)
                }
            }
        }
    }

    showRoll(data) {
        if (data.roll) {
            this.previousRoll = data.roll
            if (data.speak) {
                let line = new SpeechSynthesisUtterance(data.roll)
                this.speak.speak(line)
            }
            document.getElementById("roll").src = "./gfx/" + data.roll + ".png"
        } else {
            this.previousRoll = 0
            document.getElementById("roll").src = "./gfx/null.png"
        }
    }

    highlightPawns(color, game) {
        if (color == "none" || this.previousRoll == 0) return

        let homesPawns = this.selectPawns(game.homes[color], this.homeList)
        let boardPawns = this.selectPawns(game.board[color], this.tileList)
        let basesPawns = this.selectPawns(game.bases[color], this.baseList)

        for (let i = 0; i < homesPawns.length; i++) {
            if (this.previousRoll == 1 || this.previousRoll == 6) {
                for (let j = 0; j < homesPawns[i].items.length; j++) {
                    this.highlight ? homesPawns[i].items[j].classList.add("possible") : undefined
                    homesPawns[i].items[j].classList.add("hover")
                    homesPawns[i].items[j].onmouseover = () => { this.highlightNextMove(color) }
                    homesPawns[i].items[j].onmouseout = () => { this.hideTheHighlight() }
                }
            }
        }
        for (let i = 0; i < boardPawns.length; i++) {
            for (let j = 0; j < boardPawns[i].items.length; j++) {
                if (this.possibleMove(game.board[color][boardPawns[i].pawn], "board", game.bases[color])) {
                    this.highlight ? boardPawns[i].items[j].classList.add("possible") : undefined
                    boardPawns[i].items[j].classList.add("hover")
                    boardPawns[i].items[j].onmouseover = () => { this.highlightNextMove(color, { absolute: game.board[color][boardPawns[i].pawn].absolutePosition, regular: game.board[color][boardPawns[i].pawn].position }, true) }
                    boardPawns[i].items[j].onmouseout = () => { this.hideTheHighlight() }
                }
            }
        }
        for (let i = 0; i < basesPawns.length; i++) {
            for (let j = 0; j < basesPawns[i].items.length; j++) {
                if (this.possibleMove(game.bases[color][basesPawns[i].pawn], "bases", game.bases[color])) {
                    this.highlight ? basesPawns[i].items[j].classList.add("possible") : undefined
                    basesPawns[i].items[j].classList.add("hover")
                    basesPawns[i].items[j].onmouseover = () => { this.highlightNextMove(color, { absolute: game.bases[color][basesPawns[i].pawn].absolutePosition, regular: game.bases[color][basesPawns[i].pawn].position }) }
                    basesPawns[i].items[j].onmouseout = () => { this.hideTheHighlight() }
                }
            }
        }
        this.highlight = !this.highlight
    }

    selectPawns(gameData, where) {
        let result = []
        for (let i = 0; i < gameData.length; i++) {
            if (gameData[i]) {
                result.push({ items: where[gameData[i].absolutePosition].childNodes, pawn: i })
            }
        }
        return result
    }

    possibleMove(pawn, place, bases) {
        if (!pawn) return false
        if (pawn.position + this.previousRoll < 40 && place == "board") return true
        if (place == "board") {
            let baseSteps = pawn.position + this.previousRoll - 40
            if (baseSteps < 4 && !bases[baseSteps]) {
                return true
            }
            return false
        }
        if (pawn.position + this.previousRoll < 4 && !bases[pawn.position + this.previousRoll]) {
            console.log(bases[pawn.position], this.previousRoll, bases, bases[pawn.position + this.previousRoll])
            return true
        }
        return false
    }

    highlightNextMove(color, positions, fromBoard) {
        if (!positions) {
            console.log(this.tileList[this.offset(color)])
            this.tileList[this.offset(color)].style.backgroundColor = "pink"
            this.highlighted = this.tileList[this.offset(color)]
            return
        }
        if (positions.regular + this.previousRoll < 40 && fromBoard) { // stays within the board
            let indicatiorPosition = 0
            positions.absolute + this.previousRoll < 40 ? undefined : indicatiorPosition = -40
            this.tileList[positions.absolute + indicatiorPosition + this.previousRoll].style.backgroundColor = "pink"
            this.highlighted = this.tileList[positions.absolute + indicatiorPosition + this.previousRoll]
            return
        }
        if (fromBoard) {
            let baseSteps = positions.regular + this.previousRoll - 40 + this.offset(color) / 2.5
            this.baseList[baseSteps].style.backgroundColor = "pink"
            this.highlighted = this.baseList[baseSteps]
            return
        }
        this.baseList[positions.regular + this.previousRoll + this.offset(color) / 2.5].style.backgroundColor = "pink"
        this.highlighted = this.baseList[positions.regular + this.previousRoll + this.offset(color) / 2.5]
    }

    hideTheHighlight() {
        this.highlighted.style.backgroundColor = null
    }

    offset(color) {
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
        return offset
    }
}