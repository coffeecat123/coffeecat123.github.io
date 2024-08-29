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
        if (window.parent && window.parent !== window) {
            window.parent.postMessage('REMOVE_IFRAME', '*');
            console.log('removed iframe');
        }
    };
    p.onclick = () => {
        if (w) {
            txt.style.whiteSpace = "pre-wrap";
        } else {
            txt.style.whiteSpace = "pre";
        }
        w ^= 1;
    };

    big.onclick = () => {
        font_size += 2;
        txt.style.fontSize = font_size + "px";
    }
    sml.onclick = () => {
        font_size -= 2;
        txt.style.fontSize = font_size + "px";
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
    }, false);
    window.addEventListener('message', function (e) {
        txt.value = e.data;
    });
};