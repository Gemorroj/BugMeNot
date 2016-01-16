window.addEventListener('DOMContentLoaded', function () {
    function getContent(url, callback) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = function () {
            if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                var text = xmlHttp.responseText;
                var dom = (new DOMParser()).parseFromString(text, "text/html");
                var str = parseContent(dom);

                return callback(str);
            } else if (xmlHttp.readyState == 4 && xmlHttp.status == 404) {
                return callback('Not Found');
            } else if (xmlHttp.readyState >= 4) {
                return callback('Error!<br />URL: ' + url + '<br />Status: ' + xmlHttp.status);
            }
        };
        xmlHttp.overrideMimeType('text/html');
        xmlHttp.open("GET", url, false);
        xmlHttp.send(null);
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
