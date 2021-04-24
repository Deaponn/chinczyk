import Communication from "./communication.js"
import Renderer from "./renderer.js"

export default class Game {

    constructor() {
        this.init()
    }

    init() {
        let manager = new Communication()
        let render = new Renderer()
        manager.addRender(render)
        render.addManager(manager)
        manager.connectToLobby()
    }

}