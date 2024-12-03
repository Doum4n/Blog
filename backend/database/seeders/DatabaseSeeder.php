<?php

namespace Database\Seeders;

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
            TopicSeeder::class,
            TagSeeder::class,
            PostSeeder::class,
            StatusSeeder::class,
            ImageSeeder::class,
            CommentSeeder::class,
            InteractionSeeder::class,
            PostTagSeeder::class,
        ]);
    }
}
