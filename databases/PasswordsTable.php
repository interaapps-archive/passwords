<?php
namespace databases;

use modules\uloleorm\Table;
class PasswordsTable extends Table {

    public $id, 
           $userid,
           $name,
           $password,
           $website,
           $description,
           $icon,
           $created;

    public function database() {
        $this->_table_name_ = "passwords_passwords";
        $this->__database__ = "main";
    }

}