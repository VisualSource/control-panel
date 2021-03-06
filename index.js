const path = require("path");
const https = require("https");
const fs = require("fs");
const { spawn } = require("child_process");
const express = require("express");
const { writeJSON } = require("fs-extra");

const worlds = require("./server/load_worlds");
const { copy_screen, ping, send_command, logs } = require("./server/commands");
const { InstallPack, EnablePack, DisablePack, UninstallPack } = require("./server/packs_handler");

// HTTPS TTL KEYS
const privateKey = fs.readFileSync(path.join(__dirname,"configs/device1.key"),"utf-8");
const certificate = fs.readFileSync(path.join(__dirname,"configs/device.crt"),"utf-8");
// SERVER CONFIG
const config = JSON.parse(fs.readFileSync(path.join(__dirname,"configs/config.json"),"utf-8"));
/**
 * UUID of resouce and behavior packs.
 * Stop duplicate UUID
 * @type {Map<string,string>}
 */
let pack_routes = new Map();

// Setup express server and attach to the node https server,
// also and the websocket to express and https server
const app = express();
const sec = https.createServer({key: privateKey, cert: certificate},app);
const ws = require("express-ws")(app,sec);


/**
 *  Handles the setting of headers appon file requests
 * @param {*} res 
 * @param {*} path 
 * @param {*} stat 
 */
function setHeader(res, path, stat) {
    res.set("Service-Worker-Allowed","/");
    res.set('x-timestamp', Date.now())
}
app.use(express.static("public",{setHeaders: setHeader}));
// Need to set limit to 50mb else can't upload zip file to server
app.use(express.json({ limit: "50mb" }));
app.use(express.raw({ limit: "50mb" }));

/**
 * Handle shuntDown of express, websocket, and https server
 */
function shutDown(){
    sec.close(()=>{
        console.log('Closed out remaining connections');
        require("child_process").spawn("./restart.sh",{shell:"/bin/bash",detached:true});
        process.exit(0);
    });
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
}

process.on( 'SIGINT', function() {
    console.log( "\nGracefully shutting down from SIGINT (Ctrl-C)" );
    shutDown();
});

/**
 * Websocket handler
 * 
 * handles the pinging and console actions 
 * 
 * how often cnosole and server ping rates 
 * can be configured in app or in `configs/config.json` 
 * 
 * @url /server
 */
app.ws("/server",(ws,req)=>{
    ws.send(JSON.stringify({ type: "CONSOLE_MSG", data: "" }));
    ws.on("message",(msg)=>{
        const content = JSON.parse(msg);
        send_command(config,content.data);
    });

    setInterval(async ()=>{
        try {
            const screen = await copy_screen(config);
            ws.send(JSON.stringify({ type: "CONSOLE_MSG", data: screen }));
        } catch (error) {
            console.error(error);
        }
    },config.console_refresh_rate);
    setInterval(async () => {
            try {
                const data = await ping(config);
                ws.send(JSON.stringify({ type:"STATUS_CHANGE", data: { status: "online", port: data.rinfo.port}}));
                ws.send(JSON.stringify({ type:"PLAYER_COUNT_CHANGE", data: { min: data.currentPlayers, max: data.maxPlayers }}));
            } catch (error) {
                ws.send(JSON.stringify({ type:"STATUS_CHANGE", data: { status: "offline", port: "N/A"}}));
                ws.send(JSON.stringify({ type:"PLAYER_COUNT_CHANGE", data: { min: 0, max: 0 }}));
            }
    }, config.server_status_refresh_rate);
});


app.get("/logs",async(req,res)=>{
    try {
        const data = await logs(config);
        res.send(data);
    } catch (error) {
        console.error(error);
        res.sendStatus(500).send({error,code: 500});
    }
});

/**
 * Handles request for the server minecraft world's and resouce/behavior packs
 */
app.get("/worlds",async (req,res)=>{
    try {
        const data = await worlds(config);
        pack_routes = data.pack_routes;
        res.send(data.data);
    } catch (error) {
        console.error(error);
        res.sendStatus(500).send({error,code: 500});
    }
});

app.get("/server-properties",(req,res)=>{
    res.sendFile(path.join(config.server_dir,"server.properties"));
});
app.get("/whitelist.json",(req,res)=>{
    res.sendFile(path.join(config.server_dir,"whitelist.json"));
});
app.get("/permissions.json",(req,res)=>{
    res.sendFile(path.join(config.server_dir,"permissions.json"));
});

app.get("/start",(req,res)=>{
    const child = spawn(path.join(config.server_dir,"start.sh"));
    child.on("error",(error)=>{
        res.status(500).send({ code:500, error: error.toString("utf8")});
    });
    child.on("exit",()=>{
        res.send({ok:200});
    });
});
app.get("/stop",(req,res)=>{
    const child = spawn(path.join(config.server_dir,"stop.sh"));
    child.stderr.on("data",(error)=>{
        res.status(500).send({ code:500, error: error.toString("utf8")});
    });
    child.on("exit",()=>{
        res.send({ok:200});
    });
});
app.get("/restart",(req,res)=>{
    const child = spawn(path.join(config.server_dir,"restart.sh"));
    child.on("error",(error)=>{
        res.status(500).send({ code:500, error: error.toString("utf8")});
    });
    child.on("exit",()=>{
        res.send({ok:200});
    });
});

app.post("/save-app-settings",async (req,res)=>{
    try {
        await writeJSON(path.join(__dirname,"configs/config.json"),req.body);
        res.send({
            ok: 200,
            date: new Date().toUTCString()
        });
    } catch (error) {
        res.status(500).send({ error, code: 500});
    }
});

app.post("/install/:type/:level", async (req,res)=>{
    try {
        const data = await InstallPack(req.params,req.body,pack_routes,config);
        pack_routes = data.next_routes;
        res.send(data.pack);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error, code: 500});
    }
});

app.post("/uninstall/:type/:level",async (req,res)=>{
    try {
        const path = pack_routes.get(req.body.uuid);
        if(path){
            await UninstallPack(req.params,path,config,req.body.uuid);
            pack_routes.delete(req.body.uuid);
            res.send({ok:200});
        }else{
            res.status(500).send({code: 500, error: "Does not exist"});
        }
    } catch (error) {
        res.status(500).send({code: 500, error});
    }
});

app.post("/disable/:type/:level", async (req,res)=>{
   try {
        await DisablePack(req.params,config,req.body.pack_id);
        res.send({ok:200});
   } catch (error) {
       res.status(500).send({code: 500, error});
   }
});

app.post("/enable/:type/:level", async(req,res)=>{
    try {
        const data = await EnablePack(req.params,pack_routes.get(req.body.pack_id.trim()),config,req.body.pack_id.trim());
        res.send(data);
    } catch (error) {
        console.error(error);
        res.status(500).send({code: 500, error});
    }
});

app.post("/updatefile/:file", async (req,res)=>{
    try {
        await writeJSON(path.join(config.server_dir,req.params.file),req.body,{encoding:"utf8"});
        await send_command(config,`${req.params.file === "whitelist.json" ? "whitelist" : "permission"} reload`);
        res.send({ok: 200});
    } catch (error) {
        res.status(501).send({ code:501, error });
    }
});
app.post("/save-server-properties",async (req,res)=>{

    let properties = "";
    for (const key of Object.keys(req.body)){
        properties += `${key}=${req.body[key]}\n`;
    };

    fs.writeFile(path.join(config.server_dir,"server.properties"),properties,(err)=>{
        if(err){
            res.status(500).send({code: 500, error: err});
            return;
        }
        res.send({ok:200});
    });
});

app.get("/config",(req,res)=>{res.send(config);});
app.get("/",(req,res)=>{res.sendFile("index.html");});

app.get("/restart-gui",(req,res)=>{
    res.send({
        "restart-date": new Date().toUTCString()
    });
    shutDown();
});

app.get("*",(req,res)=>{res.redirect("/");});

sec.listen(3000,config.host);

