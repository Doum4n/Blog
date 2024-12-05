<?php

namespace App\Http\Controllers;

use App\Models\Forum;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ForumController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $topics = Forum::query()->paginate($request->input('per_page', 10));
        return Response()->json($topics);
    }

    public function all(): JsonResponse
    {
        $topics = Forum::all();
        return Response()->json($topics);
    }

    public  function forumById(int $id): JsonResponse
    {
        $topic = Forum::query()->findOrFail($id);
        return Response()->json($topic);
    }

    public function editForum(Request $request): JsonResponse
    {
        $topic = Forum::query()->findOrFail($request->input('id'));
        $topic->name = $request->input('name');
        $topic->description = $request->input('description');
        $topic->update();

        return Response()->json("Success");
    }

    public function deleteForum(Request $request): JsonResponse
    {
        $topics = $request->input("topics");
        if(is_array($topics)){
            Forum::destroy($topics);
        }
        return Response()->json("Success");
    }
}
