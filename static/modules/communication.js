class Communication {
    joinGame(nickname) {
        let request = new XMLHttpRequest()
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText)
                console.log(response)
                document.cookie = "playerToken=" + response.playerToken
                downloadGameState()
            }
        };
        request.open("POST", "http://localhost:3000/login", true)
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("nickname=" + nickname);
    }

    downloadGameState() {
        console.log("{\"" + document.cookie.replaceAll("=", "\": \"").replaceAll("; ", "\", \"") + "\"}")
        let cookies = JSON.parse("{\"" + document.cookie.replaceAll("=", "\": \"").replaceAll("; ", "\", \"") + "\"}")
        console.log("playerToken=" + cookies.playerToken + "&action=downloadGameState")
        let request = new XMLHttpRequest()
        request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                let response = JSON.parse(this.responseText)
                console.log("response received")
                showGameState(response)
            }
        };
        request.open("POST", "http://localhost:3000/actions", true)
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send("playerToken=" + cookies.playerToken + "&action=downloadGameState");
    }

    changeReadyState() {
        let cookies = JSON.parse("{\"" + document.cookie.replaceAll("=", "\": \"").replaceAll("; ", "\", \"") + "\"}")
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
}

export { Communication }