<?php
namespace databases\migrate;

use modules\uloleorm\migrate\Migrate;

class RecoveryTable extends Migrate {
    public function database() {
        $this->create('passwords_recovery', function($table) {
            $table->string("id");
            $table->int("userid");
            $table->string("recovery");
            $table->timestamp("created")->currentTimestamp();
        });
    }
}
