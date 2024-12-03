<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

//interaction between user and post
class Interaction extends Model
{
    /** @use HasFactory<\Database\Factories\InteractionFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'post_id',
        'status_id',
        'like',
        'save',
        'share'
    ];

    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }

    public function post(): BelongsTo{
        return $this->belongsTo(Post::class);
    }

    //1 comment of 1 user belong to 1 post
    public function comment(): BelongsTo{
        return $this->belongsTo(Comment::class);
    }
}
