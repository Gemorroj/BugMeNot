window.addEventListener('DOMContentLoaded', function () {
    function getContent(url, callback) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var text = xmlhttp.responseText;
                var dom = (new DOMParser()).parseFromString(text, "text/html");

                return callback(parseContent(dom));
            } else if (xmlhttp.readyState == 4 && xmlhttp.status == 404) {
                return callback('Not Found');
            } else if (xmlhttp.readyState >= 4) {
                return callback('Error!<br />URL: ' + url + '<br />Status: ' + xmlhttp.status);
            }
        };
        xmlhttp.overrideMimeType('text/html');
        xmlhttp.open("GET", url, false);
        xmlhttp.send(null);
    }

    function parseContent(domNode) {
        var outText = '';
        var articles = domNode.querySelectorAll('article');

        [].forEach.call(articles, function (article) {
            article.querySelector('form').remove();
            outText += '<article class="account">' + article.innerHTML + '</article>';
        });

        return outText;
    }

    chrome.tabs.query({"active": true}, function (tabs) {
        var tab = tabs[0], win;
        if (tab && tab.url && (win = tab.url.split("/")[2])) {
            getContent('http://bugmenot.com/view/' + win, function (text) {
                document.getElementById("content").innerHTML = text;
            });
        } else {
            document.getElementById("content").innerHTML = "Error";
        }
    });
});
