<?php
namespace app\controller;

use \ulole\core\classes\Response;
use \app\classes\User;
use \databases\PasswordsTable;

class PasswordsController {

    public static function getPasswords(){
        if (User::loggedIn()) {
            $out = [
                "done"=>false,
                "list"=>[]
            ];
            foreach ((new PasswordsTable)->select()->where("userid", User::getUserObject()->id)->get() as $obj) {
                array_push($out["list"], [
                    "id"=>$obj["id"],
                    "name"=>$obj["name"],
                    "password"=>$obj["password"],
                    "username"=>$obj["username"],
                    "website"=>$obj["website"],
                    "description"=>$obj["description"],
                    "icon"=>$obj["icon"]
                ]);
            }

            return $out;
        } else return "login";
    }

    public static function addPassword(){
        if (User::loggedIn()) {
            if (isset($_POST["name"])
                    && isset($_POST["password"])
                    && isset($_POST["username"])
                    && isset($_POST["website"])
                    && isset($_POST["description"])
                    && isset($_POST["icon"]) ) {
                $password = new PasswordsTable;
                $password->userid = User::getUserObject()->id;
                $password->name = $_POST["name"];
                $password->password = $_POST["password"];
                $password->username = $_POST["username"];
                $password->website = $_POST["website"];
                $password->description = $_POST["description"];
                $password->icon = $_POST["icon"];
                $password->save();
            } else return "invalid request";
        } else return "login";
    }

    public static function removePassword(){
        global $_ROUTEVAR;
        if (User::loggedIn()) {
            (new PasswordsTable)
                ->delete()
                ->where("id", $_ROUTEVAR[1])
                ->andwhere("userid", User::getUserObject()->id)
                ->run();

            return "done";
        } else return "login";
    }


}