import Communication from "./modules/communication.js"
import Renderer from "./modules/renderer.js"

let manager = new Communication()
let render = new Renderer()

manager.addRender(render)
render.addManager(manager)

manager.connectToLobby()

const closeInfo = document.getElementById("close")
closeInfo.onclick = () => {
    document.getElementById("instructions").style.display = "none"
}