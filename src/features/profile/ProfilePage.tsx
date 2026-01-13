import { useState, useRef, useEffect } from "react";
import {
  FaCamera,
  FaUser,
  FaTimes,
  FaSpinner,
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

// --- Custom Toast Component ---
const Toast = ({
  message,
  type,
  onClose,
}: {
  message: string | null;
  type: "success" | "error";
  onClose: () => void;
}) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const isSuccess = type === "success";
  const bgClass = isSuccess ? "bg-brand-500" : "bg-red-500";
  const icon = isSuccess ? (
    <FaCheckCircle className="text-white text-lg" />
  ) : (
    <FaExclamationCircle className="text-white text-lg" />
  );

  return (
    <div
      className={`fixed top-24 right-5 z-[100] flex items-center gap-3 px-6 py-4 rounded-lg shadow-lg text-white transform transition-all duration-300 translate-x-0 ${bgClass}`}
    >
      {icon}
      <span className="font-medium text-sm">{message}</span>
      <button onClick={onClose} className="text-white/80 hover:text-white ml-4">
        <FaTimes />
      </button>
    </div>
  );
};

const ProfilePage = () => {
  const dispatch = useAppDispatch();

  // Get current user from Auth state
  const { user: authUser } = useAppSelector((state) => state.auth);

  // Get loading/error state from Profile slice
  const { loading, error, successMessage } = useAppSelector(
    (state) => state.profile
  );

  // Form State
  const [name, setName] = useState(() => authUser?.name || "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    () => authUser?.avatarUrl || null
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup Blob URL
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // --- Dirty State Logic ---
  const isDirty = name !== authUser?.name || avatarFile !== null;

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
    if (!authUser || !isDirty) return;

    const formData = new FormData();
    formData.append("name", name);

    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    const resultAction = await dispatch(updateProfile(formData));

    if (updateProfile.fulfilled.match(resultAction)) {
      dispatch(checkAuth());
      setAvatarFile(null);
      if (resultAction.payload?.avatarUrl) {
        setPreviewUrl(resultAction.payload.avatarUrl);
      }
    }
  };

  return (
    <div
      key={authUser?.id || "loading"}
      className="min-h-screen bg-ui-bg pb-20 pt-28 px-4 sm:px-6 lg:px-8"
    >
      {/* Custom Toast Notification */}
      {successMessage && (
        <Toast
          message={successMessage}
          type="success"
          onClose={() => dispatch(clearSuccess())}
        />
      )}
      {error && (
        <Toast
          message={error}
          type="error"
          onClose={() => dispatch(clearError())}
        />
      )}

      <div className="max-w-6xl mx-auto">
        {/* Page Header */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN: Avatar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-ui-card rounded-xl shadow-sm border border-ui-border overflow-hidden">
              <div className="bg-brand-50/50 p-6 border-b border-ui-border">
                <h2 className="text-sm font-semibold text-ui-text uppercase tracking-wider">
                  Profile Photo
                </h2>
              </div>

              <div className="p-8 flex flex-col items-center">
                <div
                  className="relative group cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-36 h-36 rounded-full overflow-hidden ring-4 ring-ui-bg shadow-md relative transition-transform duration-300 group-hover:scale-105">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-ui-bg flex items-center justify-center text-ui-muted">
                        <FaUser className="w-20 h-20" />
                      </div>
                    )}
                  </div>

                  <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FaCamera className="text-white text-2xl" />
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg, image/png, image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-ui-text">
                    {previewUrl ? "Change Photo" : "Upload Photo"}
                  </p>
                  <p className="text-xs text-ui-muted mt-1">
                    JPG, PNG or WEBP. Max 2MB.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Form (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-ui-card rounded-xl shadow-sm border border-ui-border">
              {/* Header */}
              <div className="bg-ui-card px-6 py-5 border-b border-ui-border">
                <h2 className="text-lg font-semibold text-ui-text">
                  Personal Information
                </h2>
                <p className="text-sm text-ui-muted mt-1">
                  Update your display name and public profile.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-8 pb-8">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-ui-text mb-2"
                    >
                      Display Name
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

                    {/* FIXED: Reserved height for "Unsaved changes" text to prevent layout shifts */}
                    <div className="min-h-[20px] mt-1">
                      {name !== authUser?.name && (
                        <p className="text-xs text-brand-600">
                          Unsaved changes
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email Field (Read Only) */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-ui-text mb-2"
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
                  </div>
                </div>

                {/* Action Button - Always Visible */}
                <div className="pt-6 border-t border-ui-border flex justify-end">
                  <button
                    type="submit"
                    disabled={!isDirty || loading}
                    className={`inline-flex items-center justify-center min-w-[140px] px-6 py-2.5 rounded-lg text-sm font-medium shadow-sm transition-all duration-300 ease-in-out
                      ${
                        !isDirty || loading
                          ? "bg-ui-bg border border-ui-border text-ui-muted opacity-60 cursor-not-allowed"
                          : "bg-brand-600 border-transparent text-white hover:bg-brand-500 focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 opacity-100 shadow-md transform active:scale-95"
                      }`}
                  >
                    {loading ? (
                      <>
                        <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
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
