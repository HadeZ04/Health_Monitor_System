const emergencyRules = [
  { id: "rule1", label: "HR > 150 bpm", action: "SMS + Telegram" },
  { id: "rule2", label: "HR < 40 bpm", action: "SMS" },
  { id: "rule3", label: "SpO2 < 88%", action: "SMS + Email + Zalo" }
];

export function EmergencyRuleBoard() {
  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
      <p className="text-sm font-semibold text-destructive">Emergency rules</p>
      <div className="mt-4 space-y-3 text-sm">
        {emergencyRules.map((rule) => (
          <div key={rule.id} className="rounded-xl border border-destructive/30 bg-background/70 p-3">
            <p className="font-semibold">{rule.label}</p>
            <p className="text-xs text-muted-foreground">Notify: {rule.action}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
