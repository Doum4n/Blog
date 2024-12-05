<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\PostTag;
use App\Models\Tag;
use App\Models\User;
use http\Env\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\DB;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;
use Ramsey\Uuid\Type\Integer;
use function Laravel\Prompts\select;

class PostController extends Controller
{
    public function show(string $id): JsonResponse
    {
        $post = Post::query()->where('id', $id)->firstOrFail();
        return response()->json($post, 200);
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function createPost(Request $request): JsonResponse
    {
        // Tạo bài viết
        $post = Post::factory()->createOne([
            'title' => $request->get('title'),
            'content' => $request->input('content_post'),
            'user_id' => $request->input('user_id'),
            'forum_id' => $request->input('forum_id'),
        ]);

//        $tag_name = $request->input('$tag_name');
        $tagNames = explode(',', $request->input('tag_name'));

        foreach ($tagNames as $tagName) {
            $tagExists = Tag::query()->where('name', trim($tagName))->exists();
            if($tagExists) {
                $tag = Tag::query()->where('name', trim($tagName))->select('id')->first();

                PostTag::query()->create([
                    'post_id' => $post->id,
                    'tag_id' => $tag->id,
                ]);
            }else{
                $tag = Tag::query()->create([
                    'name' => trim($tagName),
                    'topic_id' => 1,
                ]);

                PostTag::query()->create([
                    'post_id' => $post->id,
                    'tag_id' => $tag->id,
                ]);
            }
        }

        // Xóa các ảnh tạm thời nếu có
        session()->forget('temporary_images');

        return response()->json(['id' => $post->id], 200);
    }

    public function getPostsByGroupId(int $id)
    {
        $post = Post::query()
            ->join('group_post', 'posts.id', '=', 'group_post.post_id')
            ->leftJoin('images', 'images.post_id', '=', 'posts.id')
            ->where('group_post.group_id', $id)
            ->groupBy('posts.id')
            ->select('posts.*', DB::raw('MIN(images.path) as path'))
            ->paginate(10);

        return response()->json($post);
    }


    public function getPost(int $id): JsonResponse
    {
        //SELECT p.*, i.path FROM `posts` as p JOIN `images` as i on p.id = i.post_id WHERE p.id = 1
        $post = DB::table('posts')
            ->join('images', 'images.post_id', '=', 'posts.id', 'left')
            ->select('images.path', 'posts.*')
            ->where('posts.id', $id)
            ->first();
//        $post = Post::query()->join('images', 'posts.id', '=', 'images.post_id')->where('id', $id)->select()->firstOrFail();
        return response()->json(['post' => $post]);
    }

    public function getPostsByHashtag(int $id): JsonResponse
    {
        $post = Post::query()
            ->selectRaw('posts.*, images.path as image_path, tags.name as tag_name')
            ->join('images', 'images.post_id', '=', 'posts.id', 'left')
            ->join('post_tag', 'post_tag.post_id', '=', 'posts.id')
            ->join('tags', 'tags.id', '=', 'post_tag.tag_id')
            ->where('tags.id', $id)
            ->get();

        return response()->json($post);
    }

    public function getNotPopularPosts(): JsonResponse
    {
        $post = Post::query()
            ->selectRaw('posts.*, views - likes as views_likes, images.path as image_path')
            ->join('images', 'images.post_id', '=', 'posts.id')
            ->orderBy('views_likes')
            ->orderBy('created_at')
            ->skip(6)
            ->take(10)
            ->get();

        return response()->json($post);
    }

    public function getPostDetails(int $id): JsonResponse
    {
        $posts = DB::table('posts as p')
            ->select('p.*', 'u.name', DB::raw('GROUP_CONCAT(i.path) AS images'))
            ->leftJoin('images as i', 'p.id', '=', 'i.post_id')
            ->join('users as u', 'u.uuid', '=', 'p.user_id')
            ->groupBy('p.id')
            ->orderBy('p.id', 'asc')
            ->where('p.id', $id)
            ->first();
        return response()->json($posts);
    }

    public function likePost(int $id): JsonResponse
    {
        Post::query()->find($id)->increaseLikes();
        return response()->json('liked', 200);
    }

    public function getLikes(string $id): JsonResponse
    {
        $post = Post::query()->select('likes')->where('id', $id)->firstOrFail();
        return response()->json(['likes' => $post->likes], 200);
    }

    public function getPostByUuid(string $uuid): JsonResponse
    {
        $post = Post::query()
            ->join('images', 'images.post_id', '=', 'posts.id', 'left')
            ->where('posts.user_id', $uuid)
            ->selectRaw('posts.*, MAX(images.path) as path')
            ->groupBy('posts.id')
            ->get();

        return response()->json(['post' => $post]);
    }

    public function getPostByCommentId(string $comment_id): JsonResponse
    {
        $post = Post::query()
            ->join('comments', 'comments.post_id', '=', 'posts.id')
            ->where('comments.id', $comment_id)
            ->selectRaw('posts.*')
            ->first();

        return response()->json($post);
    }


    public function viewPost(int $id): JsonResponse
    {
        Post::query()->find($id)->increaseViews();
        return response()->json('view', 200);
    }

    public function getMostViewedPosts(): JsonResponse
    {
        $post = DB::table('images')
            ->join('posts', 'images.post_id', '=', 'posts.id')
            ->selectRaw('posts.*, max(images.path) as path')
            ->orderBy('posts.views', 'desc')
            ->groupBy('posts.id')
            ->limit(5)
            ->get();
        return response()->json(['posts' => $post]);
    }

    public function getPopularPosts(): JsonResponse
    {
        $post = Post::query()
            ->selectRaw('*, views + likes as views_likes')
            ->orderByDesc('views_likes')
            ->orderByDesc('created_at')
            ->take(6)
            ->get();

        return response()->json(['posts' => $post]);
    }

    public function getFeaturedPosts(): JsonResponse
    {
        $post = Post::query()
            ->selectRaw('posts.*, views - likes as views_likes, images.path as image_path')
            ->join('images', 'images.post_id', '=', 'posts.id')
            ->orderBy('views_likes')
            ->orderBy('created_at')
            ->take(6)
            ->get();

        return response()->json($post);
    }

    public function getPostByForumId(int $topicId): JsonResponse
    {
        $post = DB::table('posts')
            ->join('post_tag', 'posts.id', '=', 'post_tag.post_id')
            ->join('forums', 'posts.forum_id', '=', 'forums.id')
            ->join('images', 'posts.id', '=', 'images.post_id')
            ->groupBy('posts.id')
            ->where('forums.id', $topicId)
            ->select('posts.*', DB::raw('MIN(images.path) as path'), 'forums.name as forums_name')
            ->limit(3)
            ->get();
        return response()->json($post);
    }

    public function getPostByForumId_All(int $topicId): JsonResponse
    {
        $post = DB::table('posts')
            ->join('post_tag', 'posts.id', '=', 'post_tag.post_id')
            ->join('tags', 'post_tag.tag_id', '=', 'tags.id')
            ->join('topics', 'tags.topic_id', '=', 'topics.id')
            ->join('images', 'posts.id', '=', 'images.post_id')
            ->where('topics.id', $topicId)
            ->select('posts.*', 'images.path', 'topics.name as topic_name')
            ->paginate(10);
        return response()->json($post);
    }

    public function getRecentPosts(): JsonResponse
    {
//        $post = Post::query()->orderBy('created_at', 'desc')->take(6)->get();
        $post = DB::table('images')
            ->join('posts', 'images.post_id', '=', 'posts.id')
            ->select('images.path', 'posts.*')
            ->orderBy('posts.created_at', 'desc')
            ->limit(5)
            ->get();
        return response()->json($post);
    }

    public function getRecentPosts_All(): JsonResponse
    {
//        $post = Post::query()->orderBy('created_at', 'desc')->take(6)->get();
        $post = DB::table('images')
            ->join('posts', 'images.post_id', '=', 'posts.id')
            ->select('images.path', 'posts.*')
            ->orderBy('posts.created_at', 'desc')
            ->paginate(10);
        return response()->json($post);
    }

    public function index(Request $request)
    {
        $posts = DB::table('posts as p')
            ->select('p.*', 'u.name', DB::raw('GROUP_CONCAT(i.path) AS images'))
            ->leftJoin('images as i', 'p.id', '=', 'i.post_id')
            ->join('users as u', 'u.uuid', '=', 'p.user_id')
            ->groupBy('p.id')
            ->orderBy('p.id', 'asc')
            ->paginate($request->input('per_page', 10));
        return response()->json($posts);
    }

    public function deletePost(Request $request): JsonResponse
    {
        $posts = $request->input('posts'); // Mảng các ID bài viết cần xóa

        // Kiểm tra nếu $posts là một mảng
        if (is_array($posts)) {
            // Xóa tất cả các bài viết với ID trong mảng
            Post::destroy($posts);
        }

        return response()->json('Deleted successfully', 200);
    }

}
