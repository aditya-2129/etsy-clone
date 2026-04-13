"use client";

import { useEffect, useState } from "react";
import { client } from "@/lib/appwrite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";

type PingStatus = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [status, setStatus] = useState<PingStatus>("idle");
  const [message, setMessage] = useState("");

  // Auto-ping on mount to verify Appwrite connection
  useEffect(() => {
    handlePing();
  }, []);

  const handlePing = async () => {
    setStatus("loading");
    setMessage("");
    try {
      await client.ping();
      setStatus("success");
      setMessage("Appwrite is connected and responding!");
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error ? error.message : "Failed to connect to Appwrite."
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">🛍️ Etsy Clone</CardTitle>
          <CardDescription>
            Appwrite Connection Verification
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          {status === "loading" && (
            <Badge variant="secondary" className="gap-2 px-4 py-2 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Pinging Appwrite...
            </Badge>
          )}

          {status === "success" && (
            <Badge variant="default" className="gap-2 bg-emerald-600 px-4 py-2 text-sm hover:bg-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              {message}
            </Badge>
          )}

          {status === "error" && (
            <Badge variant="destructive" className="gap-2 px-4 py-2 text-sm">
              <XCircle className="h-4 w-4" />
              {message}
            </Badge>
          )}

          <Button
            onClick={handlePing}
            disabled={status === "loading"}
            className="w-full"
          >
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Pinging...
              </>
            ) : (
              "Send a Ping"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Endpoint: https://fra.cloud.appwrite.io/v1
            <br />
            Project: etsy-clone
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
