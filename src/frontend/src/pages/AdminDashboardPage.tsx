import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, EyeOff, LogOut, Shield, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Nurse } from "../backend";
import { useDeleteNurse, useListAllNurses } from "../hooks/useQueries";

const ADMIN_PASSWORD = "RuralCare@Admin2024";

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem("adminAuth", "true");
      setError("");
      onUnlock();
    } else {
      setError("Incorrect password. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-medical-50 to-medical-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-medical-200">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-medical-600 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-medical-900">
            Admin Dashboard
          </CardTitle>
          <CardDescription className="text-medical-600">
            Enter admin password to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Input
                data-ocid="admin.input"
                type={showPassword ? "text" : "password"}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10 border-medical-300 focus:border-medical-500"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-medical-400 hover:text-medical-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {error && (
              <p
                data-ocid="admin.error_state"
                className="text-destructive text-sm font-medium"
              >
                {error}
              </p>
            )}
            <Button
              data-ocid="admin.submit_button"
              type="submit"
              className="w-full bg-medical-600 hover:bg-medical-700 text-white"
            >
              Access Dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function NurseRow({
  nurse,
  index,
  onDeleteClick,
}: {
  nurse: Nurse;
  index: number;
  onDeleteClick: (nurse: Nurse) => void;
}) {
  const initials = nurse.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const photoUrl = nurse.profilePhoto?.getDirectURL();

  return (
    <TableRow
      data-ocid={`nurses.item.${index}`}
      className="hover:bg-medical-50"
    >
      <TableCell>
        <Avatar className="h-10 w-10">
          <AvatarImage src={photoUrl} alt={nurse.name} />
          <AvatarFallback className="bg-medical-200 text-medical-700 text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </TableCell>
      <TableCell className="font-medium text-medical-900">
        {nurse.name}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground font-mono">
        {nurse.registrationNumber}
      </TableCell>
      <TableCell className="text-sm">{nurse.phone}</TableCell>
      <TableCell className="text-sm">{String(nurse.pincode)}</TableCell>
      <TableCell className="text-sm">{nurse.specialization || "—"}</TableCell>
      <TableCell className="text-sm text-center">
        {String(nurse.experience)}
      </TableCell>
      <TableCell>
        <Badge
          variant={nurse.isAvailable ? "default" : "secondary"}
          className={
            nurse.isAvailable
              ? "bg-green-100 text-green-700 border-green-200"
              : "bg-gray-100 text-gray-600"
          }
        >
          {nurse.isAvailable ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell>
        <Button
          data-ocid={`nurses.delete_button.${index}`}
          variant="destructive"
          size="sm"
          className="gap-1.5"
          onClick={() => onDeleteClick(nurse)}
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </Button>
      </TableCell>
    </TableRow>
  );
}

function AdminDashboardContent({ onLogout }: { onLogout: () => void }) {
  const { data: nurses, isLoading } = useListAllNurses();
  const deleteMutation = useDeleteNurse();
  const [nurseToDelete, setNurseToDelete] = useState<Nurse | null>(null);

  function handleConfirmDelete() {
    if (!nurseToDelete) return;
    deleteMutation.mutate(nurseToDelete.id, {
      onSuccess: () => {
        toast.success("Nurse profile deleted successfully.");
        setNurseToDelete(null);
      },
      onError: () => {
        toast.error("Failed to delete nurse profile. Please try again.");
        setNurseToDelete(null);
      },
    });
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-medical-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-medical-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-medical-900">
                Admin Dashboard
              </h1>
              <p className="text-xs text-medical-500">
                Manage registered nurse profiles
              </p>
            </div>
          </div>
          <Button
            data-ocid="admin.secondary_button"
            variant="outline"
            size="sm"
            className="gap-2 border-medical-300 text-medical-700 hover:bg-medical-50"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <Card className="shadow-sm border-medical-200">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-medical-900">
                  Registered Nurses
                </CardTitle>
                <CardDescription>
                  {isLoading
                    ? "Loading nurse records..."
                    : `${nurses?.length ?? 0} nurse${(nurses?.length ?? 0) !== 1 ? "s" : ""} registered`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-3" data-ocid="nurses.loading_state">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <Skeleton className="h-4 flex-1" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : !nurses || nurses.length === 0 ? (
              <div
                data-ocid="nurses.empty_state"
                className="flex flex-col items-center justify-center py-16 text-center"
              >
                <div className="w-16 h-16 rounded-full bg-medical-100 flex items-center justify-center mb-4">
                  <Shield className="w-8 h-8 text-medical-400" />
                </div>
                <p className="text-lg font-medium text-medical-700">
                  No nurses registered yet
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Nurse profiles will appear here once they register.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table data-ocid="nurses.table">
                  <TableHeader>
                    <TableRow className="bg-medical-50 hover:bg-medical-50">
                      <TableHead className="text-medical-700 font-semibold">
                        Photo
                      </TableHead>
                      <TableHead className="text-medical-700 font-semibold">
                        Name
                      </TableHead>
                      <TableHead className="text-medical-700 font-semibold">
                        Reg. No.
                      </TableHead>
                      <TableHead className="text-medical-700 font-semibold">
                        Phone
                      </TableHead>
                      <TableHead className="text-medical-700 font-semibold">
                        Pincode
                      </TableHead>
                      <TableHead className="text-medical-700 font-semibold">
                        Specialization
                      </TableHead>
                      <TableHead className="text-medical-700 font-semibold text-center">
                        Exp (yrs)
                      </TableHead>
                      <TableHead className="text-medical-700 font-semibold">
                        Status
                      </TableHead>
                      <TableHead className="text-medical-700 font-semibold">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {nurses.map((nurse, idx) => (
                      <NurseRow
                        key={nurse.id}
                        nurse={nurse}
                        index={idx + 1}
                        onDeleteClick={setNurseToDelete}
                      />
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Confirm Delete Dialog */}
      <AlertDialog
        open={!!nurseToDelete}
        onOpenChange={(open) => !open && setNurseToDelete(null)}
      >
        <AlertDialogContent data-ocid="nurses.dialog">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Nurse Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-foreground">
                {nurseToDelete?.name}
              </span>
              's profile? This will remove all their data and profile photo from
              the database. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-ocid="nurses.cancel_button">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              data-ocid="nurses.confirm_button"
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete Profile"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    () => sessionStorage.getItem("adminAuth") === "true",
  );

  function handleLogout() {
    sessionStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return <PasswordGate onUnlock={() => setIsAuthenticated(true)} />;
  }

  return <AdminDashboardContent onLogout={handleLogout} />;
}
