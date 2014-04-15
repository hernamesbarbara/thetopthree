
$(".choose").click(function(e) {
    $(this).toggleClass("btn-success");
    $(this).toggleClass("btn-info");
});

$(".send-email").click(function(e) {
    var thetopthree = [];
    if ($(".choose.btn-info").length != 3) {
        $("#flashwarning").toggleClass("hidden");
    } else {
        $("#flashwarning").addClass("hidden");
        $(".choose.btn-info").each(function(i, item) {
            thetopthree.push({
                img: $(item).attr("data-name"),
                week: $(item).attr("data-week")
            });
        });
        $.post("/image", { data: thetopthree });
    }
});
