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
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">{t.auth.systemName}</CardTitle>
            <CardDescription className="mt-2">{t.auth.systemDescription}</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === "initial" && (
            <>
              <Alert className="border-primary/30 bg-primary/5">
                <Info className="h-4 w-4 text-primary" />
                <AlertDescription className="text-sm">
                  {t.auth.loginWithOneId}
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="pnfl">{t.auth.pnflLabel}</Label>
                <Input
                  id="pnfl"
                  placeholder={t.auth.pnflPlaceholder}
                  value={pnfl}
                  onChange={(e) => setPnfl(e.target.value.replace(/\D/g, "").slice(0, 14))}
                  maxLength={14}
                  className="font-mono text-lg tracking-wider"
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
                <p className="text-xs text-muted-foreground">{t.auth.pnflExample}</p>
              </div>

              <Button className="w-full h-12 text-base" size="lg" onClick={handlePnflCheck} disabled={pnfl.length < 14}>
                {t.auth.check}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">{t.common.or}</span>
                </div>
              </div>

              <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">{t.auth.demoLogin}</p>
                <p className="text-xs text-muted-foreground">{t.auth.demoDescription}</p>
                <Button variant="outline" className="w-full mt-2 bg-transparent" onClick={handleDemoLogin}>
                  {t.auth.demoLogin}
                </Button>
              </div>
            </>
          )}

          {step === "checking" && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-muted-foreground">{t.auth.checking}</p>
            </div>
          )}

          {step === "oneid_redirect" && (
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 mb-4">
                  <CheckCircle2 className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground">{t.auth.userFound}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.auth.activateProfile}
                </p>
              </div>

              <div className="rounded-lg border border-border bg-muted/50 p-3 space-y-1">
                <p className="text-xs text-muted-foreground">{t.auth.pnflLabel}</p>
                <p className="font-mono font-medium">***{pnfl.slice(-4)}</p>
              </div>

              <Button className="w-full h-12 text-base gap-2" size="lg" onClick={handleOneIdLogin}>
                <ExternalLink className="h-5 w-5" />
                {t.auth.loginWithOneId}
              </Button>

              <Button variant="ghost" className="w-full" onClick={resetForm}>
                {t.auth.differentPnfl}
              </Button>
            </div>
          )}

          {step === "not_found" && (
            <div className="space-y-4">
              <div className="flex flex-col items-center text-center py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 mb-4">
                  <XCircle className="h-6 w-6 text-destructive" />
                </div>
                <h3 className="font-semibold text-foreground">{t.auth.userNotFound}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {t.auth.securityNote}
                </p>
              </div>

              <Alert variant="destructive" className="border-destructive/30 bg-destructive/5">
                <AlertDescription className="text-sm">
                  {t.auth.securityNote}
                </AlertDescription>
              </Alert>

              <Button variant="outline" className="w-full bg-transparent" onClick={resetForm}>
                {t.auth.retry}
              </Button>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
                <CheckCircle2 className="h-8 w-8 text-accent" />
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground">{t.auth.success}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t.auth.profileActivated}</p>
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
