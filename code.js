var dg = function(id) {
        return document.getElementById(id);
    },
    btnEl = dg('btn'),
    nameEl = dg('name'),
    txtEl = dg('txt');

btnEl.onclick = function() {
    download(nameEl.value, txtEl.value);
}

function download(filename, text) {
    var pom = document.createElement('a');
    pom.setAttribute(
        'href',
        'data:application/download;charset=utf-8,' + encodeURIComponent(text)
    );
    pom.setAttribute('download', filename);

    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        pom.dispatchEvent(event);
    } else {
        pom.click();
    }
}

//download('responsive.css', 'Hello world!');
