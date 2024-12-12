<?php

namespace App\Http\Controllers;

use App\Models\Post;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatisticalController extends Controller
{
    public function viewsByDay(Request $request)
    {
        $views = Post::query()
            ->where('updated_at', '>=', now()->subDays(7)) // Bài viết được cập nhật trong 7 ngày qua
            ->selectRaw('DATE(updated_at) as date, sum(views) as total_views') // Lọc theo ngày và tính tổng lượt xem
            ->groupBy(DB::raw('DATE(updated_at)')) // Nhóm theo ngày
            ->orderBy('date') // Sắp xếp theo ngày
            ->get()
            ->keyBy('date') // Tạo mảng theo ngày
            ->map(function ($item) {
                return $item->total_views; // Chỉ lấy tổng lượt xem
            });

        return $views;
    }
}
