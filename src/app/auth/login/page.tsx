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
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuthToken, setUserData } from "@/utils/cookies";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
        setWhatsappNumber(formatted);
    };

    const handleSendOtp = async () => {
        if (!whatsappNumber) {
            alert("Please enter your WhatsApp number");
            return;
        }

        // Open WhatsApp link to send OTP request
        const waNumber = "6281776741009";
        const message = encodeURIComponent("SEND OTP");
        const waLink = `https://wa.me/${waNumber}?text=${message}`;
        
        window.open(waLink, "_blank");
        
        // Mark OTP as sent after opening WhatsApp
        setIsOtpSent(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!isOtpSent) {
            handleSendOtp();
            return;
        }

        // Validate OTP format
        if (otp.length !== 6) {
            toast.error("Invalid OTP", {
                description: "OTP must be 6 digits",
                icon: <AlertCircle className="h-5 w-5" />,
            });
            setError("OTP must be 6 digits");
            return;
        }

        setIsLoading(true);

        try {
            // Call login API
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    whatsappNumber,
                    otp,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                toast.error("Login Failed", {
                    description: data.error || "Invalid credentials",
                    icon: <AlertCircle className="h-5 w-5" />,
                });
                setError(data.error || "Login failed. Please try again.");
                setIsLoading(false);
                return;
            }

            // Save token and user data in cookies
            setAuthToken(data.data.token);
            setUserData(data.data.user);

            // Show success and redirect
            toast.success("Login Successful!", {
                description: `Welcome back, ${data.data.user.name || 'User'}!`,
                icon: <CheckCircle2 className="h-5 w-5" />,
            });

            // Redirect to dashboard
            setTimeout(() => {
                router.push('/dashboard');
            }, 500);

        } catch (err) {
            console.error("Login error:", err);
            toast.error("Login Failed", {
                description: "An unexpected error occurred",
                icon: <AlertCircle className="h-5 w-5" />,
            });
            setError("An unexpected error occurred. Please try again.");
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-slate-900/80 backdrop-blur-sm border-slate-700 shadow-2xl shadow-blue-500/10">
            <CardHeader className="space-y-2">
                <CardTitle className="text-3xl font-bold text-white">Welcome Back! 👋</CardTitle>
                <CardDescription className="text-slate-300 text-base">
                    Enter your WhatsApp number to receive an OTP
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
                        <Label htmlFor="whatsappNumber" className="text-slate-200">WhatsApp Number</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                                +
                            </span>
                            <Input
                                id="whatsappNumber"
                                type="tel"
                                placeholder="62812345678"
                                value={whatsappNumber}
                                onChange={handleWhatsAppChange}
                                required
                                disabled={isLoading || isOtpSent}
                                className="pl-7 bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20"
                                pattern="62[0-9]{9,13}"
                            />
                        </div>
                        <p className="text-xs text-slate-400">
                            Enter your number with country code (e.g., 62812345678)
                        </p>
                    </div>

                    {!isOtpSent ? (
                        <Button
                            type="button"
                            onClick={handleSendOtp}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all h-11"
                            disabled={isLoading}
                        >
                            {isLoading ? "Sending OTP..." : "Send OTP via WhatsApp"}
                        </Button>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="otp" className="text-slate-200">OTP Code</Label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsOtpSent(false);
                                            setOtp("");
                                        }}
                                        className="text-sm text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline"
                                    >
                                        Change number
                                    </button>
                                </div>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                    disabled={isLoading}
                                    maxLength={6}
                                    pattern="[0-9]{6}"
                                    className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500 focus:ring-blue-500/20 text-center text-lg tracking-widest"
                                />
                                <p className="text-xs text-slate-400">
                                    Check your WhatsApp for the 6-digit code
                                </p>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify & Sign In"
                                )}
                            </Button>
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 mt-4 border-t border-slate-700 pt-6">
                    <p className="text-center text-sm text-slate-300">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/auth/register"
                            className="font-semibold text-blue-400 hover:text-blue-300 underline-offset-4 hover:underline"
                        >
                            Create account
                        </Link>
                    </p>
                    <Link href="/" className="text-center text-sm text-slate-400 hover:text-slate-300 transition-colors">
                        ← Back to home
                    </Link>
                </CardFooter>
            </form>
        </Card>
    );
}
