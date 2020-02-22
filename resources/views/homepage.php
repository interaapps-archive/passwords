
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="manifest" href="https://accounts.interaapps.de/assets/manifest.json">

    <!-- FONTS -->
    <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet"><link href="https://fonts.googleapis.com/css?family=Montserrat" rel="stylesheet">
    <link rel="stylesheet" href="https://indestructibletype.com/fonts/Jost.css" type="text/css" charset="utf-8" />
    <link rel="stylesheet" href="/assets/css/app.css" type="text/css">

    <!-- STYLES -->
    <link rel="stylesheet" href="https://accounts.interaapps.de/assets/css/panel.css">
    <!-- JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js"></script>
    <script src="https://accounts.interaapps.de/assets/js/app.js"></script>
    <script src="/assets/js/app.js"></script>

    <title>Passwords</title>
</head>
<body>


<loadindicator>
<div class="load-bar">
    <div class="bar"></div>
    <div class="bar"></div>
    <div class="bar"></div>
</div>
</loadindicator>

<div id="nav" style="display: flex">
            <a class="material-icons rippleeffect menubtn">menu</a>
        <a id="logo" href="/"><img id="logoimg" height="40px" src="https://interaapps.de/assets/interaapps/icon/icon2.png"/> <p>Passwords</p></a>
    <div id="navmenu">

        <img id="profilepicture" src="<?php echo (htmlspecialchars(\app\classes\User::getUserObject()->profilepic)); ?>" />
    </div>
</div>
<div style='padding-top: 65px'>


<div id="main">
    </head>
    <body>

    
        <div id="behind_sidenav">
        <div id="mySidenav" class="sidenav">
                        <!-- sidenavselected  -->
                <a href="https://accounts.interaapps.de" title="Back to Accounts" class="rippleeffect drawerbtn drawerbtn1 sidenava"><i class="small material-icons-outlined sideicon">home</i></a>
                    </div>
    </div>



    <script>
        var sidenavOpened = false;

        function openNav() {
            $(".sidenav").css({
                width:"270px",
                display: "block",
                top: "0",
                marginTop: "0px"
            });
            $("#behind_sidenav").css({
                width: "100%",
                background: "#32323250",
                position: "fixed",
                zIndex: "10000",
                top: "0"
            });
            sidenavOpened = true;
        }

        function closeNav() {
            $(".sidenav").css({
                width:"0px",
                display: "none",
                top: "0",
                marginTop: "20px"
            });
            $("#behind_sidenav").css({
                background: "none",
                width: "0px"
            });
            sidenavOpened = false;
        }

        $(".menubtn").click(function() {
            if (sidenavOpened)
                closeNav();
            else
                openNav();

        });

        $("#behind_sidenav").click(function() {
            if (sidenavOpened) closeNav();

        });

        function checkResize() {
            if (window.innerWidth >= 720){
                $(".sidenav").css({
                    width:"270px",
                    display: "block",
                    top: "65px",
                    marginTop: "20px",
                    paddingTop: "0px"
                });

                $("#behind_sidenav").css({
                    background: "none",
                    width: "270px",
                    paddingTop: "20px"
                });
            }
        }

        $(window).on("resize", function(){
            checkResize();
        });



        $(window).on("resize", function(){
            $("#behind_sidenav").css({
                width: "270px"
            });
            if (window.innerWidth <= 720){
                closeNav();
            }
        });


        function checkScroll() {

            if (window.pageYOffset > 1) {
                nav.style.boxShadow = " rgba(0, 0, 0, 0.55) 0px -45px 18px 34px";
            }
            else {
                nav.style.boxShadow = "0px 7px 17px -10px rgba(0,0,0,0)";
            }

        }
        $(document).ready(function() {
            var nav = $("#nav");
            var navmenu = document.getElementById("navmenu");
            checkScroll();
            window.onscroll = function() {
                checkScroll();
            };
            checkResize();
            if (window.innerWidth <= 720){
                closeNav();
            }
            initClicks();
        });

        let profilePictureImageBase64 = "";
        let responseAlert = new Alert({
            closebtn: false,
            canexit: false,
            title: ""
        });



    </script>
    
<app>

    <div class="contents">
    <a id="add_button" class="button">Add Password</a>
    <div id="passwords">
        
    </div>

      
    </div>


<style>
</style>

                <app>
            </div>
        </div>
        <a id="snackbar"></a>
    </body>
</html>