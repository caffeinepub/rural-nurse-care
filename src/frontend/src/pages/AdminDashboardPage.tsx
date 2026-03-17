import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, RefreshCw, Shield, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useDeleteNurse, useListAllNurses } from "../hooks/useQueries";

const ADMIN_PASSWORD = "RuralCare@Admin2024";

export function AdminDashboardPage() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("adminAuth") === "true",
  );
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const { data: nurses, isLoading, refetch } = useListAllNurses();
  const deleteMutation = useDeleteNurse();
  const qc = useQueryClient();

  useEffect(() => {
    if (authed) {
      qc.invalidateQueries({ queryKey: ["nurses"] });
      refetch();
    }
  }, [authed, qc, refetch]);

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (pw === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminAuth", "true");
      setAuthed(true);
      setPwError("");
    } else {
      setPwError("Incorrect password. Please try again.");
    }
  }

  function logout() {
    sessionStorage.removeItem("adminAuth");
    setAuthed(false);
  }

  function handleDelete(id: string) {
    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Nurse profile deleted.");
        setConfirmId(null);
      },
      onError: () => {
        toast.error("Failed to delete. Please try again.");
        setConfirmId(null);
      },
    });
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center mb-3">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800">Admin Access</h1>
            <p className="text-sm text-gray-500 mt-1">Rural Nurse Care</p>
          </div>
          <form onSubmit={login} className="space-y-4">
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                placeholder="Enter admin password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="current-password"
                data-ocid="admin.input"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                onClick={() => setShowPw(!showPw)}
              >
                {showPw ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {pwError && (
              <p className="text-red-500 text-sm" data-ocid="admin.error_state">
                {pwError}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 text-sm font-semibold transition-colors"
              data-ocid="admin.submit_button"
            >
              Access Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span className="font-bold text-gray-800">Admin Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                qc.invalidateQueries({ queryKey: ["nurses"] });
                refetch();
              }}
              className="text-sm text-blue-600 hover:text-blue-800 border border-blue-300 rounded-lg px-3 py-1 flex items-center gap-1"
              data-ocid="admin.secondary_button"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Refresh
            </button>
            <button
              type="button"
              onClick={logout}
              className="text-sm text-gray-500 hover:text-gray-800 border border-gray-300 rounded-lg px-3 py-1"
              data-ocid="admin.button"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Registered Nurses
          {!isLoading && nurses && (
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({nurses.length} total)
            </span>
          )}
        </h2>

        {isLoading && (
          <div
            className="text-center py-12 text-gray-400"
            data-ocid="admin.loading_state"
          >
            Loading nurses...
          </div>
        )}

        {!isLoading && (!nurses || nurses.length === 0) && (
          <div
            className="text-center py-12 bg-white rounded-xl border"
            data-ocid="admin.empty_state"
          >
            <p className="text-gray-500">No nurses registered yet.</p>
          </div>
        )}

        {!isLoading && nurses && nurses.length > 0 && (
          <div className="space-y-3" data-ocid="admin.list">
            {nurses.map((nurse, idx) => {
              let photoUrl: string | undefined;
              try {
                photoUrl = nurse.profilePhoto?.getDirectURL();
              } catch {
                photoUrl = undefined;
              }
              const initials = (nurse.name || "?")
                .split(" ")
                .map((n: string) => n[0] || "")
                .join("")
                .toUpperCase()
                .slice(0, 2);

              return (
                <div
                  key={nurse.id}
                  className="bg-white rounded-xl border shadow-sm p-4 flex items-center gap-4"
                  data-ocid={`admin.item.${idx + 1}`}
                >
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden shrink-0">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt={nurse.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="text-blue-600 font-bold text-sm">
                        {initials}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">
                      {nurse.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Reg: {nurse.registrationNumber} &middot; Pincode:{" "}
                      {String(nurse.pincode)}
                    </p>
                    <p className="text-xs text-gray-400">
                      {nurse.phone} &middot; {String(nurse.experience)} yrs exp
                    </p>
                    {(nurse.village || nurse.mandal || nurse.district) && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {[nurse.village, nurse.mandal, nurse.district]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}
                  </div>

                  {confirmId === nurse.id ? (
                    <div className="flex gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleDelete(nurse.id)}
                        disabled={deleteMutation.isPending}
                        className="text-xs bg-red-600 text-white rounded-lg px-3 py-1.5 font-semibold"
                        data-ocid={`admin.confirm_button.${idx + 1}`}
                      >
                        {deleteMutation.isPending ? "Deleting..." : "Confirm"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmId(null)}
                        className="text-xs border border-gray-300 rounded-lg px-3 py-1.5"
                        data-ocid={`admin.cancel_button.${idx + 1}`}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      className="shrink-0 gap-1.5"
                      onClick={() => setConfirmId(nurse.id)}
                      data-ocid={`admin.delete_button.${idx + 1}`}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
