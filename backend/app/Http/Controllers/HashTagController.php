<?php

namespace App\Http\Controllers;

use App\Models\Tag;
use Illuminate\Http\Request;

class HashTagController extends Controller
{
    public function index()
    {
        $hashtag = Tag::query()
            ->join('post_tag', 'post_tag.tag_id', '=', 'tags.id', 'left')
            ->join('topic_tag', 'topic_tag.tag_id', '=', 'tags.id', 'left')
            ->groupBy('tags.id')
            ->selectRaw('tags.* , COUNT(post_tag.tag_id) as post_count, COUNT(topic_tag.tag_id) as topic_count')
            ->paginate(10);

        return response()->json($hashtag);
    }
}
