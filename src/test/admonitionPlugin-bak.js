"use strict";


module.exports = function admonitionPlugin(md, options) {

    options = options || {};

    var minMarkers = 3,
        markerStr  = options.marker || "!",
        markerChar = markerStr.charCodeAt(0),
        markerLen  = markerStr.length,
        validate    = validateDefault,
        render      = renderDefault,
        type        = "",
        title       = null,
        types       = options.types || ["note", "abstract", "info", "tip", "success", "question", "warning", "failure", "danger", "bug", "example", "quote"];

    function renderDefault(tokens, idx, _options, env, self) {

        var token = tokens[idx];

        if (token.type === "admonition_open") {
            tokens[idx].attrPush([ "class", "admonition " + token.info ]);
        }

        else if (token.type === "admonition_title_open") {
            tokens[idx].attrPush([ "class", "admonition-title"]);
        }

        return self.renderToken(tokens, idx, _options, env, self);
    }

    function validateDefault(params){
        var array = params.trim().split(" ", 2);
        title = "";
        type = array[0];
        if (array.length > 1) {
            title = params.substring(type.length + 2);
        }

        if ( title === "" || !title ) {
            title = type;
        }

        return types.includes(type);
    }
    console.info("admon start")

    function admonition(state, startLine, endLine, silent) {
        var pos, nextLine, markerCount, markup, params, token,
            oldParent, oldLineMax,
            autoClosed = false,
            start = state.bMarks[startLine] + state.tShift[startLine],
            max = state.eMarks[startLine];
        console.info("state")
        console.info(state)
        // Check out the first character quickly,
        // this should filter out most of non-containers
        //
        if (markerChar !== state.src.charCodeAt(start)) { return false; }

        // Check out the rest of the marker string
        //
        for (pos = start + 1; pos <= max; pos++) {
            if (markerStr[(pos - start) % markerLen] !== state.src[pos]) {
                break;
            }
        }

        markerCount = Math.floor((pos - start) / markerLen);
        if (markerCount < minMarkers) { return false; }
        pos -= (pos - start) % markerLen;

        markup = state.src.slice(start, pos);
        params = state.src.slice(pos, max);
        if (!validate(params)) { return false; }

        // Since start is found, we can report success here in validation mode
        //
        if (silent) { return true; }

        // Search for the end of the block
        //
        nextLine = startLine;

        for (;;) {
            nextLine++;
            if (nextLine >= endLine) {
                // unclosed block should be autoclosed by end of document.
                // also block seems to be autoclosed by end of parent
                break;
            }

            start = state.bMarks[nextLine] + state.tShift[nextLine];
            max = state.eMarks[nextLine];

            if (start < max && state.sCount[nextLine] < state.blkIndent) {
                // non-empty line with negative indent should stop the list:
                // - ```
                //  test
                break;
            }

            if (markerChar !== state.src.charCodeAt(start)) { continue; }

            if (state.sCount[nextLine] - state.blkIndent >= 4) {
                // closing fence should be indented less than 4 spaces
                continue;
            }

            for (pos = start + 1; pos <= max; pos++) {
                if (markerStr[(pos - start) % markerLen] !== state.src[pos]) {
                    break;
                }
            }

            // closing adminition fence must be at least as long as the opening one
            if (Math.floor((pos - start) / markerLen) < markerCount) { continue; }

            // make sure tail has spaces only
            pos -= (pos - start) % markerLen;
            pos = state.skipSpaces(pos);

            if (pos < max) { continue; }

            // found!
            autoClosed = true;
            break;
        }

        oldParent = state.parentType;
        oldLineMax = state.lineMax;
        state.parentType = "admonition";

        // this will prevent lazy continuations from ever going past our end marker
        state.lineMax = nextLine;

        token        = state.push("admonition_open", "div", 1);
        token.markup = markup;
        token.block  = true;
        token.info   = type;
        token.map    = [ startLine, nextLine ];

        // admonition title
        token        = state.push("admonition_title_open", "p", 1);
        token.markup = markup + " " + type;
        token.map    = [ startLine, nextLine ];

        token          = state.push("inline", "", 0);
        token.content  = title;
        token.map      = [ startLine, state.line - 1 ];
        token.children = [];

        token        = state.push("admonition_title_close", "p", -1);
        token.markup = markup + " " + type;

        state.md.block.tokenize(state, startLine + 1, nextLine);

        token        = state.push("admonition_close", "div", -1);
        token.markup = state.src.slice(start, pos);
        token.block  = true;

        state.parentType = oldParent;
        state.lineMax = oldLineMax;
        state.line = nextLine + (autoClosed ? 1 : 0);

        token          = state.push("inline", "", 0);
        var result = title;
        console.log(result);
        var patt = /^\u0009/;
        if(patt.test(result)){
            result = result.replace(patt, '&nbsp;&nbsp;&nbsp;&nbsp;');
            console.log("1:"+result);
            var patt_next = /&nbsp;\u0009/;
            while(patt_next.test(result)){
                result = result.replace(patt_next,"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
                console.log("next:"+result);
            }
        }
        console.log("result:"+result);

        token.content  = result + "突突突";
        token.map      = [ startLine, state.line - 1 ];
        token.children = [];

        return true;
    }

    md.block.ruler.before("code", "admonition", admonition, {
        alt: ["paragraph", "reference", "blockquote", "list" ]
    });
    md.renderer.rules["admonition_open"] = render;
    md.renderer.rules["admonition_title_open"] = render;
    md.renderer.rules["admonition_title_close"] = render;
    md.renderer.rules["admonition_close"] = render;
};



/*
    md.renderer.rules.html_inline = function (tokens, idx, options, env, self) {
        const token = tokens[idx];
        console.info("begin:")
        console.info(tokens)
        console.info(token.content)
        console.info(idx)

        var result = token.content;
        let rg = /^\u0009/;
        let match = result.match(rg);
        //这个不行，没有获取到 tab 键, 去除了 符号！！ klb 2023年03月06日19:34:11

        if (match && match.length) {
            result = result.replace(rg, '&nbsp;&nbsp;&nbsp;&nbsp;');
            console.log("1:"+result);
            var patt_next = /&nbsp;\u0009/;
            while(patt_next.test(result)){
                result = result.replace(patt_next,"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
                console.log("next:"+result);
            }
        }
        console.log("result:"+result);

        return result;

        // let name = null, date = null;
        // for (let i = idx + 1; i < tokens.length; i++) {
        //     console.info(!tokens[i].children)
        //
        //     if(!tokens[i].children){
        //         continue;
        //     }
        //     for (const child of tokens[i].children) {
        //         console.info("child:")
        //         console.info(child.content);
        //         return child.content;
        //         if (child.type !== 'text') {
        //             continue;
        //         }
        //
        //     }
        // }
    }*/

/*
md.block.ruler.before('paragraph', 'admonition', function (state,startLine,endLine) {
    // console.info("state")
    console.info(state)
    // for(var token : state.){

    var ch, level, tmp, token,
        pos = state.bMarks[startLine] + state.tShift[startLine],
        max = state.eMarks[startLine];
    if (pos >= max) { return false; }

    let text = state.src.substring(pos, max);
    console.info(text)
    let rg = /^\u0009/;
    let match = text.match(rg);
    if (match && match.length) {
        var result = text.replace(rg, '&nbsp;&nbsp;&nbsp;&nbsp;');
        console.log("1:"+result);
        var patt_next = /&nbsp;\u0009/;
        while(patt_next.test(result)){
            result = result.replace(patt_next,"&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
            console.log("next:"+result);
        }
        var token = state.push('heading_open', 'text', 1);
        token.markup = '@';
        token.map = [ startLine, state.line ];
        token = state.push('inline', '', 0);
        token.content = result;
        token.map = [ startLine, state.line ];
        token.children = [];
        token = state.push('heading_close', 'text', -1);
        token.markup = '@';
        state.line = startLine + 1;
        return true;
    }

})*/
