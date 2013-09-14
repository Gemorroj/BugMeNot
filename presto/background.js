function getTab () {
    return opera.extension.tabs.getFocused();
}

opera.contexts.toolbar.addItem(opera.contexts.toolbar.createItem({
    title: "BugMeNot",
    icon: "icons/icon18.png",
    disabled: false,
    popup: {
        href: "popup.html",
        width: 496,
        height: 500
    }
}));