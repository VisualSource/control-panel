import {Route} from './routes.js';
export class ServerProps extends HTMLDivElement {
    static get observedAttributes() { return []; }
    constructor(){
        super();
        this.loader = `<div class="spinner-grow" role="status"><span class="visually-hidden">Loading...</span></div>`;
    }
    connectedCallback(){
        this.handle();
    }
    async handle(){
        const data = await this.loadContent();
        const el = this.getElementsByClassName("server-props").item(0);
     
        el.innerHTML = `
            <form id="server-props-form">
            <header>
                <button type="submit" class="btn btn-success">Save Changes</button>
            </header>
            <div class="input-group mb-4">
                <span class="input-group-text" id="basic-addon1">Server Name</span>
                <input name="server-name" type="text" class="form-control" placeholder="" value="${data["server-name"]}" aria-label="Server Name" aria-describedby="basic-addon1">
            </div>
            <div class="input-group mb-4">
                <label class="input-group-text" for="inputGroupSelect01">Gamemode</label>
                <select name="gamemode" class="form-select" id="inputGroupSelect01">
                    <option disabled>Choose...</option>
                    <option ${data["gamemode"]==="survival" ? "selected" : ""} value="survival">Survival</option>
                    <option ${data["gamemode"]==="creative" ? "selected" : ""} value="creative">Creative</option>
                    <option ${data["gamemode"]==="adventure" ? "selected" : ""} value="adventure">Adventure</option>
                </select>
            </div>
            <section class="properties-info">
                <h6 class="fw-bold">Force Gamemode</h6>
                <b>force-gamemode=false</b>(or <b>force-gamemode is not defined</b> in the server.properties file)
                    prevents the server for sending to the client gamemode values other
                    than the gamemode value saved by the server during world creation
                    even if those values are set in server.properties file after world creation.<br />
                    <b>force-gamemode=true</b> forces the server to send to the client gamemode values
                    other than the gamemode value saved by the server during world creation
                    if those values are set in server.properties file after world creation.
            </section>
            <div class="input-group mb-4">
                <label class="input-group-text" for="inputGroupSelect01">Force Gamemode</label>
                <select name="force-gamemode" class="form-select" id="inputGroupSelect01">
                    <option disabled>Choose...</option>
                    <option ${data["force-gamemode"]==="true" ? "selected" : ""} value="true">True</option>
                    <option ${data["force-gamemode"]==="false" ? "selected" : ""} value="false">False</option>
                </select>
            </div>
            <div class="input-group mb-4">
                <label class="input-group-text" for="inputGroupSelect01">Difficulty</label>
                <select name="difficulty" class="form-select" id="inputGroupSelect01">
                    <option disabled>Choose...</option>
                    <option ${data["difficulty"]==="peaceful" ? "selected" : ""} value="peaceful">Peaceful</option>
                    <option ${data["difficulty"]==="easy" ? "selected" : ""} value="easy">Easy</option>
                    <option ${data["difficulty"]==="normal" ? "selected" : ""} value="normal">Normal</option>
                    <option ${data["difficulty"]==="hard" ? "selected" : ""} value="hard">Hard</option>
                </select>
            </div>
            <div class="input-group mb-4">
                <label class="input-group-text" for="inputGroupSelect01">Allow Cheats</label>
                <select name="allow-cheats" class="form-select" id="inputGroupSelect01">
                    <option disabled>Choose...</option>
                    <option ${data["allow-cheats"]==="true" ? "selected" : ""} value="true">True</option>
                    <option ${data["allow-cheats"]==="false" ? "selected" : ""} value="false">False</option>
                </select>
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Max Players</span>
                <input name="max-players" type="number" min="0" class="form-control" placeholder="" value="${data["max-players"]}" aria-label="Max Players" aria-describedby="basic-addon1">
            </div>
            <section class="properties-info">
                <h6 class="fw-bold">Online Mode</h6>
                <p>
                    If true then all connected players must be authenticated to Xbox Live.
                    Clients connecting to remote (non-LAN) servers will always require Xbox Live authentication regardless of this setting.
                    If the server accepts connections from the Internet, then it's <b>highly</b> recommended to enable online-mode.
                
                </p>
            </section>
            <div class="input-group mb-4">
                <label class="input-group-text" for="inputGroupSelect01">Online Mode</label>
                <select name="online-mode" class="form-select" id="inputGroupSelect01">
                    <option disabled>Choose...</option>
                    <option ${data["online-mode"]==="true" ? "selected" : ""} value="true">True</option>
                    <option ${data["online-mode"]==="false" ? "selected" : ""} value="false">False</option>
                </select>
            </div>
            <div class="input-group mb-4">
                <label class="input-group-text" for="inputGroupSelect01">Whitelist</label>
                <select name="white-list" class="form-select" id="inputGroupSelect01">
                    <option disabled>Choose...</option>
                    <option ${data["white-list"]==="true" ? "selected" : ""} value="true">True</option>
                    <option ${data["white-list"]==="false" ? "selected" : ""} value="false">False</option>
                </select>
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">IPV4 Port</span>
                <input name="server-port" type="number" min="0" class="form-control" placeholder="" value="${data["server-port"]}" aria-label="port" aria-describedby="basic-addon1">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">IPV6 Port</span>
                <input name="server-portv6" type="number" min="0" class="form-control" placeholder="" value="${data["server-portv6"]}" aria-label="port" aria-describedby="basic-addon1">
            </div>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">View distance</span>
                <input name="view-distance" type="number" min="0" class="form-control" placeholder="" value="${data["view-distance"]}" aria-label="port" aria-describedby="basic-addon1">
            </div>
            <section class="properties-info">
                <h6 class="fw-bold">Tick distance</h6>
                <p>The world will be ticked this many chunks away from any player. <b>Higher values have performance impact.</b></p>
            </section>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Tick distance</span>
                <input name="tick-distance" type="number" min="4" max="12" class="form-control" placeholder="" value="${data["tick-distance"]}" aria-label="port" aria-describedby="basic-addon1">
            </div>
            <section class="properties-info">
                <h6 class="fw-bold">Player idle timeout</h6>
                <p>After a player has idled for this many minutes they will be kicked. If set to 0 then players can idle indefinitely.</p>
            </section>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Player idle timeout</span>
                <input name="player-idle-timeout" type="number" min="0" class="form-control" placeholder="" value="${data["player-idle-timeout"]}" aria-label="port" aria-describedby="basic-addon1">
            </div>
            <section class="properties-info">
                <h6 class="fw-bold">Max threads</h6>
                <p>Maximum number of threads the server will try to use. If set to 0 server will use as many as possible.</p>
            </section>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Max threads</span>
                <input name="max-threads" type="number" min="0" class="form-control" placeholder="" value="${data["max-threads"]}" aria-label="port" aria-describedby="basic-addon1">
            </div>
            <div class="input-group mb-4">
                <span class="input-group-text" id="basic-addon1">Level Name</span>
                <input name="level-name" type="text" class="form-control" placeholder="" value="${data["level-name"]}" aria-label="Server Name" aria-describedby="basic-addon1">
            </div>
            <div class="input-group mb-4">
                <span class="input-group-text" id="basic-addon1">Level Seed</span>
                <input name="level-seed" type="text" class="form-control" placeholder="" value="${data["level-seed"]}" aria-label="Server Name" aria-describedby="basic-addon1">
            </div>
            <div class="input-group mb-4">
                <label class="input-group-text" for="inputGroupSelect01">Level type</label>
                <select name="level-type" class="form-select" id="inputGroupSelect01">
                    <option disabled>Choose...</option>
                    <option ${data["level-type"]==="DEFAULT" ? "selected" : ""} value="DEFAULT">DEFAULT</option>
                    <option ${data["level-type"]==="FLAT" ? "selected" : ""} value="FLAT">FLAT</option>
                    <option ${data["level-type"]==="LEGACY" ? "selected" : ""} value="LEGACY">LEGACY</option>
                </select>
            </div>
            <div class="input-group mb-4">
                <label class="input-group-text" for="inputGroupSelect01">Default player permission level</label>
                <select name="default-player-permission-level" class="form-select" id="inputGroupSelect01">
                    <option disabled>Choose...</option>
                    <option ${data["default-player-permission-level"]==="visitor" ? "selected" : ""} value="visitor">Visitor</option>
                    <option ${data["default-player-permission-level"]==="member" ? "selected" : ""} value="member">Member</option>
                    <option ${data["default-player-permission-level"]==="true" ? "operator" : ""} value="operator">Operator</option>
                </select>
            </div>
            <div class="input-group mb-4">
                <label class="input-group-text" for="inputGroupSelect01">Texturepack required</label>
                <select name="texturepack-required" class="form-select" id="inputGroupSelect01">
                    <option disabled>Choose...</option>
                    <option ${data["texturepack-required"]==="true" ? "selected" : ""} value="true">True</option>
                    <option ${data["texturepack-required"]==="false" ? "selected" : ""} value="false">False</option>
                </select>
            </div>
            <div class="input-group mb-4">
                <label class="input-group-text" for="inputGroupSelect01">Content log file enabled</label>
                <select name="content-log-file-enabled" class="form-select" id="inputGroupSelect01">
                    <option disabled>Choose...</option>
                    <option ${data["content-log-file-enabled"]==="true" ? "selected" : ""} value="true">True</option>
                    <option ${data["content-log-file-enabled"]==="false" ? "selected" : ""} value="false">False</option>
                </select>
            </div>
            <section class="properties-info">
                <h6 class="fw-bold">Compression threshold</h6>
                <p>Determines the smallest size of raw network payload to compress. Can be used to experiment with CPU-bandwidth tradeoffs.</p>
            </section>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Compression threshold</span>
                <input  name="compression-threshold" type="number" min="0" max="65535" class="form-control" placeholder="" value="${data["compression-threshold"]}" aria-label="port" aria-describedby="basic-addon1">
            </div>
            <section class="properties-info">
                <h6 class="fw-bold">Server authoritative movement</h6>
                <p>Enables server authoritative movement. If true, the server will replay local user input on the server and send down corrections when the client's position doesn't match the server's. Corrections will only happen if correct-player-movement is set to true.</p>
            </section>
            <div class="input-group mb-4">
                <label class="input-group-text" for="inputGroupSelect01">Server authoritative movement</label>
                <select name="server-authoritative-movement" class="form-select" id="inputGroupSelect01">
                    <option disabled>Choose...</option>
                    <option ${data["server-authoritative-movement"]==="client-auth" ? "selected" : ""} value="client-auth">Client auth</option>
                    <option ${data["server-authoritative-movement"]==="server-auth" ? "selected" : ""} value="server-auth">Server auth</option>
                    <option ${data["server-authoritative-movement"]==="server-auth-with-rewind" ? "operator" : ""} value="server-auth-with-rewind">Server auth with rewind</option>
                </select>
            </div>
            <section class="properties-info">
                <h6 class="fw-bold">Player movement score threshold</h6>
                <p>The number of incongruent time intervals needed before abnormal behavior is reported. In other words, how many times a player does something suspicious before we take action. Only relevant for server-authoritative-movement.</p>
            </section>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Player movement score threshold</span>
                <input name="player-movement-score-threshold" type="number" class="form-control" placeholder="" value="${data["player-movement-score-threshold"]}" aria-label="port" aria-describedby="basic-addon1">
            </div>
            <section class="properties-info">
                <h6 class="fw-bold">player movement distance threshold</h6>
                <p>The difference between server and client positions that needs to be exceeded before abnormal behavior is registered. Only relevant for server-authoritative-movement.</p>
            </section>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">player movement distance threshold</span>
                <input name="player-movement-distance-threshold" type="number" class="form-control" placeholder="" value="${data["player-movement-distance-threshold"]}" aria-label="port" aria-describedby="basic-addon1">
            </div>
            <section class="properties-info">
                <h6 class="fw-bold">Player movement duration threshold in ms</h6>
                <p>The duration of time the server and client positions can be out of sync (as defined by player-movement-distance-threshold) before the abnormal movement score is incremented. This value is defined in milliseconds. Only relevant for server-authoritative-movement.</p>
            </section>
            <div class="input-group mb-3">
                <span class="input-group-text" id="basic-addon1">Player movement duration threshold in ms</span>
                <input name="player-movement-duration-threshold-in-ms" type="number" class="form-control" placeholder="" value="${data["player-movement-duration-threshold-in-ms"]}" aria-label="port" aria-describedby="basic-addon1">
            </div>
            <section class="properties-info">
                <h6 class="fw-bold">Correct player movement</h6>
                <p>If true, the client position will get corrected to the server position if the movement score exceeds the threshold. Only relevant for server-authoritative-movement. We don't recommend enabling this as of yet; work is still in progress.</p>
            </section>
            <div class="input-group mb-4">
            <label class="input-group-text" for="inputGroupSelect01">Correct player movement</label>
            <select name="correct-player-movement" class="form-select" id="inputGroupSelect01">
                <option disabled>Choose...</option>
                <option ${data["correct-player-movement"]==="true" ? "selected" : ""} value="true">True</option>
                <option ${data["correct-player-movement"]==="false" ? "selected" : ""} value="false">False</option>
            </select>
        </div>
        <section class="properties-info">
            <h6 class="fw-bold">Server authoritative block breaking</h6>
            <p>If true, the server will compute block mining operations in sync with the client so it can verify that the client should be able to break blocks when it thinks it can.</p>
        </section>
        <div class="input-group mb-4">
            <label class="input-group-text" for="inputGroupSelect01">Server authoritative block breaking</label>
            <select name="server-authoritative-block-breaking" class="form-select" id="inputGroupSelect01">
                <option disabled>Choose...</option>
                <option ${data["server-authoritative-block-breaking"]==="true" ? "selected" : ""} value="true">True</option>
                <option ${data["server-authoritative-block-breaking"]==="false" ? "selected" : ""} value="false">False</option>
            </select>
        </div>
        <button type="submit" class="btn btn-success">Save</button>
        </form>
        `;


        this.getElementsByTagName("form")[0].addEventListener("submit",(event)=>{
            event.preventDefault();
            new Route().path = "/properties";

            const body = {}; 

            for (const [key,value] of new FormData(event.target).entries() ){
                    body[key] = value;
            }
            fetch(`${window.location.origin}/save-server-properties`,{method:"POST", body: JSON.stringify(body), headers: { 'Content-Type':"application/json"}})
            .then(a=>{
                document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Success", message: "Server props have been saved. Server requires restart for changes to take effect."}})); 
                console.log(a)
            }).catch(e=>{
                console.error(e);
                document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Error", message: "There was an error when saving the properties."}})); 
            });
        });
    }
    async loadContent(){
        try {
            const data = await (await fetch(`${window.location.origin}/server-properties`)).text();
            let server = {};
            let current = "";
            let prop = "";
            let isComment = false;
            for(let a = 0; a < data.length; a++){
                if(data[a].match(/\n/) !== null) {
                    if(!isComment && prop !== ""){
                        server[current] = prop;
                    }
                    prop = "";
                    isComment = false;
                    continue;
                }
                if((data[a].match(/#/) !== null)|| (isComment === true)){
                        isComment = true;
                        continue;
                }
                if(data[a].match(/=/) !== null) {
                server[prop] = "";
                current = prop;
                prop = "";
                continue;
                }
            prop += data[a]; 
            }
            return server;
        } catch (error) {
            console.error(error);
            document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Error", message: "Faild to fetch server properties."}})); 
        }
    }
}