<?php
namespace databases;

use modules\uloleorm\Table;
class PasswordsSessionsTable extends Table {

    public $id, 
           $session_id,
           $userid,
           $user_key;
    
    public function database() {
        $this->_table_name_ = "password_sessions";
        $this->__database__ = "main";
    }

}