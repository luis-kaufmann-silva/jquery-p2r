var markdown = require('node-markdown').Markdown;


module.exports = function _plugin_markdown(Twig) {

    Twig.extend(function (Twig) {
        // example of extending a tag type that would
        // restrict content to the specified "level"
        Twig.exports.extendTag({
            // unique name for tag type
            type: "markdown",
            // regex for matching tag
            regex: /^markdown$/,

            // what type of tags can follow this one.
            next: ["endmarkdown"], // match the type of the end tag
            open: true,
            parse: function (token, context, chain) {

                // check level of current user
                output = markdown(Twig.parse.apply(this, [token.output, context]));

                return {
                    chain: chain,
                    output: output
                };
            }
        });

        // a matching end tag type
        Twig.exports.extendTag({
            type: "endmarkdown",
            regex: /^endmarkdown$/,
            next: [],
            open: false
        });
    });

    return Twig;
};