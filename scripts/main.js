var token_preparser = function(token, trim, lowercase) {
    // Preparses token for the sake of consistency
    if (trim == true) {
        var token = token.trim();
    }
    if (lowercase == true) {
        var token = token.toLowerCase();
    }
    return token
}

var sha256_hasher = function(data, type) {
    // Creates different encodings of the sha256 hash (base64 or hex)
    if (type == "hex") {
        return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(data));
    }
    else if (type == "base64") {
        return sjcl.codec.base64.fromBits(sjcl.hash.sha256.hash(data));
    }
}
$(document).ready(function() {
    $("#token_input").focus();
    //Reads value from input box in html page and passes it on to relevent functions
    $(".inputbox").on('input', function() {
        // Checks in case inputs are empty
        if ($("#token_input").val() === "" || $("#password_input").val() === "") {
            // Do nothing or clears output
            $("#hash_output").val("");
        }
        // If inputs are not empty...
        else {
            // Creates hash and writes to inputbox
            $("#hash_output").val(sha256_hasher(token_preparser($("#token_input").val(), localStorage.getItem("strip_whitespace"), localStorage.getItem("enforce_lowercase")) + $("#password_input").val(), "base64"));

            // Copies to clipboard and closes window when tabbed over
            $("#hash_output").focus(function(){

                // Selects everything
                this.select();

                //Copies to clipboard
                document.execCommand("copy");
                $("#main_header").text("Copied!");

                // Closing animation
                $("#wrapper").slideUp(400, function(){
                    window.close();
                });
            });
        }
    });

    //Slick Slider
    $(".wrapper").slick({
        nextArrow: $(".forward"),
        prevArrow: $(".backward"),
        variableWidth: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        centerMode: false,
        initialSlide: 1,
        speed: 200,
        draggable: false,
        swipe: false,
        swipeToSlide: false,
        touchMove: false,

    });

    // Toggles preparser enforce_lowercase option
    $("#enforce_lowercase").click(function(){
       if($(this).is(":checked")){
           localStorage.setItem("enforce_lowercase", true);
       }
       else if($(this).is(":not(:checked)")){
           localStorage.setItem("enforce_lowercase", false);
       }
    });

    // Toggles preparser strip_whitespace option
    $("#strip_whitespace").click(function(){
        if($(this).is(":checked")){
            localStorage.setItem("strip_whitespace", true);
        }
        else if($(this).is(":not(:checked)")){
            localStorage.setItem("strip_whitespace", false);
        }
    });
});
