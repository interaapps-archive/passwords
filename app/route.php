<?php
// Directory for the views
$views_dir      =  "resources/views/";
$templates_dir  =  "resources/views/templates/";

// Routes

$router->get("/", "homepage.php");

$router->get("/user/login", "!UserController@login");
$router->get("/user/loggedIn", "!UserController@loggedIn");

$router->get("/passwords/get", "!PasswordsController@getPasswords");
$router->post("/passwords/add", "!PasswordsController@addPassword");
$router->delete("/passwords/([0-9]*)/remove", "!PasswordsController@removePassword");

$router->setPageNotFound("404.php");