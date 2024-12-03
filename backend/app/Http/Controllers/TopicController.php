<?php

namespace App\Http\Controllers;

use App\Models\Topic;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TopicController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $topics = Topic::query()->paginate($request->input('per_page', 10));
        return Response()->json($topics);
    }

    public function all(): JsonResponse
    {
        $topics = Topic::all();
        return Response()->json($topics);
    }

    public  function topicById(int $id): JsonResponse
    {
        $topic = Topic::query()->findOrFail($id);
        return Response()->json($topic);
    }

    public function editTopic(Request $request): JsonResponse
    {
        $topic = Topic::query()->findOrFail($request->input('id'));
        $topic->name = $request->input('name');
        $topic->description = $request->input('description');
        $topic->update();

        return Response()->json("Success");
    }

    public function deleteTopic(Request $request): JsonResponse
    {
        $topics = $request->input("topics");
        if(is_array($topics)){
            Topic::destroy($topics);
        }
        return Response()->json("Success");
    }
}
