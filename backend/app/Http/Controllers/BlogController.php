<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BlogController extends Controller
{
    public function index(Request $request)
    {
        $query = Blog::query();
        
        // For unauthenticated users, only show published blogs
        if (!Auth::check()) {
            $query->published();
        } else {
            // For authenticated users, show their own blogs (published or not) and other published blogs
            $query->where(function($q) {
                $q->published()
                  ->orWhere('user_id', Auth::id());
            });
        }

        $blogs = $query->latest()
            ->with('user:id,name')
            ->paginate(10);

        return response()->json($blogs);
    }

    public function show(Blog $blog)
    {
        // Allow access if blog is published or user is the author
        if (!$blog->is_published && (!Auth::check() || Auth::id() !== $blog->user_id)) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Load the user relationship for the blog
        $blog->load('user:id,name');

        return response()->json($blog);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_published' => 'boolean'
        ]);

        $blog = Auth::user()->blogs()->create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'is_published' => $validated['is_published'] ?? false,
            'published_at' => $validated['is_published'] ? now() : null
        ]);

        return response()->json($blog, 201);
    }

    public function update(Request $request, Blog $blog)
    {
        if (Auth::id() !== $blog->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'is_published' => 'boolean'
        ]);

        $blog->update([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'is_published' => $validated['is_published'] ?? $blog->is_published,
            'published_at' => $validated['is_published'] ? ($blog->published_at ?? now()) : null
        ]);

        return response()->json($blog);
    }

    public function destroy(Blog $blog)
    {
        if (Auth::id() !== $blog->user_id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $blog->delete();
        return response()->json(null, 204);
    }
} 