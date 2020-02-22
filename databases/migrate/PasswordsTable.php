<?php
namespace databases\migrate;

use modules\uloleorm\migrate\Migrate;

class PasswordsTable extends Migrate {
    public function database() {
        $this->create('passwords_passwords', function($table) {
            $table->int("id")->ai();
            $table->int("userid");
            $table->string("name");
            $table->string("username");
            $table->string("password");
            $table->string("website");
            $table->string("description");
            $table->string("icon");
            $table->timestamp("created")->currentTimestamp();
        });
    }
}
