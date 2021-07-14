const {spawn} = require("child_process");
const mcpeping = require('mcpe-ping');
const {join} = require("path")

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


module.exports = {copy_screen, ping, send_command};
