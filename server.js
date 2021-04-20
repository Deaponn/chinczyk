//zmienne, stałe

var express = require("express")
var bodyParser = require("body-parser")
var uuid = require("uuid")
const Lobby = require(__dirname + "/modules/lobby.js")
const Game = require(__dirname + "/modules/game.js")
var app = express()
app.use(express.static('static'))
app.use(bodyParser.urlencoded({ extended: true }));

let gameList = []
let lobbyList = []
let previousRoll = 0
let rolled = false

app.get("/", function (req, res) {
    res.sendFile("index.html")
})

app.get("/favicon.ico", function (req, res) {
    res.sendFile(__dirname + "/favicon.ico")
})

app.post("/login", function (req, res) {
    let playerToken = uuid.v4()
    if (lobbyList.length == 0) {
        let newLobby = new Lobby(0)
        newLobby.newPlayer(playerToken, req.body.nickname)
        lobbyList.push(newLobby)
        let game = new Game()
        gameList.push(game)
    } else if (lobbyList[lobbyList.length - 1].full) {
        let newLobby = new Lobby(gameList.length)
        newLobby.newPlayer(playerToken, req.body.nickname)
        lobbyList.push(newLobby)
        let game = new Game()
        gameList.push(game)
    } else {
        lobbyList[lobbyList.length - 1].newPlayer(playerToken, req.body.nickname) // joins current lobby
    }
    res.send({ playerToken: playerToken, newPlayer: true })
})

app.post("/actions", function (req, res) {
    let credentials = { gameId: -1 }
    for (let i = 0; i < lobbyList.length; i++) {
        if (lobbyList[i].getGameAndPlayer(req.body.playerToken) != 0) {
            credentials = lobbyList[i].getGameAndPlayer(req.body.playerToken) // checks if info is correct
            credentials["lobbyId"] = i
            break
        }
    }
    if (credentials.gameId != -1) { // player exists in lobby
        switch (req.body.action) { // what player wishes to do
            case "downloadGameState": {
                let lobbyInfo = lobbyList[credentials.lobbyId].info(credentials.playerId)
                let gameInfo = gameList[credentials.gameId].info()
                if (gameList[credentials.gameId].isGameEnded() || lobbyList[credentials.lobbyId].isGameEnded()) {
                    res.send({ lobby: lobbyInfo, game: gameInfo, finished: true, winner: gameList[credentials.gameId].whoWon() })
                    setTimeout(function () {
                        gameList[credentials.gameId] = null
                        lobbyList[credentials.lobbyId] = { getGameAndPlayer: function () { return 0 } }
                        console.log("game with credentials", credentials, " deleted, game and lobby list: ", gameList, lobbyList);
                    }, 3000)
                } else { res.send({ lobby: lobbyInfo, game: gameInfo, finished: false }) }
                break
            }
            case "changeReadyState": {
                let newStatus = lobbyList[credentials.lobbyId].changeReadyState(credentials.playerId)
                res.send(newStatus)
                break
            }
            case "roll": {
                if (!gameList[credentials.gameId].isGameEnded()) {
                    if (credentials.state == 2 && !rolled) {
                        rolled = true
                        let roll = Math.floor(Math.random() * 6 + 1)
                        previousRoll = roll
                        res.send({ roll: roll })
                        if (!gameList[credentials.gameId].possibleMove(roll, credentials.color)) {
                            lobbyList[credentials.lobbyId].nextPlayer()
                            rolled = false
                        }
                    } else { res.send({ message: "not your turn" }) }
                } else { res.send({ message: "game ended" }) }
                break
            }
            case "move": {
                if (!gameList[credentials.gameId].isGameEnded()) {
                    if (credentials.state == 2 && req.body.color == credentials.color && rolled) {
                        let moved = gameList[credentials.gameId].movePawn(parseInt(req.body.clicked), req.body.where, req.body.color, previousRoll)
                        if (moved) {
                            lobbyList[credentials.lobbyId].nextPlayer()
                            rolled = false
                        }
                    }
                    let lobbyInfo = lobbyList[credentials.lobbyId].info(credentials.playerId)
                    let gameInfo = gameList[credentials.gameId].info()
                    res.send({ lobby: lobbyInfo, game: gameInfo })
                } else { res.send({ message: "game ended" }) }
                break
            }
        }
    } else { // is not in a lobby, send info about that
        res.send({ message: "deleting your playerToken cookies", notInLobby: true })
    }
})

//nasłuch na określonym porcie

app.listen(process.env.PORT || 3000, function () {
    console.log("start serwera na porcie 3000")
})