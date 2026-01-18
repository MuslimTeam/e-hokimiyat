"use client"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  User,
  Bell,
  Shield,
  Globe,
  Smartphone,
  Mail,
  MessageSquare,
  Save,
  UserCheck,
  Bot,
  Settings,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useTranslation } from "@/lib/i18n/context"
import { getSettings, getUsers, postSettings } from "@/lib/api"

export default function SettingsPage() {
  const t = useTranslation()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [telegramNotifications, setTelegramNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [taskDeadlineReminder, setTaskDeadlineReminder] = useState(true)
  const [newTaskNotification, setNewTaskNotification] = useState(true)
  const [language, setLanguage] = useState("uz")

  const [botToken, setBotToken] = useState("")
  const [botUsername, setBotUsername] = useState("")
  const [showToken, setShowToken] = useState(false)
  const [tokenSaved, setTokenSaved] = useState(false)
  const [smtpHost, setSmtpHost] = useState("")
  const [smtpPort, setSmtpPort] = useState("")
  const [senderEmail, setSenderEmail] = useState("")

  useEffect(() => {
    let mounted = true
    try {
      const lsLang = localStorage.getItem("language")
      if (lsLang) setLanguage(lsLang)
    } catch (e) {}
    getSettings()
      .then((s) => {
        if (!mounted) return
        setBotToken(s.telegramBotToken || "")
        setBotUsername(s.telegramBotUsername || "")
        setSmtpHost(s.emailSmtpHost || "")
        setSmtpPort(String(s.emailSmtpPort || ""))
        setSenderEmail(s.emailSenderAddress || "")
        setLanguage(s.language || language)
      })
      .catch(() => {})
    getUsers()
      .then((users) => {
        if (!mounted) return
        const current = users.find((u: any) => u.role === "ADMIN") || users[0]
        if (current) {
          // prefill some profile fields
        }
      })
      .catch(() => {})
    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    try {
      document.documentElement.lang = language || "uz"
      localStorage.setItem("language", language)
    } catch (e) {}
  }, [language])

  const currentUser = { firstName: "Admin", lastName: "User", middleName: "", phone: "", pnfl: "12345678901234", role: "ADMIN" }
  const isAdmin = currentUser.role === "ADMIN"

  const saveBotSettings = () => {
    // Persist bot settings
    postSettings({ telegramBotToken: botToken, telegramBotUsername: botUsername }).catch(() => {})
    setTokenSaved(true)
    setTimeout(() => setTokenSaved(false), 3000)
  }

  const [settingsSaved, setSettingsSaved] = useState(false)

  const saveSettings = async () => {
    const body: any = {
      language,
      emailNotifications,
      telegramNotifications,
      pushNotifications,
      newTaskNotification,
      taskDeadlineReminder,
      telegramBotToken: botToken,
      telegramBotUsername: botUsername,
      emailSmtpHost: smtpHost,
      emailSmtpPort: smtpPort ? Number(smtpPort) : undefined,
      emailSenderAddress: senderEmail,
    }
    try {
      await postSettings(body)
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 3000)
    } catch (e) {
      // ignore for now
    }
  }

  return (
    <>
      <Header title={t.settings.title} description={t.settings.description} />
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-muted/20 p-6">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full animate-float" />
          <div className="absolute top-40 right-32 w-24 h-24 bg-purple-500/10 rounded-full animate-float" style={{ animationDelay: "1s" }} />
          <div className="absolute bottom-32 left-40 w-20 h-20 bg-pink-500/10 rounded-full animate-float" style={{ animationDelay: "2s" }} />
          <div className="absolute bottom-20 right-20 w-28 h-28 bg-green-500/10 rounded-full animate-float" style={{ animationDelay: "3s" }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="relative w-full grid grid-cols-5 lg:w-[600px] mx-auto bg-background/80 backdrop-blur-xl border border-border/50 rounded-2xl p-1 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-2xl opacity-50" />
              
              <TabsTrigger 
                value="profile" 
                className="relative gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{t.settings.profile}</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="notifications" 
                className="relative gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">{t.settings.notifications}</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="security" 
                className="relative gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">{t.settings.security}</span>
              </TabsTrigger>
              
              <TabsTrigger 
                value="appearance" 
                className="relative gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{t.settings.appearance}</span>
              </TabsTrigger>
              
              {isAdmin && (
                <TabsTrigger 
                  value="admin" 
                  className="relative gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.settings.admin}</span>
                </TabsTrigger>
              )}
            </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="animate-fade-in">
            <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10" />
                <CardTitle className="relative flex items-center gap-3 text-2xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  {t.settings.profileInfo}
                </CardTitle>
                <CardDescription className="relative">{t.settings.profileDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="flex items-center gap-8 p-6 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border border-primary/20">
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-primary/30 ring-offset-4 ring-offset-transparent">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-3xl font-bold animate-pulse-modern">
                        {currentUser.firstName[0]}
                        {currentUser.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-4 border-white animate-bounce-subtle" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {currentUser.firstName} {currentUser.lastName}
                    </h3>
                    <p className="text-lg text-muted-foreground">{currentUser.role}</p>
                    <Badge variant="outline" className="mt-3 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/30 px-4 py-2">
                      <UserCheck className="mr-2 h-4 w-4" />
                      {t.settings.oneIDConnected}
                    </Badge>
                  </div>
                </div>

                <Separator className="my-8" />

                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-3 group">
                    <Label className="text-base font-medium group-hover:text-primary transition-colors">{t.settings.firstName}</Label>
                    <Input 
                      defaultValue={currentUser.firstName} 
                      className="h-12 text-base border-2 border-border/50 focus:border-primary transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                  <div className="space-y-3 group">
                    <Label className="text-base font-medium group-hover:text-primary transition-colors">{t.settings.lastName}</Label>
                    <Input 
                      defaultValue={currentUser.lastName} 
                      className="h-12 text-base border-2 border-border/50 focus:border-primary transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                  <div className="space-y-3 group">
                    <Label className="text-base font-medium group-hover:text-primary transition-colors">{t.settings.middleName}</Label>
                    <Input 
                      defaultValue={currentUser.middleName} 
                      className="h-12 text-base border-2 border-border/50 focus:border-primary transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                  <div className="space-y-3 group">
                    <Label className="text-base font-medium group-hover:text-primary transition-colors">{t.settings.phone}</Label>
                    <Input 
                      defaultValue={currentUser.phone || ""} 
                      className="h-12 text-base border-2 border-border/50 focus:border-primary transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                  <div className="space-y-3 group sm:col-span-2">
                    <Label className="text-base font-medium group-hover:text-primary transition-colors">{t.settings.email}</Label>
                    <Input 
                      defaultValue="user@gov.uz" 
                      type="email" 
                      className="h-12 text-base border-2 border-border/50 focus:border-primary transition-all duration-300 hover:border-primary/50"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <Button 
                    onClick={saveSettings}
                    className="h-12 px-8 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    {t.common.save}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="animate-fade-in">
            <Card className="bg-card/80 backdrop-blur-xl border-border/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
              <CardHeader className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-pink-500/10" />
                <CardTitle className="relative flex items-center gap-3 text-2xl">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Bell className="h-4 w-4 text-white" />
                  </div>
                  {t.settings.notificationSettings}
                </CardTitle>
                <CardDescription className="relative">{t.settings.notificationDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8 p-8">
                <div className="space-y-6">
                  <h4 className="text-xl font-semibold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    {t.settings.notificationChannels}
                  </h4>

                  <div className="flex items-center justify-between rounded-2xl border-2 border-border/50 p-6 bg-gradient-to-r from-blue-500/5 to-purple-600/5 hover:from-blue-500/10 hover:to-purple-600/10 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                        <Mail className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">{t.settings.emailNotifications}</p>
                        <p className="text-sm text-muted-foreground">{t.settings.emailNotificationsDesc}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={emailNotifications} 
                      onCheckedChange={setEmailNotifications}
                      className="scale-125"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border-2 border-border/50 p-6 bg-gradient-to-r from-purple-500/5 to-pink-600/5 hover:from-purple-500/10 hover:to-pink-600/10 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                        <MessageSquare className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">{t.settings.telegramNotifications}</p>
                        <p className="text-sm text-muted-foreground">{t.settings.telegramNotificationsDesc}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={telegramNotifications} 
                      onCheckedChange={setTelegramNotifications}
                      className="scale-125"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border-2 border-border/50 p-6 bg-gradient-to-r from-pink-500/5 to-orange-600/5 hover:from-pink-500/10 hover:to-orange-600/10 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-pink-500 to-orange-600 shadow-lg">
                        <Smartphone className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">{t.settings.pushNotifications}</p>
                        <p className="text-sm text-muted-foreground">{t.settings.pushNotificationsDesc}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={pushNotifications} 
                      onCheckedChange={setPushNotifications}
                      className="scale-125"
                    />
                  </div>
                </div>

                <Separator className="my-8" />

                <div className="space-y-6">
                  <h4 className="text-xl font-semibold bg-gradient-to-r from-green-500 to-teal-600 bg-clip-text text-transparent">
                    {t.settings.taskNotifications}
                  </h4>

                  <div className="flex items-center justify-between rounded-2xl border-2 border-border/50 p-6 bg-gradient-to-r from-green-500/5 to-teal-600/5 hover:from-green-500/10 hover:to-teal-600/10 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-teal-600 shadow-lg">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">{t.settings.newTasks}</p>
                        <p className="text-sm text-muted-foreground">{t.settings.newTasksDesc}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={newTaskNotification} 
                      onCheckedChange={setNewTaskNotification}
                      className="scale-125"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border-2 border-border/50 p-6 bg-gradient-to-r from-teal-500/5 to-cyan-600/5 hover:from-teal-500/10 hover:to-cyan-600/10 transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-cyan-600 shadow-lg">
                        <AlertCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="text-lg font-medium">{t.settings.deadlineReminders}</p>
                        <p className="text-sm text-muted-foreground">{t.settings.deadlineRemindersDesc}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={taskDeadlineReminder} 
                      onCheckedChange={setTaskDeadlineReminder}
                      className="scale-125"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <Button 
                    onClick={saveSettings}
                    className="h-12 px-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-500/90 hover:to-purple-600/90 text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    <Save className="mr-2 h-5 w-5" />
                    {t.common.save}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>{t.settings.securitySettings}</CardTitle>
                <CardDescription>{t.settings.securityDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t.settings.oneIDAuth}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {t.settings.oneIDAuthDesc}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-accent/10 text-accent border-accent/30">
                      {t.settings.active}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t.settings.pnfl}</h4>
                      <p className="text-sm text-muted-foreground mt-1">{t.settings.pnflDesc}</p>
                    </div>
                      <code className="rounded bg-muted px-3 py-1 font-mono text-sm">
                      ***{(currentUser.pnfl ?? "").slice(-4)}
                    </code>
                  </div>
                </div>

                <div className="rounded-lg border border-border p-4">
                  <h4 className="font-medium mb-2">{t.settings.activeSessions}</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-accent" />
                        <span>{t.settings.currentSession}</span>
                      </div>
                      <span className="text-muted-foreground">{t.settings.now}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground" />
                        <span>{t.settings.hoursAgo}</span>
                      </div>
                      <span className="text-muted-foreground">2 {t.settings.hoursAgo}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                    {t.settings.terminateOtherSessions}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Appearance Settings */}
          <TabsContent value="appearance">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>{t.settings.appearanceSettings}</CardTitle>
                <CardDescription>{t.settings.appearanceDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>{t.settings.language}</Label>
                  <Select value={language} onValueChange={(v) => setLanguage(v)}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <Globe className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uz">O'zbek tili (lotin)</SelectItem>
                      <SelectItem value="uz-cyrl">Ўзбек тили (кирилл)</SelectItem>
                      <SelectItem value="ru">Русский</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end">
                  <Button onClick={saveSettings}>
                    <Save className="mr-2 h-4 w-4" />
                    {t.common.save}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && (
            <TabsContent value="admin">
              <div className="space-y-6">
                {/* Telegram Bot Settings */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      {t.settings.telegramBotSettings}
                    </CardTitle>
                    <CardDescription>{t.settings.telegramBotDesc}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert className="border-primary/30 bg-primary/5">
                      <AlertCircle className="h-4 w-4 text-primary" />
                      <AlertDescription className="text-sm">
                        {t.settings.createBot}
                      </AlertDescription>
                    </Alert>

                    {tokenSaved && (
                      <Alert className="border-accent/30 bg-accent/5">
                        <CheckCircle2 className="h-4 w-4 text-accent" />
                        <AlertDescription className="text-sm text-accent">
                          {t.settings.settingsSaved}!
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="botToken">{t.settings.botToken}</Label>
                        <div className="relative">
                          <Input
                            id="botToken"
                            type={showToken ? "text" : "password"}
                            placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                            value={botToken}
                            onChange={(e) => setBotToken(e.target.value)}
                            className="font-mono pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                            onClick={() => setShowToken(!showToken)}
                          >
                            {showToken ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.settings.botTokenDesc}</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="botUsername">{t.settings.botUsername}</Label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-border bg-muted text-muted-foreground text-sm">
                            @
                          </span>
                          <Input
                            id="botUsername"
                            placeholder="hokimlik_bot"
                            value={botUsername}
                            onChange={(e) => setBotUsername(e.target.value)}
                            className="rounded-l-none"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">{t.settings.botUsernameDesc}</p>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-end">
                      <Button onClick={saveBotSettings}>
                        <Save className="mr-2 h-4 w-4" />
                        {t.common.save}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Email SMTP Settings */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      {t.settings.emailSettings}
                    </CardTitle>
                    <CardDescription>{t.settings.emailSettingsDesc}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="smtpHost">{t.settings.smtpServer}</Label>
                        <Input
                          id="smtpHost"
                          placeholder="smtp.example.com"
                          value={smtpHost}
                          onChange={(e) => setSmtpHost(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPort">{t.settings.port}</Label>
                        <Input
                          id="smtpPort"
                          placeholder="587"
                          value={smtpPort}
                          onChange={(e) => setSmtpPort(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="senderEmail">{t.settings.senderEmail}</Label>
                        <Input
                          id="senderEmail"
                          type="email"
                          placeholder="noreply@hokimlik.uz"
                          value={senderEmail}
                          onChange={(e) => setSenderEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button>
                        <Save className="mr-2 h-4 w-4" />
                        {t.common.save}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          )}
          
          {/* Email SMTP Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {t.settings.emailSettings}
              </CardTitle>
              <CardDescription>{t.settings.emailSettingsDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">{t.settings.smtpServer}</Label>
                  <Input
                    id="smtpHost"
                    placeholder="smtp.example.com"
                    value={smtpHost}
                    onChange={(e) => setSmtpHost(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">{t.settings.port}</Label>
                  <Input
                    id="smtpPort"
                    placeholder="587"
                    value={smtpPort}
                    onChange={(e) => setSmtpPort(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="senderEmail">{t.settings.senderEmail}</Label>
                <Input
                  id="senderEmail"
                  type="email"
                  placeholder="noreply@hokimlik.uz"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                />
              </div>

              <div className="flex justify-end">
                <Button>
                  <Save className="mr-2 h-4 w-4" />
                  {t.common.save}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
    </>
  )
}
