+(function _codepen_module($, window) {
    var codepen = {
        build: function (code, height, tab) {

            !height && (height = "400px");
            !tab && (tab = "result");



            var url = [
                    "//codepen.io/anon/embed/", code, "?default-tab=", tab, "&theme-id=7511&height=", height.replace("px", "")
                ].join(''),
                text = "<iframe ",
                n = {
                    id: "cp_embed_" + code.replace("/", "_"),
                    src: url,
                    scrolling: "no",
                    frameborder: "0",
                    height: height,
                    allowTransparency: "true",
                    ref: "true",
                    "class": "cp_embed_iframe",
                    style: "width: 100%; overflow: hidden;"
                };

            for (var i in n) {
                text += i + '="' + n[i] + '" ';
            }
            text += "></iframe>";
            return text;
        }
    };

    window.codepen = codepen;

    $(document).ready(function _ondocument_ready() {
        $(document)
            .on("activate.codepenapi", "[data-trigger='codepen']", function (evt) {
                $(this).find(".pen-body").html(codepen.build($(this).attr("data-hash")));
            })
            .on("click", "[data-trigger='codepen'] .btn", function () {
                $(this).parent("[data-trigger='codepen']").trigger('activate.codepenapi');
            });

        $("[data-trigger='codepen']").each(function () {
            var autostart = $(this).data('autostart'),
                $this = $(this);
            $this.append(
                [
                    "<button class='btn btn-primary'>",
                    "    Click here to show a codepen example",
                    "</button>",
                    "<div class='pen-body'></div>"
                ].join("")
            );
            if (autostart) {
                $(this).trigger('activate.codepenapi');
            }
        });

    });

})(window.jQuery, window);