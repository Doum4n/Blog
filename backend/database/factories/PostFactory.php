<?php

namespace Database\Factories;

use App\Models\Author;
use App\Models\Forum;
use App\Models\Group;
use App\Models\Image;
use App\Models\Status;
use App\Models\Tag;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => $this->faker->sentence(),
            'content' => $this->faker->paragraphs(5, true),
            'user_id' => User::all()->random()->uuid,
            'forum_id' => Forum::all()->random()->id,
            'group_id' => $this->faker->optional(0.6)->randomElement(Group::query()->pluck('id')->toArray()),
            'views' => $this->faker->randomDigit(),
            'likes' => $this->faker->randomDigit(),
            'comments' => $this->faker->randomDigit(),
        ];
    }
}
