<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PostTag extends Model
{
    /** @use HasFactory<\Database\Factories\PostTagFactory> */
    use HasFactory;

    protected $table = 'post_tag';
    protected $fillable = [
        'post_id',
        'tag_id',
    ];

    public function posts(): BelongsTo
    {
        return $this->belongsTo(Post::class);
    }
    public function tags(): BelongsTo
    {
        return $this->belongsTo(Tag::class);
    }
}
