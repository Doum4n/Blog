<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function getStatistical()
    {
        $statictical = DB::query()
            ->selectRaw(
            '
            (SELECT COUNT(*) FROM posts) AS post_count,
            (SELECT COUNT(*) FROM comments) AS comment_count,
            (SELECT COUNT(*) FROM users) AS user_count,
            (SELECT SUM(likes) FROM posts) AS total_likes,
            (SELECT SUM(views) FROM posts) AS total_views'
        )->first();
        return response()->json($statictical);
    }
}
