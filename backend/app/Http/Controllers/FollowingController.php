<?php

namespace App\Http\Controllers;

use App\Models\Following;
use App\Models\Forum;
use Illuminate\Http\Request;

class FollowingController extends Controller
{
    public function follow(Request $request)
    {
        // Xác định loại theo dõi
        $type = $request->input('type');
        $userId = $request->input('user_id');
        $followedUserId = $request->input('followed_user_id');
        $groupId = $request->input('group_id');
        $topicId = $request->input('topic_id');

        // Kiểm tra dòng theo dõi đã tồn tại chưa
        $followingExists = Following::query()
            ->where('user_id', $userId)
            ->when($type === 'user', function ($query) use ($followedUserId) {
                return $query->where('followed_user_id', $followedUserId);
            })
            ->when($type === 'group', function ($query) use ($groupId) {
                return $query->where('group_id', $groupId);
            })
            ->when($type === 'topic', function ($query) use ($topicId) {
                return $query->where('topic_id', $topicId);
            })
            ->exists();

        // Nếu chưa tồn tại, tạo mới
        if (!$followingExists) {
            Following::query()->create([
                'user_id' => $userId,
                'followed_user_id' => $type === 'user' ? $followedUserId : null,
                'group_id' => $type === 'group' ? $groupId : null,
                'topic_id' => $type === 'topic' ? $topicId : null,
            ]);
        }

        return response()->json('success');
    }

    public function createForum(Request $request)
    {
        Forum::query()->create([
            'name' => $request->input('name'),
            'description' => $request->input('description'),
        ]);

        return response()->json('success');
    }
}
