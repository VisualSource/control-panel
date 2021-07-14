const { spawn } = require("child_process");
const fs = require("fs/promises");
const { nanoid } = require("nanoid");
const { join } = require("path");
const { remove, readJSON, writeJSON } = require("fs-extra");


/**
 * unzips a file with a give name to a directory
 * 
 * @param {string} fileid 
 * @param {string} route 
 * @returns {Promise<number>}
 */
async function unzip(fileid,route){
    return new Promise((ok,error)=>{
        const unzip = spawn(`unzip ${fileid}.zip -d ${fileid}`,{ shell: "/bin/bash", cwd: route });
        unzip.on("error",(err)=>{
            error(err);
        });
        unzip.stderr.on("data",(err)=>{
            error(err.toString());
        });
        unzip.on("close",(code)=>{
            if(code === 0){
                ok(code);
            }else{
                error(code);
            }
        });
    });
}

/**
 * Install ethear a resource or behavior pack in a world
 * 
 * 
 * @param {{type: string, level: string}} params 
 * @param {ArrayBuffer} zip 
 * @param {Map<string,string>} routes 
 * @param {{server_dir: string}} config 
 * @returns 
 */
async function InstallPack({type,level},zip,routes,{server_dir}){
    const level_name = Buffer.from(level,"base64").toString("utf-8");
    const route = join(server_dir,"worlds",level_name, type === "BP" ? "behavior_packs" : "resource_packs");
    const fileid = nanoid();

    await fs.writeFile(`${route}/${fileid}.zip`,zip);
   
    await unzip(fileid,route);

    await remove(`${route}/${fileid}.zip`);

    const manifest = await readJSON(`${route}/${fileid}/manifest.json`,{encoding: "utf8"});

    if(type === "BP"){
       manifest.header["dependencies"] = manifest.dependencies;
    }

    routes.set(manifest.header.uuid,`${route}/${fileid}`);

    return {
        pack: manifest.header,
        next_routes: routes
    }
}

/**
 *  Enable a resource or behavior pack in a world
 * 
 * 
 * @param {{level: string, type: string}} params 
 * @param {string} path 
 * @param {{server_dir: string}} config 
 * @param {string} uuid 
 * @returns 
 */
async function EnablePack({level,type},path,{server_dir},uuid){
    try {
        const level_name = Buffer.from(level,"base64").toString("utf-8");
        const world_path = join(server_dir,"worlds",level_name, type === "BP" ? "world_behavior_packs.json" : "world_resource_packs.json");

        const world_file = await readJSON(world_path);

        if(world_file.findIndex(value=>value.pack_id===uuid) !== -1) throw { type: "install", msg: `Already installed ${type}: ${uuid}` };


        const manifest = await readJSON(join(path,"manifest.json"),{encoding:"utf8"});

        const content = {
            "pack_id" : manifest.header.uuid,
            "version" : manifest.header.version
        }

        world_file.push(content);

        await writeJSON(world_path,world_file,{encoding:"utf8"});

        return content;
    } catch (error) {
        if(error?.type === "install") throw error;
        throw { type: "internal", msg: error };
    }
}

/**
 * Uninstalls and disables a resource or behavior pack.
 * 
 * @param {any} parms 
 * @param {string} path 
 * @param {string} dir 
 * @param {string} uuid 
 */
async function UninstallPack(parms,path,dir,uuid){
    await remove(path);
    await DisablePack(parms,dir,uuid);
}

/**
 * 
 * @param {{level: string, type: string}} params 
 * @param {{server_dir: string}} config 
 * @param {string} uuid 
 */
async function DisablePack({level,type},{server_dir},uuid){
    try {
        const level_name = Buffer.from(level,"base64").toString("utf-8");
        const world_path = join(server_dir,"worlds",level_name, type === "BP" ? "world_behavior_packs.json" : "world_resource_packs.json");

        const world_file = await readJSON(world_path);
       
        await writeJSON(world_path,world_file.filter(value=>value.pack_id!==uuid),{encoding:"utf8"});

    } catch (error) {
        throw error;
    }
}

module.exports = { InstallPack, EnablePack, DisablePack, UninstallPack };