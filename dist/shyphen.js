class ZoonTable extends HTMLElement {
    render() {
        let json = window[this.getAttribute('src')];
        let cols = Object.keys(json[0]);
        let headerRow = cols
            .map(col => `<th>${col}</th>`)
            .join("");
        let rows = json
            .map(row => {
            let tds = cols.map(col => `<td>${row[col]}</td>`).join("");
            return `<tr>${tds}</tr>`;
        })
            .join("");
        const table = `
    <table>
      <thead>
        <tr>${headerRow}</tr>
      <thead>
      <tbody>
        ${rows}
      <tbody>
    <table>`;
        this.innerHTML = table;
        console.log('z-table', '#2fc4de', `Built table`);
    }
    connectedCallback() {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }
    static get observedAttributes() {
        return ['src'];
    }
}
class ZoonButton extends HTMLElement {
    setup() {
        this.actiom = this.getAttribute('action');
        this.target = this.getAttribute('target');
        this.addEventListener('click', function () {
            this.run();
        }, false);
    }
    run() {
        console.log('button pressed');
        let target = $q(this.target);
    }
    connectedCallback() {
        if (!this.rendered) {
            this.setup();
            this.rendered = true;
        }
    }
    update() {
        this.actiom = this.getAttribute('action');
        this.target = this.getAttribute('target');
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.update();
    }
    static get observedAttributes() {
        return ['action', 'target'];
    }
}
class ZoonURLInput extends HTMLElement {
    connectedCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const source = this.getAttribute('src');
        const key = this.getAttribute('key');
        const queryValue = urlParams.get(key);
        let fetchme;
        if (queryValue === null) {
            return;
        }
        else {
            fetchme = source + queryValue + '.html';
            fetch(fetchme)
                .then(response => response.text())
                .then(text => {
                this.innerHTML = text;
            });
        }
        console.log(`query is ${queryValue}`);
    }
}
class ZoonInsert extends HTMLElement {
    connectedCallback() {
        const output = $q('z-insert');
        const input = $q(this.getAttribute('input'));
        while (input.childNodes.length > 0) {
            output.appendChild(input.childNodes[0]);
        }
        input.remove();
    }
}
class ZoonCards extends HTMLElement {
    connectedCallback() {
        let tmpl = $q('#' + this.getAttribute('tmpl'));
        this.attachShadow({ mode: 'open' }).append(tmpl.content.cloneNode(true));
        let jsonsrc = this.getAttribute('json');
        fetch(jsonsrc)
            .then(response => response.json())
            .then(data => window[this.getAttribute('name')] = data)
            .catch(console.error);
    }
}
class ZoonClassToggle extends HTMLElement {
    connectedCallback() {
        this.firstClass = this.getAttribute('1');
        this.secondClass = this.getAttribute('2');
        this.input = this.getAttribute('input');
        this.target = $q('#' + this.getAttribute('target'));
        this.setup();
        this.addEventListener('click', function () {
            this.run();
        }, false);
    }
    setup() {
        if (window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches) {
            this.target.classList.add(`lightswitch-off`);
        }
        else {
            this.target.classList.add(`lightswitch-on`);
        }
    }
    run() {
        if (this.target.classList.contains(`lightswitch-off`)) {
            this.target.classList.remove(`lightswitch-off`);
            this.target.classList.add(`lightswitch-on`);
        }
        else {
            this.target.classList.remove(`lightswitch-on`);
            this.target.classList.add(`lightswitch-off`);
        }
    }
}
customElements.define("my-counter", class extends HTMLElement {
    count;
    constructor() {
        super()
            .attachShadow({ mode: "open" })
            .innerHTML =
            "<style>" +
                "*{font-size:200%}" +
                "span{width:4rem;display:inline-block;text-align:center}" +
                "button{width:4rem;height:4rem;border:none;border-radius:10px;background-color:seagreen;color:white}" +
                "</style>" +
                "<button onclick=this.getRootNode().host.dec()>-</button>" +
                "<span>0</span>" +
                "<button onclick=this.getRootNode().host.inc()>+</button>";
        this.count = 0;
    }
    inc() {
        this.update(++this.count);
    }
    dec() {
        this.update(--this.count);
    }
    update(count) {
        this.shadowRoot.querySelector("span").innerHTML = count;
    }
});
class ZoonClock extends HTMLElement {
    render() {
        this.innerHTML = `
    <z-time hour="numeric" minute="numeric" second="numeric">
    </z-time>
    `;
        this.timerElem = this.firstElementChild;
    }
    connectedCallback() {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
        this.timer = setInterval(() => this.update(), 1000);
    }
    update() {
        this.date = new Date();
        this.timerElem.setAttribute('datetime', this.date);
        this.dispatchEvent(new CustomEvent('tick', { detail: this.date }));
    }
    disconnectedCallback() {
        clearInterval(this.timer);
    }
}
customElements.define("z-time", class extends HTMLElement {
    render() {
        let date = new Date(this.getAttribute('datetime') || Date.now());
        this.innerHTML = new Intl.DateTimeFormat("default", {
            year: this.getAttribute('year') || undefined,
            month: this.getAttribute('month') || undefined,
            day: this.getAttribute('day') || undefined,
            hour: this.getAttribute('hour') || undefined,
            minute: this.getAttribute('minute') || undefined,
            second: this.getAttribute('second') || undefined,
            timeZoneName: this.getAttribute('time-zone-name') || undefined,
        }).format(date);
    }
    connectedCallback() {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
    static get observedAttributes() {
        return ['datetime', 'year', 'month', 'day', 'hour', 'minute', 'second', 'time-zone-name'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }
});
class ZoonFrame extends HTMLElement {
    constructor() {
        super();
        this.setup();
    }
    setup() {
        if (!this.hasAttribute('frame'))
            this.setAttribute('frame', 'default');
        if (!this.hasAttribute('src'))
            this.setAttribute('src', '/frames/');
    }
    render() {
        let frameDOM, currentFrame, frame, url, body;
        body = $q('body');
        this.frame = this.getAttribute('frame');
        currentFrame = frame;
        fetch(this.getAttribute('src') + this.getAttribute('frame') + '.html')
            .catch((err) => { zoon.log('Error fetching layout'); })
            .then(response => response.text())
            .then(text => {
            this.text = text;
            body.insertAdjacentHTML('beforeend', this.text);
        });
        zoon.log('z-frame', '#de922f', `Frame set to ${this.frame}`);
    }
    connectedCallback() {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
    static get observedAttributes() {
        return ['src', 'frame'];
    }
}
customElements.define("html-include", class extends HTMLElement {
    constructor() {
        super()
            .attachShadow({ mode: "open" })
            .innerHTML =
            "<style>" +
                "*{font-size:200%}" +
                "span{width:4rem;display:inline-block;text-align:center}" +
                "button{width:4rem;height:4rem;border:none;border-radius:10px;background-color:seagreen;color:white}" +
                "</style>" +
                "<button onclick=this.getRootNode().host.dec()>-</button>" +
                "<span>0</span>" +
                "<button onclick=this.getRootNode().host.inc()>+</button>";
        this.count = 0;
    }
    connectedCallback() {
        this.setFromSource();
    }
    setFromSource() {
        fetch(this.getAttribute('src'))
            .then(response => response.text())
            .then(text => {
            this.innerHTML = text;
        });
    }
    attributeChangedCallback(name, oldValue, newValue) {
        if (this.hasAttribute('src')) {
            this.setFromSource();
        }
        else if (this.hasAttribute('key')) {
            this.setFromURL();
        }
    }
    static get observedAttributes() {
        return ['src'];
    }
});
customElements.define("html-include-query", class extends HTMLElement {
    connectedCallback() {
        const urlParams = new URLSearchParams(window.location.search);
        const source = this.getAttribute('src');
        const key = this.getAttribute('key');
        const queryValue = urlParams.get(key);
        let fetchme;
        if (queryValue === null) {
            return;
        }
        else {
            fetchme = source + queryValue + '.html';
            fetch(fetchme)
                .then(response => response.text())
                .then(text => {
                this.innerHTML = text;
            });
        }
        console.log(`query is ${queryValue}`);
    }
});
customElements.define("html-include-path", class extends HTMLElement {
    rendered;
    render() {
        const urlParams = new URLSearchParams(window.location.search);
        const pathValue = window.location.pathname;
        const source = this.getAttribute('src');
        let fetchme;
        if (pathValue === '/') {
            fetchme = source + '/home.html';
        }
        else {
            fetchme = source + pathValue + '.html';
        }
        fetch(fetchme)
            .then(response => response.text())
            .then(text => {
            this.innerHTML = text;
        });
        console.log(`page is ${pathValue}`);
    }
    connectedCallback() {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
});
class ZoonLogo extends HTMLElement {
    connectedCallback() {
        let tag = this.getAttribute('tag');
        this.innerHTML = `<a href="https://zoon.vuw.nu">Zoon</a>`;
    }
}
class ZoonNavbar extends HTMLElement {
    connectedCallback() {
        this.setCurrentPage();
    }
    setCurrentPage() {
        let current_location = location.pathname;
        if (current_location === "/")
            return;
        let nav_items = this.getElementsByTagName("a");
        for (let i = 0, len = nav_items.length; i < len; i++) {
            if (nav_items[i].getAttribute("href").indexOf(current_location) !== -1) {
                nav_items[i].classList.add("current-page");
            }
        }
    }
    setupLinks() {
        let nav_items = this.getElementsByTagName("a");
        for (let i = 0, len = nav_items.length; i < len; i++) {
            if (nav_items[i].getAttribute("href").indexOf(current_location) !== -1) {
                nav_items[i].className = "current-page";
            }
        }
    }
}
class ZoonData extends HTMLElement {
    connectedCallback() {
        let self = this;
        let str = this.innerHTML;
        str = str.replace(/(\n)+/g, '", "').replace(/( = )+/g, '":"').slice(0, -3).slice(2);
        str = `{${str}}`;
        let finalString = JSON.parse(str);
        Object.assign(zdata, finalString);
        console.log(finalString);
        self.remove();
    }
}
class ZoonVariable extends HTMLElement {
    render() {
        let object = this.getAttribute('object');
        this.innerHTML = zdata[this.getAttribute('var')] || "";
    }
    connectedCallback() {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
}
class ZoonObject extends HTMLElement {
    connectedCallback() {
        this.setupObject();
    }
    setupObject() {
        const objectName = this.getAttribute('name');
        const src = this.getAttribute('src');
        fetch(src)
            .then(response => response.json())
            .then(data => window[this.getAttribute('name')] = data)
            .catch(console.error);
        console.log(`Created an object with the name ${objectName}`);
    }
}
class ZoonTemplate extends HTMLElement {
    render() {
        let tmpl = $q('#' + this.getAttribute('src'));
        this.attachShadow({ mode: 'open' }).append(tmpl.content.cloneNode(true));
    }
    connectedCallback() {
        if (!this.rendered) {
            this.render();
            this.rendered = true;
        }
    }
}
customElements.define("text-to-speech", class extends HTMLElement {
    voice;
    text;
    pitch;
    rate;
    run() {
        let msg = new SpeechSynthesisUtterance(this.text);
        let voices = window.speechSynthesis.getVoices();
        msg.voice = voices[0];
        msg.pitch = parseInt(this.pitch, 10);
        msg.rate = parseInt(this.rate, 10);
        window.speechSynthesis.speak(msg);
    }
    update() {
        this.text = this.getAttribute('input');
        this.voice = this.getAttribute('voice');
        this.pitch = this.getAttribute('pitch');
        this.rate = this.getAttribute('rate');
    }
    connectedCallback() {
        this.update();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.update();
    }
    static get observedAttributes() {
        return ['input', 'voice', 'pitch', 'rate'];
    }
});
class ZoonTitle extends HTMLElement {
    run() {
        let main = this.getAttribute('title') || "";
        let prepend = this.getAttribute('prepend') || "";
        let append = this.getAttribute('append') || "";
        let titleFull = `${prepend}${main}${append}`;
        document.title = titleFull;
        zoon.log('z-title', '#2f84de', `title set as ${titleFull}`);
    }
    connectedCallback() {
        this.run();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.run();
    }
    static get observedAttributes() {
        return ['title', 'prepend', 'append'];
    }
}
customElements.define("lorem-ipsum", class extends HTMLElement {
    constructor() {
        super();
    }
    static get observedAttributes() {
        return [''];
    }
    render() {
    }
});
