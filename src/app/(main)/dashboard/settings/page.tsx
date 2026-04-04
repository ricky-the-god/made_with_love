import { getUserPreferences } from "@/server/settings-actions";

import { SettingsPageContent } from "./_components/settings-page-content";

// Default prefs used for unauthenticated / fallback render
const DEFAULT_PREFS = {
  pref_recipes_private_by_default: true,
  pref_show_in_discover: false,
  pref_show_memorial_public: false,
  pref_notify_invitations: true,
  pref_notify_new_recipe: true,
  pref_notify_new_memory: false,
};

export default async function SettingsPage() {
  const prefs = (await getUserPreferences()) ?? DEFAULT_PREFS;
  return <SettingsPageContent prefs={prefs} />;
}
