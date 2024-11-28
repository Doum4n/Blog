<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Post extends Model
{
    /** @use HasFactory<\Database\Factories\PostFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
        'content',
        'user_id',
        'likes',
        'comments',
        'views',
    ];

    public function image(): HasMany{
        return $this->hasMany(Image::class);
    }

    public function user(): BelongsTo{
        return $this->belongsTo(User::class);
    }

    public function increaseLikes(): void
    {
        $this->increment('likes');
    }

    public function  increaseViews(): void
    {
        $this->increment('views');
    }
}
