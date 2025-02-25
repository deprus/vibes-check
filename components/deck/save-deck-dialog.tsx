import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SaveDeckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deckName: string;
  setDeckName: (name: string) => void;
  deckDescription: string;
  setDeckDescription: (description: string) => void;
  isPublic: boolean;
  setIsPublic: (isPublic: boolean) => void;
  onSave: () => void;
  isSaving: boolean;
  isExisting: boolean;
}

export default function SaveDeckDialog({
  open,
  onOpenChange,
  deckName,
  setDeckName,
  deckDescription,
  setDeckDescription,
  isPublic,
  setIsPublic,
  onSave,
  isSaving,
  isExisting,
}: SaveDeckDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isExisting ? "Edit Deck" : "Save Deck"}</DialogTitle>
          <DialogDescription>
            {isExisting
              ? "Update your deck information."
              : "Give your deck a name and save it to your collection."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <textarea
              id="description"
              value={deckDescription}
              onChange={(e) => setDeckDescription(e.target.value)}
              className="col-span-3 min-h-[100px] rounded-md border p-2"
              placeholder="Enter deck description..."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="public" className="text-right">
              Public
            </Label>
            <div className="col-span-3 flex items-center space-x-2">
              <input
                type="checkbox"
                id="public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="h-4 w-4"
              />
              <Label htmlFor="public" className="text-muted-foreground text-sm">
                Make this deck visible to other users
              </Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? "Saving..." : isExisting ? "Update" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
