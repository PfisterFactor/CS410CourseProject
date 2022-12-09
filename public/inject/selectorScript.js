class DomOutline {
    opts = {}
    keyCodes = {
        BACKSPACE: 8,
        ESC: 27,
        DELETE: 46
    }
    active = false
    initialized = false
    elements = {}
    element = null
    constructor(options) {
        this.opts = {
            namespace: options.namespace || 'DomOutline',
            borderWidth: options.borderWidth || 2,
            onClick: options.onClick || false,
            filter: options.filter || false
        }
    }

    writeStylesheet(css) {
        const element = document.createElement('style');
        element.type = 'text/css';
        document.getElementsByTagName('head')[0].appendChild(element);

        if (element.styleSheet) {
            element.styleSheet.cssText = css; // IE
        } else {
            element.innerHTML = css; // Non-IE
        }
    }

    initStylesheet() {
        if (this.initialized !== true) {
            const css = '' +
                '.' + this.opts.namespace + ' {' +
                '    background: #09c;' +
                '    position: absolute;' +
                '    z-index: 9999999998;' +
                '    padding: 0 !important;' +
                '}' +
                '.' + this.opts.namespace + '_label {' +
                '    background: #09c;' +
                '    border-radius: 2px;' +
                '    color: #fff;' +
                '    font: bold 12px/12px Helvetica, sans-serif;' +
                '    padding: 4px 6px;' +
                '    position: absolute;' +
                '    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);' +
                '    z-index: 9999999999;' +
                '}';

            this.writeStylesheet(css);
            this.initialized = true;
        }
    }

    createOutlineElements() {
        this.elements.label = jQuery('<div></div>').addClass(this.opts.namespace + '_label').appendTo('body');
        this.elements.top = jQuery('<div></div>').addClass(this.opts.namespace).appendTo('body');
        this.elements.bottom = jQuery('<div></div>').addClass(this.opts.namespace).appendTo('body');
        this.elements.left = jQuery('<div></div>').addClass(this.opts.namespace).appendTo('body');
        this.elements.right = jQuery('<div></div>').addClass(this.opts.namespace).appendTo('body');
    }

    removeOutlineElements() {
        jQuery.each(this.elements, function (name, element) {
            element.remove();
        });
    }

    compileLabelText(element, width, height) {
        var label = element.tagName.toLowerCase();
        if (element.id) {
            label += '#' + element.id;
        }
        if (element.className) {
            label += ('.' + jQuery.trim(element.className).replace(/ /g, '.')).replace(/\.\.+/g, '.');
        }
        return label + ' (' + Math.round(width) + 'x' + Math.round(height) + ')';
    }

    getScrollTop() {
        if (!this.elements.window) {
            this.elements.window = jQuery(window);
        }
        return this.elements.window.scrollTop();
    }

    updateOutlinePosition(e) {
        if (e.target.className.indexOf(this.opts.namespace) !== -1) {
            return;
        }
        if (this.opts.filter) {
            if (!jQuery(e.target).is(this.opts.filter)) {
                return;
            }
        }
        let bodyRect = document.body.getBoundingClientRect()
        this.element = e.target;
        const b = this.opts.borderWidth;
        const scroll_top = this.getScrollTop();
        const pos = this.element.getBoundingClientRect();
        const top = pos.top + scroll_top;
        const left = pos.left;

        const label_text = this.compileLabelText(this.element, pos.width, pos.height);
        const label_top = Math.max(0, top - 20 - b, scroll_top);
        const label_left = Math.max(0, left - b);

        this.elements.label.css({ top: label_top, left: label_left }).text(label_text);
        this.elements.top.css({ top: Math.max(0, top - b), left: left - b, width: pos.width + b, height: b });
        this.elements.bottom.css({ top: top + pos.height, left: left - b, width: pos.width + b, height: b });
        this.elements.left.css({ top: top - b, left: Math.max(0, left - b), width: b, height: pos.height + b });
        this.elements.right.css({ top: top - b, left: left + pos.width, width: b, height: pos.height + (b * 2) });
    }

    stopOnEscape(e) {
        if (e.keyCode === this.keyCodes.ESC || e.keyCode === this.keyCodes.BACKSPACE || e.keyCode === this.keyCodes.DELETE) {
            this.stop();
        }

        return false;
    }

    clickHandler(e) {
        this.stop();
        this.opts.onClick(this.element);

        return false;
    }

    start() {
        console.log("starting selection");
        this.initStylesheet();
        if (this.active !== true) {
            this.active = true;
            this.createOutlineElements();
            jQuery('body').on('mousemove.' + this.opts.namespace, (e) => this.updateOutlinePosition(e));
            jQuery('body').on('keyup.' + this.opts.namespace, (e) => this.stopOnEscape(e));
            if (this.opts.onClick) {
                setTimeout(() => {
                    jQuery('body').on('click.' + this.opts.namespace, (e) => {
                        if (this.opts.filter) {
                            if (!jQuery(e.target).is(this.opts.filter)) {
                                return false;
                            }
                        }
                        this.clickHandler(e);
                    });
                }, 50);
            }
        }
    }

    stop() {
        console.log("stopping selection")
        this.active = false;
        this.removeOutlineElements();
        jQuery('body').off('mousemove.' + this.opts.namespace)
            .off('keyup.' + this.opts.namespace)
            .off('click.' + this.opts.namespace);
    }

}

// Prevent navigating away inside the iframe
document.addEventListener("beforeunload", (e) => { e.preventDefault(); return false; });
Array.from(document.getElementsByTagName("a")).forEach(e => e.href = "javascript:void(0);");
window.sendEventFromParent = (event, data) => onEventFromParent(event, data);
window.DomOutliner = new DomOutline({ onClick: (e) => sendEventToParent("ELEMENT_CLICKED", e) });
sendEventToParent("SCRIPT_LOADED");
function defer(method) {
    if (window.jQuery) {
        method()
    }
    else {
        setTimeout(() => defer(method), 50);
    }
}
function onEventFromParent(event, data = null) {
    switch (event) {
        case "START_SELECTION":
            defer(() => window.DomOutliner.start());
            break;
        case "STOP_SELECTION":
            defer(() => window.DomOutliner.stop());
            window.myDomOutline = null;
            break;
    }
}

function sendEventToParent(event, data = null) {
    parent?.window?.ChildIFrameEventHandler(event, data);
}
