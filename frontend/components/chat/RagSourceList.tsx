import { ragSources } from "@/lib/data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function RagSourceList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Knowledge Base</CardTitle>
        <CardDescription>RAG data sources</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {ragSources.map((source) => (
          <div key={source.id} className="rounded-lg border p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm font-semibold">{source.title}</p>
                <div className="mt-1 flex gap-2">
                  <Badge variant="outline" className="text-xs">{source.region}</Badge>
                  <Badge variant="outline" className="text-xs">{source.language}</Badge>
                </div>
              </div>
              <span className="text-lg">📚</span>
            </div>
          </div>
        ))}
        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <p className="text-xs font-semibold text-primary">Sources Include:</p>
          <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
            <li>• WHO Medical Guidelines</li>
            <li>• PubMed Research Papers</li>
            <li>• Vietnam Ministry of Health Docs</li>
            <li>• Clinical Trial Database</li>
            <li>• Drug Information Database</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
