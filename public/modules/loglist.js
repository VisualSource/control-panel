export class LogList extends HTMLDivElement {
    connectedCallback(){
        this.fetchContent();
    }
    async fetchContent(){
        try {
            const data = await (await fetch(`${window.location.origin}/logs`)).json();

            const root = this.querySelector("main");
            for (const item of data) {
                const el = this.createLogElement(item);
                root.appendChild(el);
            }
        } catch (error) {
            console.error(error)
            document.dispatchEvent(new CustomEvent(`new-toat`,{detail: {type: "Error", message: "There was an error attempting to get server logs"}})); 
        }
    }
    createLogElement({date, name, content}){
        const root = document.createElement("details");

        const sum = document.createElement("summary");
            const date_text = document.createElement("code");
            date_text.textContent = date;
            sum.appendChild(date_text);
            sum.insertAdjacentText("beforeend",name);
        root.appendChild(sum);


        const cont = document.createElement("p");
        cont.innerHTML = content;

        root.appendChild(cont);

        return root;
    }
}