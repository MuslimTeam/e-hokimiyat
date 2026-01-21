"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ExternalLink, Loader2, CheckCircle2, XCircle, Info } from "lucide-react"
import { useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { mockUsers } from "@/lib/mock-data"

// Temporary translation object
const t = {
  auth: {
    title: "Тизимга кириш",
    subtitle: "PNFL рақами орқали идентификация",
    pnflPlaceholder: "PNFL рақамини киритинг",
    checkButton: "Текшириш",
    checking: "Текширилмоқда...",
    invalidPnfl: "PNFL рақами нотўғри",
    userNotFound: "Фойдаланувчи топилмади",
    oneidRedirect: "OneID орқали йўналтирилмоқда...",
    success: "Муваффаққиятли!",
    profileActivated: "Профилингиз активлаштирилди",
    agreeToTerms: "Давом этиш билан {terms} ва {policy} рози бўласиз",
    termsOfService: "Фойдаланиш шартлари",
    privacyPolicy: "Махфийлик сиёсати"
  }
}

type LoginStep = "initial" | "checking" | "oneid_redirect" | "success" | "not_found"

export default function LoginPage() {
  const [step, setStep] = useState<LoginStep>("initial")
  const [pnfl, setPnfl] = useState("")
  const [error, setError] = useState("")

  const handlePnflCheck = () => {
    if (pnfl.length !== 14) {
      setError("PNFL 14 ta raqamdan iborat bo'lishi kerak")
      return
    }

    setError("")
    setStep("checking")

    // Simulate API call - check against users database
    setTimeout(() => {
      const user = mockUsers.find(u => u.pnfl === pnfl)
      
      if (user) {
        // User found - redirect based on role
        setStep("success")
        // In real app, this would use router.push with role-based routing
        setTimeout(() => {
          // For demo, we'll just show success
          // In real app: 
          // if (user.role === "ADMIN") router.push("/dashboard")
          // else if (user.role === "TUMAN_HOKIMI") router.push("/dashboard")
          // else router.push("/dashboard")
        }, 1500)
      } else {
        setStep("not_found")
        setError("Bu PNFL raqami tizimda ro'yxatdan o'tmagan")
      }
    }, 2000)
  }

  const handleReset = () => {
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
              <CardTitle className="text-2xl font-bold text-foreground">Тизимга кириш</CardTitle>
              <p className="text-muted-foreground">PNFL рақами орқали идентификация</p>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-6">
            {step === "initial" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pnfl">PNFL рақами</Label>
                  <Input
                    id="pnfl"
                    type="text"
                    placeholder="PNFL рақамини киритинг"
                    value={pnfl}
                    onChange={(e) => setPnfl(e.target.value.replace(/\D/g, ""))}
                    maxLength={14}
                    className="text-center text-lg tracking-wider"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <XCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  onClick={handlePnflCheck} 
                  className="w-full" 
                  disabled={pnfl.length !== 14}
                >
                  Текшириш
                </Button>
              </div>
            )}

            {step === "checking" && (
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">Текширилмоқда...</h3>
                  <p className="text-sm text-muted-foreground">PNFL рақамингиз текширилмоқда</p>
                </div>
              </div>
            )}

            {step === "oneid_redirect" && (
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <div>
                  <h3 className="font-semibold text-foreground">OneID орқали йўналтирилмоқда...</h3>
                  <p className="text-sm text-muted-foreground">Илтимос кутинг</p>
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto" />
                <div>
                  <h3 className="font-bold text-foreground text-2xl">Муваффаққиятли!</h3>
                  <p className="text-muted-foreground">Профилингиз активлаштирилди</p>
                </div>
                <Button className="w-full">
                  Тизимга кириш
                </Button>
              </div>
            )}

            {step === "not_found" && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertDescription>
                    Фойдаланувчи топилмади. Илтимос PNFL рақамингизни текшириб кўринг.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <Button onClick={handleReset} variant="outline" className="w-full">
                    Қайта уриниш
                  </Button>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    OneID орқали рўйхатдан ўтиш
                  </Button>
                </div>
              </div>
            )}

            {step === "initial" && (
              <p className="text-center text-xs text-muted-foreground">
                Давом этиш билан <a href="#" className="text-primary hover:underline">Фойдаланиш шартлари</a> ва <a href="#" className="text-primary hover:underline">Махфийлик сиёсати</a> рози бўласиз
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
