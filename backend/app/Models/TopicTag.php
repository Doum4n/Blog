<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TopicTag extends Model
{
    /** @use HasFactory<\Database\Factories\TopicTagFactory> */
    use HasFactory;

    public $timestamps = false;
    protected $table = 'topic_tag';

    protected $fillable = [
        'topic_id',
        'tag_id',
    ];
}
