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

 function decrypt(value){
    return CryptoJS.AES.decrypt(value, password).toString(CryptoJS.enc.Utf8);
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
                title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Set Master Password"
            });
        
            masterPassAlert.addHtml('<img id="alert_preview" src="assets/images/safe.svg"><input id="masterpass" type="password" class="flatInput"><a id="random_password">Random password</a><br>Please select a secure password and keep it!<br>If you want to reset your password after that you\'ll lose your password.<br>Write it down or save it into a file.');
            $("#random_password").click(function(){
                $("#alert_preview").val(randomString(25));
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
                title: "&nbsp;&nbsp;Give me your Master Password"
            });
        
            masterPassAlert.addHtml('<img id="alert_preview" src="assets/images/authentication.svg"><input id="masterpass" type="password" class="flatInput"><br><a id="forgot_password">Forgot password?</a>');
        
            $("#forgot_password").click(function(){
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
                            }
                        }).send();
                    }
                });
                newPasswordConfirmation.addButton("Close", function(){
                    newPasswordConfirmation.close();
                });
                newPasswordConfirmation.open();


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

 $(document).ready(ready);