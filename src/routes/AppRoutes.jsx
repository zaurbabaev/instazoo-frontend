import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";

import Login from "../pages/Login";
import Register from "../pages/Register";
import Feed from "../pages/Feed";
import Profile from "../pages/Profile";
import CreatePost from "../pages/CreatePost";
import Settings from "../pages/Settings";
import PostDetail from "../pages/PostDetail";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }>
        <Route index element={<Feed />} />
        <Route path="profile" element={<Profile />} />
        <Route path="create" element={<CreatePost />} />
        <Route path="settings" element={<Settings />} />
        <Route path="post/:id" element={<PostDetail />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
