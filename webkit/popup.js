function castVote (site, account, vote) {
    var val = document.getElementById("account" + account);
    var img = document.createElement("img");
    img.src = "loader.gif";
    img.alt = "Wait...";
    val.appendChild(img);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            val.removeChild(img);
            val.appendChild(document.createTextNode("Ok"));
        } else if (xmlhttp.readyState >= 4) {
            val.removeChild(img);
            val.appendChild(document.createTextNode("Error"));
        }
    };
    xmlhttp.open("GET", 'http://www.bugmenot.com/vote_ajax.php?id=' + account + '&site=' + site + '&vote=' + vote, false);
    xmlhttp.send(null);
}

window.addEventListener('DOMContentLoaded', function () {
    function castVoteHandler (e) {
        var element = e.target;
        castVote(
            element.getAttribute('data-site'),
            element.getAttribute('data-account'),
            element.getAttribute('data-vote')
        );
        element.disabled = true;
        element.style.backgroundColor = '#CCCCCC';

        e.preventDefault();
        return false;
    }
    function castVoteParser (element) {
        // castVote(187442, 3938438, 'Y')
        var onclick = element.getAttribute('onclick');
        element.removeAttribute('onclick');
        var onclickParsed = onclick.replace('castVote(', '').replace(')', '').replace(/'/g, '');
        onclickParsed = onclickParsed.split(', ');

        element.setAttribute('data-site', onclickParsed[0]);
        element.setAttribute('data-account', onclickParsed[1]);
        element.setAttribute('data-vote', onclickParsed[2]);
    }



    var key;

    function decoder(strInput) {
        strInput = window.atob(strInput);
        var strOutput = "", intOffset = (key + 112) / 12;
        for (var i = 4, l = strInput.length; i < l; i++) {
            strOutput += String.fromCharCode(strInput.charCodeAt(i) - intOffset);
        }
        return strOutput;
    }

    function getContent(url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                //FIXME: теперь это не XML
                return callback(parseContent(xmlhttp.responseXML));
            } else if (xmlhttp.readyState == 4 && xmlhttp.status == 404) {
                return callback('Not Found');
            } else if (xmlhttp.readyState >= 4) {
                return callback('Error!<br />URL: ' + url + '<br />Status: ' + xmlhttp.status);
            }
        };
        xmlhttp.overrideMimeType('application/xml');
        xmlhttp.open("GET", url, false);
        xmlhttp.send(null);
    }

    function parseContent(xml) {
        key = Number(xml.querySelectorAll("script")[1].innerText.replace(/[^0-9-]/g, ''));
        var form = xml.querySelector("div.panel.minor");
        var nodes = form.querySelectorAll("form");
        for (var i = 0, l = nodes.length; i < l; i++) {
            nodes[i].action = "#";
        }
        return form.innerHTML.replace(/<script>d\('(.+)'\);<\/script>/g, function (str, p1) {
            return decoder(p1);
        });
    }

    chrome.tabs.query({"active": true}, function (tabs) {
        var tab = tabs[0], win;
        if (tab && tab.url && (win = tab.url.split("/")[2])) {
            getContent('http://bugmenot.com/view/' + win, function (text) {
                document.getElementById("val").innerHTML = text;

                var votes = document.querySelectorAll("input[type='submit'][name='vote']");
                for (var i = 0, l = votes.length; i < l; ++i) {
                    var item = votes[i];
                    castVoteParser(item);
                    item.addEventListener("click", castVoteHandler);
                }
            });
        } else {
            document.getElementById("val").innerHTML = "Error";
        }
    });
});
