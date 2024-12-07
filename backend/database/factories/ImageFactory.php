<?php

namespace Database\Factories;

use App\Http\Controllers\TopicController;
use App\Models\Comment;
use App\Models\Post;
use App\Models\Status;
use App\Models\Topic;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Image>
 */
class ImageFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
//     */
    public function definition(): array
    {
        return [
            'path' => $this->faker->imageUrl(),
            'post_id' => Post::all()->random()->id,
            'status_id' => $this->faker->optional(0.7)->randomElement(Status::query()->pluck('id')->toArray()),
            'topic_id' => $this->faker->optional(0.7)->randomElement(Topic::query()->pluck('id')->toArray()),
        ];
    }
}
