<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\GroupController;
use App\Http\Controllers\ImageController;
use App\Http\Controllers\interactionController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\PostTagController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\ForumController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Redis;
use Kreait\Firebase\Auth\UserQuery;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/test-redis', function () {
    $value = json_encode([1,2,3]);
    $redis = Redis::connection();
    $redis->set('foo', 'bar');
    $redis->set('foo1', $value);
    $redis->set('foo2', 2);
    $name = $redis->get('foo2');
    echo $name;
});


use App\Http\Middleware\CorsMiddleware;

Route::middleware([CorsMiddleware::class])->group(function () {
    Route::get('/test-db/{id}', [PostController::class, 'show']);
    Route::get('/test-firebase', [UserController::class, 'getById']);

    Route::post('/image/store', [ImageController::class, 'store']);
    Route::post('/image/temp', [ImageController::class, 'storeTemp']);
//    Route::get('/image/temp', [ImageController::class, 'getTempImage']);
    Route::get('/get-image/{post_id}', [ImageController::class, 'getImage']);
    Route::get('get-image/once/{post_id}', [ImageController::class, 'getImageOnce']);

    Route::post('/post/create', [PostController::class, 'createPost']);
    Route::get('/get-post/{id}', [PostController::class, 'getPost']);
    Route::get('/get-post/detail/{id}', [PostController::class, 'getPostDetails']);
    Route::get('/post/{id}/like', [PostController::class, 'likePost']);
    Route::get('/post/{id}/view', [PostController::class, 'viewPost']);
    Route::get('/post/{id}/likes', [PostController::class, 'getLikes']);
    Route::get('/post/user/{id}', [PostController::class, 'getPostByUuid']);
    Route::get('/post/most-viewed', [PostController::class, 'getMostViewedPosts']);
    Route::get('/post/Popular', [PostController::class, 'getPopularPosts']);
    Route::get('/post/Featured', [PostController::class, 'getFeaturedPosts']);

    Route::get('posts/not-popular', [PostController::class, 'getNotPopularPosts']);

    Route::get('posts/hashtag/{id}', [PostController::class, 'getPostsByHashtag']);
    Route::get('/post/forum/{id}', [PostController::class, 'getPostByForumId']);
    Route::get('/post/forum/{id}/all', [PostController::class, 'getPostByForumId_All']);
    Route::get('/posts/recent', [PostController::class, 'getRecentPosts']);
    Route::get('/posts/recent/all', [PostController::class, 'getRecentPosts_All']);
    Route::get('post/index', [PostController::class, 'index']);
    Route::get('posts/group/{id}', [PostController::class, 'getPostsByGroupId']);
    Route::get('/get-post/comment/{comment_id}', [PostController::class, 'getPostByCommentId']);
    Route::delete('posts/delete', [PostController::class, 'deletePost']);

    Route::get('get/comment/{id}', [CommentController::class, 'getComments']);
    Route::get('get/commentDetail/{id}', [CommentController::class, 'getCommentDetails']);
    Route::get('get/commentByPostId/{id}', [CommentController::class, 'getCommentByPostId']);
    Route::get('get/commentByStatusId/{id}', [CommentController::class, 'getCommentByStatusId']);
    Route::post('comment/create', [CommentController::class, 'createComment']);
    Route::get('comment/user/{id}', [CommentController::class, 'getCommentByUserId']);

    Route::get('get/user', [UserController::class, 'getUser']);
    Route::get('get/username/{id}', [UserController::class, 'getUsername']);
    Route::post('user/create', [UserController::class, 'createUser']);
    Route::get('get/user/photo/{id}', [UserController::class, 'getPhotoById']);
    Route::put('user/update/photo', [UserController::class, 'updatePhoto']);
    Route::get('users/index', [UserController::class, 'index']);
    Route::delete('users/delete', [UserController::class, 'deleteUser']);
    Route::get('user/{id}', [UserController::class, 'getUserById']);
    Route::get('user/post/{id}', [UserController::class, 'getUserByPostId']);

    Route::put('interaction', [interactionController::class, 'update']);
    Route::get('interact/share/{id}', [interactionController::class, 'getPostsSharedByUser']);

    Route::get('/post/{id}/tags', [PostTagController::class, 'getTagsByPostId']);
    Route::get('/tag/{id}', [PostTagController::class, 'getTagNameByTagId']);

    Route::get('/forums', [ForumController::class, 'all']);
    Route::get('/forums/index', [ForumController::class, 'index']);
    Route::get('/forum/{id}', [ForumController::class, 'forumById']);

    Route::get('status/index', [StatusController::class, 'index']);
    Route::get('status/{id}', [StatusController::class, 'getStatusById']);
    Route::get('status/{id}/like', [StatusController::class, 'increaseLike']);
    Route::post('status/create', [StatusController::class, 'createStatus']);
    Route::get('/status/user/{id}', [StatusController::class, 'getStatusByUserId']);

    Route::get('group/{id}', [GroupController::class, 'getGroupById'])->whereNumber('id');
    Route::get('group/top4', [GroupController::class, 'index_4']);

    //ADMIN
    Route::get('/statistical', [AdminController::class, 'getStatistical']);

    Route::put('/forum/edit', [ForumController::class, 'editForum']);
    Route::delete('/forum/delete', [ForumController::class, 'deleteForum']);

    Route::get('comments/index', [CommentController::class, 'index']);
    Route::get('comment/related', [CommentController::class, 'relatedComments']);
    Route::get('comment/{id}', [CommentController::class, 'getCommentById']);
    Route::delete('comment/delete', [CommentController::class, 'deleteComment']);
});

