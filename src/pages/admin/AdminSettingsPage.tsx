import { useState } from "react";
import { Save, Shield, Settings2, Bell, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/Checkbox";
import { Textarea } from "@/components/ui/Textarea";

export function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      // In a real app, this would show a toast notification
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Platform Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage global configuration for the Vendly platform.</p>
      </div>

      <div className="flex flex-col gap-6 md:flex-row">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64">
          <nav className="flex space-x-2 md:flex-col md:space-x-0 md:space-y-1">
            <button
              onClick={() => setActiveTab("general")}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                activeTab === "general"
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-50"
              }`}
            >
              <Settings2 className="mr-2 size-4" />
              General
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                activeTab === "security"
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-50"
              }`}
            >
              <Shield className="mr-2 size-4" />
              Security
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                activeTab === "notifications"
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-50"
              }`}
            >
              <Bell className="mr-2 size-4" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("email")}
              className={`flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                activeTab === "email"
                  ? "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-50"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-50"
              }`}
            >
              <Mail className="mr-2 size-4" />
              Email Templates
            </button>
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 space-y-6">
          {activeTab === "general" && (
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-medium text-slate-900 dark:text-slate-100">General Settings</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="platform-name" className="text-sm font-medium text-slate-700 dark:text-slate-300">Platform Name</label>
                  <Input id="platform-name" defaultValue="Vendly" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="support-email" className="text-sm font-medium text-slate-700 dark:text-slate-300">Support Email</label>
                  <Input id="support-email" defaultValue="support@vendly.com" type="email" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="maintenance-mode" className="flex items-center gap-2">
                    <Checkbox id="maintenance-mode" />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Enable Maintenance Mode</span>
                  </label>
                  <p className="pl-6 text-sm text-slate-500">Only super admins can access the platform when maintenance mode is active.</p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "security" && (
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-medium text-slate-900 dark:text-slate-100">Security Settings</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="session-timeout" className="text-sm font-medium text-slate-700 dark:text-slate-300">Session Timeout (minutes)</label>
                  <Input id="session-timeout" defaultValue="60" type="number" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="mfa-enforce" className="flex items-center gap-2">
                    <Checkbox id="mfa-enforce" defaultChecked />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Enforce Multi-Factor Authentication (MFA)</span>
                  </label>
                  <p className="pl-6 text-sm text-slate-500">Require all admins to configure MFA before accessing the portal.</p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-medium text-slate-900 dark:text-slate-100">Notification Preferences</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="notify-new-user" className="flex items-center gap-2">
                    <Checkbox id="notify-new-user" defaultChecked />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">New User Registrations</span>
                  </label>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="notify-verifications" className="flex items-center gap-2">
                    <Checkbox id="notify-verifications" defaultChecked />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Pending Verifications (Daily Digest)</span>
                  </label>
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="notify-system-errors" className="flex items-center gap-2">
                    <Checkbox id="notify-system-errors" defaultChecked />
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">System Errors & Alerts</span>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {activeTab === "email" && (
            <Card className="p-6">
              <h2 className="mb-4 text-lg font-medium text-slate-900 dark:text-slate-100">Email Templates</h2>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="welcome-subject" className="text-sm font-medium text-slate-700 dark:text-slate-300">Welcome Email Subject</label>
                  <Input id="welcome-subject" defaultValue="Welcome to Vendly!" />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="welcome-body" className="text-sm font-medium text-slate-700 dark:text-slate-300">Welcome Email Body</label>
                  <Textarea id="welcome-body" rows={6} defaultValue="Hi {{name}},\n\nWelcome to Vendly! We're excited to have you on board.\n\nPlease complete your profile to get started.\n\nThanks,\nThe Vendly Team" />
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
              <Save className="mr-2 size-4" />
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
