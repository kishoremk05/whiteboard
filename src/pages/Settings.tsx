import { useState } from 'react';
import { Settings as SettingsIcon, User, Bell, CreditCard, Palette } from 'lucide-react';
import { DashboardLayout } from '../components/dashboard/DashboardLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Switch } from '../components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { getInitials } from '../lib/utils';
import { toast } from 'sonner';

export function Settings() {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [bio, setBio] = useState(user?.bio || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSaveProfile = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        updateUser({ name, bio });
        setIsSaving(false);
        toast.success('Profile updated');
    };

    return (
        <DashboardLayout>
            {/* Page Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                        <SettingsIcon className="w-5 h-5 text-slate-600" />
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                        Settings
                    </h1>
                </div>
                <p className="text-slate-500">
                    Manage your account settings and preferences
                </p>
            </div>

            {/* Settings Tabs */}
            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="mb-6 bg-slate-100">
                    <TabsTrigger value="profile" className="gap-2">
                        <User className="w-4 h-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="preferences" className="gap-2">
                        <Palette className="w-4 h-4" />
                        Preferences
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="w-4 h-4" />
                        Notifications
                    </TabsTrigger>
                    <TabsTrigger value="billing" className="gap-2">
                        <CreditCard className="w-4 h-4" />
                        Billing
                    </TabsTrigger>
                </TabsList>

                {/* Profile Tab */}
                <TabsContent value="profile">
                    <div className="grid gap-6 max-w-2xl">
                        <Card>
                            <CardHeader>
                                <CardTitle>Profile Picture</CardTitle>
                                <CardDescription>
                                    Click on the avatar to upload a custom photo
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center gap-6">
                                    <Avatar className="w-20 h-20">
                                        <AvatarImage src={user?.avatar} />
                                        <AvatarFallback className="text-2xl">
                                            {user?.name ? getInitials(user.name) : 'U'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <Button variant="outline" size="sm">
                                            Change Avatar
                                        </Button>
                                        <p className="text-xs text-slate-500 mt-2">
                                            JPG, PNG or GIF. Max 2MB.
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Personal Information</CardTitle>
                                <CardDescription>
                                    Update your personal details
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        value={user?.email}
                                        disabled
                                        className="bg-slate-50"
                                    />
                                    <p className="text-xs text-slate-500">
                                        Email cannot be changed
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio">Bio</Label>
                                    <textarea
                                        id="bio"
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell us a bit about yourself"
                                        className="flex min-h-[100px] w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                                    />
                                </div>
                                <Button
                                    onClick={handleSaveProfile}
                                    disabled={isSaving}
                                    variant="gradient"
                                >
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Preferences Tab */}
                <TabsContent value="preferences">
                    <div className="grid gap-6 max-w-2xl">
                        <Card>
                            <CardHeader>
                                <CardTitle>Appearance</CardTitle>
                                <CardDescription>
                                    Customize how CanvasAI looks
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-900">Dark Mode</p>
                                        <p className="text-sm text-slate-500">
                                            Use dark theme across the app
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-900">Compact View</p>
                                        <p className="text-sm text-slate-500">
                                            Show more items with smaller cards
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Language & Region</CardTitle>
                                <CardDescription>
                                    Set your preferred language
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label>Language</Label>
                                    <select className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                                        <option>English (US)</option>
                                        <option>Spanish</option>
                                        <option>French</option>
                                        <option>German</option>
                                    </select>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Notifications Tab */}
                <TabsContent value="notifications">
                    <div className="grid gap-6 max-w-2xl">
                        <Card>
                            <CardHeader>
                                <CardTitle>Email Notifications</CardTitle>
                                <CardDescription>
                                    Manage what emails you receive
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-900">Weekly Digest</p>
                                        <p className="text-sm text-slate-500">
                                            Summary of your weekly activity
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-900">Collaboration Updates</p>
                                        <p className="text-sm text-slate-500">
                                            When someone shares a board with you
                                        </p>
                                    </div>
                                    <Switch defaultChecked />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-slate-900">Product Updates</p>
                                        <p className="text-sm text-slate-500">
                                            News about new features
                                        </p>
                                    </div>
                                    <Switch />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Billing Tab */}
                <TabsContent value="billing">
                    <div className="grid gap-6 max-w-2xl">
                        <Card>
                            <CardHeader>
                                <CardTitle>Current Plan</CardTitle>
                                <CardDescription>
                                    You are currently on the Pro plan
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white">
                                    <div>
                                        <p className="text-xl font-bold">Pro Plan</p>
                                        <p className="text-primary-100">$12/month</p>
                                    </div>
                                    <Badge className="bg-white/20 text-white hover:bg-white/30">
                                        Active
                                    </Badge>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Storage used</span>
                                        <span className="font-medium">2.4 GB / 10 GB</span>
                                    </div>
                                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full w-1/4 bg-primary-500 rounded-full" />
                                    </div>
                                </div>
                                <div className="mt-6 flex gap-3">
                                    <Button variant="outline">Change Plan</Button>
                                    <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                                        Cancel Subscription
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </DashboardLayout>
    );
}
