<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\Post;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PhpParser\Node\Expr\Array_;

class ImageController extends Controller
{
    public function storeTemp(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif',
        ]);

        $path = $request->file('image')->store('images', 'public');
//        $image = new Image();
//        $image->path = $path;
//        $image->post_id = null;
//
//        $temporaryImages = session()->get('temporary_images', []);
//        $temporaryImages[] = $image;
//        session(['temporary_images' => $temporaryImages]);

        return response()->json(['path' => $path]);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'path' => 'required|string',
            'post_id' => 'required|integer',
        ]);

        $image = Image::factory()->createOne([
            'post_id' => $request->input('post_id'),
            'path' => $request->input('path')
        ]);

        return response()->json(['path' => $image->path]);
    }

    public function getImage(String $id)
    {
        $images = Image::query()->select('path')->where('post_id', $id)->get();

//        $urls = array_map(function($image) {
//            return Storage::url($image['path']);
//        }, $images->toArray());
        return response()->json(['url' => $images]);
    }

    public function getImageOnce(String $id): JsonResponse
    {
        $images = Image::query()->where('post_id', $id)->first()->path;
        return response()->json(['url' => $images]);
    }

    public function deleteImage(String $id): void
    {
        Storage::disk('public')->delete($id);
    }

    public function update(Request $request, Image $image): JsonResponse
    {
        $request->validate([
            'post_id' => 'required|integer|exists:posts,id',
        ]);

        $image->post_id = $request->post_id;
        $image->save();

        return response()->json([
            'message' => 'Post ID updated successfully!',
            'image' => $image,
        ], 200);
    }

}
