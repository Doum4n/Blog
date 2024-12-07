<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('topic_tag', function (Blueprint $table) {
           $table->foreignId('tag_id')->constrained('tags')->cascadeOnDelete();
           $table->foreignId('topic_id')->constrained('topics')->cascadeOnDelete();
           $table->primary(['tag_id', 'topic_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('topic_tag');
    }
};