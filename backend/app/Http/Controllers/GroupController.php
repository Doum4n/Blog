<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Models\Post;
use App\Models\User;
use http\Env\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class GroupController extends Controller
{
    public function getGroupById(int $id): JsonResponse
    {
        $group = Group::query()->findOrFail($id);

        return response()->json($group);
    }

    public function index_4(): JsonResponse
    {
        return response()->json(Group::query()->take(4)->get());
    }

    public function all(): JsonResponse
    {
        return response()->json(Group::query()->get());
    }

    public function index(): JsonResponse
    {
        $groups = Group::query()
            ->paginate(10);

        return response()->json($groups);
    }

    public function deleteGroup(Request $request): JsonResponse
    {
        $groups = $request->input('groups');

        if (is_array($groups)) {
            Group::destroy($groups);
        }

        return response()->json(['success' => true]);
    }

    public function getUsersByGroupId(int $id): JsonResponse
    {
        $group = User::query()
            ->join('followings', 'users.uuid', '=', 'followings.user_id')
            ->where('followings.group_id', $id)
            ->paginate(10);

        return response()->json($group);
    }

    public function getGroupsByUserId(string $id)
    {
        $groups = Group::query()
            ->join('followings', 'groups.id', '=', 'followings.group_id')
            ->join('users', 'users.uuid', '=', 'followings.user_id')
            ->where('followings.user_id', $id)
            ->select('groups.*')
            ->take(4)
            ->get();

        return response()->json($groups);
    }

    public function createGroup(Request $request): JsonResponse
    {
        Group::query()->create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
            'coverPhotoUrl' => $request->input('coverPhotoUrl'),
        ]);

        return response()->json('success');
    }
}
