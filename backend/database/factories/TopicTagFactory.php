<?php

namespace Database\Factories;

use App\Models\Tag;
use App\Models\Topic;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\TopicTag>
 */
class TopicTagFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'topic_id' => Topic::all()->random()->id,
            'tag_id' => Tag::all()->random()->id,
        ];
    }
}
