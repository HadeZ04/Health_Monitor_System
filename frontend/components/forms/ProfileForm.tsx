"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const defaultProfile = {
  name: "Jordan Diaz",
  email: "jordan@example.com",
  specialization: "Cardiology",
  bio: "Keeping patients safe with proactive monitoring."
};

export function ProfileForm() {
  const [profile, setProfile] = useState(defaultProfile);

  return (
    <form className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Name</label>
          <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium">Specialization</label>
          <Input
            value={profile.specialization}
            onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium">Medical background</label>
        <Textarea value={profile.bio} rows={4} onChange={(e) => setProfile({ ...profile, bio: e.target.value })} />
      </div>
      <Button type="button">Save profile</Button>
    </form>
  );
}
