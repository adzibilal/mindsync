"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services";
import type { RegisterFormData } from "@/types";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, Phone } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    whatsappNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions", {
        description: "You must accept the terms to continue",
        icon: <AlertCircle className="h-5 w-5" />,
      });
      setError("Please agree to the terms and conditions");
      return;
    }

    // Validate WhatsApp number format
    const whatsappRegex = /^62\d{9,13}$/;
    if (!whatsappRegex.exec(formData.whatsappNumber)) {
      toast.error("Invalid WhatsApp number", {
        description: "Please use format: 62XXXXXXXXXX (e.g., 62812345678)",
        icon: <AlertCircle className="h-5 w-5" />,
      });
      setError("Invalid WhatsApp number format. Please use format: 62XXXXXXXXXX");
      return;
    }

    // Show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmRegistration = async () => {
    setShowConfirmDialog(false);
    setIsLoading(true);

    try {
      const response = await registerUser({
        whatsapp_number: formData.whatsappNumber,
        name: formData.name,
        email: formData.email,
      });

      if (response.success) {
        // Show success dialog
        setShowSuccessDialog(true);
        
        // Show success toast
        toast.success("Registration successful!", {
          description: "Your account has been created",
          icon: <CheckCircle2 className="h-5 w-5" />,
        });
      } else {
        setError(response.error || "Registration failed. Please try again.");
        toast.error("Registration failed", {
          description: response.error || "Please try again",
          icon: <AlertCircle className="h-5 w-5" />,
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("Registration failed", {
        description: "An unexpected error occurred. Please try again.",
        icon: <AlertCircle className="h-5 w-5" />,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    router.push(`/auth/login?registered=true&phone=${formData.whatsappNumber}`);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const formatWhatsAppNumber = (value: string) => {
    // Remove all non-numeric characters
    const numbers = value.replace(/\D/g, "");

    // If starts with 0, replace with 62
    if (numbers.startsWith("0")) {
      return "62" + numbers.slice(1);
    }

    // If doesn't start with 62, add it
    if (!numbers.startsWith("62")) {
      return "62" + numbers;
    }

    return numbers;
  };

  const handleWhatsAppChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsAppNumber(e.target.value);
    setFormData({
      ...formData,
      whatsappNumber: formatted,
    });
  };

  return (
    <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700 shadow-2xl shadow-blue-500/10">
      <CardHeader className="space-y-2">
        <CardTitle className="text-3xl font-bold text-white">Create Account 🚀</CardTitle>
        <CardDescription className="text-slate-300 text-base">
          Join MindSync and start managing your documents smarter
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg text-sm backdrop-blur-sm">
              {error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-slate-200">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-200">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="whatsappNumber" className="text-slate-200">WhatsApp Number</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                +
              </span>
              <Input
                id="whatsappNumber"
                type="tel"
                placeholder="62812345678"
                value={formData.whatsappNumber}
                onChange={handleWhatsAppChange}
                required
                disabled={isLoading}
                className="pl-7 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                pattern="62[0-9]{9,13}"
              />
            </div>
            <p className="text-xs text-slate-400">
              Enter your number with country code (e.g., 62812345678)
            </p>
          </div>

          <div className="flex items-start space-x-3 bg-slate-800/30 border border-slate-700 rounded-lg p-3">
            <input
              type="checkbox"
              id="terms"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
              disabled={isLoading}
            />
            <Label 
              htmlFor="terms" 
              className="text-sm font-normal cursor-pointer text-slate-300 leading-relaxed"
            >
              I agree to the{" "}
              <Link 
                href="/terms" 
                className="text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline"
              >
                terms and conditions
              </Link>
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 mt-4">
          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all h-11"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>

          <div className="border-t border-slate-700 pt-4 space-y-3">
            <p className="text-center text-sm text-slate-300">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-semibold text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
            <Link href="/" className="block text-center text-sm text-slate-400 hover:text-slate-300 transition-colors">
              ← Back to home
            </Link>
          </div>
        </CardFooter>
      </form>

      {/* WhatsApp Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className="bg-slate-900 border-slate-700">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-white">
              <Phone className="h-5 w-5 text-blue-400" />
              Konfirmasi Nomor WhatsApp
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-3 pt-2 text-slate-300">
              <p>Pastikan nomor WhatsApp Anda sudah benar:</p>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <p className="text-center text-2xl font-bold text-blue-400">
                  +{formData.whatsappNumber}
                </p>
              </div>
              <p className="text-sm">
                Nomor ini akan digunakan untuk login dan menerima kode OTP.
                Pastikan nomor aktif dan dapat menerima pesan.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading} className="bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700">
              Ubah Nomor
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmRegistration}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Processing..." : "Ya, Nomor Sudah Benar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md bg-slate-900 border-slate-700">
          <DialogHeader>
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-500/20 p-3">
                <CheckCircle2 className="h-12 w-12 text-green-400" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl text-white">
              Registrasi Berhasil! 🎉
            </DialogTitle>
            <DialogDescription className="text-center space-y-4 pt-4 text-slate-300">
              <p className="text-base">
                Akun Anda telah berhasil dibuat dengan nomor WhatsApp:
              </p>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
                <p className="font-semibold text-lg text-blue-400">
                  +{formData.whatsappNumber}
                </p>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-2">
                <p className="font-semibold text-blue-300">
                  Langkah Selanjutnya:
                </p>
                <ol className="list-decimal list-inside text-left space-y-1 text-sm text-slate-300">
                  <li>Klik tombol &ldquo;Login Sekarang&rdquo; di bawah</li>
                  <li>Masukkan nomor WhatsApp Anda</li>
                  <li>Masukkan kode OTP yang dikirim ke WhatsApp</li>
                  <li>Mulai gunakan MindSync! 🚀</li>
                </ol>
              </div>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 pt-4">
            <Button
              onClick={handleSuccessDialogClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/50"
            >
              Login Sekarang
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
