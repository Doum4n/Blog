<?php

namespace Database\Factories;

use App\Models\Group;
use App\Models\Topic;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Following>
 */
class FollowingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::all()->random()->uuid,
            'group_id' => Group::all()->random()->id,
            'followed_user_id' => User::all()->random()->uuid,
            'topic_id' => Topic::all()->random()->id,
        ];
    }
}
