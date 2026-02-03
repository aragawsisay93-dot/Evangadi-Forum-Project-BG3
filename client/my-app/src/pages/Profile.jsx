// // src/pages/Profile.jsx
// import { useMemo, useState, useEffect } from "react";
// import api from "../services/api";
// import { useAuth } from "../context/AuthContext";
// import { toAvatarUrl } from "../utils/avatar";

// export default function Profile() {
//   const { auth, setAuth } = useAuth();

//   const [file, setFile] = useState(null);
//   const [msg, setMsg] = useState("");
//   const [err, setErr] = useState("");
//   const [loading, setLoading] = useState(false);

//   // ✅ user from AuthContext first, fallback localStorage
//   const user = useMemo(() => {
//     if (auth?.user) return auth.user;
//     try {
//       return JSON.parse(localStorage.getItem("user") || "null");
//     } catch {
//       return null;
//     }
//   }, [auth?.user]);

//   // ✅ local preview url
//   const previewUrl = useMemo(() => {
//     if (!file) return "";
//     return URL.createObjectURL(file);
//   }, [file]);

//   // ✅ clean up object URL to avoid memory leak
//   useEffect(() => {
//     return () => {
//       if (previewUrl) URL.revokeObjectURL(previewUrl);
//     };
//   }, [previewUrl]);

//   const uploadAvatar = async (e) => {
//     e.preventDefault();
//     if (!file || !user) return;

//     try {
//       setLoading(true);
//       setErr("");
//       setMsg("");

//       const fd = new FormData();
//       fd.append("avatar", file); // ✅ MUST match upload.single("avatar")

//       // api interceptor should add Authorization Bearer token ✅
//       const res = await api.post("/profile/avatar", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // ✅ support BOTH backend response styles:
//       // 1) res.data.user (best)
//       // 2) res.data.avatar_url (fallback)
//       const serverUser = res.data?.user;
//       const avatar_url = res.data?.avatar_url;

//       const updatedUser = serverUser ? serverUser : { ...user, avatar_url };

//       // ✅ update everywhere
//       setAuth((prev) => ({ ...prev, user: updatedUser }));
//       localStorage.setItem("user", JSON.stringify(updatedUser));

//       // ✅ force header update in same tab (optional but helps)
//       window.dispatchEvent(new Event("storage"));

//       setMsg("Profile picture updated!");
//       setFile(null);
//     } catch (e2) {
//       setErr(e2?.response?.data?.message || e2.message || "Upload failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (!user) return <p style={{ padding: 20 }}>User not found.</p>;

//   return (
//     <div style={{ maxWidth: 600, margin: "30px auto", padding: 16 }}>
//       <h2>My Profile</h2>

//       <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
//         <img
//           src={previewUrl || toAvatarUrl(user.avatar_url)}
//           alt="avatar"
//           style={{
//             width: 96,
//             height: 96,
//             borderRadius: "50%",
//             objectFit: "cover",
//             border: "1px solid #e5e7eb",
//             background: "#f3f4f6",
//           }}
//           onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
//         />

//         <div>
//           <div style={{ fontWeight: 700, fontSize: 16 }}>{user.username}</div>
//           <div style={{ color: "#6b7280", fontSize: 13 }}>{user.email}</div>
//         </div>
//       </div>

//       <form onSubmit={uploadAvatar} style={{ marginTop: 16 }}>
//         <input
//           type="file"
//           accept="image/*"
//           onChange={(e) => setFile(e.target.files?.[0] || null)}
//         />

//         <button
//           type="submit"
//           disabled={loading || !file}
//           style={{ marginLeft: 10 }}
//         >
//           {loading ? "Uploading..." : "Upload / Change"}
//         </button>

//         {file && (
//           <button
//             type="button"
//             style={{ marginLeft: 10 }}
//             onClick={() => setFile(null)}
//           >
//             Cancel
//           </button>
//         )}
//       </form>

//       {msg && <p style={{ color: "green", marginTop: 10 }}>{msg}</p>}
//       {err && <p style={{ color: "red", marginTop: 10 }}>{err}</p>}
//     </div>
//   );
// }
import { useMemo, useState, useEffect } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toAvatarUrl } from "../utils/avatar";

export default function Profile() {
  const { auth, setAuth } = useAuth();

  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const user = useMemo(() => auth?.user || null, [auth?.user]);

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file],
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const uploadAvatar = async (e) => {
    e.preventDefault();
    if (!file || !user) return;

    try {
      setLoading(true);
      setErr("");
      setMsg("");

      const fd = new FormData();
      fd.append("avatar", file); // ✅ must match backend .single("avatar")

      const res = await api.post("/profile/avatar", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updatedUser = res.data.user;

      // ✅ cache-buster version so new image always shows
      updatedUser.avatar_v = Date.now();

      setAuth((prev) => ({ ...prev, user: updatedUser }));
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("storage"));

      setMsg("Profile picture updated!");
      setFile(null);
    } catch (e2) {
      setErr(e2?.response?.data?.message || e2.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p style={{ padding: 20 }}>User not found.</p>;

  return (
    <div style={{ maxWidth: 600, margin: "30px auto", padding: 16 }}>
      <h2>My Profile</h2>

      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
        <img
          src={previewUrl || toAvatarUrl(user.avatar_url, user.avatar_v)}
          alt="avatar"
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid #e5e7eb",
            background: "#f3f4f6",
          }}
          onError={(e) => (e.currentTarget.src = "/default-avatar.png")}
        />

        <div>
          <div style={{ fontWeight: 700, fontSize: 16 }}>{user.username}</div>
          <div style={{ color: "#6b7280", fontSize: 13 }}>{user.email}</div>
        </div>
      </div>

      <form onSubmit={uploadAvatar} style={{ marginTop: 16 }}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        <button
          type="submit"
          disabled={loading || !file}
          style={{ marginLeft: 10 }}
        >
          {loading ? "Uploading..." : "Upload / Change"}
        </button>

        {file && (
          <button
            type="button"
            style={{ marginLeft: 10 }}
            onClick={() => setFile(null)}
          >
            Cancel
          </button>
        )}
      </form>

      {msg && <p style={{ color: "green", marginTop: 10 }}>{msg}</p>}
      {err && <p style={{ color: "red", marginTop: 10 }}>{err}</p>}
    </div>
  );
}
