<?php

namespace App\Http\Controllers;

use App\Models\Status;
use Database\Seeders\StatusSeeder;
use http\Client\Curl\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

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
            ->select('statuses.*', 'users.name as user_name', 'users.uuid as uuid', 'users.photoUrl as avatar', DB::raw("GROUP_CONCAT(images.path) AS image_paths"))
            ->join('users', 'users.uuid', '=', 'statuses.user_id')
            ->join('images', 'images.status_id', '=', 'statuses.id', 'left')
            ->groupBy('statuses.id')
            ->where('statuses.id', $id)
            ->first();
        return response()->json($status);
    }

    public function getStatusByUserId(string $userId): JsonResponse
    {
        $status = Status::query()
            ->join('users', 'users.uuid', '=', 'statuses.user_id')
            ->join('images', 'images.status_id', '=', 'statuses.id', 'left')
            ->where('statuses.user_id', $userId)
            ->selectRaw('statuses.*, users.name as user_name, images.path as image_path')
            ->paginate(10);

        return response()->json($status);
    }

    public function increaseLike(int $id): JsonResponse
    {
        $status = Status::query()->find($id)->increment('likes');
        return Response()->json("success");
    }

    public function createStatus(Request $request): JsonResponse
    {
        $status = Status::query()->create([
            'user_id' => $request->input('user_id'),
            'content' => $request->input('content'),
            'likes' => 0,
        ]);

        return Response()->json($status->id);
    }
}
