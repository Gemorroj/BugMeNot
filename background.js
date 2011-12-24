function getTab () {
    return opera.extension.tabs.getFocused();
}

opera.contexts.toolbar.addItem(opera.contexts.toolbar.createItem({
    title: "Find logins/passwords for websites that force you to register.",
    icon: "icons/icon18.png",
    disabled: false,
    popup: {
        href: "popup.html",
        width: 400,
        height: 500
    }
}));