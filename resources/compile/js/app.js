let root = "/";

if (typeof chrome != 'undefined' && typeof chrome.tabs != 'undefined')
    root = "https://passwords.interaapps.de/";

let password;

function randomString(length, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789') {
    var result           = '';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

 function encrypt(value){
    return CryptoJS.AES.encrypt(value, password).toString();
 }

 function encryptWithKey(value,key){
    return CryptoJS.AES.encrypt(value, key).toString();
 }

 function decrypt(value){
    return CryptoJS.AES.decrypt(value, password).toString(CryptoJS.enc.Utf8);
 }

 function decryptWithKey(value, key){
    return CryptoJS.AES.decrypt(value, key).toString(CryptoJS.enc.Utf8);
 }

function addPassword(name="no name given", password="", username="test", website="https://accounts.interaapps.de", description="Nothing given", icon="https://passwords.interaapps.de/icon.svg", then=function(){}){ 
    let passwordObj = {
        name: encrypt(name),
        password: encrypt(password),
        username: encrypt(username),
        website: encrypt(website),
        description: encrypt(description),
        icon: encrypt(icon)
    };

    Cajax.post(root+"passwords/add", passwordObj).then(then).catch(function(){
        showSnackBar("Error", "#FF3232");
    }).send();
}

function changePassword(newPW){
    const oldPW = password+"";
    Cajax.get(root+"passwords/get").then((response)=>{
        const parsed = JSON.parse(response.responseText);
        password = newPW;
        for (obj in parsed.list) {
            const pw = parsed.list[obj];
            addPassword(
                decryptWithKey(pw.name, oldPW),
                decryptWithKey(pw.password, oldPW),
                decryptWithKey(pw.username, oldPW),
                decryptWithKey(pw.website, oldPW),
                decryptWithKey(pw.description, oldPW),
                decryptWithKey(pw.icon, oldPW),
                function(){}
            );
            Cajax.delete(root+"passwords/"+pw.id+"/remove").send();
        }
        loadList();
    }).send();
}

function randomPassword(then=function(pw){}){
    var pwAlert = new Alert({
        canexit: true,
        closebtn: true,
        title: "New Password"
    });

    let randomize = function(){
        $letters = "";
        
        if ($("#random_use_letters").getFirstElement().checked)
            $letters += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        if ($("#random_use_numbers").getFirstElement().checked)
            $letters += "1234567890";
        if ($("#random_use_ascii").getFirstElement().checked)
            $letters += "&!$/()=[]{}?+*#'~\\ \'";
        

        $("#random_password_out").text(randomString(Number.parseInt($("#random_password_lenght").val()), $letters));

    };

    pwAlert.addHtml(
        $n("div").append($n("span").attr("id", "random_password_out"))
        .append($n("br"))
        .append($n("span").text("Lenght")).append(
            $n("input").attr("type", "text").attr("id", "random_password_lenght")
        )
        .append($n("br"))
        .append($n("span").text("Letters")).append(
            $n("input").attr("id", "random_use_letters").attr("type", "checkbox")
        )
        .append($n("br"))
        .append($n("span").text("Numbers")).append(
            $n("input").attr("id", "random_use_numbers").attr("type", "checkbox")
        )
        .append($n("br"))
        .append($n("span").text("Ascii")).append(
            $n("input").attr("id", "random_use_ascii").attr("type", "checkbox")
        ).html()
    );

    $("#random_use_letters").change(randomize);
    $("#random_use_numbers").change(randomize);
    $("#random_use_ascii").change(randomize);
    $("#random_password_lenght").keyup(randomize);

    $("#random_password_lenght").val(25);
    $("#random_use_letters").getFirstElement().checked = true;
    $("#random_use_numbers").getFirstElement().checked = true;
    randomize();

    pwAlert.addButton("Use", function() {

    });

    pwAlert.open();
    

}


function newPassword(){
    var pwAlert = new Alert({
        canexit: true,
        closebtn: true,
        title: "New Password"
    });

    pwAlert.addButton("Add", function() {
        addPassword(nameInput.val(), passwordInput.val(), usernameInput.val(), websiteInput.val(), descriptionInput.val(), iconInput.val(), function(){
            showSnackBar("Done");
            pwAlert.close();
            loadList();
        });
    });
    changed = true;

    let nameInput = $n("input").addClass("password_entry_var_val").attr("placeholder", "Entry Name");
    let usernameInput = $n("input").addClass("password_entry_var_val").attr("placeholder", "Your Username");
    let passwordInput = $n("input").addClass("password_entry_var_val").val(randomString(25)).attr("placeholder", "Password");
    let websiteInput = $n("input").addClass("password_entry_var_val").attr("placeholder", "Website");
    let descriptionInput = $n("textarea").addClass("password_entry_var_val").attr("placeholder", "Descripion");
    let iconInput = $n("input").addClass("password_entry_var_val").attr("placeholder", "Icon URL");

    pwAlert.addHtml(
        $n("div").append(
            $n("div").addClass("password_entry_var")
                     .append($n("span").addClass("password_entry_var_name").text("Name"))
                     .append(nameInput)
        ).append(
            $n("div").addClass("password_entry_var")
                     .append($n("span").addClass("password_entry_var_name").text("Username"))
                     .append(usernameInput)
        ).append(
            $n("div").addClass("password_entry_var")
                     .append($n("span").addClass("password_entry_var_name").text("Password"))
                     .append(passwordInput)
        ).append(
            $n("div").addClass("password_entry_var")
                     .append($n("span").addClass("password_entry_var_name").text("Website"))
                     .append(websiteInput)
        ).append(
            $n("div").addClass("password_entry_var")
                     .append($n("span").addClass("password_entry_var_name").text("Description"))
                     .append(descriptionInput)
        ).append(
            $n("div").addClass("password_entry_var")
                     .append($n("span").addClass("password_entry_var_name").text("Icon"))
                     .append(iconInput)
        )
    );
    pwAlert.addButton("Close", function() {
        pwAlert.close();
    }).open();
}

function loadList(){
    $("#passwords").html("");
    Cajax.get(root+"passwords/get").then((response)=>{
        const parsed = JSON.parse(response.responseText);
        for (obj in parsed.list) {
            const pw = parsed.list[obj];
            if (decrypt(pw.name) != "%$test$%")
            $("#passwords").append(
                $n("div").addClass("password").append(
                    $n("img").addClass("password_icon").css("display", "none").attr("src", decrypt(pw.icon))
                ).append(
                    $n("span").addClass("password_name").text(decrypt(pw.name))
                ).append(
                    $n("span").addClass("password_password").text(decrypt(pw.password).replace(/./g, '*'))
                ).click(function() {
                    var pwAlert = new Alert({
                        canexit: true,
                        closebtn: true,
                        title: decrypt(pw.name)
                    });

                    let changed = false;

                    const pwAlertChange = function(){
                        if (!changed) {
                            pwAlert.addButton("Update", function() {
                                addPassword(nameInput.val(), passwordInput.val(), usernameInput.val(), websiteInput.val(), descriptionInput.val(), iconInput.val(), function(){
                                    showSnackBar("Done");
                                    Cajax.delete(root+"passwords/"+pw.id+"/remove").then(loadList).send();                  
                                });
                                pwAlert.close();
                            });
                            changed = true;
                        }
                    };

                    let nameInput = $n("input").addClass("password_entry_var_val").val(decrypt(pw.name)).change(pwAlertChange);
                    let usernameInput = $n("input").addClass("password_entry_var_val").val(decrypt(pw.username)).change(pwAlertChange);
                    let passwordInput = $n("input").addClass("password_entry_var_val").val(decrypt(pw.password)).change(pwAlertChange);
                    let websiteInput = $n("input").addClass("password_entry_var_val").val(decrypt(pw.website)).change(pwAlertChange);
                    let descriptionInput = $n("textarea").addClass("password_entry_var_val").val(decrypt(pw.description)).change(pwAlertChange);
                    let iconInput = $n("input").addClass("password_entry_var_val").val(decrypt(pw.icon)).change(pwAlertChange);

                    pwAlert.addHtml(
                        $n("div").css("overflowX","auto").append(
                            $n("div").addClass("password_entry_var")
                                    .append($n("span").addClass("password_entry_var_name").text("Name"))
                                    .append(nameInput)
                        ).append(
                            $n("div").addClass("password_entry_var")
                                    .append($n("span").addClass("password_entry_var_name").text("Username"))
                                    .append(usernameInput)
                        ).append(
                            $n("div").addClass("password_entry_var")
                                    .append($n("span").addClass("password_entry_var_name").text("Password"))
                                    .append(passwordInput)
                        ).append(
                            $n("div").addClass("password_entry_var")
                                    .append($n("span").addClass("password_entry_var_name").text("Website"))
                                    .append(websiteInput)
                        ).append(
                            $n("div").addClass("password_entry_var")
                                    .append($n("span").addClass("password_entry_var_name").text("Description"))
                                    .append(descriptionInput)
                        ).append(
                            $n("div").addClass("password_entry_var")
                                    .append($n("span").addClass("password_entry_var_name").text("Icon"))
                                    .append(iconInput)
                        ).append($n("a").text("delete this entry").click(function(){
                            Cajax.delete(root+"passwords/"+pw.id+"/remove").then(loadList).send();
                            pwAlert.close();
                        }))
                    );

                    
                    pwAlert.addButton("Close", function() {
                        pwAlert.close();
                    });

                    pwAlert.open();
            }));

            $("img").on("load", function(e){
                $(e.target).css("display","inline");
            });
        }
    }).send();
    
}

const ready = function(){
    $("#add_button").click(newPassword);
    Cajax.get(root+"passwords/get").then((response)=>{
        const parsed = JSON.parse(response.responseText);
        
        if (parsed.list.length == 0) {
            var masterPassAlert = new Alert({
                canexit: false,
                closebtn: false,
                title: "Set Master Password"
            });
        
            masterPassAlert.addHtml('<img id="alert_preview" src="assets/images/safe.svg"><input id="masterpass" type="password" class="flatInput"><a id="random_password">Random password</a><br>Please select a secure password and keep it!<br>If you want to reset your password after that you\'ll lose your password.<br>Write it down or save it into a file.');
            $("#random_password").click(function(){
                randomPassword(function(pw){
                    console.log(pw);
                });
            });
            masterPassAlert.addButton("Set Masterpassword", function() {
                password = $("#masterpass").val();
                addPassword("%$test$%", "test","","","","",function(){
                    showSnackBar("Done");
                    masterPassAlert.close();
                    ready();
                });
            });

            masterPassAlert.open();
        
        } else {
            var masterPassAlert = new Alert({
                canexit: false,
                closebtn: false,
                title: "Enter your Master Password"
            });
        
            masterPassAlert.addHtml('<img id="alert_preview" src="assets/images/authentication.svg"><input id="masterpass" type="password" class="flatInput"><br><a id="forgot_password">Forgot password?</a>');
        
            $("#forgot_password").click(function(){

                var forgotPasswordAlert = new Alert({
                    canexit: true,
                    closebtn: true,
                    title: "Password assistent"
                });
            
                forgotPasswordAlert.addHtml('<img id="alert_preview" src="assets/images/settings.svg">'+`
                    <a class="settings_alert_button" id="reset_password_with_file">I have got a Recovery Key/File</a>
                    <a class="settings_alert_button" id="reset_without_file">I haven't got a Recovery Key. (If you don't know what that is, choose this!)</a>
                `);

                $("#reset_password_with_file").click(function(){
                    var newPasswordConfirmation = new Alert({
                        canexit: true,
                        closebtn: true,
                        title: "Password recovery"
                    });
                    newPasswordConfirmation.addHtml('<img id="alert_preview" src="assets/images/throw_down.svg">Insert you Password recovery contents!<br><textarea id="recovery_input"></textarea><br>New password:<br><input type="password" id="newpw_input">');
                    newPasswordConfirmation.addButton("Start!", function(){
                        try {
                            const parsedFile = JSON.parse($("#recovery_input").val());
                            console.log(parsedFile);
                            Cajax.post(root+"recovery/get", {
                                id: parsedFile.id
                            }).then(function(res){
                                const oldPW = decryptWithKey(res.responseText, parsedFile.key);
                                if (oldPW != "") {
                                    showSnackBar("List is valid!");
                                    password = oldPW;
                                    showSnackBar("Changing password...", "#FFFF32");
                                    changePassword($("#newpw_input").val());
                                    newPasswordConfirmation.close();
                                    forgotPasswordAlert.close();
                                    showSnackBar("Deleting old Recovery-Keys! Please create new ones.", "#FFFF32");
                                    Cajax.post("recovery/deleteAll").then(()=>showSnackBar("Done")).send();
                                } else
                                    showSnackBar("Invalid key!", "#FF3232");
                            }).send();
                        }catch(e) {
                            showSnackBar("Error! Is the key valid?", "#FF3232");
                        }
                    });
                    newPasswordConfirmation.addButton("Close", function(){
                        newPasswordConfirmation.close();
                    });
                    newPasswordConfirmation.open();

                });

                $("#reset_without_file").click(function(){
                    var newPasswordConfirmation = new Alert({
                        canexit: true,
                        closebtn: true,
                        title: "Are you sure?"
                    });
                    newPasswordConfirmation.addHtml('<img id="alert_preview" src="assets/images/throw_down.svg">Do you really want to set a new password? This will reset all of your passwords!');
                    newPasswordConfirmation.addButton("Confirm", function(){
                        for (obj in parsed.list) {
                            console.log("Hi");
                            const pw = parsed.list[obj];
                            Cajax.delete(root+"passwords/"+pw.id+"/remove").then(function(){
                                console.log(parsed.list.length-1);
                                console.log(obj);
                                if ((parsed.list.length-1) == obj) {
                                    ready();
                                    newPasswordConfirmation.close();
                                    masterPassAlert.close();
                                    forgotPasswordAlert.close();
                                }
                            }).send();
                        }
                    });
                    newPasswordConfirmation.addButton("Close", function(){
                        newPasswordConfirmation.close();
                    });
                    newPasswordConfirmation.open();
                });

                forgotPasswordAlert.open();


            });

            masterPassAlert.addButton("Go!", function() {
                password = $("#masterpass").val();
                console.log(parsed.list[0].password);
                if (decrypt(parsed.list[0].password) == "") {
                    showSnackBar("Invalid password", "#FF3232");
                } else {
                    loadList();
                    masterPassAlert.close();
                    
                }
            });

            masterPassAlert.open();
        }
        
    }).send();

};


 $(document).ready(function(){
     ready();

    $("#settings_button").click(function(){
        var settingsAlert = new Alert({
            canexit: true,
            closebtn: true,
            title: "Settings"
        });
    
        settingsAlert.addHtml('<img id="alert_preview" src="assets/images/settings.svg">'+`
            <a class="settings_alert_button" id="get_master_password_file">Create masterpassword-recovery entry and file</a>
            <a class="settings_alert_button" id="delete_recovery_files">Delete all recovery keys</a>
        `);

        $("#get_master_password_file").click(function(){
            const randomKeyPW = randomString(150);
            Cajax.post(root+"recovery/new", {
                recovery: CryptoJS.AES.encrypt(password, randomKeyPW).toString()
            }).then(function(res){
                const recoveryJSON = {
                    id: res.responseText,
                    key: randomKeyPW
                };
                var keyCreatedAlert = new Alert({
                    canexit: true,
                    closebtn: true,
                    title: "Recovery Key"
                });

                keyCreatedAlert.addHtml(
                    $n("div").append(
                        $n("textarea").text(JSON.stringify(recoveryJSON)).css({
                            width: "100%",
                            display: "block"
                        })
                    ).append(
                        $n("a").text("Download Key").attr("download", "interaappspassword-recovery-key.iaprk").attr("href", "data:text/html,"+JSON.stringify(recoveryJSON))
                    ).append(
                        $n("p").text("Download it and put it on an USB Stick or write this key down!")
                    ).html()
                );
                keyCreatedAlert.open();

            }).send();
        });

        $("#delete_recovery_files").click(function(){
            Cajax.post("recovery/deleteAll").then(()=>showSnackBar("Done")).send();
        });
    
        settingsAlert.open();
    })
 });