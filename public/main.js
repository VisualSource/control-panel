import {WorldMannager, FileUploader, EnablePack} from './modules/world_manager.js';
import {ActiveServerStatus,ActivePlayerCount, ServerControlBtn} from './modules/server_control.js';
import {ServerConsole} from './modules/server_console.js';
import {Socket} from './modules/socket_handler.js';
import {Route,RouteHandler,RouteLink} from './modules/routes.js';
import {ServerProps} from './modules/server_props.js';
import {ListAddHandler,ListHandler,WhiteListItem,PermissionItem} from './modules/lists.js';
import {ToastContainer} from './modules/toasts.js';
import {AppMannager} from './modules/app_settings.js';
import {LogList} from './modules/loglist.js';
new Socket();
new Route();



customElements.define("app-mannager",AppMannager, { extends:"div" });
customElements.define("toast-container",ToastContainer);
customElements.define("server-console",ServerConsole,{extends:"div"});
customElements.define("control-btn",ServerControlBtn,{extends:"button"});
customElements.define("player-count",ActivePlayerCount);
customElements.define("server-status",ActiveServerStatus);
customElements.define("logger-list",LogList,{extends: "div"});
customElements.define("enable-pack",EnablePack);
customElements.define("file-uploader",FileUploader);
customElements.define("world-mannager",WorldMannager,{extends:"div"});
customElements.define("add-button",ListAddHandler);
customElements.define("remote-list",ListHandler)
customElements.define("perm-li",PermissionItem);
customElements.define("whitelist-li",WhiteListItem);
customElements.define("server-props",ServerProps,{extends:"div"});
customElements.define("route-link",RouteLink);
customElements.define("route-handler",RouteHandler);

/*
navigator.serviceWorker.register('sw.js',{scope:"/"})
.then(function(registration) {
    console.log("Service Worker Registered!");
}).catch(function(err) {
    console.log("Service Worker not registered!", err);
});*/