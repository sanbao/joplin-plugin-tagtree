"use strict";


module.exports = function admonitionPlugin(md, options) {

    /*md.core.ruler.after('inline', 'jks-github-task-lists', function (state) {
        var tokens = state.tokens;
        // ...
        // Just make the type checking happy
        console.log("-----------tokens")
        console.log(state)

        console.log(tokens)
        let result = ""
        for(var index in tokens){
            let token = tokens[index]

            let rg = /\n\t/;
            let ma = result.match(rg);
            if (ma && ma.length) {
                result = result.replace(rg, '\n&#8195;');
                console.log("1:" + result);
            }

            rg = /^\t/;
            result = token.content;
            ma = result.match(rg);
            if (ma && ma.length) {
                result = result.replace(rg, '&#8195;');
                console.log("2:" + result);
            }


            var patt_next = / \t/;
            while (patt_next.test(result)) {
                result = result.replace(patt_next, " &#8195;");
                console.log("next:" + result);
            }
            token.content = result;
        }

        return true;
    });*/

    /*md.block.ruler.after('paragraph','@header',function(state, startLine, endLine, silent){
        console.log(state,startLine,endLine,silent)
        var ch, level, tmp, token,
            pos = state.bMarks[startLine] + state.tShift[startLine],
            max = state.eMarks[startLine];
        console.log("state------",startLine,endLine,pos,max)
        console.log(JSON.parse(JSON.stringify(state)), startLine, endLine);
        let text = state.src.substring(pos, max);
        console.log(text);

        let result= text;
        let rg = /\n\t/;
        let ma = result.match(rg);
        if (ma && ma.length) {
            result = result.replace(rg, '\n    ');
            console.log("1:" + result);
        }

        rg = /^\t/;
        ma = result.match(rg);
        if (ma && ma.length) {
            result = result.replace(rg, '    ');
            console.log("2:" + result);
        }

        var patt_next = / \t/;
        while (patt_next.test(result)) {
            result = result.replace(patt_next, "     ");
            console.log("next:" + result);
        }

        token = state.push('text', '', 0);
        token.content = text + "-----";
        token.map = [startLine, state.line];
        token.children = [];


        //这是为了进入到下一行的遍历之中。
        state.line = startLine + 1;
        //如果返回true 会跳过其他规则
        // return true
    })*/

    md.core.ruler.before("block","tabtotab",function (state){
        console.log("state tabtotab------")
        console.log(state)
        var result = state.src;
        let rg = /\u0009/g;
        let match = result.match(rg);
        if (match && match.length) {
            result = result.replace(rg, '&nbsp;&nbsp;&nbsp;&nbsp;');
            console.log("1:" + result);
        }
         rg = /\n\t/g;
         match = result.match(rg);
        if (match && match.length) {
            result = result.replace(rg, '\n&nbsp;&nbsp;&nbsp;&nbsp;');
            console.log("2:" + result);
        }
        rg = /\t/g;
        match = result.match(rg);
        if (match && match.length) {
            result = result.replace(rg, '&nbsp;&nbsp;&nbsp;&nbsp;');
            console.log("3:" + result);
        }

        if (true) {
            result = result.replaceAll('    ', '&nbsp;&nbsp;&nbsp;&nbsp;');
            console.log("4:" + result);
        }
        state.src = result

    })

    /*md.block.ruler.before('code','@headerer',function(state, startLine, endLine, silent){
        var ch, level, tmp, token,
            pos = state.bMarks[startLine] + state.tShift[startLine],
            max = state.eMarks[startLine];
        console.log("state new0------")
        console.log(state)
        console.log(JSON.parse(JSON.stringify(state)), startLine, endLine);
        let text = state.src.substring(pos, max);
        console.log(text);


        let rg = /^\u0009/;
        let match = text.match(rg);
        if (match && match.length) {
            var result = text.replace(rg, '&nbsp;&nbsp;&nbsp;&nbsp;');
            console.log("1:" + result);
            var patt_next = /&nbsp;\u0009/;
            while (patt_next.test(result)) {
                result = result.replace(patt_next, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
                console.log("next:" + result);
            }
            token = state.push('text', '', 0);
            token.content = text + "-----";
            token.map = [startLine, state.line];
            token.children = [];
        }else{
            return false;
        }


        //这是为了进入到下一行的遍历之中。
        state.line = startLine + 1;
        return true
    })*/
};
