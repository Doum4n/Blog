<?php

namespace App\Http\Controllers;

use App\Models\Following;
use Illuminate\Http\Request;

class FollowingController extends Controller
{
    public function follow(Request $request)
    {
        $following = Following::query()->find($request->input('user_id'));
        $following->followed_user_id = $request->input('followed_user_id');
        $following->group_id = $request->input('group_id');
        $following->topic_id = $request->input('topic_id');
        $following->save();

        return response()->json('success');
    }
}
