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
        <Card className="shadow-2xl border-slate-200 dark:border-slate-700">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
                <CardDescription>
                    Enter your WhatsApp number to receive an OTP and access your account
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400">
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
                                className="pl-7"
                                pattern="62[0-9]{9,13}"
                            />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                            Enter your number with country code (e.g., 62812345678 for Indonesia)
                        </p>
                    </div>

                    {!isOtpSent ? (
                        <Button
                            type="button"
                            onClick={handleSendOtp}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? "Sending OTP..." : "Send OTP"}
                        </Button>
                    ) : (
                        <>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="otp">OTP Code</Label>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsOtpSent(false);
                                            setOtp("");
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
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
                                />
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    OTP has been sent to your WhatsApp number
                                </p>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Verifying...
                                    </>
                                ) : (
                                    "Verify & Sign In"
                                )}
                            </Button>
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4 mt-4">

                    <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/auth/register"
                            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
