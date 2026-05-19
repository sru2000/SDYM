import { useEffect, useState } from "react";
import { FiBell, FiCpu, FiDatabase, FiLock, FiSave, FiUser } from "react-icons/fi";
import PageScaffold from "../components/layout/PageScaffold.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { fetchSettings, updateSettings } from "../services/api.js";

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
        {label}
      </span>
      <div className="mt-2">{children}</div>
    </label>
  );
}

function TextInput({ placeholder, type = "text", value = "", onChange }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="h-12 w-full rounded-2xl border border-emerald-100 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-emerald-900/50 dark:bg-slate-950 dark:text-white dark:focus:ring-emerald-950"
    />
  );
}

function Toggle({ checked, onChange, label, description }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-left hover:border-emerald-200 dark:border-slate-800 dark:bg-slate-950"
    >
      <span>
        <span className="block text-sm font-bold text-slate-950 dark:text-white">
          {label}
        </span>
        <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">
          {description}
        </span>
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full ${
          checked ? "bg-emerald-600" : "bg-slate-300 dark:bg-slate-700"
        }`}
      >
        <span
          className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow ${
            checked ? "left-6" : "left-1"
          }`}
        />
      </span>
    </button>
  );
}

function RangeControl({ label, value, onChange, suffix = "%" }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-bold text-slate-950 dark:text-white">{label}</p>
        <p className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
          {value}
          {suffix}
        </p>
      </div>
      <input
        type="range"
        value={value}
        min="0"
        max="100"
        onChange={(event) => onChange(Number(event.target.value))}
        className="mt-4 w-full accent-emerald-600"
      />
    </div>
  );
}

function SettingsCard({ icon: Icon, title, description, children }) {
  return (
    <section className="rounded-3xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-950/5 dark:border-emerald-900/50 dark:bg-slate-900">
      <div className="mb-5 flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
          <Icon />
        </div>
        <div className="min-w-0">
          <h2 className="text-xl font-black text-slate-950 dark:text-white">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>
      </div>
      {children}
    </section>
  );
}

function Settings() {
  const { user, updateUser } = useAuth();
  const [profile, setProfile] = useState({
    name: user?.name || "",
    role: user?.role || "",
    email: user?.email || "",
    region: user?.region || "Andhra Pradesh and Telangana",
  });
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    autoEscalation: true,
  });
  const [thresholds, setThresholds] = useState({
    aiSensitivity: 72,
    pestThreshold: 82,
    rainfallThreshold: 64,
  });
  const [integrations, setIntegrations] = useState({
    firebaseProjectId: "krishimitra-ai-prod",
    predictionApiEndpoint: "",
    weatherProviderKey: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let active = true;

    async function loadSettings() {
      setIsLoading(true);
      setError("");

      try {
        const data = await fetchSettings();

        if (!active) {
          return;
        }

        setProfile({
          name: data.user.name || "",
          role: data.user.role || "",
          email: data.user.email || "",
          region: data.user.region || "Andhra Pradesh and Telangana",
        });
        setNotifications({
          emailAlerts: data.settings.emailAlerts,
          smsAlerts: data.settings.smsAlerts,
          autoEscalation: data.settings.autoEscalation,
        });
        setThresholds({
          aiSensitivity: data.settings.aiSensitivity,
          pestThreshold: data.settings.pestThreshold,
          rainfallThreshold: data.settings.rainfallThreshold,
        });
        setIntegrations({
          firebaseProjectId: data.settings.firebaseProjectId,
          predictionApiEndpoint: data.settings.predictionApiEndpoint,
          weatherProviderKey: data.settings.weatherProviderKey,
        });
      } catch (err) {
        if (active) {
          setError(err.message || "Unable to load settings.");
        }
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      active = false;
    };
  }, []);

  const updateProfileField = (field) => (event) => {
    setProfile((current) => ({ ...current, [field]: event.target.value }));
  };

  const updateIntegrationField = (field) => (event) => {
    setIntegrations((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const data = await updateSettings({
        profile,
        notifications,
        thresholds,
        integrations,
      });
      updateUser(data.user);
      setProfile({
        name: data.user.name || "",
        role: data.user.role || "",
        email: data.user.email || "",
        region: data.user.region || "Andhra Pradesh and Telangana",
      });
      setSuccess("Settings saved successfully.");
    } catch (err) {
      setError(err.message || "Unable to save settings.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageScaffold
        eyebrow="Platform controls"
        title="Settings"
        description="Configure organization preferences, alert thresholds, model confidence rules, integrations, and user permissions."
      />

      {(isLoading || error || success) && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
            error
              ? "border-rose-100 bg-rose-50 text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/30 dark:text-rose-200"
              : "border-emerald-100 bg-emerald-50 text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/30 dark:text-emerald-200"
          }`}
        >
          {isLoading ? "Loading settings..." : error || success}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SettingsCard
          icon={FiUser}
          title="Profile Settings"
          description="Manage the operator identity shown across field workflows and approval logs."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <TextInput value={profile.name} onChange={updateProfileField("name")} />
            </Field>
            <Field label="Role">
              <TextInput value={profile.role} onChange={updateProfileField("role")} />
            </Field>
            <Field label="Email">
              <TextInput
                type="email"
                value={profile.email}
                onChange={updateProfileField("email")}
              />
            </Field>
            <Field label="Primary region">
              <select
                value={profile.region}
                onChange={updateProfileField("region")}
                className="h-12 w-full rounded-2xl border border-emerald-100 bg-white px-4 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 dark:border-emerald-900/50 dark:bg-slate-950 dark:text-white"
              >
                <option>Andhra Pradesh and Telangana</option>
                <option>Guntur cluster</option>
                <option>Warangal cluster</option>
                <option>Nellore cluster</option>
              </select>
            </Field>
          </div>
        </SettingsCard>

        <SettingsCard
          icon={FiBell}
          title="Notification Preferences"
          description="Choose how alerts and AI advisories reach operations teams."
        >
          <div className="space-y-3">
            <Toggle
              checked={notifications.emailAlerts}
              onChange={(value) =>
                setNotifications((current) => ({ ...current, emailAlerts: value }))
              }
              label="Email alerts"
              description="Send daily summaries and critical incident notifications."
            />
            <Toggle
              checked={notifications.smsAlerts}
              onChange={(value) =>
                setNotifications((current) => ({ ...current, smsAlerts: value }))
              }
              label="SMS escalation"
              description="Notify field coordinators when risk crosses critical limits."
            />
            <Toggle
              checked={notifications.autoEscalation}
              onChange={(value) =>
                setNotifications((current) => ({ ...current, autoEscalation: value }))
              }
              label="Auto-escalate critical zones"
              description="Create field tasks automatically for high-confidence pest outbreaks."
            />
          </div>
        </SettingsCard>

        <SettingsCard
          icon={FiCpu}
          title="AI Sensitivity and Thresholds"
          description="Tune how aggressively the platform flags pest, rainfall, and crop stress anomalies."
        >
          <div className="space-y-4">
            <RangeControl
              label="AI sensitivity"
              value={thresholds.aiSensitivity}
              onChange={(value) =>
                setThresholds((current) => ({ ...current, aiSensitivity: value }))
              }
            />
            <RangeControl
              label="Pest risk alert threshold"
              value={thresholds.pestThreshold}
              onChange={(value) =>
                setThresholds((current) => ({ ...current, pestThreshold: value }))
              }
            />
            <RangeControl
              label="Rainfall warning threshold"
              value={thresholds.rainfallThreshold}
              onChange={(value) =>
                setThresholds((current) => ({ ...current, rainfallThreshold: value }))
              }
            />
          </div>
        </SettingsCard>

        <SettingsCard
          icon={FiDatabase}
          title="API Integrations"
          description="Prepare secure service connections for Firebase, prediction APIs, and weather feeds."
        >
          <div className="grid gap-4">
            <Field label="Firebase project ID">
              <TextInput
                placeholder="krishimitra-prod"
                value={integrations.firebaseProjectId}
                onChange={updateIntegrationField("firebaseProjectId")}
              />
            </Field>
            <Field label="Prediction API endpoint">
              <TextInput
                placeholder="https://api.krishimitra.ai/predict"
                value={integrations.predictionApiEndpoint}
                onChange={updateIntegrationField("predictionApiEndpoint")}
              />
            </Field>
            <Field label="Weather provider key">
              <TextInput
                type="password"
                value={integrations.weatherProviderKey}
                onChange={updateIntegrationField("weatherProviderKey")}
              />
            </Field>
          </div>
        </SettingsCard>
      </div>

      <SettingsCard
        icon={FiLock}
        title="Role and Access Management"
        description="Control who can approve recommendations, edit thresholds, and manage integrations."
      >
        <div className="grid gap-4 lg:grid-cols-3">
          {[
            ["Admin", "Full platform access", "4 users"],
            ["Analyst", "Analytics and recommendations", "12 users"],
            ["Field Team", "Visits, alerts, and farmer notes", "38 users"],
          ].map(([role, access, users]) => (
            <div
              key={role}
              className="rounded-3xl border border-slate-100 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950"
            >
              <p className="text-lg font-black text-slate-950 dark:text-white">
                {role}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                {access}
              </p>
              <p className="mt-4 rounded-full bg-white px-3 py-1 text-xs font-bold text-emerald-700 dark:bg-slate-900 dark:text-emerald-300">
                {users}
              </p>
            </div>
          ))}
        </div>
      </SettingsCard>

      <div className="sticky bottom-4 z-10 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isLoading || isSaving}
          className="flex items-center gap-2 rounded-2xl bg-emerald-700 px-6 py-4 text-sm font-black text-white shadow-2xl shadow-emerald-700/25 hover:-translate-y-1 hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0"
        >
          <FiSave />
          {isSaving ? "Saving..." : "Save settings"}
        </button>
      </div>
    </div>
  );
}

export default Settings;
