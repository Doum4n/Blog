<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostTag;
use App\Models\Tag;
use App\Models\Topic;
use App\Models\TopicTag;
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
            ->select('topics.*', 'users.name as username', DB::raw('GROUP_CONCAT(images.path) as image_path'), DB::raw('GROUP_CONCAT(DISTINCT tags.name) as tag_name'))
            ->first();

        return response()->json($topic);
    }

    public function getTopicsByTagId(int $id)
    {
        $topis = Topic::query()
            ->join('topic_tag', 'topics.id', '=', 'topic_tag.topic_id', 'left')
            ->where('topic_tag.tag_id', $id)
            ->paginate(10);

        return response()->json($topis);
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

    public function createTopic(Request $request): JsonResponse
    {
        // Tạo bài viết
        $topic = Topic::factory()->createOne([
            'title' => $request->get('title'),
            'content' => $request->input('content'),
            'user_id' => $request->input('user_id'),
        ]);

//        $tag_name = $request->input('$tag_name');
        $tagNames = explode(',', $request->input('tag_name'));

        foreach ($tagNames as $tagName) {
            $tagExists = Tag::query()->where('name', trim($tagName))->exists();
            if($tagExists) {
                $tag = Tag::query()->where('name', trim($tagName))->select('id')->first();

                TopicTag::query()->create([
                    'topic_id' => $topic->id,
                    'tag_id' => $tag->id,
                ]);
            }else{
                $tag = Tag::query()->create([
                    'name' => trim($tagName),
                ]);

                TopicTag::query()->create([
                    'topic_id' => $topic->id,
                    'tag_id' => $tag->id,
                ]);
            }
        }

        return response()->json(['id' => $topic->id], 200);
    }
}
