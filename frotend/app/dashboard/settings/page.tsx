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
  Palette,
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
import { useTheme } from "next-themes"
import { useTranslation } from "@/lib/i18n/context"
import { getSettings, getUsers, postSettings } from "@/lib/api"

export default function SettingsPage() {
  const t = useTranslation()
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [telegramNotifications, setTelegramNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(false)
  const [taskDeadlineReminder, setTaskDeadlineReminder] = useState(true)
  const [newTaskNotification, setNewTaskNotification] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
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
      const lsDark = localStorage.getItem("darkMode")
      if (lsDark !== null) setDarkMode(lsDark === "1")
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
        setDarkMode(typeof s.darkMode !== "undefined" ? Boolean(s.darkMode) : darkMode)
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

  const { setTheme } = useTheme()

  useEffect(() => {
    try {
      setTheme(darkMode ? "dark" : "light")
      localStorage.setItem("darkMode", darkMode ? "1" : "0")
    } catch (e) {}
  }, [darkMode, setTheme])

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
      darkMode,
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
      <div className="p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList
            className={`grid w-full ${isAdmin ? "grid-cols-5" : "grid-cols-4"} lg:w-[${isAdmin ? "600" : "500"}px]`}
          >
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">{t.settings.profile}</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">{t.settings.notifications}</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">{t.settings.security}</span>
            </TabsTrigger>
            <TabsTrigger value="appearance" className="gap-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">{t.settings.appearance}</span>
            </TabsTrigger>
            {isAdmin && (
              <TabsTrigger value="admin" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">{t.settings.admin}</span>
              </TabsTrigger>
            )}
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>{t.settings.profileInfo}</CardTitle>
                <CardDescription>{t.settings.profileDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-6">
                  <Avatar className="h-20 w-20">
                    <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                      {currentUser.firstName[0]}
                      {currentUser.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">
                      {currentUser.firstName} {currentUser.lastName}
                    </h3>
                    <p className="text-sm text-muted-foreground">{currentUser.role}</p>
                    <Badge variant="outline" className="mt-2 bg-accent/10 text-accent border-accent/30">
                      <UserCheck className="mr-1 h-3 w-3" />
                      {t.settings.oneIDConnected}
                    </Badge>
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t.settings.firstName}</Label>
                    <Input defaultValue={currentUser.firstName} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.settings.lastName}</Label>
                    <Input defaultValue={currentUser.lastName} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.settings.middleName}</Label>
                    <Input defaultValue={currentUser.middleName} />
                  </div>
                  <div className="space-y-2">
                    <Label>{t.settings.phone}</Label>
                    <Input defaultValue={currentUser.phone || ""} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>{t.settings.email}</Label>
                    <Input defaultValue="user@gov.uz" type="email" />
                  </div>
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

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>{t.settings.notificationSettings}</CardTitle>
                <CardDescription>{t.settings.notificationDescription}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">{t.settings.notificationChannels}</h4>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Mail className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{t.settings.emailNotifications}</p>
                        <p className="text-sm text-muted-foreground">{t.settings.emailNotificationsDesc}</p>
                      </div>
                    </div>
                    <Switch checked={emailNotifications} onCheckedChange={setEmailNotifications} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{t.settings.telegramNotifications}</p>
                        <p className="text-sm text-muted-foreground">{t.settings.telegramNotificationsDesc}</p>
                      </div>
                    </div>
                    <Switch checked={telegramNotifications} onCheckedChange={setTelegramNotifications} />
                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                        <Smartphone className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">{t.settings.pushNotifications}</p>
                        <p className="text-sm text-muted-foreground">{t.settings.pushNotificationsDesc}</p>
                      </div>
                    </div>
                    <Switch checked={pushNotifications} onCheckedChange={setPushNotifications} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">{t.settings.notificationTypes}</h4>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t.settings.newTasks}</p>
                      <p className="text-sm text-muted-foreground">{t.settings.newTasksDesc}</p>
                    </div>
                    <Switch checked={newTaskNotification} onCheckedChange={setNewTaskNotification} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t.settings.deadlineReminders}</p>
                      <p className="text-sm text-muted-foreground">{t.settings.deadlineRemindersDesc}</p>
                    </div>
                    <Switch checked={taskDeadlineReminder} onCheckedChange={setTaskDeadlineReminder} />
                  </div>
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
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{t.settings.darkMode}</p>
                    <p className="text-sm text-muted-foreground">{t.settings.darkModeDesc}</p>
                  </div>
                  <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>{t.settings.language}</Label>
                  <Select value={language} onValueChange={(v) => setLanguage(v)}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <Globe className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="uz">Ўзбек тили</SelectItem>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="en">English</SelectItem>
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
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </>
  )
}
