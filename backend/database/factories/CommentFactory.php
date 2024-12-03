<?php

namespace Database\Factories;

use App\Models\Comment;
use App\Models\Post;
use App\Models\Status;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Comment>
 */
class CommentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'post_id' => Post::all()->random()->id,
            'user_id' => User::all()->random()->uuid,
            'content' => $this->faker->text(),
            'status_id' => $this->faker->optional(0.6)->randomElement(Status::query()->pluck('id')->toArray()),
            'parent_id' => $this->faker->optional(0.3)->randomElement(Comment::query()->pluck('id')->toArray()),
        ];
    }
}
