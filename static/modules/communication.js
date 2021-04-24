export default class Communication {

    constructor() {
        this.init()
    }

    init() {
        console.log("inited")
        document.getElementById("login").onclick = () => { this.joinGame() }
        document.getElementById("roll").onclick = () => { this.roll() }
        console.log(window)
    }

    addRender(render) {
        this.render = render
        console.log(render === this.render, Object.getPrototypeOf(render) === Object.getPrototypeOf(this.render))
    }

    connectToLobby() {
        if (document.cookie.indexOf("playerToken") != -1) {
            let manager = this
            let cookies = JSON.parse("{\"" + document.cookie.replaceAll("=", "\": \"").replaceAll("; ", "\", \"") + "\"}")
            let request = new XMLHttpRequest()
            request.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    let response = JSON.parse(this.responseText)
                    console.log(response)
                    if (!response.notInLobby) {
                        manager.downloadGameState()
                        manager.render.boardSetup()
                        manager.intervalId = setInterval(manager.downloadGameState.bind(manager), 1000)
                    } else { document.cookie = "playerToken=\"\"; Expires=" + new Date(0).toUTCString(); console.log("deleted"); }
                }
            };
            request.open("POST", "/actions", true)
            request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            request.send("playerToken=" + cookies.playerToken + "&action=downloadGameState");
        }
    }

    joinGame() {
        let manager = this
        console.log(manager)
        let nickname = document.getElementById("nickname").value
        let request = new XMLHttpRequest()
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText)
                console.log(response)
                document.cookie = "playerToken=" + response.playerToken + "; SameSite=Lax"
                console.log("co? ", manager)
                manager.downloadGameState()
                manager.render.boardSetup()
                manager.intervalId = setInterval(manager.downloadGameState.bind(manager), 1000)
            }
        };
        request.open("POST", "/login", true)
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("nickname=" + nickname);
    }

    downloadGameState() {
        let manager = this
        console.log(this)
        let cookies = JSON.parse("{\"" + document.cookie.replaceAll("=", "\": \"").replaceAll("; ", "\", \"") + "\"}")
        let request = new XMLHttpRequest()
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText)
                console.log(manager.render)
                manager.render.showGameState(response)
                if (response.finished) {
                    console.log(manager.intervalId);
                    clearInterval(manager.intervalId)
                }
            }
        };
        request.open("POST", "/actions", true)
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
        request.open("POST", "/actions", true)
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("playerToken=" + cookies.playerToken + "&action=changeReadyState");
    }

    roll() {
        let manager = this
        let cookies = JSON.parse("{\"" + document.cookie.replaceAll("=", "\": \"").replaceAll("; ", "\", \"") + "\"}")
        let request = new XMLHttpRequest()
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText)
                manager.render.showRoll(response)
            }
        };
        request.open("POST", "/actions", true)
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("playerToken=" + cookies.playerToken + "&action=roll");
    }

    moveThePawn(which, where, color) {
        console.log(which, where, color)
        let manager = this
        let cookies = JSON.parse("{\"" + document.cookie.replaceAll("=", "\": \"").replaceAll("; ", "\", \"") + "\"}")
        let request = new XMLHttpRequest()
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText)
                manager.render.showGameState(response)
            }
        };
        request.open("POST", "/actions", true)
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("playerToken=" + cookies.playerToken + "&action=move" + "&clicked=" + which + "&where=" + where + "&color=" + color);
    }
}