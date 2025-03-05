"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { updateName } from "@/server/actions/profile-actions";
import { Deck } from "@/config/types";
import { User } from "better-auth";

type ProfileClientProps = {
  user: User;
  recentDecks: Deck[];
};

type RecentDecksProps = {
  decks: Deck[];
};

function RecentDecks({ decks }: RecentDecksProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Decks</CardTitle>
            <CardDescription>Your recently updated decks</CardDescription>
          </div>
          <Button asChild variant="outline">
            <Link href="/my-decks">See all</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {decks.length === 0 ? (
          <p className="text-muted-foreground">No decks yet</p>
        ) : (
          <div className="space-y-4">
            {decks.map((deck) => (
              <div
                key={deck.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <h3 className="font-medium">{deck.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {deck.description || "No description"}
                  </p>
                </div>
                <div className="text-muted-foreground text-sm">
                  Last updated {new Date(deck.updatedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ProfileClient({
  user,
  recentDecks,
}: ProfileClientProps) {
  const [displayName, setDisplayName] = useState(user.name || "");

  return (
    <div className="container py-8">
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">{displayName}</CardTitle>
                  <ProfileNameEditor
                    initialName={displayName}
                    onNameUpdate={setDisplayName}
                  />
                </div>
                <CardDescription>{user.email}</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        <RecentDecks decks={recentDecks} />
      </div>
    </div>
  );
}

function ProfileNameEditor({
  initialName,
  onNameUpdate,
}: {
  initialName: string;
  onNameUpdate: (name: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    const loadingToast = toast.loading("Updating name...");

    try {
      const result = await updateName({ name });

      if (!result.success) {
        throw new Error(result.error || "Failed to update name");
      }

      onNameUpdate(name);
      toast.success("Name updated successfully", {
        id: loadingToast,
      });
      setIsEditing(false);
    } catch (err) {
      const error = err as Error;
      toast.error(error.message || "Failed to update name", {
        id: loadingToast,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setName(initialName);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center gap-1">
      {isEditing ? (
        <>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-8 w-48"
            disabled={isLoading}
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleSave}
            disabled={name === initialName || isLoading}
          >
            <Save className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4" />
          </Button>
        </>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          onClick={() => setIsEditing(true)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
