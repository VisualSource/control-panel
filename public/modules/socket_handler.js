export class Socket {
    static INSTANCE = null;
    constructor(){
        if(Socket.INSTANCE) return Socket.INSTANCE;

        Socket.INSTANCE = this;
        this.reconnect = 0;
        this.init();
    }
    send(msg){
        this.ws.send(msg);
    }
    init(){
        this.ws = new WebSocket(`wss://${window.location.hostname}:${window.location.port}/server`);

        this.ws.addEventListener("open",(ev)=>{
            this.reconnect = 0;
        });
        this.ws.addEventListener("message",(ev)=>{
            const raw = JSON.parse(ev.data);
            document.dispatchEvent(new CustomEvent(raw.type,{detail: raw.data}));
        });
        this.ws.addEventListener("error",(ev)=>{
            if(this.reconnect < 1){
                document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Error", message: "There was an error when connect to the server."}})); 
            }
        });
        this.ws.addEventListener("close",(ev)=>{
                this.reconnect++;
                setTimeout(()=>this.init(),600);
        });
    }
}