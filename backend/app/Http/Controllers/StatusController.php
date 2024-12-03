<?php

namespace App\Http\Controllers;

use App\Models\Status;
use Database\Seeders\StatusSeeder;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StatusController extends Controller
{
    public function index(): JsonResponse
    {
        $status = Status::query()
            ->selectRaw('statuses.*, users.name as user_name,users.photoUrl as avatar, images.path as image_path')
            ->join('users', 'users.uuid', '=', 'statuses.user_id')
            ->join('images', 'images.status_id', '=', 'statuses.id')
            ->paginate(10);
        return Response()->json($status);
    }

    public function getStatusById(int $id): JsonResponse
    {
        $status = Status::query()
            ->selectRaw('statuses.*, users.name as user_name, images.path as image_path')
            ->join('users', 'users.uuid', '=', 'statuses.user_id')
            ->join('images', 'images.status_id', '=', 'statuses.id')
            ->where('statuses.id', $id)
            ->first();
        return response()->json($status);
    }

    public function increaseLike(int $id): JsonResponse
    {
        $status = Status::query()->find($id)->increment('likes');
        return Response()->json("success");
    }

    public function createStatus(Request $request): JsonResponse
    {
        Status::query()->create([
            'user_id' => $request->input('user_id'),
            'content' => $request->input('content'),
            'likes' => 0,
        ]);

        return Response()->json("success");
    }
}
