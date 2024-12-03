<?php

namespace App\Http\Controllers;

use App\Models\Comment;
use App\Models\Post;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CommentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $comments = Comment::query()
            ->selectRaw('comments.*, posts.title as post_title, users.name as user_name')
            ->join('posts', 'comments.post_id', '=', 'posts.id')
            ->join('users', 'comments.user_id', '=', 'users.uuid')
            ->paginate($request->input('per_page', 10));
        return response()->json($comments);
    }

    public function deleteComment(Request $request): JsonResponse
    {
        $comment = $request->input('comments'); // Mảng các ID bài viết cần xóa

        // Kiểm tra nếu $posts là một mảng
        if (is_array($comment)) {
            // Xóa tất cả các bài viết với ID trong mảng
            Comment::destroy($comment);
        }

        return response()->json('Deleted successfully', 200);
    }

    public function getCommentById(int $id): JsonResponse
    {
        return response()->json(Comment::query()->where('id', $id)->firstOrFail());
    }

    public function relatedComments(Request $request): JsonResponse
    {
        $comments = Comment::query()
            ->selectRaw('comments.*, posts.title as post_title, users.name as user_name')
            ->join('posts', 'comments.post_id', '=', 'posts.id')
            ->join('users', 'comments.user_id', '=', 'users.uuid')
            ->where('parent_id', $request->input('parent_id'))
            ->get();

        return response()->json($comments);
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

    public function getCommentByStatusId(int $id): JsonResponse
    {
        $comment = Comment::with('children')->where('status_id', $id)->orderBy('updated_at', 'desc') ->get();
        return response()->json($comment);
    }

    public function createComment(Request $request): JsonResponse
    {
        if($request->input('type') == 'post') {
            Comment::factory()->createOne([
                'user_id' => $request->input('user_id'),
                'parent_id' => $request->input('parent_id'),
                'content' => $request->input('content'),
                'post_id' => $request->input('id'),
                'status_id' => null,
            ]);
        }else if($request->input('type') == 'status') {
            Comment::factory()->createOne([
                'user_id' => $request->input('user_id'),
                'parent_id' => $request->input('parent_id'),
                'content' => $request->input('content'),
                'status_id' => $request->input('id'),
                'post_id' => null,
            ]);
        }

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
