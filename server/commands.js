const {spawn} = require("child_process");
const mcpeping = require('mcpe-ping');
const {join} = require("path")
const { readdir } = require("fs-extra");
const {readFile} = require("fs/promises");
/**
 *  Pings the current server and return the port, current and max players
 *  if the server is offline the ping will fail 
 * 
 * 
 * @param {{host: string}} config 
 * @returns {Promise<{rinfo:{port: number }, currentPlayers: number, maxPlayers: number}>}
 */
async function ping({host}){
    return new Promise((ok,err)=>{
        mcpeping(host,19132,(error,res)=>{
            if(error){
                err(error);
            }else{
                ok(res);
            }
        },200);
    });
}


/**
 * check if the minecraft server screen is active
 * 
 * @param {string} lab the screen name of the minecraft server
 * @returns {Promise<boolean>}
 */
async function check_alive(lab){
    const screen = spawn("screen",["-list"]);
    const grep = spawn("grep",["-e",`\.${lab}`]);

    return new Promise((ok,err)=>{
        screen.stdout.on("data",(data)=>{
            grep.stdin.write(data);
        });
        screen.on("close",(code)=>{
            grep.stdin.end();
        });
        grep.on('close', (code) => {
            ok(false);
        });
        grep.stdout.on('data', (data) => {
            ok(true);
        });
        grep.stderr.on('data', () => {
            ok(false);
        });
    });
}

/**
 *  send a command or content to the minecraft server's screen
 * 
 * @param {{screen: string}} config 
 * @param {string} content the content to send to the screen
 */
async function send_command({screen},content){

    const alive = await check_alive(screen);

    if(alive){
        const child = spawn(`screen -Rd ${screen} -X stuff "${content} $(printf '\r')"`,{stdio:"pipe",shell:"/bin/bash"});
        child.on("error",(error)=>{
            console.error(error);
        });
        child.on("exit",()=>{});
    }
}

/**
 * Copys the content of the of the minecraft server screen
 * 
 * @param {{screen: string, server_dir: string}} config 
 * @returns {Promise<string>}
 */
async function copy_screen({screen,server_dir}){

    const alive = await check_alive(screen);

    if(alive){
        const child = spawn(`screen -r ${screen} -p0 -X hardcopy console_log.txt && cat ${join(server_dir,"console_log.txt")}`,{stdio:"pipe",shell:"/bin/bash"});

        return new Promise((ok,err)=>{
            child.stdout.on("data",(data)=>{
                let info = data.toString();
                for (let char of info){
                    if(char === '['){
                       info = info.replace("\n","<br>");
                    }
                }
                ok(info);
           });
           child.on("error",(error)=>{
               err(error);
           });
        });
    }else{
        return "";
    }
}


async function logs({server_dir}){
    const path = join(server_dir,"/logs");
    const logs = await readdir(path);

    let review = [];
    for (const log of logs) {
        let content = await readFile(join(path,log),{encoding: "utf-8"});

        const data = log.split(".");
        
        for(let i = 0; i < content.search("\n"); i++){
            content = content.replace("\n","<br/>");
        }


        let item = {
            content,
            date: `[${data[2]}/${data[3]}/${data[1]}]`,
            name: `  Server: ${data[0]} | Time: ${data[4]}:${data[5]}:${data[6]}`
        }
        review.push(item);
    }


    return review;
}


module.exports = {copy_screen, ping, send_command, logs};
