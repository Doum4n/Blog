<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Model
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory;

    protected  $fillable = [
        'uuid',
        'name',
        'age',
        'gender',
        'biography',
        'date_of_birth',
        'photoUrl',
        'email',
        'role',
        'followers',
        'password',
    ];

    protected $hidden = [
      'password',
    ];

    public function post(): HasMany
    {
        return $this->hasMany(Post::class);
    }
}
