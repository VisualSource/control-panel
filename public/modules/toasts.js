export class ToastContainer extends HTMLElement {
    constructor(){
        super();
        this.classList = "toast-container";
        document.addEventListener("new-toat",(ev)=>{
            this.generateToast(ev.detail.type,ev.detail.message);
        });
    }
    generateToast(type,msg){
        const toast = document.createElement("div");
        toast.setAttribute("role","alert");
        toast.setAttribute("class","toast");
        toast.setAttribute("aria-atomic","true");
        toast.setAttribute("aria-live","assertive");
            const toast_headler = document.createElement("div");
            toast_headler.setAttribute("class","toast-header");
                const img = document.createElement("img");
                img.setAttribute("src","favicon.jpg");
                img.setAttribute("class","rounded me-2 small-img");
                img.setAttribute("alt","icon");
                toast_headler.appendChild(img);
                const strong = document.createElement("strong");
                strong.setAttribute("class","me-auto");
                strong.textContent = type;
                toast_headler.appendChild(strong);
                const small = document.createElement("small");
                small.setAttribute("class","text-muted");
                small.textContent = "just now";
                toast_headler.appendChild(small);
                const btn = document.createElement("button");
                btn.setAttribute("type","button");
                btn.setAttribute("class","btn-close");
                btn.setAttribute("data-bs-dismiss","toast");
                btn.setAttribute("aria-label","Close");
                toast_headler.appendChild(btn);
        toast.appendChild(toast_headler);

            const body = document.createElement("div");
            body.setAttribute("class","toast-body");
            body.textContent = msg;
        toast.appendChild(body);

        
        const inst = new bootstrap.Toast(toast, {animation: true, autohide: true, delay: 5000});
        inst.show();
        toast.addEventListener("hidden.bs.toast",()=>{
            inst.dispose();
            toast.remove();
        });
        this.appendChild(toast);
    }
}


