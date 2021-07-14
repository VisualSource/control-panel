export class WorldMannager extends HTMLDivElement {
    constructor(){
        super();
        this.content = {};
        this.active_level = "";
        this.main = null;
        this.aside = null;
    }
    async install_pack(type,data) {
        try {
            const raw = await fetch(
                `${window.location.origin}/install/${type}/${btoa(this.active_level)}`,
                { 
                    method: "POST",
                    body: data,
                    headers: {
                        "Content-Type": "application/octet-stream"
                    }  
                }
            );
            
            const response = await raw.json();
            document.getElementById(`${type}${btoa(this.active_level)}list`).appendChild(this.createNewInstall(type,response));
            document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Success", message: `${type} has been installed.`}})); 
        } catch (error) {
            console.error(error);
            document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Error", message: `Failed to install ${type}`}})); 
        }
    }
    async enable_pack(type,content) {
        try {
         const raw = await fetch(
             `${window.location.origin}/enable/${type}/${btoa(this.active_level)}`,
             { 
                 method: "POST",
                 headers: {
                     'Content-Type':"application/json"
                 },
                 body: JSON.stringify(content)
             }
             );  
             
            if(!raw.ok) throw await raw.json();
 
            const data = await raw.json();

            document.getElementById(`E${btoa(this.active_level)}${type}`).appendChild(this.createNewEnable(type,data));
            document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Success", message: `${type} has been enabled`}})); 
        } catch (error) {
            document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Error", message: error.error.type === "install" ? error.error.msg :  `There was an error when enabling ${type}`}})); 
            if(error instanceof Error) console.error(error);
        }
    }
    async disable_pack(type,content){
        if(type === "BP"){
            this.content.worlds[this.active_level].world_behavior_packs = this.content.worlds[this.active_level].world_behavior_packs.filter(value=>value.pack_id!==content.pack_id);
        }else{
            this.content.worlds[this.active_level].world_resource_packs = this.content.worlds[this.active_level].world_resource_packs.filter(value=>value.pack_id!==content.pack_id);
        }
            fetch(
                `${window.location.origin}/disable/${type}/${btoa(this.active_level)}`,
                {
                    method: "POST",
                    body: JSON.stringify(content),
                    headers: {
                        'Content-Type': "application/json"
                    }
                }
            ).then(res=>{
                document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Success", message: `${type} was disabled.`}})); 
            }).catch(err=>{
                document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Error", message: `Failed to disable the ${type}.`}})); 
                console.error(err);
            });
    }
    async uninstall_pack(type,content){
        if(type === "BP"){
            this.content.worlds[this.active_level].behavior_packs = this.content.worlds[this.active_level].behavior_packs.filter(value=>value.uuid!==content.uuid);
        }else{
            this.content.worlds[this.active_level].resouce_packs = this.content.worlds[this.active_level].resouce_packs.filter(value=>value.uuid!==content.uuid);
        }
            fetch(
                `${window.location.origin}/uninstall/${type}/${btoa(this.active_level)}`,
                {
                    method: "POST",
                    body: JSON.stringify(content),
                    headers: {
                        'Content-Type': "application/json"
                    }
                }
            ).then(res=>{
                document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Success", message: `${type} was removed.`}})); 
            }).catch(err=>{
                document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Error", message: `There was an error when removing the ${type}`}})); 
                console.error(err);
            });
    }
    connectedCallback(){
        document.addEventListener("REMOVE_BP",(event)=>this.uninstall_pack("BP",event.detail));
        document.addEventListener("REMOVE_RP",(event)=>this.uninstall_pack("RP",event.detail));
        document.addEventListener("DISABLE_BP",(event)=>this.disable_pack("BP",event.detail));
        document.addEventListener("DISABLE_RP",(event)=>this.disable_pack("RP",event.detail));
        document.addEventListener("INSTALL_BP",(event)=>this.install_pack("BP",event.detail.file));
        document.addEventListener("INSTALL_RP",(event)=>this.install_pack("RP",event.detail.file));
        document.addEventListener("ENABLE_BP",(event)=>this.enable_pack("BP",event.detail));
        document.addEventListener("ENABLE_RP",(event)=>this.enable_pack("RP",event.detail));

        this.main = document.getElementById("world-list");
        this.aside = document.getElementById("world-control");

        this.aside.getElementsByTagName("select").item(0).addEventListener("change",(event)=>{
            this.active_level = event.target.value;
        });

        this.loadContent();
    }
    async loadContent(){
        try {
            this.content = await (await fetch(`${window.location.origin}/worlds`)).json();

            this.active_level = this.content.worlds_names[0];
           
                //<option value="Bedrock level">Bedrock level</option>
            const selector = this.aside.getElementsByTagName("select").item(0);
          
            for(const name of this.content.worlds_names) {
                const el = document.createElement("option");
                el.setAttribute("value",name);
                el.textContent = name;
                selector.appendChild(el);
            }
            for(const name of this.content.worlds_names){
                this.main.appendChild(this.createWorldElement(this.content.worlds[name],name));
            }
        } catch (error) {
            document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Error", message: `There was an error when fetching worlds`}})); 
            console.error(error);
        }
    }
    createNewInstall(type,content){
        const root_li = document.createElement("li");
        const li_details = document.createElement("details");
            /* NAME */
            const li_summary = document.createElement("summary");
            li_summary.textContent = content.name;
            li_details.appendChild(li_summary);
            /* DESCRIPTION */
            const li_des_div = document.createElement("div");
                const des_span = document.createElement("span");
                des_span.textContent = "Description: ";
            li_des_div.appendChild(des_span);
            li_des_div.appendChild(document.createTextNode(content.description));
        li_details.appendChild(li_des_div);
            /* UUID */
            const bp_uuid = document.createElement("div");
            bp_uuid.textContent = "UUID: ";
                const uuid_code = document.createElement("code");
                uuid_code.textContent = content.uuid;
            bp_uuid.appendChild(uuid_code);
        li_details.appendChild(bp_uuid);
            /* VERSION */
            const bp_version = document.createElement("div");
            bp_version.textContent = "Version: ";
                 const bp_version_code = document.createElement("code");
                bp_version_code.textContent = content.version.join(".");
             bp_version.appendChild(bp_version_code);
        li_details.appendChild(bp_version);
            /* MINECRAFT MIN VERSION */
            const min_engine = document.createElement("div");
            min_engine.appendChild(document.createTextNode("Min Minecraft Engine Version: "));
                const min_engine_version_el = document.createElement("code");
                    min_engine_version_el.textContent = content.min_engine_version.join(".");
            min_engine.appendChild(min_engine_version_el);
        li_details.appendChild(min_engine);

        /* Requires */
        if(type === "BP"){
            const header = document.createElement("h5");
            header.textContent = "Requires";
            li_details.appendChild(header);

            const require_list = document.createElement("ul");

            for(const required of content.dependencies){
                const el = document.createElement("li");
                const required_uuid = document.createElement("div");
                required_uuid.appendChild(document.createTextNode("UUID: "));
                    const required_uuid_code = document.createElement("code");
                    required_uuid_code.textContent = required.uuid;
                required_uuid.appendChild(required_uuid_code);

                const required_version = document.createElement("div");
                required_version.appendChild(document.createTextNode("Version: "));
                    const require_verison_code = document.createElement("code");
                    require_verison_code.textContent = required.version.join(".");
                required_version.appendChild(require_verison_code);

                el.appendChild(required_uuid);
                el.appendChild(required_version);

                require_list.appendChild(el);
            }
            li_details.appendChild(require_list);
        }
            const removal = document.createElement("button");
            removal.setAttribute("class","btn btn-danger");
            removal.textContent = "Remove";
            removal.addEventListener("click",(event)=>{
                root_li.remove();
                document.dispatchEvent(new CustomEvent(`REMOVE_${type}`,{ detail: { uuid: content.uuid }}));
            });

        li_details.appendChild(removal);
        root_li.appendChild(li_details);

        return root_li;
    }
    createNewEnable(type, content){
        const root = document.createElement("li");
            const uuid = document.createElement("div");
            uuid.appendChild(document.createTextNode("UUID: "));
                const uuid_code = document.createElement("code");
                uuid_code.textContent = content.pack_id;
            uuid.appendChild(uuid_code);
        root.appendChild(uuid);

            const version_el = document.createElement("div");
            version_el.appendChild(document.createTextNode("Version: "));
                const version_code = document.createElement("code");
                version_code.textContent = content.version.join(".");
            version_el.appendChild(version_code);
        root.appendChild(version_el);
        
            const btn = document.createElement("button");
            btn.textContent = "Disable";
            btn.setAttribute("class","btn btn-danger");

            btn.addEventListener("click",()=>{
                root.remove();
                document.dispatchEvent(new CustomEvent(`DISABLE_${type}`,{ detail: { pack_id: content.pack_id }}));
            });

            root.appendChild(btn);

        return root;
    }
    createWorldElement(world,name){
        const root = document.createElement("details"); 
        root.setAttribute("id",name);
        root.setAttribute("class","world-level")

        const summary = document.createElement("summary");
        summary.textContent = name;
        root.appendChild(summary);


        const install_bp = document.createElement("section");
        install_bp.setAttribute("class","world-behavior-packs");

            const bp_header = document.createElement("h3");
            bp_header.textContent = "Available Behavior Packs";

            const install_bp_ul = document.createElement("ul");
            install_bp_ul.setAttribute("id",`BP${btoa(name)}list`);

            for(const content of world.behavior_packs){
                install_bp_ul.appendChild(this.createNewInstall("BP",content));
            }

            install_bp.appendChild(bp_header);
            install_bp.appendChild(install_bp_ul);

        root.appendChild(install_bp);


        const install_rr = document.createElement("section");
        install_rr.setAttribute("class","world-resouce-packs");
            const rr_header = document.createElement("h3");
            rr_header.textContent = "Available Resouce Packs";
            install_rr.appendChild(rr_header);

            const install_rr_ul = document.createElement("ul");
            install_rr_ul.setAttribute("id",`RP${btoa(name)}list`);

            for(const content of world.resouce_packs){
                install_rr_ul.appendChild(this.createNewInstall("RP",content));
            }


        install_rr.appendChild(install_rr_ul);
        root.appendChild(install_rr);

        const enabled_bp = document.createElement("section");
        enabled_bp.setAttribute("class","enabled-behavior-packs");
            const enabled_bp_header = document.createElement("h3");
            enabled_bp_header.textContent = "Enabled Behavior packs";
            enabled_bp.appendChild(enabled_bp_header);

            const enabled_bp_ul = document.createElement("ul");
            enabled_bp_ul.setAttribute("id",`E${btoa(this.active_level)}BP`);

            for(const content of world.world_behavior_packs){
                enabled_bp_ul.appendChild(this.createNewEnable("BP",content));
            }
            enabled_bp.appendChild(enabled_bp_ul);

        root.appendChild(enabled_bp);


        const enabled_rr = document.createElement("section");
        enabled_rr.setAttribute("class","enabled-resouce-packs");
            const enabled_rr_header = document.createElement("h3");
            enabled_rr_header.textContent = "Enabled Resouce packs";
            enabled_rr.appendChild(enabled_rr_header);

            const enabled_rr_ul = document.createElement("ul");
            enabled_rr_ul.setAttribute("id",`E${btoa(this.active_level)}RP`);

            for(const content of world.world_resource_packs){
                enabled_rr_ul.appendChild(this.createNewEnable("RP",content));
            }

            enabled_rr.appendChild(enabled_rr_ul);

        root.appendChild(enabled_rr);


        return root;
    }
}


export class FileUploader extends HTMLElement {
    constructor(){
        super();
    }
    connectedCallback(){
        const root = document.createElement("div");
        root.setAttribute("class","file-uploader");

        const input = document.createElement("div");
        input.setAttribute("class","mb-3");

            const label = document.createElement("label");
            label.setAttribute("for","forFile");
            label.setAttribute("class","form-label");
            label.textContent = this.getAttribute("data-text");

            const file = document.createElement("input");
            file.setAttribute("accept",".zip");
            file.setAttribute("class","form-control");
            file.setAttribute("type","file");
            file.setAttribute("id","formFile");

            input.appendChild(label);
            input.appendChild(file);

        root.appendChild(input);

        const btn = document.createElement("button");
        btn.setAttribute("class","btn btn-success");
        btn.setAttribute("type","button");
        btn.textContent = "Install";

        btn.addEventListener("click",()=>{
            if(file.files.length > 0){
                const reader = new FileReader();
                reader.addEventListener("load",(event)=>{
                    document.dispatchEvent(new CustomEvent(`INSTALL_${this.getAttribute("data-event")}`,{ detail: {
                        file: event.target.result
                    }}));
                    file.value = "";
                });
                reader.readAsArrayBuffer(file.files[0]);
            }else{
                console.error("NO FILE");
            }  
        });

        root.appendChild(btn);
        this.appendChild(root);
    }
}

export class EnablePack extends HTMLElement {
    constructor(){
        super();
    }
    connectedCallback(){
        const root = document.createElement("div");
        root.setAttribute("class","input-group mb-3");

        const input = document.createElement("input");
        input.setAttribute("type","text");
        input.setAttribute("class","form-control");
        input.setAttribute("placeholder",`Enable ${this.getAttribute("data-type")} pack (enter UUID)`);

        root.appendChild(input);


        const btn = document.createElement("button");
        btn.setAttribute("class","btn btn-success");
        btn.setAttribute("type","button");
        btn.textContent = "Enable";

        root.appendChild(btn);

        btn.addEventListener("click",()=>{
            document.dispatchEvent(new CustomEvent(`ENABLE_${this.getAttribute("data-event")}`,{detail: {pack_id: input.value}}));
            input.value = "";
        });

        this.appendChild(root);
    }
}