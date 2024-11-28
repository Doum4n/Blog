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
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id')->nullable();
           $table->foreignUuid('user_id')->constrained('users', 'uuid')->cascadeOnDelete();
           $table->foreign('parent_id')->references('id')->on('comments')->cascadeOnDelete();
           $table->foreignId('post_id')->constrained('posts')->cascadeOnDelete();
//           $table->primary(['user_id', 'post_id', 'parent_id']);
           $table->string('content');
           $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comments');
    }
};
