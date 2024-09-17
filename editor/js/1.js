const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
window.onload = function () {
    var font_size = 20;
    let w = 1;
    var p = $("#pre");
    var txt = $("#txt");
    var ok = $("#ok");
    var big = $("#big");
    var sml = $("#sml");

    txt.style.fontSize = font_size + "px";

    ok.onclick = () => {
        if (window.self !== window.top) {
            window.parent.postMessage('REMOVE_IFRAME', '*');
        }
    };
    p.onclick = () => {
        if (w) {
            txt.style.whiteSpace = "pre-wrap";
        } else {
            txt.style.whiteSpace = "pre";
        }
        w ^= 1;
        saveTextareaContent();
    };

    big.onclick = () => {
        font_size += 2;
        txt.style.fontSize = font_size + "px";
        saveTextareaContent();
    }
    sml.onclick = () => {
        font_size -= 2;
        txt.style.fontSize = font_size + "px";
        saveTextareaContent();
    }
    txt.addEventListener('keydown', function (e) {
        if (e.keyCode === 9) {
            var start = this.selectionStart;
            var end = this.selectionEnd;

            var target = e.target;
            var value = target.value;

            target.value = value.substring(0, start)
                + "\t"
                + value.substring(end);
            this.selectionStart = this.selectionEnd = start + 1;
            e.preventDefault();
        }
        saveTextareaContent();
    }, false);
    /*
    window.addEventListener('message', function (e) {
        txt.value = e.data;
    });
    */
    const dbName = 'cftDB';
    const storeName = 'txt';
    let db;

    // 打开或创建数据库
    const openRequest = indexedDB.open(dbName, 1);

    openRequest.onupgradeneeded = (event) => {
        db = event.target.result;
        // 创建对象存储（Object Store），主键为 'id'
        if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
        }
    };

    openRequest.onsuccess = (event) => {
        db = event.target.result;
        console.log('Database opened successfully');
        // 尝试从数据库中加载内容
        loadTextareaContent();
    };

    openRequest.onerror = (event) => {
        console.error('Error opening database:', event.target.error);
    };

    // 保存数据到 IndexedDB
    function saveTextareaContent() {
        const transaction = db.transaction([storeName], 'readwrite');
        const store = transaction.objectStore(storeName);

        store.put({ id: 1, content:txt.value ,font_size,w});
    }

    // 从 IndexedDB 加载数据到 textarea
    function loadTextareaContent() {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(1);

        request.onsuccess = (event) => {
            if (event.target.result) {
                const data = event.target.result;
                txt.value = data.content;
                w = data.w;
                font_size = data.font_size;
                txt.style.fontSize = font_size + "px";
                if (!w) {
                    txt.style.whiteSpace = "pre-wrap";
                } else {
                    txt.style.whiteSpace = "pre";
                }
            }
        };

        request.onerror = (event) => {
            console.error('Error loading content:', event.target.error);
        };
    }
};