<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\Topic;
use Database\Seeders\TopicSeeder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TopicController extends Controller
{
    public function index(): JsonResponse
    {
        $topics = Topic::query()
            ->join('users', 'topics.user_id', '=', 'users.uuid')
            ->join('images', 'topics.id', '=', 'images.topic_id', 'left')
            ->groupBy('topics.id', 'users.uuid', 'users.name')
            ->select('topics.*', 'users.name as username', 'users.uuid as userId')
            ->paginate(10);

        return response()->json($topics);
    }

    public function getTopicById(int $id): JsonResponse
    {
        $topic = Topic::query()
            ->join('users', 'topics.user_id', '=', 'users.uuid')
            ->join('images', 'topics.id', '=', 'images.topic_id', 'left')
            ->join('comments', 'topics.id', '=', 'comments.topic_id', 'left')
            ->join('topic_tag', 'topics.id', '=', 'topic_tag.topic_id', 'left')
            ->join('tags', 'topic_tag.tag_id', '=', 'tags.id', 'left')
            ->groupBy('topics.id', 'users.name')
            ->where('topics.id', $id)
            ->select('topics.*', 'users.name as username', DB::raw('GROUP_CONCAT(images.path) as image_path'), DB::raw('GROUP_CONCAT(tags.name) as tag_name'))
            ->first();

        return response()->json($topic);
    }

    public function deleteTopic(Request $request): JsonResponse
    {
        $topics = $request->input('topics');

        if (is_array($topics)) {
            Topic::destroy($topics);
        }

        return response()->json("deleted");
    }

    public function getRecentTopics(): JsonResponse
    {
        $topics = Topic::query()
            ->join('images', 'topics.id', '=', 'images.topic_id', 'left')
            ->orderBy('topics.created_at', 'desc')
            ->groupBy('topics.id')
            ->select('topics.*', DB::raw('MIN(images.path) as image_path'))
            ->take(10)
            ->get();

        return response()->json($topics);
    }
}
