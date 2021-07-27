export class ActiveServerStatus extends HTMLElement {
    constructor(){
        super();
        this.status = "offline";
        this.port = "25565";
    }
    connectedCallback(){
        const root = document.createElement("div");
        root.setAttribute("class","server-active-status");


        const icon = document.createElement("div");
        icon.setAttribute("class","icon");
            const mat = document.createElement("span");
            mat.setAttribute("class","material-icons");
            mat.textContent = "remove_circle_outline";
            mat.setAttribute("data-color","red");
            icon.appendChild(mat);

        root.appendChild(icon);

        const info = document.createElement("div");
            const h4 = document.createElement("h4");
            h4.textContent = "offline";
            info.appendChild(h4);

            const port = document.createElement("span");
            port.textContent = "25565";
            info.appendChild(port);

        root.appendChild(info);


        document.addEventListener("STATUS_CHANGE",(event)=>{
            const status = event.detail.status;
            h4.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            port.textContent = event.detail.port;

            mat.textContent = event.detail.status === "online" ? "check_circle" : "remove_circle_outline";
            mat.setAttribute("data-color",event.detail.status === "online" ? "green" : "red");
        });

        this.appendChild(root);
    }
}

export class ActivePlayerCount extends HTMLElement {
    constructor(){
        super();
    }// <code id="active-players">0</code>/<code id="max-players">10</code>
    connectedCallback(){
        const active = document.createElement("code");
        active.textContent = "0";

        const max = document.createElement("code");
        max.textContent = "10";

        document.addEventListener("PLAYER_COUNT_CHANGE",(ev)=>{
            active.textContent = ev.detail.min;
            max.textContent = ev.detail.max;
        });

        this.appendChild(active);
        this.appendChild(document.createTextNode("/"));
        this.appendChild(max);
    }
}

export class ServerControlBtn extends HTMLButtonElement {
    constructor(){
        super();
    }
    connectedCallback(){
        this.addEventListener("click",()=>{
                fetch(`${window.location.origin}/${this.getAttribute("data-type")}`)
                .then(res=>{
                    document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Success", message: `Server has been ${this.getAttribute("data-type")}ed`}})); 
                }).catch(err=>{
                    document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Error", message: `Failed to ${this.getAttribute("data-type")} server.`}})); 
                });
        });
    }
}