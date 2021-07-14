const fs = require("fs");
const {join} = require("path");
const { readJSON, readdir } = require("fs-extra");

function exists(path){
    try {
        fs.statSync(path);
        return true;
    } catch (error) {
        return false;
    }
}

async function readWorlds(config){
    const root = `${config.server_dir}/worlds`;
    const worlds = await readdir(root);
    const pack_routes = new Map();
    const data = {
        worlds_names: worlds,
        worlds: {}
    };

    for(const world of worlds){
        const content = {
            behavior_packs: [],
            resouce_packs: [],
            world_behavior_packs: [],
            world_resource_packs: []
        }

        const path_bp_folder = join(root,world,"behavior_packs");
        const path_rp_folder = join(root,world,"resource_packs");
        const file_world_bp = join(root,world,"world_behavior_packs.json");
        const file_world_rp = join(root,world,"world_resource_packs.json");
        if(!exists(path_bp_folder)){
            fs.mkdirSync(path_bp_folder);
        }
        if(!exists(path_rp_folder)){
            fs.mkdirSync(path_rp_folder);
        }
        if(!exists(file_world_bp)){
            fs.writeFileSync(file_world_bp,"[]",{encoding:"utf-8"});
        }
        if(!exists(file_world_rp)){
            fs.writeFileSync(file_world_rp,"[]",{encoding:"utf-8"});
        }

        const bp = await readdir(path_bp_folder);

        for(const pack of bp){
            const path = join(path_bp_folder,pack,"manifest.json");
            if(!exists(path)) continue;
           try {
                const raw = await readJSON(path);

                pack_routes.set(raw.header.uuid, join(path_bp_folder,pack));
            
                raw.header["dependencies"] = raw.dependencies;
               
                content.behavior_packs.push(raw.header); 
           } catch (error) {
               console.log("Invaild bp pack", error.path);
           }
        }

        const rp = await readdir(path_rp_folder);

        for(const pack of rp){
            const path = join(path_rp_folder,pack,"manifest.json");
            if(!exists(path)) continue;
            try {
                const raw = await readJSON(path);
                pack_routes.set(raw.header.uuid,join(path_rp_folder,pack));
                content.resouce_packs.push(raw.header); 
            } catch (error) {
                console.error("Invaild RP",error.path);
            }
        }

        content.world_behavior_packs = await readJSON(file_world_bp);
        content.world_resource_packs = await readJSON(file_world_rp);
    
        data.worlds[world] = content;
    }

    return {data,pack_routes};
}

module.exports = readWorlds;

