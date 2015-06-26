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

var token_parser = function(raw_token, trim, lowercase) {

    // Checks if trimming is specified
    if (trim == true) {

        // Attempts to trim whitespace from token for consistency
        try {
            raw_token = raw_token.trim();

            // Debug logging for trimmed token
            console.log("Info: token_parser() trimmed Token currently " + raw_token);
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
            raw_token = raw_token.toLowerCase();

            // Debug logging for token lowercasing
            console.log("Info: token_parser() lowercased Token currently " + raw_token);
        }
        // In case lowerase process does not work, throw error
        catch(error) {
            throw "Error: token_parser() token.toLowerCase() failed, " + error;
        }
    }

    // Returns token no matter what
    return raw_token
}

var hashword_maker = function(processed_token, password) {
    // Creates hash from password and processed token
    var hash = sha256_hasher(processed_token + password, "base64");

    // Writes hash to output box
    $("#hash_output").val(hash);
}

var automagics = function(autocopy, autoclose) {
    // Automatically copies the hashword when tabbled over
    if (autocopy == true) {

        // On tabbing over to hash output box
        $("#hash_output").focus(function(){

            // Selects everything
            this.select();

            //Copies to clipboard
            document.execCommand("copy");
            $("#main_header").text("Copied!");
        });
    }

    // Automatically closes the extension when hashword is tabbed over
    if (autoclose == true) {

        // On tabbing over to hash output box
        $("#hash_output").focus(function(){

            // Close plugin with sweet animation
            $("#wrapper").slideUp(300, function(){
                window.close();
            });
        });
    }

}

// Main javascript code body - executes on document load ready
$(document).ready(function() {

    // Executes startup functions
    startup();

    // Attempts to initate global setting variables
    try {
        // Trim settings
        if (localStorage.getItem("trim") !== null) {
            var trim = Boolean(localStorage.getItem("trim"));
        }
        else if (localStorage.getItem("trim") == null) {
            var trim = false;
        }
        console.log("trim: " + trim);

        // Lowercase settings
        if (localStorage.getItem("lowercase") !== null) {
            var lowercase = Boolean(localStorage.getItem("lowercase"));
        }
        else if (localStorage.getItem("lowercase") == null) {
            var lowercase = false;
        }
        console.log("lowercase: " + lowercase);

        // Autocopy settings
        if (localStorage.getItem("autocopy") !== null) {
            var autocopy = Boolean(localStorage.getItem("autocopy"));
        }
        else if (localStorage.getItem("autocopy") == null) {
            var autocopy = true;
        }
        console.log("autocopy: " + autocopy);

        // Autoclose settings
        if (localStorage.getItem("autoclose") !== null) {
            var autoclose = Boolean(localStorage.getItem("autoclose"));
        }
        else if (localStorage.getItem("autoclose") == null) {
            var autoclose = true;
        }
        console.log("autoclose: " + autoclose);
    }
    catch(error) {
        throw "Error: failed to initiate global setting variables, " + error;
    }

    // Attempts to check checkboxes on options menu with previous values
    try {
        // Trim options
        if (trim === true) {
            // Check the checkboxes
            $('#strip_whitespace').prop('checked', true);
        }
        else {
            // Uncheck them if they are false
            $('#strip_whitespace').prop('checked', false);
        }

        // Lowercase options
        if (lowercase === true) {
            $('#enforce_lowercase').prop('checked', true);
        }
        else {
            $('#enforce_lowercase').prop('checked', false);
        }

        // Autocopy options
        if (autocopy === true) {
            // Check the checkboxes
            $('#autocopy').prop('checked', true);
        }
        else {
            // Uncheck them if they are false
            $('#autocopy').prop('checked', false);
        }

        // enforce_lowercase options
        if (autoclose === true) {
            $('#autoclose').prop('checked', true);
        }
        else {
            $('#autoclose').prop('checked', false);
        }
    }
    catch(error) {
        throw "Error: Checking checkboxes did not work, " + error;
    }

    // If user changes settings, attempts to update said settings
    try {

    }

    // Execute as soon as a inputbox is changed/modified
    $(".inputbox").on('input', function() {

        // Checks if the input boxes are empty
        if ($("#token_input").val() === "" || $("#password_input").val() === "") {

            // Clears output if input boxes are empty
            $("#hash_output").val("");
        }

        // Begins hashing process if all required information is there
        else {

            // Gathers required functional variables
            var raw_token = $("#token_input").val();
            var password = $("#password_input").val();

            // Creates processed token
            var processed_token = token_parser(raw_token, trim, lowercase);
            console.log(processed_token);

            // Creates hashword from processed token and password
            hashword_maker(processed_token, password);

            // Execute automagics (if enabled, of course)
            automagics(autocopy, autoclose);
        }
    });
});
