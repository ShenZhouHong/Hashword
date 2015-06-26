var sha256_hasher = function(input, encoding) {
    // Creates SHA-256 hash from input, returns either hash in hex or base64
    if (encoding == "hex") {
        console.log("Info: sha256_hasher() returned hex hash");
        return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(input));
    }
    else if (encoding == "base64") {
        console.log("Info: sha256_hasher() returned base64 hash");
        return sjcl.codec.base64.fromBits(sjcl.hash.sha256.hash(input));
    }

    // If encoding value is neither
    else {
        throw "Error: sha256_hasher() encoding accepts 'hex' or 'base64', but recieved " + encoding;
    }
}

var token_parser = function(token, trim, lowercase) {
    // Debug logging for token_parser arguments
    console.log("Info: token_parser() called");
    console.log("Info: token_parser() given the following arguments: ");
    console.log("      token: " + token);
    console.log("      trim: " + trim);
    console.log("      lowercase: " + lowercase);

    // Checks if trimming is specified
    if (trim == true) {

        // Attempts to trim whitespace from token for consistency
        try {
            token = token.trim();

            // Debug logging for trimmed token
            console.log("Info: token_parser() trimmed Token currently " + token);
        }
        // In case trm process does not work, throw error
        catch(error) {
            throw "Error: token_parser() token.trim() failed, " + error;
        }
    }

    // Checks if lowercase is specified
    if (lowercase == true) {

        // Attempts to force lowercase on token for consistency
        try {
            token = token.toLowerCase();

            // Debug logging for token lowercasing
            console.log("Info: token_parser() lowercased Token currently " + token);
        }
        // In case lowerase process does not work, throw error
        catch(error) {
            throw "Error: token_parser() token.toLowerCase() failed, " + error;
        }
    }

    // Returns token no matter what
    return token
}

var startup = function() {
    // Focuses cursor on inputbox in form during startup
    $("#token_input").focus();
    console.log("Info: startup() #token_input inputbox focused");

    // Initializes slick.js carousel for menu panels
    try {
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
        console.log("Info startup(): slick.js activated at .wrapper class")
    }

    // In case slick.js did not load or does not work, throw error
    catch(error) {
        throw "Error: startup() $(\".wrapper\").slick({...}) failed, " + error;
    }
}

var load_options = function() {
    // Attempts to loads options for the extensions from localStorage API as booleans
    try {
        // strip_whitespace option
        if (localStorage.getItem("strip_whitespace_value") !== null) {
            // Retrieves previous settings if existing as global variable booleans
            window.strip_whitespace_value = Boolean(localStorage.getItem("strip_whitespace_value"));
        }
        else {
            // If no previous settings exist, default to false
            window.strip_whitespace_value = localStorage.setItem("strip_whitespace_value", false);
        }

        // enforce_lowercase option
        if (localStorage.getItem("enforce_lowercase_value") !== null) {
            // Retrieves previous settings if existing as global variable booleans
            window.enforce_lowercase_value = Boolean(localStorage.getItem("enforce_lowercase_value"));
        }
        else {
            // If no previous settings exist, default to false
            window.enforce_lowercase_value = localStorage.setItem("enforce_lowercase_value", false);
        }

        // hide_hash option
        if (localStorage.getItem("hide_hash_value") !== null) {
            // Retrieves previous settings if existing as global variable booleans
            window.hide_hash_value = Boolean(localStorage.getItem("hide_hash_value"));
        }
        else {
            // If no previous settings exist, default to false
            window.hide_hash_value = localStorage.setItem("hide_hash_value", false);
        }
    }

    // If somehow the attempt does not work, throw error
    catch(error) {
        // If it does not work
        throw "Error: load_options() failed at loading option values from localStorage API, " + error;
    }

    // After options are loaded, attempt to check checkboxes in options panel if they are already set
    try {
        // strip_whitespace options
        if (strip_whitespace_value == true) {
            // Check the checkboxes
            $('#strip_whitespace').prop('checked', true);
        }
        else {
            // Uncheck them if they are false
            $('#strip_whitespace').prop('checked', false);
        }

        // enforce_lowercase options
        if (enforce_lowercase_value == true) {
            $('#enforce_lowercase').prop('checked', true);
        }
        else {
            $('#enforce_lowercase').prop('checked', false);
        }

        // hide_hash options
        if (hide_hash_value == true) {
            $('#hide_hash').prop('checked', true);
        }
        else {
            $('#hide_hash').prop('checked', false);
        }
    }

    // If checkboxes cannot be checked, throw error
    catch(error) {
        throw "Error: load_options() failed at checking checkboxes, " + error;
    }
}

var set_options = function() {
    // Antagonistic to load_options() - sets the options defined by the user
    $("#strip_whitespace").click(function(){
        if ($("#strip_whitespace").is(':checked') == true) {
            localStorage.setItem("strip_whitespace_value", true);
        }
        else if ($("#strip_whitespace").is(':checked') == false) {
            localStorage.setItem("strip_whitespace_value", false);
        }
        // Debug prompt
        console.log("strip_whitespace_value: " + localStorage.getItem("strip_whitespace_value"));

    });
    $("#enforce_lowercase").click(function(){
        if ($("#enforce_lowercase").is(':checked') == true) {
            localStorage.setItem("enforce_lowercase_value", true);
        }
        else if ($("#enforce_lowercase").is(':checked') == false) {
            localStorage.setItem("enforce_lowercase_value", false);
        }
        // Debug prompt
        console.log("enforce_lowercase_value " + localStorage.getItem("enforce_lowercase_value"));

    });
    $("#hide_hash").click(function(){
        if($("#hide_hash").is(':checked') == true) {
            localStorage.setItem("hide_hash_value", true);
        }
        else if ($("#hide_hash").is(':checked') == false) {
            localStorage.setItem("hide_hash_value", false);
        }
        // Debug prompt
        console.log("hide_hash " + localStorage.getItem("hide_hash_value"));
    });
}

// Main javascript code body - executes on document load ready
$(document).ready(function() {

    startup();
    load_options();
    set_options();

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
            var processed_token = token_parser($("#token_input").val(), strip_whitespace_value, enforce_lowercase_value);
            console.log("Info: Processed token is " + processed_token);

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
