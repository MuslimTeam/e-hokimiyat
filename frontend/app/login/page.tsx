"use client"

import { useState } from "react"
import {
  Shield,
  ExternalLink,
  Loader2,
  CheckCircle2,
  XCircle,
  Info,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTranslation } from "@/lib/i18n/context"

type LoginStep =
  | "initial"
  | "checking"
  | "oneid_redirect"
  | "success"
  | "not_found"

export default function LoginPage() {
  const t = useTranslation()
  const [step, setStep] = useState<LoginStep>("initial")
  const [pnfl, setPnfl] = useState("")
  const [error, setError] = useState("")

  const handlePnflCheck = () => {
    if (!/^\d{14}$/.test(pnfl)) {
      setError("PNFL 14 ta raqamdan iborat bo‘lishi kerak")
      return
    }

    setError("")
    setStep("checking")

    setTimeout(() => {
      const validPnfls = [
        "31234567890123",
        "32345678901234",
        "33456789012345",
      ]

      setStep(validPnfls.includes(pnfl) ? "oneid_redirect" : "not_found")
    }, 1500)
  }

  const handleOneIdLogin = () => {
    setStep("checking")
    setTimeout(() => {
      setStep("success")
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1000)
    }, 1500)
  }

  const resetForm = () => {
    setStep("initial")
    setPnfl("")
    setError("")
  }

  const termsHtml = t.auth.agreeToTerms
    .replace(
      "{terms}",
      `<a href="#" class="text-primary hover:underline">${t.auth.termsOfService}</a>`
    )
    .replace(
      "{policy}",
      `<a href="#" class="text-primary hover:underline">${t.auth.privacyPolicy}</a>`
    )

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-emerald-50 flex items-center justify-center p-4">
      {/* Background blur */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-emerald-400/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-purple-400/20 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <Card className="bg-card/95 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">
          <CardHeader className="text-center space-y-4 p-8">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary-foreground" />
            </div>
            <CardTitle className="text-2xl font-bold">
              {t.auth.systemName}
            </CardTitle>
            <CardDescription>
              {t.auth.systemDescription}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 p-8">
            {step === "initial" && (
              <>
                <Alert className="bg-primary/10 border-primary/20">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertDescription>
                    {t.auth.loginWithOneId}
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <Label>{t.auth.pnflLabel}</Label>
                  <Input
                    value={pnfl}
                    onChange={(e) =>
                      setPnfl(
                        e.target.value.replace(/\D/g, "").slice(0, 14)
                      )
                    }
                    maxLength={14}
                  />
                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}
                </div>

                <Button
                  className="w-full"
                  onClick={handlePnflCheck}
                  disabled={pnfl.length !== 14}
                >
                  {t.auth.check}
                </Button>

                <p
                  className="text-xs text-muted-foreground text-center"
                  dangerouslySetInnerHTML={{ __html: termsHtml }}
                />
              </>
            )}

            {step === "checking" && (
              <div className="flex flex-col items-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-4 text-muted-foreground">
                  {t.auth.checking}
                </p>
              </div>
            )}

            {step === "oneid_redirect" && (
              <>
                <Alert>
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>
                    {t.auth.userFound}
                  </AlertDescription>
                </Alert>

                <Button
                  className="w-full"
                  onClick={handleOneIdLogin}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t.auth.loginWithOneId}
                </Button>

                <Button variant="ghost" onClick={resetForm}>
                  {t.auth.differentPnfl}
                </Button>
              </>
            )}

            {step === "not_found" && (
              <>
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    {t.auth.userNotFound}
                  </AlertDescription>
                </Alert>

                <Button variant="outline" onClick={resetForm}>
                  {t.auth.retry}
                </Button>
              </>
            )}

            {step === "success" && (
              <div className="flex flex-col items-center py-10">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
                <p className="mt-4 font-semibold">
                  {t.auth.success}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
