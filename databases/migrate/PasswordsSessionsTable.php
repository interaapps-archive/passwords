<?php
namespace databases\migrate;

use modules\uloleorm\migrate\Migrate;

class PasswordsSessionsTable extends Migrate {
    public function database() {
        $this->create('password_sessions', function($table) {
            $table->int("id")->ai();
            $table->string("session_id");
            $table->int("userid");
            $table->string("user_key");
        });
    }
}