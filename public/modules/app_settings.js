import {Route} from './routes.js';


export class AppMannager extends HTMLDivElement {
    constructor(){
        super();
        this.form = this.getElementsByTagName("form")[0];
        this.form.addEventListener("submit",(event)=>this.handleSubmit(event));

        this.restart = this.querySelector("button#app-restart");
        this.restart.addEventListener("click",()=>this.handleRestart());
    }
    async handleRestart(){
        try {
            const raw = await fetch(`/restart-gui`);

            await raw.json();            
            document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Success", message: "Restarting sever please wait, about 1 min. The window will refresh"}})); 
            setTimeout(()=>{
                window.location.reload();
            },60000);
        } catch (error) {
            console.error(error);
            document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Error", message: "Failed to restart GUI"}})); 
        }
    }
    async handleSubmit(event){
        event.preventDefault();
        new Route().path = "/app-settings";

        const body = {}; 
        for (const [key,value] of new FormData(event.target).entries()) body[key] = value;
        
        try {
            const raw = await fetch(
                `/save-app-settings`,
                {
                    method: "POST",
                    body: JSON.stringify(body),
                    headers:{
                        'Content-Type': "application/json"
                    }
                }
            );
            await raw.json();
            document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Success", message: "Server settings have been saved."}})); 
        } catch (error) {
            console.error(error);
            document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Error", message: "Failed to save settings."}})); 
        }
        
    }
    connectedCallback(){
        this.loadConfig();
    }
    async loadConfig(){
        try {
            const raw = await fetch(`/config`);

            const config = await raw.json();
           
            this.querySelector("input#server_dir").value = config.server_dir;
            this.querySelector("input#host").value = config.host;
            this.querySelector("input#screen").value = config.screen;
            this.querySelector("input#console_refresh_rate").value = config.console_refresh_rate;
            this.querySelector("input#server_status_refresh_rate").value = config.server_status_refresh_rate;
        } catch (error) {
            console.error(error);
            document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Error", message: "Failed to fetch settings"}}));
        }
    }
}