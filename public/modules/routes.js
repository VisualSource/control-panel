export class Route {
    static INSTANCE = null;
    constructor(){
        if(Route.INSTANCE) return Route.INSTANCE;
        Route.INSTANCE = this;

        this._current = "/";
        this._events = {
            change: []
        };
    }
    set path(value) {
        if(value !== this._current) {
            history.pushState({},"",value);
            this._current = value;
            this.changeEvent(value);
        }
    }
    get path(){
        return this._current;
    }
    changeEvent(path){
        for(const event of this._events["change"]){
            event(path);
        }
    }
    on(type,handler){
        this._events[type].push(handler);
    }
}

export class RouteLink extends HTMLElement {
    static get observedAttributes() { return []; }
    constructor(){
        super();
        this.route = new Route();
        this.className = "nav-item material-icons";
    }
    disconnectedCallback() {}
    connectedCallback(){
        this.style.display = "flex";
        this.appendChild(document.createTextNode(this.getAttribute("data-icon")));
        this.addEventListener("click",()=>{
            this.route.path = this.getAttribute("data-path");
        });
    }
    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue){}
}

export class RouteHandler extends HTMLElement {
    static get observedAttributes() { return []; }
    constructor(){
        super();
        this.paths = [];
        this.className = "panel";
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(document.createElement("slot"));
        this.route = new Route();
        this.route.on("change",(path)=>{
            for(const child of this.children){ child.style.display = "none";}
            const paths = this.paths.filter(value=>value.path === path);
            if(paths.length > 0){
                this.children.item(paths[0].index).style.display = paths[0].display; 
            }
        });
    }
    disconnectedCallback() {}
    connectedCallback(){
        for(let i = 0; i < this.children.length; i++){
            const path = this.children.item(i).getAttribute("data-path");
            if(path !== this.route.path){
                this.children.item(i).style.display = "none";
            }
            this.paths.push({index: i , path, display: this.children.item(i).getAttribute("data-display")});
        }
    }
    adoptedCallback() {}
    attributeChangedCallback(name, oldValue, newValue){}
}