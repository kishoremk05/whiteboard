import { useState } from "react";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  CreditCard,
  Palette,
  Shield,
  Upload,
  Camera,
  Check,
  Globe,
  Moon,
  Sun,
  Laptop,
  Zap,
  Sparkles,
  ChevronRight,
  Clock,
  Mail,
  MessageSquare,
  AlertCircle,
  Info,
} from "lucide-react";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";
import { useAuth } from "../contexts/AuthContext";
import { getInitials, cn } from "../lib/utils";
import { toast } from "sonner";

type ThemeMode = "light" | "dark" | "system";

export function Settings() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [isSaving, setIsSaving] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [showSavedIndicator, setShowSavedIndicator] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    updateUser({ name, bio });
    setIsSaving(false);
    setShowSavedIndicator(true);
    toast.success("Profile updated successfully");
    setTimeout(() => setShowSavedIndicator(false), 2000);
  };

  const themeOptions: {
    value: ThemeMode;
    label: string;
    icon: React.ReactNode;
  }[] = [
    { value: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
    { value: "system", label: "System", icon: <Laptop className="w-4 h-4" /> },
  ];

  const notificationSettings = [
    {
      id: "weekly-digest",
      title: "Weekly Digest",
      description: "Summary of your weekly activity and highlights",
      icon: Clock,
      defaultChecked: true,
    },
    {
      id: "collaboration",
      title: "Collaboration Updates",
      description: "When someone shares a board or invites you",
      icon: MessageSquare,
      defaultChecked: true,
    },
    {
      id: "mentions",
      title: "Mentions & Comments",
      description: "When you're mentioned in a board comment",
      icon: Mail,
      defaultChecked: true,
    },
    {
      id: "product-updates",
      title: "Product Updates",
      description: "News about new features and improvements",
      icon: Sparkles,
      defaultChecked: false,
    },
    {
      id: "security",
      title: "Security Alerts",
      description: "Important security notifications",
      icon: Shield,
      defaultChecked: true,
    },
  ];

  const planFeatures = [
    "Unlimited boards",
    "10 GB storage",
    "Real-time collaboration",
    "AI-powered tools",
    "Priority support",
    "Custom branding",
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center shadow-sm">
            <SettingsIcon className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
              Settings
            </h1>
            <p className="text-slate-500 text-sm">
              Manage your account settings and preferences
            </p>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <Tabs
        defaultValue="profile"
        className="w-full"
      >
        <div className="sticky top-0 z-10 bg-gradient-to-b from-slate-50 via-slate-50 to-transparent pb-4 -mx-1 px-1">
          <TabsList className="bg-white border border-slate-200 shadow-sm p-1.5 rounded-xl">
            <TabsTrigger
              value="profile"
              className={cn(
                "gap-2 rounded-lg data-[state=active]:bg-primary-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
              )}
            >
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="gap-2 rounded-lg data-[state=active]:bg-primary-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Palette className="w-4 h-4" />
              Preferences
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="gap-2 rounded-lg data-[state=active]:bg-primary-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Bell className="w-4 h-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="billing"
              className="gap-2 rounded-lg data-[state=active]:bg-primary-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <CreditCard className="w-4 h-4" />
              Billing
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="gap-2 rounded-lg data-[state=active]:bg-primary-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all"
            >
              <Shield className="w-4 h-4" />
              Security
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Profile Tab */}
        <TabsContent
          value="profile"
          className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
        >
          <div className="grid gap-6 max-w-2xl">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary-50 to-accent-50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary-500" />
                  Profile Picture
                </CardTitle>
                <CardDescription>
                  This is how others will see you
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <Avatar className="w-24 h-24 ring-4 ring-white shadow-xl">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="text-2xl bg-gradient-to-br from-primary-400 to-accent-400 text-white">
                        {user?.name ? getInitials(user.name) : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Upload className="w-6 h-6 text-white" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <Button variant="outline" size="sm" className="mb-2">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    <p className="text-xs text-slate-500">
                      Recommended: Square image, at least 400x400px.
                      <br />
                      Max file size: 2MB (JPG, PNG, GIF)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary-500" />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update your personal details and public profile
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-slate-700">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="border-slate-200 focus:border-primary-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700">
                      Email
                      <span className="ml-1 text-xs text-slate-400">
                        (verified)
                      </span>
                    </Label>
                    <div className="relative">
                      <Input
                        id="email"
                        value={user?.email}
                        disabled
                        className="bg-slate-50 pr-10"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Check className="w-4 h-4 text-emerald-500" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-slate-700">
                    Bio
                  </Label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us a bit about yourself..."
                    className="flex min-h-[120px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:border-primary-500 transition-all resize-none"
                  />
                  <p className="text-xs text-slate-500">
                    {bio.length}/200 characters
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    variant="gradient"
                    className="min-w-[120px]"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Saving...
                      </>
                    ) : showSavedIndicator ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Saved!
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                  <Button variant="ghost">Cancel</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50/50">
              <CardHeader>
                <CardTitle className="text-red-700 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
                <CardDescription className="text-red-600">
                  Irreversible and destructive actions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700"
                >
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent
          value="preferences"
          className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
        >
          <div className="grid gap-6 max-w-2xl">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-primary-500" />
                  Appearance
                </CardTitle>
                <CardDescription>
                  Customize how CanvasAI looks and feels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-sm font-medium text-slate-700 mb-3 block">
                    Theme
                  </Label>
                  <div className="grid grid-cols-3 gap-3">
                    {themeOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setTheme(option.value)}
                        className={cn(
                          "p-4 rounded-xl border-2 text-center transition-all duration-200",
                          "hover:shadow-md hover:-translate-y-0.5",
                          theme === option.value
                            ? "border-primary-500 bg-primary-50 shadow-md"
                            : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <div
                          className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2",
                            theme === option.value
                              ? "bg-primary-500 text-white"
                              : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {option.icon}
                        </div>
                        <span
                          className={cn(
                            "text-sm font-medium",
                            theme === option.value
                              ? "text-primary-700"
                              : "text-slate-600"
                          )}
                        >
                          {option.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <Separator />
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                        <Zap className="w-5 h-5 text-amber-500" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          Reduced Motion
                        </p>
                        <p className="text-sm text-slate-500">
                          Minimize animations throughout the app
                        </p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                        <Info className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          Compact View
                        </p>
                        <p className="text-sm text-slate-500">
                          Show more items with smaller cards
                        </p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary-500" />
                  Language & Region
                </CardTitle>
                <CardDescription>
                  Set your preferred language and locale settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <select className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option>English (US)</option>
                      <option>Spanish (ES)</option>
                      <option>French (FR)</option>
                      <option>German (DE)</option>
                      <option>Japanese (JP)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <select className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
                      <option>Pacific Time (PT)</option>
                      <option>Eastern Time (ET)</option>
                      <option>Central European Time (CET)</option>
                      <option>Japan Standard Time (JST)</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent
          value="notifications"
          className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
        >
          <div className="grid gap-6 max-w-2xl">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary-500" />
                  Email Notifications
                </CardTitle>
                <CardDescription>
                  Manage what emails you receive from CanvasAI
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {notificationSettings.map((setting, index) => (
                  <div
                    key={setting.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl transition-colors hover:bg-slate-50",
                      "animate-in fade-in-0 slide-in-from-left-2"
                    )}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: "both",
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <setting.icon className="w-5 h-5 text-slate-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          {setting.title}
                        </p>
                        <p className="text-sm text-slate-500">
                          {setting.description}
                        </p>
                      </div>
                    </div>
                    <Switch defaultChecked={setting.defaultChecked} />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Push Notifications</CardTitle>
                <CardDescription>
                  Receive notifications in your browser
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50">
                  <div>
                    <p className="font-medium text-slate-900">
                      Enable Push Notifications
                    </p>
                    <p className="text-sm text-slate-500">
                      Get instant updates even when you're not on the site
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent
          value="billing"
          className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
        >
          <div className="grid gap-6 max-w-2xl">
            <Card className="border-slate-200 shadow-sm overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white">Pro Plan</CardTitle>
                    <CardDescription className="text-white/80">
                      Your current subscription
                    </CardDescription>
                  </div>
                  <Badge className="bg-white/20 text-white hover:bg-white/30 text-sm px-3 py-1">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-slate-900">$12</span>
                  <span className="text-slate-500">/month</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  {planFeatures.map((feature, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-600" />
                      </div>
                      {feature}
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-50 mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-600">Storage used</span>
                    <span className="font-semibold text-slate-900">
                      2.4 GB / 10 GB
                    </span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                      style={{ width: "24%" }}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button variant="outline" className="gap-2">
                    Upgrade Plan
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" className="text-slate-500">
                    View Invoice History
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>
                  Manage your payment information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50">
                  <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-800 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-900">
                      •••• •••• •••• 4242
                    </p>
                    <p className="text-sm text-slate-500">Expires 12/25</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent
          value="security"
          className="animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
        >
          <div className="grid gap-6 max-w-2xl">
            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-500" />
                  Password
                </CardTitle>
                <CardDescription>
                  Change your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Current Password</Label>
                  <Input type="password" placeholder="••••••••" />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label>Confirm Password</Label>
                    <Input type="password" placeholder="••••••••" />
                  </div>
                </div>
                <Button variant="gradient">Update Password</Button>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-medium text-amber-900">
                        2FA is not enabled
                      </p>
                      <p className="text-sm text-amber-700">
                        Protect your account with two-factor authentication
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-amber-300 text-amber-700 hover:bg-amber-100"
                  >
                    Enable
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>
                  Manage your active sessions across devices
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                      <Laptop className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        Windows • Chrome
                      </p>
                      <p className="text-sm text-slate-500">
                        Current session • Last active now
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700">
                    Current
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  className="text-red-600 hover:bg-red-50 hover:text-red-700"
                >
                  Sign Out All Other Sessions
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
