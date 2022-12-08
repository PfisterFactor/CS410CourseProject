export function GenerateCSSSelector(element: any) {
    let index, pathSelector, localName;

    if (element == "null") throw "not an dom reference";
    // call getIndex function
    index = getIndex(element);

    while (element.tagName) {
        // selector path
        pathSelector = element.localName + (pathSelector ? ">" + pathSelector : "");
        element = element.parentNode;
    }
    // selector path for nth of type
    pathSelector = pathSelector + `:nth-of-type(${index})`;
    return pathSelector;
}

// get index for nth of type element
function getIndex(node:any) {
    let i = 1;
    let tagName = node.tagName;

    while (node.previousSibling) {
        node = node.previousSibling;
        if (
            node.nodeType === 1 &&
            tagName.toLowerCase() == node.tagName.toLowerCase()
        ) {
            i++;
        }
    }
    return i;
}