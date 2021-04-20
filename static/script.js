class Communication {

    constructor() {
        this.init()
    }

    init() {
        console.log("inited")
        document.getElementById("login").onclick = this.joinGame
        document.getElementById("roll").onclick = this.roll
    }

    connectToLobby() {
        if (document.cookie.indexOf("playerToken") != -1) {
            let cookies = JSON.parse("{\"" + document.cookie.replaceAll("=", "\": \"").replaceAll("; ", "\", \"") + "\"}")
            let request = new XMLHttpRequest()
            request.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let response = JSON.parse(this.responseText)
                    console.log(response)
                    if (!response.notInLobby) {
                        manager.downloadGameState()
                        render.boardSetup()
                        manager.intervalId = setInterval(manager.downloadGameState, 1000)
                    } else { document.cookie = "playerToken=\"\"; Expires=" + new Date(0).toUTCString(); console.log("deleted"); }
                }
            };
            request.open("POST", "http://localhost:3000/actions", true)
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send("playerToken=" + cookies.playerToken + "&action=downloadGameState");
        }
    }

    joinGame() {
        let nickname = document.getElementById("nickname").value
        let request = new XMLHttpRequest()
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText)
                console.log(response)
                document.cookie = "playerToken=" + response.playerToken + "; SameSite=Lax"
                manager.downloadGameState()
                render.boardSetup()
                manager.intervalId = setInterval(manager.downloadGameState, 1000)
            }
        };
        request.open("POST", "http://localhost:3000/login", true)
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("nickname=" + nickname);
    }

    downloadGameState() {
        let cookies = JSON.parse("{\"" + document.cookie.replaceAll("=", "\": \"").replaceAll("; ", "\", \"") + "\"}")
        let request = new XMLHttpRequest()
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText)
                render.showGameState(response)
                if (response.finished) {
                    console.log(manager.intervalId);
                    clearInterval(manager.intervalId)
                }
            }
        };
        request.open("POST", "http://localhost:3000/actions", true)
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("playerToken=" + cookies.playerToken + "&action=downloadGameState");
    }

    changeReadyState() {
        let cookies = JSON.parse("{\"" + document.cookie.replaceAll("=", "\": \"").replaceAll("; ", "\", \"") + "\"}")
        console.log("playerToken=" + cookies.playerToken + "&action=downloadGameState")
        let request = new XMLHttpRequest()
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("response received")
                let data = JSON.parse(this.responseText)
                let lobby = document.getElementById("lobby")
                console.log(lobby, data)
                switch (data.color) {
                    case "red": {
                        if (data.state > 0) { lobby.childNodes[0].style.backgroundColor = "red" } else { lobby.childNodes[0].style.backgroundColor = "grey" }
                        break
                    }
                    case "green": {
                        if (data.state > 0) { lobby.childNodes[1].style.backgroundColor = "green" } else { lobby.childNodes[1].style.backgroundColor = "grey" }
                        break
                    }
                    case "blue": {
                        if (data.state > 0) { lobby.childNodes[2].style.backgroundColor = "blue" } else { lobby.childNodes[2].style.backgroundColor = "grey" }
                        break
                    }
                    case "yellow": {
                        if (data.state > 0) { lobby.childNodes[3].style.backgroundColor = "yellow" } else { lobby.childNodes[3].style.backgroundColor = "grey" }
                    }
                }
            }
        };
        request.open("POST", "http://localhost:3000/actions", true)
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("playerToken=" + cookies.playerToken + "&action=changeReadyState");
    }

    roll() {
        let cookies = JSON.parse("{\"" + document.cookie.replaceAll("=", "\": \"").replaceAll("; ", "\", \"") + "\"}")
        let request = new XMLHttpRequest()
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText)
                render.showRoll(response)
            }
        };
        request.open("POST", "http://localhost:3000/actions", true)
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("playerToken=" + cookies.playerToken + "&action=roll");
    }

    moveThePawn(which, where, color) {
        console.log(which, where, color)
        let cookies = JSON.parse("{\"" + document.cookie.replaceAll("=", "\": \"").replaceAll("; ", "\", \"") + "\"}")
        let request = new XMLHttpRequest()
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText)
                render.showGameState(response)
            }
        };
        request.open("POST", "http://localhost:3000/actions", true)
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("playerToken=" + cookies.playerToken + "&action=move" + "&clicked=" + which + "&where=" + where + "&color=" + color);
    }
}

class Renderer {

    constructor() {
        this.tileList = []
        this.homeList = []
        this.baseList = []
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
            tile.className = "base"
            tile.classList.add(homeMap[i].color)
            tile.innerHTML = i
        }
        console.log(this.homeList)
        for (let i = 0; i < baseMap.length; i++) {
            let tile = document.querySelector("[data-cords='" + baseMap[i].x + " " + baseMap[i].y + "']")
            this.baseList.push(tile)
            tile.className = "basic"
            tile.classList.add(baseMap[i].color)
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
        switchInput.onchange = manager.changeReadyState
        for (let i = 0; i < 4; i++) {
            let player = document.createElement("div")
            player.style.backgroundColor = "grey"
            player.innerHTML = "?"
            lobby.append(player)
        }
        for (let i = 0; i < data.lobby.length; i++) {
            switch (data.lobby[i].color) {
                case "red": {
                    if (data.lobby[i].state > 0) lobby.childNodes[0].style.backgroundColor = "red"
                    lobby.childNodes[0].innerHTML = data.lobby[i].nickname
                    if (data.lobby[i].state == 2) {
                        switchElem.style.display = "none"
                        time.innerHTML = 15 - Math.floor((Date.now() - data.lobby[i].turnBegin) / 1000)
                        lobby.childNodes[0].append(time)
                        lobby.childNodes[0].classList.add("active")
                    }
                    if (data.lobby[i].token) {
                        lobby.childNodes[0].append(switchElem)
                        switchInput.checked = data.lobby[i].state > 0
                    }
                    break
                }
                case "green": {
                    if (data.lobby[i].state > 0) lobby.childNodes[1].style.backgroundColor = "green"
                    lobby.childNodes[1].innerHTML = data.lobby[i].nickname
                    if (data.lobby[i].state == 2) {
                        switchElem.style.display = "none"
                        time.innerHTML = 15 - Math.floor((Date.now() - data.lobby[i].turnBegin) / 1000)
                        lobby.childNodes[1].append(time)
                        lobby.childNodes[1].classList.add("active")
                    }
                    if (data.lobby[i].token) {
                        lobby.childNodes[1].append(switchElem)
                        switchInput.checked = data.lobby[i].state > 0
                    }
                    break
                }
                case "blue": {
                    if (data.lobby[i].state > 0) lobby.childNodes[2].style.backgroundColor = "blue"
                    lobby.childNodes[2].innerHTML = data.lobby[i].nickname
                    if (data.lobby[i].state == 2) {
                        switchElem.style.display = "none"
                        time.innerHTML = 15 - Math.floor((Date.now() - data.lobby[i].turnBegin) / 1000)
                        lobby.childNodes[2].append(time)
                        lobby.childNodes[2].classList.add("active")
                    }
                    if (data.lobby[i].token) {
                        lobby.childNodes[2].append(switchElem)
                        switchInput.checked = data.lobby[i].state > 0
                    }
                    break
                }
                case "yellow": {
                    if (data.lobby[i].state > 0) lobby.childNodes[3].style.backgroundColor = "yellow"
                    lobby.childNodes[3].innerHTML = data.lobby[i].nickname
                    if (data.lobby[i].state == 2) {
                        switchElem.style.display = "none"
                        time.innerHTML = 15 - Math.floor((Date.now() - data.lobby[i].turnBegin) / 1000)
                        lobby.childNodes[3].append(time)
                        lobby.childNodes[3].classList.add("active")
                    }
                    if (data.lobby[i].token) {
                        lobby.childNodes[3].append(switchElem)
                        switchInput.checked = data.lobby[i].state > 0
                    }
                }
            }
        }
        document.getElementById("main").append(lobby)
        this.clear()
        this.populate(data.game)
    }

    clear() {
        for (let i = 0; i < this.homeList.length; i++) {
            this.homeList[i].innerHTML = i
        }
        for (let i = 0; i < this.tileList.length; i++) {
            this.tileList[i].innerHTML = i
        }
        for (let i = 0; i < this.baseList.length; i++) {
            this.baseList[i].innerHTML = i
        }
    }

    populate(data) {
        for (const color in data.homes) {
            for (let i = 0; i < data.homes[color].length; i++) {
                if (data.homes[color][i]) {
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
                    let pawn = document.createElement("div")
                    pawn.innerHTML = color[0]
                    pawn.onclick = () => { manager.moveThePawn(i, "homes", color) }
                    this.homeList[i + offset].append(pawn)
                }
            }
        }
        for (const color in data.board) {
            for (let i = 0; i < data.board[color].length; i++) {
                if (data.board[color][i]) {
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
                    if (offset + data.board[color][i].position > 39) {
                        offset -= 40
                    }
                    let pawn = document.createElement("div")
                    pawn.innerHTML = color + " " + data.board[color][i].position
                    pawn.onclick = () => { manager.moveThePawn(i, "board", color) }
                    this.tileList[data.board[color][i].position + offset].append(pawn)
                }
            }
        }
        for (const color in data.bases) {
            for (let i = 0; i < data.bases[color].length; i++) {
                if (data.bases[color][i]) {
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
                    let pawn = document.createElement("div")
                    pawn.innerHTML = color[0]
                    pawn.onclick = () => { manager.moveThePawn(i, "bases", color) }
                    this.baseList[i + offset].append(pawn)
                }
            }
        }
    }

    showRoll(data) {
        if (data.roll) {
            document.getElementById("roll").innerHTML = data.roll
        } else { alert("nie twoja kolej koles") }
    }
}

let manager = new Communication()
let render = new Renderer()

manager.connectToLobby()
//setInterval(downloadGameState, 1000)
//if (JSON.parse("{\"" + document.cookie.replaceAll("=", "\": \"").replaceAll("; ", "\", \"") + "\"}").playerToken && "{\"" + document.cookie.replaceAll("=", "\": \"").replaceAll("; ", "\", \"") + "\"}".lobbyToken) { setInterval(downloadGameState, 10000) }