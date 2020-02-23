<?php
namespace databases;

use modules\uloleorm\Table;
class RecoveryTable extends Table {

    public $id, 
           $userid,
           $recovery,
           $created;
    
    public function database() {
        $this->_table_name_ = "passwords_recovery";
        $this->__database__ = "main";
    }

}
