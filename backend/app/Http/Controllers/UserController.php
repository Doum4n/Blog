<?php

namespace App\Http\Controllers;

use App\Models\Image;
use App\Models\User;
use http\Env\Response;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Kreait\Firebase\Contract\Auth;
use Kreait\Firebase\Exception\AuthException;
use Kreait\Firebase\Exception\DatabaseException;
use Kreait\Firebase\Exception\FirebaseException;
use Kreait\Laravel\Firebase\Facades\Firebase;
use Illuminate\Support\Facades\Session;
use Psr\Container\ContainerExceptionInterface;
use Psr\Container\NotFoundExceptionInterface;

class UserController extends Controller
{
    public function getById(){
        $response = Firebase::auth()->getUser("d1b2CmC5Z1RxJnoJNolVKw08jbw1");
//        Firebase::auth()->
        echo $response->displayName;
    }

    public function getUsername($uuid): JsonResponse
    {
        $username = User::query()->where('uuid', $uuid)->value('name');
        return response()->json($username);
    }
    public function getUser(Request $request, Auth $auth): JsonResponse
    {

        $idToken = $request->bearerToken();

        try {
            $verifiedIdToken = $auth->verifyIdToken($idToken);
            $uid = $verifiedIdToken->claims()->get('sub');
            $user = $auth->getUser($uid);
            return response()->json(['user' => $user]);
        } catch (\InvalidArgumentException $e) {
            return response()->json(['error' => 'Could not parse token'], 401);
        } catch (AuthException|FirebaseException $e) {
            return response()->json(['error' => $e->getMessage()], 401);
        }
    }

    public function getUserByPostId(int $postId): JsonResponse
    {
        $user = User::query()
            ->join('posts', 'users.uuid', '=', 'posts.user_id')
            ->where('posts.id', $postId)
            ->first();

        return response()->json($user);
    }

    public function getUserById(string $uuid): JsonResponse
    {
        return response()->json(User::query()->where('uuid', $uuid)->first());
    }

    public function createUser(Request $request): JsonResponse
    {
        User::query()->create([
           'uuid' => $request->input('id'),
           'name' => $request->input('name'),
           'email' => $request->input('email'),
            'photoUrl' => $request->input('photoUrl'),
            'role' => $request->input('role'),
            'password' => Hash::make($request->input('password')),
        ]);

        return response()->json('Create user successfully!');
    }

    public function getFollowedUsers(string $uuid): JsonResponse
    {
        $users = User::query()
            ->join('followings', 'users.uuid', '=', 'followings.followed_user_id') // Liên kết với người dùng được theo dõi
            ->where('followings.user_id', $uuid) // Điều kiện: user_id là UUID của người dùng đang theo dõi
            ->select('users.uuid','users.name', 'users.photoUrl') // Lấy thông tin của người dùng được theo dõi
            ->get();

        return response()->json($users);
    }


    public function getPhotoById($uuid): JsonResponse
    {
        $photo = User::query()->where('uuid', $uuid)->value('photoUrl');
        return response()->json($photo);
    }

    public function updateUser(Request $request): JsonResponse
    {
        // Lấy dữ liệu từ request, loại bỏ các giá trị null hoặc rỗng
        $data = array_filter($request->only([
            'photoUrl',
            'name',
            'age',
            'gender',
            'biography',
            'email',
            'date_of_birth',
        ]), function ($value) {
            return !is_null($value) && $value !== ''; // Chỉ giữ lại các giá trị không rỗng
        });

        // Kiểm tra nếu không có dữ liệu nào để cập nhật
        if (empty($data)) {
            return response()->json('No data to update.', 400);
        }

        // Cập nhật vào cơ sở dữ liệu
        $affectedRows = User::query()
            ->where('uuid', $request->input('id'))
            ->update($data);

        // Kiểm tra nếu không tìm thấy người dùng
        if ($affectedRows === 0) {
            return response()->json('User not found or no changes made.', 404);
        }

        return response()->json('Update user successfully!');
    }


    public function index(): JsonResponse
    {
        $users = User::query()
            ->orderByDesc('followers')
            ->paginate(10);
        return response()->json($users);
    }

    /**
     * @throws DatabaseException
     */
    public function deleteUser(Request $response)
    {
        $user = $response->input('users');

        if (is_array($user)) {
            foreach ($user as $u) {
                User::query()->where('uuid', $u)->delete();
                Firebase::database()->getReference('users/' . $u)->remove();
            }
        }

        return response()->json('Deleted successfully', 200);
    }

    public function validateAccount()
    {
        $account = User::query()
            ->where('name', request()->input('name'))
            ->where('password', request()->input('password'))
            ->first();
        if(!$account) {
            return response()->json('User not found', 404);
        }else{
             session()->put(['uuid' => $account->uuid]);
            return response()->json('validated', 200);
        }
    }

    /**
     * @throws ContainerExceptionInterface
     * @throws NotFoundExceptionInterface
     */
    public function getCurrentUser(): JsonResponse
    {
        $userId = session()->get('uuid');
        if (!$userId) {
            return response()->json('Unauthorized', 401);
        }

        $user = User::query()->where('uuid', $userId)->first();
        return response()->json($user);
    }

}
