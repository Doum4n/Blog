<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(): Collection
    {
        return Comment::all();
    }

    public function getComments(int $id): JsonResponse
    {
        $comment = Comment::with('children')->find($id);
        return response()->json($comment);
    }

    public function getCommentByPostId(int $id): JsonResponse
    {
        $comment = Comment::with('children')->where('post_id', $id)->orderBy('updated_at', 'desc') ->get();
        return response()->json($comment);
    }

    public function createComment(Request $request): JsonResponse
    {
        Comment::factory()->createOne([
            'user_id' => $request->input('user_id'),
            'parent_id' => $request->input('parent_id'),
            'content' => $request->input('content'),
            'post_id' => $request->input('post_id'),
        ]);

        return response()->json('Comment created!');
    }

    public function getCommentByUserId(string $userId): JsonResponse
    {
        $comments = Comment::query()->with('children') ->where('user_id', $userId)->get();
        return response()->json(['comments' => $comments]);
    }

    public function getCommentDetails(int $id): JsonResponse
    {
        $comment = Comment::with('children')
            ->join('users', 'users.uuid', '=', 'comments.user_id')
            ->where('comments.post_id', $id)
            ->select('comments.*', 'users.name', 'users.photoUrl')
            ->get();
        return response()->json($comment);
    }
}
