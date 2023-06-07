"use strict";


module.exports = function admonitionPlugin(md, options) {

    md.core.ruler.before('inline', 'jks-github-task-lists', function (state) {
        const tokens = state.tokens;
        console.info(tokens)
        // ...
        // Just make the type checking happy
        return true;
    });


    md.renderer.rules.paragraph_open = function (tokens, idx, options, env, self) {
        const tokeni = tokens[idx];
        console.info("begin:")
        console.info(tokens)
        console.info(tokeni.content)
        console.info(idx)

        /*for(var index in tokens) {
            let token = tokens[index]
            var result = token.content;
            let rg = /\n\t/;
            let ma = result.match(rg);
            if (ma && ma.length) {
                result = result.replace(rg, '\n    ');
                console.log("1:" + result);
            }

            rg = /^\t/;
            result = token.content;
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

            token.content = result;
        }*/


        return "";

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
    }
}
