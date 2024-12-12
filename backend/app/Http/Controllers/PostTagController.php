<?php

namespace App\Http\Controllers;

use App\Models\Post;
use App\Models\PostTag;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PostTagController extends Controller
{
    public function getTagsByPostId(int $id): JsonResponse
    {
        $post = PostTag::query()
            ->join('tags', 'post_tag.tag_id', '=', 'tags.id')
            ->where('post_id', $id)
            ->select('tags.name')
            ->get();
        return response()->json($post);
    }

    public function getTagNameByTagId(int $id): JsonResponse
    {
        $tag_name = Tag::query()->where('id', $id)->value('name');
        return response()->json($tag_name);
    }
}
