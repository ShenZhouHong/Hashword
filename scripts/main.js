// Checks if all modules have been properly loaded
var script_checks = function() {
    // jQuery check
    if (typeof jQuery == 'undefined') {
        console.log("Error: Jquery is not loaded!");
    }
    else {
        console.log("Check: Jquery is loaded successfully");
    }
    // sjcl check
    if (typeof sjcl.hash.sha256 == 'undefined') {
        console.log("Error: sjcl is not loaded!");
    }
    else {
        console.log("Check: sjcl is loaded successfully");
    }
}

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

// Primary module that creates password hashes.
var sha256_hasher = function(data, type) {
    // Creates a (raw) sha256 hash
    var sha256_raw = sjcl.hash.sha256.hash(data);

    // Creates different encodings of the sha256 hash (base64 or hex)
    if (type == "hex") {
        return sjcl.codec.hex.fromBits(sha256_raw);
    }
    else if (type == "base64") {
        return sjcl.codec.base64.fromBits(sha256_raw);
    }
}
$(document).ready(function() {
    //Reads value from input box in html page and passes it on to relevent functions
    $(".inputbox").on('input', function() {
        // Checks in case inputs are empty
        if ($("#token_input").val() === "" || $("#password_input").val() === "") {
            // Do nothing or clears output
            $("#hash_output").val("");
        }
        else {

            // Creates hash
            var hash = sha256_hasher(token_preparser($("#token_input").val(), localStorage.getItem("strip_whitespace"), localStorage.getItem("enforce_lowercase")) + $("#password_input").val(), "base64");

            // Writes hash to inputbox
            $("#hash_output").val(hash);

            // Copies to clipboard and closes window when tabbed over
            $("#hash_output").focus(function(){

                // Selects everything
                this.select()

                //Copies to clipboard
                document.execCommand("copy");
                $("#notice_ticker").text("Copied!");

                // Closing animation
                $("#wrapper").slideUp(400, function(){
                    window.close();
                });
            });
        }
    });

    $("#options_button").click(function() {
        $("#options_menu").slideToggle(500);
    });

    $("#enforce_lowercase").click(function(){
       if($(this).is(":checked")){
           localStorage.setItem("enforce_lowercase", true);
       }
       else if($(this).is(":not(:checked)")){
           localStorage.setItem("enforce_lowercase". false);

       }
    });

    $("#strip_whitespace").click(function(){
        if($(this).is(":checked")){
            localStorage.setItem("strip_whitespace", true);
        }
        else if($(this).is(":not(:checked)")){
            localStorage.setItem("strip_whitespace", false);
        }
    });
});
