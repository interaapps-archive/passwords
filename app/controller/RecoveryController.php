<?php
namespace app\controller;

use \ulole\core\classes\Response;
use \app\classes\User;
use \databases\RecoveryTable;
use \ulole\core\classes\util\Str;

class RecoveryController {

    public static function addRecovery(){
        if (User::loggedIn()) {
            if (isset($_POST["recovery"]) ) {
                $password = new RecoveryTable;
                $password->id = Str::random(20);
                $password->userid = User::getUserObject()->id;
                $password->recovery = $_POST["recovery"];
                $password->save();
                return $password->id;
            } else return "invalid request";
        } else return "login";
    }

    public static function getRecovery(){
        if (User::loggedIn() && isset($_POST["id"])) {
            return (new RecoveryTable)
                ->select()
                ->where("id", $_POST["id"])
                ->andwhere("userid", User::getUserObject()->id)
                ->first()["recovery"];
        } else return "login";
    }

    public static function deleteAll(){
        if (User::loggedIn()) {
            return (new RecoveryTable)
                ->delete()
                ->where("userid", User::getUserObject()->id)
                ->run();
        } else return "login";
    }


}