<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Following extends Model
{
    /** @use HasFactory<\Database\Factories\FollowingFactory> */
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'group_id',
        'followed_user_id',
        'topic_id'
    ];
}
