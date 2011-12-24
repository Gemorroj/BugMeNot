window.addEventListener('DOMContentLoaded', function () {
    var key;

    function decoder (strInput) {
        strInput = window.atob(strInput);
        var strOutput = "", intOffset = (key + 112) / 12;
        for (var i = 4, l = strInput.length; i < l; i++) {
            strOutput += String.fromCharCode(strInput.charCodeAt(i) - intOffset)
        }
        return strOutput;
    }

    function getContent (url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                return callback(parseContent(xmlhttp.responseXML));
            } else if (xmlhttp.readyState == 4 && xmlhttp.status == 404) {
                return callback('Not Found');
            } else if (xmlhttp.readyState >= 4) {
                return callback('Error!<br />URL: ' + url + '<br />Status: ' + xmlhttp.status);
            }
        };
        xmlhttp.open("GET", url, false);
        xmlhttp.send(null);
    }

    function parseContent (xml) {
        key = Number(xml.querySelectorAll("script")[1].innerText.replace(/[^0-9-]/g, ''));

        var form = xml.querySelector("div.panel.minor");
        var nodes = form.querySelectorAll("form");
        for (var i = 0, l = nodes.length; i < l; i++) {
            nodes[i].parentNode.removeChild(nodes[i]);
        }

        return form.innerHTML.replace(/<script>d\('(.+)'\);<\/script>/g, function (str, p1) {
            return decoder(p1);
        });
    }

    var tab = opera.extension.bgProcess.getTab(), win;
    if (tab && tab.url && (win = tab.url.split("/")[2])) {
        getContent('http://www.bugmenot.com/view/' + win, function (text) {
            document.getElementById("val").innerHTML = text;
        });
    } else {
        document.getElementById("val").innerHTML = "=)";
    }
}, false);