export class ListHandler extends HTMLElement {
    constructor(){
        super();
        this.loading = true;
        this.content = [];

        this.root  = document.createElement("ol");
        this.root.setAttribute("class","list-group");

        this.appendChild(this.root);

    }
    connectedCallback(){
        this.handleContent(this.getAttribute("data-list"),this.getAttribute("data-el"));

        document.addEventListener(`${this.getAttribute("data-event")}-remove`,(event)=>{
            this.root.removeChild(this.root.children.item(Number(event.detail)));
            this.content = this.content.filter((_,i)=>i!==Number(event.detail));
            fetch(
                `${window.location.origin}/updatefile/${this.getAttribute("data-list")}`,
                {method:"POST",
                body:JSON.stringify(this.content),
                headers:{'Content-Type':"application/json"}
            }).then(e=>{
                document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Success", message: `Data has been saved.`}})); 
            }).catch(e=>{
                document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Error", message: `Failed to save.`}})); 
                console.error(e);  
            });

            for(let i = 0; i < this.content.length; i++){
                this.root.children.item(i).setAttribute("data-index",i);
            }
        });

        document.addEventListener(`${this.getAttribute("data-event")}-add`,(event)=>{
            this.createItem(this.getAttribute("data-el"),event.detail,this.content.length);
            this.content.push(event.detail);
            fetch(
                `${window.location.origin}/updatefile/${this.getAttribute("data-list")}`,
                {method:"POST",
                body:JSON.stringify(this.content),
                headers:{'Content-Type':"application/json"}
            }).then(e=>{
                document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Success", message: `Data has been saved.`}})); 
            }).catch(e=>{
                document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Error", message: `Failed to save.`}})); 
                console.error(e);  
            });

        });
        
        
    }
    createItem(el,data,i){
        const li = document.createElement(el);
        for(const key of Object.keys(data)){
            li.setAttribute(`data-${key}`,data[key]);
        }
        li.setAttribute("data-index",i);
        this.root.appendChild(li);
    }
    async handleContent(orgin,el){

        try {
            const data = await (await fetch(`${window.location.origin}/${orgin}`)).json();
            this.content = data;

            let i = 0;
            for (const child of data){
                this.createItem(el,child,i);
                i++;
            }
        } catch (error) {
            console.error(error);
            document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Error", message: `There was an error when fetching ${orgin}`}})); 
        }
    
        this.loading = false;
    }
}

export class ListAddHandler extends HTMLElement {
    constructor(){
        super();

        this.button = document.createElement("button");
        this.button.setAttribute("class","btn btn-primary");
        this.button.textContent = "Add";

        this.appendChild(this.button);
    }
    connectedCallback(){

        this.button.addEventListener("click",()=>{

            let ok = true;
            const targets = JSON.parse(this.getAttribute("data-ids"));

            const validate = JSON.parse(this.getAttribute("data-validate"))

            const detail = {};
            for (const target of targets){
                const a = document.getElementById(target);

                if(validate.includes(target)){
                    if(!a.value){
                        ok = false;
                    }
                }
                
                if(a.type === "checkbox"){
                    detail[a.name] = a.checked.toString();
                    a.checked = false;
                }else{
                    if(a.value) detail[a.name] = a.value;
                    a.value = "";
                }
                
            }
            const required = JSON.parse(this.getAttribute("data-require"));

            for(const item of required) {
                if(!Object.keys(detail).includes(item)){
                    ok = false;
                }
            }
    
            if(ok) document.dispatchEvent(new CustomEvent(`${this.getAttribute("data-event")}-add`,{detail})); 
            else document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "error", message: "input data is invaild or missing a input"}})); 

        });

    }
}

export class WhiteListItem extends HTMLElement {
    constructor(){
        super();
    }
    connectedCallback(){
        const root = document.createElement("li");
        root.setAttribute("class","list-group-item d-flex justify-content-between align-items-start");

        
        const remove = document.createElement("span");
        remove.setAttribute("class","badge bg-danger rounded-pill close-button");

        const icon = document.createElement("span");
        icon.setAttribute("class","material-icons");
        icon.textContent = "close";

        remove.addEventListener("click",(event)=>{
            document.dispatchEvent(new CustomEvent("wl-remove",{detail: this.getAttribute("data-index")}));
        });
        remove.appendChild(icon);

        const main = document.createElement("div");
        main.setAttribute("class","ms-2 me-auto");

        const username = document.createElement("div");
        username.setAttribute("class","fw-bold");
        username.textContent = this.getAttribute("data-name") ?? "NO USERNAME DEFINED";

        main.appendChild(username);
        main.insertAdjacentText("beforeend",this.getAttribute("data-xuid") ?? "NO XUID DEFINED");


        const limit = document.createElement("div");
        limit.textContent = `Ignores player limit: ${this.getAttribute("data-ignoresPlayerLimit") ?? "false"}`;

        main.appendChild(limit);

        root.appendChild(main);
        root.appendChild(remove);

        this.appendChild(root);
    
    }
}
export class PermissionItem extends HTMLElement {
    connectedCallback(){
        const root = document.createElement("li");
        root.setAttribute("class","list-group-item d-flex justify-content-between align-items-start");

        
        const remove = document.createElement("span");
        remove.setAttribute("class","badge bg-danger rounded-pill close-button");

        const icon = document.createElement("span");
        icon.setAttribute("class","material-icons");
        icon.textContent = "close";

        remove.addEventListener("click",(event)=>{
            document.dispatchEvent(new CustomEvent("pi-remove",{detail: this.getAttribute("data-index")}));
        });
        remove.appendChild(icon);

        const main = document.createElement("div");
        main.setAttribute("class","ms-2 me-auto");

        const permission = document.createElement("div");
        const header_p = document.createElement("span");
        header_p.setAttribute("class","fw-bold");
        permission.appendChild(header_p);
        permission.textContent = `Permission: ${this.getAttribute("data-permission") ?? "INVALID OPTION"}`;

        const userid = document.createElement("div");
        const header_i = document.createElement("span");
        header_i.setAttribute("class","fw-bold");
        userid.appendChild(header_i);
        userid.textContent = `XUID: ${this.getAttribute("data-xuid") ?? "INVALID OPTION"}`;


        main.appendChild(permission);
        main.appendChild(userid);

        root.appendChild(main);
        root.appendChild(remove);

        this.appendChild(root);
    }
}