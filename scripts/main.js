
// Gathers settings from the options menu
console.log("Info: Attempting to load settings from localStorage API");

// Declares global option variables from chrome API localStorage
var strip_whitespace_value = localStorage.getItem("strip_whitespace_value");
var enforce_lowercase_value = localStorage.getItem("enforce_lowercase_value");
var hide_hash_value = localStorage.getItem("hide_hash_value");

// Debug logging for options menu logs
console.log("Info: Dumping options menu variables!");
console.log("      strip whitespace: " + strip_whitespace_value);
console.log("      enforce lowercase: " + enforce_lowercase_value);
console.log("      hide hash: " + hide_hash_value);
console.log("Info: Dump complete, values above");

// Preparses token for the sake of consistency
var token_preparser = function(token, trim, lowercase) {
    // Debug logging for token retrieval
    console.log("Info: Token recieved at token_preparser");
    console.log("Info: Original token: " + token);

    // Trims token
    if (trim == true) {
        token.trim();

        // Debug logging for token trimming
        console.log("Info: Token is now trimmed");
        console.log("Info: Token currently " + token);
    }

    // Forces lowercase
    if (lowercase == true) {
        token.toLowerCase();

        // Debug logging for token lowercasing
        console.log("Info: Token is now lowercased");
        console.log("Info: Token currently " + token);
    }

    // Debug logging for token return
    console.log("Info: Token has finished processing and is now returned");
    console.log("Info: Post-processed token: " + token);
    return token;
}

// Creates different encodings of the sha256 hash (base64 or hex)
var sha256_hasher = function(data, type) {
    if (type == "hex") {

        // Debug logging for hex hash return
        console.log("Info: sha256_hasher returned hex hash");

        // Return hash (hex)
        return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(data));
    }
    if (type == "base64") {

        // Debug logging for base64 hash return
        console.log("Info: sha256_hasher returned base64 hash");

        // Return hash (base64)
        return sjcl.codec.base64.fromBits(sjcl.hash.sha256.hash(data));
    }
}

var autofocus = function() {
    // Automatically focuses on first inputbox to start with
    $("#token_input").focus();

    // Debug logging for #token_input focus
    console.log("Info: #token_input inputbox focused");
}

var slider_activate = function() {
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
    // Debug logging for slick.js activation
    console.log("Info: Slick.js activated at .wrapper class");
}

var option_loader = function() {

    // Changes checkmarks in the options menu based on previous settings
    if (strip_whitespace_value == true) {
        $('#strip_whitespace').prop('checked', true);

    }

    if (enforce_lowercase_value == true) {
        $('#enforce_lowercase').prop('checked', true);
    }

    if (hide_hash_value == true) {
        $('#hide_hash').prop('checked', true);
    }
}

// Main javascript code body - executes on document load ready
$(document).ready(function() {

    autofocus();
    slider_activate();
    option_loader();

    // Sets settings from the options menu
    $("#strip_whitespace").click(function(){
        if ($("#strip_whitespace").is(':checked') == true) {
            localStorage.setItem("strip_whitespace_value", true);
        }
        else {
            localStorage.setItem("strip_whitespace_value", false);
        }
        // Debug prompt
        console.log("strip_whitespace_value " + localStorage.getItem("strip_whitespace_value"));

    });
    $("#enforce_lowercase").click(function(){
        if ($("#enforce_lowercase").is(':checked') == true) {
            localStorage.setItem("enforce_lowercase_value", true);
        }
        else {
            localStorage.setItem("enforce_lowercase_value", false);
        }
        // Debug prompt
        console.log("enforce_lowercase_value " + localStorage.getItem("enforce_lowercase_value"));

    });
    $("#hide_hash").click(function(){
        if($("#hide_hash").is(':checked') == true) {
            localStorage.setItem("hide_hash_value", true);
        }
        else {
            localStorage.setItem("hide_hash_value", false);
        }
        // Debug prompt
        console.log("hide_hash " + localStorage.getItem("hide_hash_value"));
    });

    // Reads value from input box in html page and passes it on to relevent functions
    $(".inputbox").on('input', function() {

        // Checks in case inputs are empty
        if ($("#token_input").val() === "" || $("#password_input").val() === "") {

            // Do nothing or clears output
            $("#hash_output").val("");
        }

        // If inputs are not empty...
        else {

            // Creates processed token after processing by preparser
            var processed_token = token_preparser($("#token_input").val(), strip_whitespace_value, enforce_lowercase_value);

            // Creates hash from password and processed token
            var hash = sha256_hasher(processed_token + $("#password_input").val(), "base64");

            // Writes hash IF hide_hash is set to false
            if (hide_hash_value == false) {
                $("#hash_output").val(hash);
            }

            // Copies to clipboard and closes window when tabbed over
            $("#hash_output").focus(function(){

                // Writes hash IF hide_hash is set to true
                if (hide_hash_value == true) {
                    $("#hash_output").val(hash);
                }
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
});
