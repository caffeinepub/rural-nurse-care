import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, CrossIcon, Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { ExternalBlob } from "../backend";
import { useRegisterNurse } from "../hooks/useQueries";
import { v4 as uuidv4 } from "../utils/uuid";

const SPECIALIZATIONS = [
  "General Care",
  "Elderly Care",
  "Pediatric Care",
  "Maternal & Child Health",
  "Post-Surgical Care",
  "Diabetes & Cardiac Care",
  "Palliative Care",
  "Physiotherapy Support",
  "Wound Care",
  "Mental Health Support",
];

interface FormState {
  name: string;
  registrationNumber: string;
  phone: string;
  pincode: string;
  experience: string;
  specialization: string;
  bio: string;
  isAvailable: boolean;
  photoFile: File | null;
}

const EMPTY: FormState = {
  name: "",
  registrationNumber: "",
  phone: "",
  pincode: "",
  experience: "",
  specialization: "",
  bio: "",
  isAvailable: true,
  photoFile: null,
};

export function NurseRegisterPage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [success, setSuccess] = useState(false);
  const registerNurse = useRegisterNurse();

  const set = (key: keyof FormState, value: string | boolean | File | null) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let profilePhoto: ExternalBlob | undefined = undefined;
      if (form.photoFile) {
        const bytes = new Uint8Array(await form.photoFile.arrayBuffer());
        profilePhoto = ExternalBlob.fromBytes(bytes);
      }
      await registerNurse.mutateAsync({
        id: uuidv4(),
        name: form.name,
        registrationNumber: form.registrationNumber,
        phone: form.phone,
        pincode: BigInt(form.pincode),
        experience: BigInt(form.experience || "0"),
        specialization: form.specialization,
        bio: form.bio,
        isAvailable: form.isAvailable,
        profilePhoto,
      });
      setSuccess(true);
      setForm(EMPTY);
    } catch {
      // error handled by mutation
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero banner */}
      <div className="bg-primary py-10 px-4">
        <div className="container mx-auto max-w-2xl text-center">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
            <CrossIcon size={28} className="text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Join as a Certified Nurse
          </h1>
          <p className="mt-2 text-sm text-white/80">
            Register your profile and connect with patients in your area
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Success message */}
        {success && (
          <div
            className="mb-6 flex items-start gap-3 bg-accent/20 border border-accent text-accent-foreground rounded-xl px-5 py-4"
            data-ocid="register.success_state"
          >
            <CheckCircle2 size={20} className="text-accent shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">
                Registration Successful!
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Your profile will be reviewed and published shortly. Thank you
                for joining Rural Nurse Care.
              </p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-card rounded-2xl border border-border shadow-sm p-6">
          <h2 className="text-lg font-bold text-foreground mb-5">
            Nurse Registration Form
          </h2>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
            data-ocid="register.modal"
          >
            {/* Full Name */}
            <div>
              <Label htmlFor="reg-name" className="text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="reg-name"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Priya Sharma"
                required
                className="mt-1.5 h-12"
                data-ocid="register.input"
              />
            </div>

            {/* Nursing Council Reg No */}
            <div>
              <Label htmlFor="reg-number" className="text-sm font-medium">
                Nursing Council Reg. No.{" "}
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="reg-number"
                value={form.registrationNumber}
                onChange={(e) => set("registrationNumber", e.target.value)}
                placeholder="e.g. AP/RN/2018/04521"
                required
                className="mt-1.5 h-12"
                data-ocid="register.input"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Your official Andhra Pradesh Nursing Council registration number
              </p>
            </div>

            {/* Phone + Pincode */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reg-phone" className="text-sm font-medium">
                  Phone Number <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reg-phone"
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  inputMode="tel"
                  required
                  className="mt-1.5 h-12"
                  data-ocid="register.input"
                />
              </div>
              <div>
                <Label htmlFor="reg-pincode" className="text-sm font-medium">
                  6-digit Pincode <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reg-pincode"
                  value={form.pincode}
                  onChange={(e) =>
                    set(
                      "pincode",
                      e.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  placeholder="e.g. 533001"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  className="mt-1.5 h-12"
                  data-ocid="register.input"
                />
              </div>
            </div>

            {/* Experience + Specialization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reg-exp" className="text-sm font-medium">
                  Years of Experience{" "}
                  <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="reg-exp"
                  type="number"
                  min={0}
                  max={60}
                  value={form.experience}
                  onChange={(e) => set("experience", e.target.value)}
                  placeholder="e.g. 5"
                  required
                  className="mt-1.5 h-12"
                  data-ocid="register.input"
                />
              </div>
              <div>
                <Label htmlFor="reg-spec" className="text-sm font-medium">
                  Specialization <span className="text-destructive">*</span>
                </Label>
                <select
                  id="reg-spec"
                  value={form.specialization}
                  onChange={(e) => set("specialization", e.target.value)}
                  required
                  className="mt-1.5 h-12 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  data-ocid="register.select"
                >
                  <option value="" disabled>
                    Select specialization
                  </option>
                  {SPECIALIZATIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="reg-bio" className="text-sm font-medium">
                Bio / Description{" "}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </Label>
              <Textarea
                id="reg-bio"
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                placeholder="Brief professional summary — your experience, areas served, approach to care..."
                rows={3}
                className="mt-1.5"
                data-ocid="register.textarea"
              />
            </div>

            {/* Photo upload */}
            <div>
              <Label className="text-sm font-medium">
                Profile Photo{" "}
                <span className="text-muted-foreground text-xs">
                  (optional)
                </span>
              </Label>
              <label
                htmlFor="reg-photo"
                className="mt-1.5 flex items-center gap-3 w-full border-2 border-dashed border-border rounded-xl px-4 py-4 cursor-pointer hover:border-primary transition-colors"
                data-ocid="register.upload_button"
              >
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <Upload size={16} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {form.photoFile ? form.photoFile.name : "Upload your photo"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG, WEBP — max 5 MB
                  </p>
                </div>
                <input
                  id="reg-photo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    set("photoFile", e.target.files?.[0] || null)
                  }
                />
              </label>
            </div>

            {/* Availability */}
            <div className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3">
              <Switch
                id="reg-available"
                checked={form.isAvailable}
                onCheckedChange={(v) => set("isAvailable", v)}
                data-ocid="register.switch"
              />
              <div>
                <Label
                  htmlFor="reg-available"
                  className="text-sm font-medium cursor-pointer"
                >
                  Available for appointments
                </Label>
                <p className="text-xs text-muted-foreground">
                  Patients can see and contact you right away
                </p>
              </div>
            </div>

            {/* Error */}
            {registerNurse.isError && (
              <div
                className="text-sm text-destructive bg-destructive/10 rounded-lg px-4 py-3"
                data-ocid="register.error_state"
              >
                Registration failed. Please try again.
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              disabled={registerNurse.isPending}
              className="w-full h-12 text-base font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
              data-ocid="register.submit_button"
            >
              {registerNurse.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting Registration...
                </>
              ) : (
                "Submit Registration"
              )}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By registering, you confirm that your credentials are valid and you
          are a licensed nurse under the Andhra Pradesh Nursing Council.
        </p>
      </div>
    </div>
  );
}
