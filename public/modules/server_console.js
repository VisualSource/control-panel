import {Socket} from './socket_handler.js';
export class ServerConsole extends HTMLDivElement {
    connectedCallback(){
        this.input = document.getElementById("server-console-input");
        this.logs = document.getElementById("console");
        this.ws = new Socket();



        this.input.addEventListener("keydown",(ev)=>{
            if(ev.key === "Enter"){
                this.ws.send(JSON.stringify({type: "CONSOLE_INPUT", data: this.input.value }));
                this.input.value = "";
            }
        });

        document.addEventListener("CONSOLE_MSG",(ev)=>{
            for(const child of this.logs.children){
                child.remove();
            }
            this.createMsg(ev.detail);
        });
    }
    createMsg(text){
        const root = document.createElement("span");
        root.setAttribute("class","console-message");
        root.innerHTML = text;
        this.logs.appendChild(root);
    }
}