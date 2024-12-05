<?php

namespace App\Http\Controllers;

use App\Models\Group;
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
}
