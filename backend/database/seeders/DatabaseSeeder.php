<?php

namespace Database\Seeders;

use App\Models\Topic;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            ForumSeeder::class,
            GroupSeeder::class,
            TagSeeder::class,
            PostSeeder::class,
            StatusSeeder::class,
            ImageSeeder::class,
            TopicSeeder::class,
            CommentSeeder::class,
            InteractionSeeder::class,
            PostTagSeeder::class,
            FollowingSeeder::class,
            TopicTagSeeder::class,
        ]);
    }
}
