import { useState, useRef, useEffect } from "react";
import {
  FaCamera,
  FaUser,
  FaCheckCircle,
  FaExclamationCircle,
} from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { updateProfile, clearError, clearSuccess } from "./profileSlice";
import { checkAuth } from "../auth/authSlice";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

const ProfilePage = () => {
  const dispatch = useAppDispatch();

  // Get current user from Auth state
  const { user: authUser } = useAppSelector((state) => state.auth);

  // Get loading/error state from Profile slice
  const { loading, error, successMessage } = useAppSelector(
    (state) => state.profile
  );

  // Form State
  const [name, setName] = useState(authUser?.name || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    authUser?.avatarUrl || null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync form if authUser loads
  useEffect(() => {
    if (authUser) {
      setName(authUser.name);
      setPreviewUrl(authUser.avatarUrl);
    }
  }, [authUser]);

  // Cleanup object URL to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB");
        return;
      }

      setAvatarFile(file);
      setPreviewUrl(URL.createObjectURL(file));

      if (error) dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!authUser) return;

    const formData = new FormData();
    formData.append("name", name);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const resultAction = await dispatch(updateProfile(formData));

    if (updateProfile.fulfilled.match(resultAction)) {
      dispatch(checkAuth());

      setAvatarFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-ui-bg pb-20 pt-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ui-text tracking-tight">
            Account Settings
          </h1>
          <p className="mt-2 text-ui-muted">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>

        {/* Status Banners */}
        <div className="mb-6 space-y-3">
          {error && (
            <div className="flex items-center p-4 rounded-lg bg-red-50 border border-red-200 text-red-800">
              <FaExclamationCircle className="mr-3 text-red-500 flex-shrink-0" />
              <p className="text-sm font-medium">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center p-4 rounded-lg bg-green-50 border border-green-200 text-green-800">
              <FaCheckCircle className="mr-3 text-green-600 flex-shrink-0" />
              <p className="text-sm font-medium">{successMessage}</p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Identity / Avatar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-ui-card rounded-xl shadow-sm border border-ui-border overflow-hidden">
              <div className="bg-brand-50/50 p-6 border-b border-ui-border">
                <h2 className="text-sm font-semibold text-ui-text uppercase tracking-wider">
                  Profile Photo
                </h2>
              </div>

              <div className="p-6 flex flex-col items-center">
                <div className="relative group">
                  {/* Avatar Image */}
                  <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-ui-bg shadow-md relative">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full bg-ui-bg flex items-center justify-center text-ui-muted">
                        <FaUser className="w-16 h-16" />
                      </div>
                    )}
                  </div>

                  {/* Camera Button Overlay */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 bg-brand-500 hover:bg-brand-600 text-white rounded-full p-2.5 shadow-lg transition-transform hover:scale-110 focus:outline-none ring-2 ring-white"
                  >
                    <FaCamera className="w-4 h-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg, image/png, image/webp"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-ui-text">
                    {name || "User Name"}
                  </p>
                  <p className="text-xs text-ui-muted mt-1">
                    JPG, GIF or PNG. Max 2MB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Form / Information (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-ui-card rounded-xl shadow-sm border border-ui-border">
              <div className="bg-ui-card px-6 py-4 border-b border-ui-border">
                <h2 className="text-lg font-semibold text-ui-text">
                  Personal Information
                </h2>
                <p className="text-sm text-ui-muted mt-1">
                  Update your account's personal information.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Name Field */}
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-ui-text mb-1.5"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ui-muted">
                        <FaUser className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (error) dispatch(clearError());
                        }}
                        className="pl-10 block w-full rounded-lg border border-ui-border bg-ui-bg py-2.5 text-sm text-ui-text placeholder:text-ui-muted focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors outline-none"
                        placeholder="e.g. Alex Johnson"
                      />
                    </div>
                  </div>

                  {/* Email Field (Read Only) */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-ui-text mb-1.5"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-ui-muted">
                        <span className="text-sm">@</span>
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={authUser?.email || ""}
                        disabled
                        className="pl-10 block w-full rounded-lg border border-ui-border bg-ui-bg/50 py-2.5 text-sm text-ui-muted cursor-not-allowed focus:outline-none"
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-ui-muted">
                      Contact support to change your registered email address.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-6 border-t border-ui-border flex items-center justify-end gap-3">
                  {successMessage && (
                    <button
                      type="button"
                      onClick={() => dispatch(clearSuccess())}
                      className="px-4 py-2 text-sm font-medium text-ui-muted hover:text-ui-text transition-colors"
                    >
                      Close
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-brand-600 hover:bg-brand-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
