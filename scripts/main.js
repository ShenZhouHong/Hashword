// Preparses token for the sake of consistency
var token_preparser = function(token, trim, lowercase) {
    if (trim == true) {
        var token = token.trim();
    }
    if (lowercase == true) {
        var token = token.toLowerCase();
    }
    return token
}

// Creates different encodings of the sha256 hash (base64 or hex)
var sha256_hasher = function(data, type) {
    if (type == "hex") {
        return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(data));
    }
    else if (type == "base64") {
        return sjcl.codec.base64.fromBits(sjcl.hash.sha256.hash(data));
    }
}

// Main javascript code body - executes on document load ready
$(document).ready(function() {

    // Automatically focuses on first inputbox to start with
    $("#token_input").focus();

    // Uses slick.js to start slide panel sliding effect
    $(".wrapper").slick({

        // Sets sliding speed
        speed: 200,

        // Binds forward and backward buttons
        nextArrow: $(".forward"),
        prevArrow: $(".backward"),

        // Sliding and slide view settings
        slidesToShow: 1,
        slidesToScroll: 1,

        // Disables various hipster drag settings
        draggable: false,
        swipe: false,
        swipeToSlide: false,
        touchMove: false,

        // Misc. slide.js settings for slider window
        variableWidth: true,
        infinite: false,
        centerMode: false,
        initialSlide: 1
    });

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
