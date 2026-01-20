"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ExternalLink, Loader2, CheckCircle2, XCircle, Info } from "lucide-react"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranslation } from "@/lib/i18n/context"

type LoginStep = "initial" | "checking" | "oneid_redirect" | "success" | "not_found"

export default function LoginPage() {
  const t = useTranslation()
  const [step, setStep] = useState<LoginStep>("initial")
  const [pnfl, setPnfl] = useState("")
  const [error, setError] = useState("")

  const handlePnflCheck = () => {
    if (pnfl.length !== 14) {
      setError("PNFL 14 ta raqamdan iborat bo'lishi kerak")
      return
    }

    if (!/^\d{14}$/.test(pnfl)) {
      setError("PNFL faqat raqamlardan iborat bo'lishi kerak")
      return
    }

    setError("")
    setStep("checking")

    // Simulate PNFL check
    setTimeout(() => {
      // Mock check - in real app this would call API
      const validPnfls = [
        "31234567890123",
        "32345678901234",
        "33456789012345",
        "34567890123456",
        "35678901234567",
        "36789012345678",
      ]

      if (validPnfls.some((p) => p === pnfl)) {
        setStep("oneid_redirect")
      } else {
        setStep("not_found")
      }
    }, 1500)
  }

  const handleOneIdLogin = () => {
    setStep("checking")
    setTimeout(() => {
      setStep("success")
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1000)
    }, 2000)
  }

  const handleDemoLogin = () => {
    window.location.href = "/dashboard"
  }

  const resetForm = () => {
    setStep("initial")
    setPnfl("")
    setError("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-purple-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <Card className="bg-card/95 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center space-y-6 p-8 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary/80 shadow-lg">
              <Shield className="h-10 w-10 text-primary-foreground" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-foreground">{t.auth.systemName}</CardTitle>
              <CardDescription className="text-muted-foreground text-base">{t.auth.systemDescription}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 p-8">
          {step === "initial" && (
            <>
              <Alert className="border-primary/30 bg-primary/10 rounded-2xl">
                <Info className="h-4 w-4 text-primary" />
                <AlertDescription className="text-sm text-primary/90">
                  {t.auth.loginWithOneId}
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Label htmlFor="pnfl" className="text-sm font-semibold text-foreground">{t.auth.pnflLabel}</Label>
                <Input
                  id="pnfl"
                  placeholder={t.auth.pnflPlaceholder}
                  value={pnfl}
                  onChange={(e) => setPnfl(e.target.value.replace(/\D/g, "").slice(0, 14))}
                  maxLength={14}
                  className="font-mono text-lg tracking-wider h-12 border-2 border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 rounded-xl bg-background/50 backdrop-blur-sm"
                />
                {error && <p className="text-sm text-destructive font-medium">{error}</p>}
                <p className="text-xs text-muted-foreground">{t.auth.pnflExample}</p>
              </div>

              <Button
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                size="lg"
                onClick={handlePnflCheck}
                disabled={pnfl.length < 14}
              >
                {t.auth.check}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card/80 px-3 py-1 rounded-full text-muted-foreground font-medium border border-border/50">{t.common.or}</span>
                </div>
              </div>

              <div className="rounded-2xl border border-border/50 bg-secondary/20 backdrop-blur-sm p-6 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">⚡</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.auth.demoLogin}</p>
                    <p className="text-xs text-muted-foreground">{t.auth.demoDescription}</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-3 bg-background/50 border-border/50 hover:bg-background hover:border-primary/30 rounded-xl transition-all duration-300"
                  onClick={handleDemoLogin}
                >
                  {t.auth.demoLogin}
                </Button>
              </div>
            </>
          )}

          {step === "checking" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center shadow-lg">
                  <Loader2 className="h-8 w-8 animate-spin text-primary-foreground" />
                </div>
                <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <p className="text-muted-foreground font-medium">{t.auth.checking}</p>
                <p className="text-xs text-muted-foreground">Илтимос, кутинг...</p>
              </div>
            </div>
          )}

          {step === "oneid_redirect" && (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center py-6">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <CheckCircle2 className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-3xl animate-pulse" />
                </div>
                <h3 className="font-bold text-foreground text-xl">{t.auth.userFound}</h3>
                <p className="text-muted-foreground">
                  {t.auth.activateProfile}
                </p>
              </div>

              <div className="rounded-2xl border border-border/50 bg-muted/30 backdrop-blur-sm p-4 space-y-2">
                <p className="text-xs text-muted-foreground font-medium">{t.auth.pnflLabel}</p>
                <p className="font-mono font-bold text-lg text-foreground">***{pnfl.slice(-4)}</p>
              </div>

              <Button
                className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 gap-2"
                size="lg"
                onClick={handleOneIdLogin}
              >
                <ExternalLink className="h-5 w-5" />
                {t.auth.loginWithOneId}
              </Button>

              <Button
                variant="ghost"
                className="w-full bg-muted/20 hover:bg-muted/30 rounded-xl transition-all duration-300"
                onClick={resetForm}
              >
                {t.auth.differentPnfl}
              </Button>
            </div>
          )}

          {step === "not_found" && (
            <div className="space-y-6">
              <div className="flex flex-col items-center text-center py-6">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <XCircle className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -inset-2 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-3xl animate-pulse" />
                </div>
                <h3 className="font-bold text-foreground text-xl">{t.auth.userNotFound}</h3>
                <p className="text-muted-foreground">
                  {t.auth.securityNote}
                </p>
              </div>

              <Alert variant="destructive" className="border-destructive/30 bg-destructive/10 rounded-2xl">
                <AlertDescription className="text-sm text-destructive/90">
                  {t.auth.securityNote}
                </AlertDescription>
              </Alert>

              <Button
                variant="outline"
                className="w-full bg-background/50 border-border/50 hover:bg-background hover:border-primary/30 rounded-xl transition-all duration-300"
                onClick={resetForm}
              >
                {t.auth.retry}
              </Button>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-12 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-xl">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -inset-3 bg-gradient-to-br from-green-500/30 to-emerald-600/30 rounded-[2rem] animate-pulse" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="font-bold text-foreground text-2xl">{t.auth.success}</h3>
                <p className="text-muted-foreground">{t.auth.profileActivated}</p>
              </div>
            </div>
          )}

          {step === "initial" && (
            <p className="text-center text-xs text-muted-foreground">
              {t.auth.agreeToTerms.replace('{terms}', `<a href="#" class="text-primary hover:underline">${t.auth.termsOfService}</a>`).replace('{policy}', `<a href="#" class="text-primary hover:underline">${t.auth.privacyPolicy}</a>`)}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
