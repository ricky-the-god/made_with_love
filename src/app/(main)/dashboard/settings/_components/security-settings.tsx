"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAppCopy } from "@/lib/i18n/use-app-copy";
import { deleteAccount, signOutOtherSessions, updatePassword } from "@/server/auth-actions";

const DELETE_CONFIRMATION = "DELETE";

export function SecuritySettings() {
  const copy = useAppCopy();
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordPending, startPasswordTransition] = useTransition();
  const [isSessionsPending, startSessionsTransition] = useTransition();

  function resetPasswordForm() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  function handlePasswordSave() {
    startPasswordTransition(async () => {
      const result = await updatePassword(currentPassword, newPassword, confirmPassword);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(copy.passwordUpdatedSuccess);
      resetPasswordForm();
      setPasswordDialogOpen(false);
    });
  }

  function handleSignOutOtherSessions() {
    startSessionsTransition(async () => {
      const result = await signOutOtherSessions();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(copy.activeSessionsRevokedSuccess);
    });
  }

  return (
    <div className="space-y-3">
      <Dialog
        open={passwordDialogOpen}
        onOpenChange={(open) => {
          setPasswordDialogOpen(open);
          if (!open) {
            resetPasswordForm();
          }
        }}
      >
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {copy.changePassword}
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.changePassword}</DialogTitle>
            <DialogDescription>{copy.changePasswordDescription}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">{copy.currentPasswordLabel}</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
                disabled={isPasswordPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">{copy.newPasswordLabel}</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                disabled={isPasswordPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">{copy.confirmPasswordLabel}</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={isPasswordPending}
              />
            </div>
            <p className="text-muted-foreground text-xs">{copy.passwordRequirementsHint}</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              disabled={isPasswordPending}
              onClick={() => setPasswordDialogOpen(false)}
            >
              {copy.cancelAction}
            </Button>
            <Button
              type="button"
              disabled={
                isPasswordPending ||
                currentPassword.trim().length === 0 ||
                newPassword.trim().length === 0 ||
                confirmPassword.trim().length === 0
              }
              onClick={handlePasswordSave}
            >
              {isPasswordPending ? copy.savingPassword : copy.savePassword}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline" className="w-full justify-start">
            {copy.manageActiveSessions}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{copy.manageActiveSessions}</AlertDialogTitle>
            <AlertDialogDescription>{copy.signOutOtherSessionsDescription}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{copy.cancelAction}</AlertDialogCancel>
            <AlertDialogAction disabled={isSessionsPending} onClick={handleSignOutOtherSessions}>
              {isSessionsPending ? copy.signingOutOtherSessions : copy.signOutOtherSessionsLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export function DangerZoneSettings() {
  const copy = useAppCopy();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, startDeleteTransition] = useTransition();

  function handleDeleteAccount() {
    startDeleteTransition(async () => {
      const result = await deleteAccount();

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success(copy.accountDeletedSuccess);
      setDialogOpen(false);
      router.push("/auth/v2/login");
      router.refresh();
    });
  }

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(open) => {
        setDialogOpen(open);
        if (!open) {
          setConfirmation("");
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full text-destructive hover:text-destructive">
          {copy.deleteMyAccount}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-destructive">{copy.deleteMyAccount}</DialogTitle>
          <DialogDescription>{copy.deleteAccountDescription}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="delete-account-confirmation">{copy.deleteAccountConfirmLabel}</Label>
          <Input
            id="delete-account-confirmation"
            value={confirmation}
            onChange={(event) => setConfirmation(event.target.value)}
            placeholder={DELETE_CONFIRMATION}
            disabled={isDeleting}
          />
          <p className="text-muted-foreground text-xs">{copy.deleteAccountConfirmInstruction}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" type="button" disabled={isDeleting} onClick={() => setDialogOpen(false)}>
            {copy.cancelAction}
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={isDeleting || confirmation.trim().toUpperCase() !== DELETE_CONFIRMATION}
            onClick={handleDeleteAccount}
          >
            {isDeleting ? copy.deletingAccount : copy.deleteMyAccount}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
