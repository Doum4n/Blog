<?php

namespace App\Http\Controllers;

use App\Models\Interaction;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class interactionController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $interaction = Interaction::query()
            ->where('user_id', $request->input('user_id'))
            ->where('post_id', $request->input('post_id'))
            ->where('status_id', $request->input('status_id'))
            ->first();
        if (!$interaction) {
             Interaction::query()->create([
                'user_id' => $request->input('user_id'),
                'post_id' => $request->input('post_id'),
                 'status_id' => $request->input('status_id'),
                 'like' => 0,
                'save' => 0,
                'share' => 0
            ]);
        }
        switch ($request->input('action')) {
            case 'like': {
                Interaction::query()
                    ->where('post_id', $request->input('post_id'))
                    ->where('user_id',  $request->input('user_id'))
                    ->where('status_id', $request->input('status_id'))
                    ->update(['like' => true]);
                return response()->json(['success' => true]);
            }
            case 'save': {
                Interaction::query()->find($request->post_id)->update(['save' => $request->input('save')]);
                return response()->json(['success' => true]);
            }
            case 'share': {
                Interaction::query()
                    ->where('post_id', $request->input('post_id'))
                    ->where('user_id',  $request->input('user_id'))
                    ->where('status_id', $request->input('status_id'))
                    ->update(['share' => true]);
                return response()->json(['success' => true]);
            }
        }
        return response()->json(['failed' => false]);
    }

    public function getPostsSharedByUser(string $userId): JsonResponse
    {
        $postIds = Interaction::query()
            ->where('share', true)
            ->where('user_id', $userId)
            ->pluck('post_id');

        $posts = Post::query()->whereIn('id', $postIds)->get();

        return response()->json(['posts' => $posts]);
    }
}
