"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api";
import { saveSession, type SessionState } from "@/lib/session";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "patient",
    age: "",
    gender: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const session = await apiFetch<SessionState>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          age: formData.age ? Number(formData.age) : undefined,
          gender: formData.gender || undefined
        })
      });
      saveSession(session);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 p-6">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-3xl">❤️</div>
          </div>
          <h1 className="text-4xl font-bold text-white">Join Health Monitor</h1>
          <p className="mt-2 text-slate-300">Start tracking your vital signs today</p>
        </div>

        <Card className="border-white/10 bg-card/90 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-2xl">Create your account</CardTitle>
            <CardDescription>Set up your Electronic Health Record (EHR) profile</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Full name *</label>
                  <Input 
                    type="text" 
                    placeholder="Jordan Diaz" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Email address *</label>
                  <Input 
                    type="email" 
                    placeholder="you@example.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Age</label>
                  <Input 
                    type="number" 
                    placeholder="42" 
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Gender</label>
                  <select 
                    className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  >
                    <option value="">Select gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="O">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Password *</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  required
                  className="mt-1"
                />
                <p className="mt-1 text-xs text-muted-foreground">At least 8 characters with numbers and symbols</p>
              </div>

              <div>
                <label className="text-sm font-medium">Account Type</label>
                <div className="mt-2 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {[
                    { value: 'patient', label: 'Patient', icon: '🧑‍⚕️' },
                    { value: 'doctor', label: 'Doctor', icon: '👨‍⚕️' },
                    { value: 'admin', label: 'Admin', icon: '👔' },
                    { value: 'researcher', label: 'Researcher', icon: '🔬' }
                  ].map(role => (
                    <button
                      key={role.value}
                      type="button"
                      onClick={() => setFormData({...formData, role: role.value})}
                      className={`rounded-lg border p-3 text-center transition-all ${
                        formData.role === role.value 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:bg-accent'
                      }`}
                    >
                      <div className="text-2xl mb-1">{role.icon}</div>
                      <div className="text-xs font-medium">{role.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-blue-500/20 bg-blue-500/10 p-3">
                <p className="text-xs font-semibold">✓ Your EHR Profile Includes:</p>
                <ul className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                  <li>• Personal health information storage</li>
                  <li>• Medical history tracking</li>
                  <li>• Vital sign trends and analytics</li>
                  <li>• Secure doctor-patient messaging</li>
                  <li>• Medication list management</li>
                </ul>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating account..." : "Create Account & Continue"}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account? <Link href="/auth/login" className="text-primary underline-offset-4 hover:underline font-semibold">Sign in</Link>
            </p>

            {error && (
              <p className="mt-4 text-center text-sm font-semibold text-destructive">
                {error}
              </p>
            )}

            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                By creating an account, you agree to our <Link href="#" className="text-primary hover:underline">Terms of Service</Link> and <Link href="#" className="text-primary hover:underline">Privacy Policy</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
