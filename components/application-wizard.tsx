"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ArrowLeft,
  ArrowRight,
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Download,
  Calendar,
  Building2,
  Tractor,
  Coins,
  ClipboardList,
  FileCheck,
  AlertTriangle,
  XCircle,
  Eye,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

interface ApplicationWizardProps {
  landId: string
}

const crops = ["稲（米）", "小麦", "野菜（葉物）", "野菜（根菜）", "果樹", "花卉", "豆類", "その他"]

const equipment = [
  "トラクター",
  "田植え機",
  "コンバイン",
  "耕運機",
  "軽トラック",
  "散布機",
  "草刈り機",
  "ビニールハウス",
]

const scheduleMonths = [
  { month: "1月", task: "" },
  { month: "2月", task: "" },
  { month: "3月", task: "土壌準備・耕起" },
  { month: "4月", task: "播種・定植" },
  { month: "5月", task: "管理作業" },
  { month: "6月", task: "管理作業・除草" },
  { month: "7月", task: "管理作業" },
  { month: "8月", task: "収穫準備" },
  { month: "9月", task: "収穫" },
  { month: "10月", task: "収穫・出荷" },
  { month: "11月", task: "片付け・土壌改良" },
  { month: "12月", task: "計画立案" },
]

// Mock application status for the dashboard
const applicationStatus = {
  currentStep: 2,
  steps: [
    { id: 1, label: "申請書提出", status: "completed", date: "2026/01/10" },
    { id: 2, label: "書類確認中", status: "current", date: "2026/01/14", note: "農業委員会が確認中" },
    { id: 3, label: "審議予定", status: "upcoming", date: "2026/02/15", note: "月例審議会" },
    { id: 4, label: "許可通知", status: "upcoming", date: "2026/02/20頃" },
  ],
  issues: [
    {
      field: "自己資金証明",
      message: "残高証明書の日付が3ヶ月以上前です。最新のものを再提出してください。",
      severity: "error",
    },
    {
      field: "営農計画書",
      message: "収支計画の詳細が不足しています。販売先の記載を追加してください。",
      severity: "warning",
    },
  ],
}

export function ApplicationWizard({ landId }: ApplicationWizardProps) {
  const [wizardStep, setWizardStep] = useState(1)
  const [activeTab, setActiveTab] = useState<"wizard" | "documents" | "dashboard" | "preview">("wizard")

  // Form state
  const [formData, setFormData] = useState({
    selectedCrops: [] as string[],
    yearlySchedule: scheduleMonths,
    selfFunding: "",
    loanAmount: "",
    selectedEquipment: [] as string[],
    farmingExperience: "",
    salesPlan: "",
  })

  // Document upload state
  const [uploadedDocs, setUploadedDocs] = useState<
    Record<string, { uploaded: boolean; status: "ok" | "error" | "warning" | null }>
  >({
    mynumber: { uploaded: false, status: null },
    residence: { uploaded: false, status: null },
    bankStatement: { uploaded: false, status: null },
    farmingPlan: { uploaded: false, status: null },
  })

  const totalWizardSteps = 4
  const wizardProgress = (wizardStep / totalWizardSteps) * 100

  const handleCropToggle = (crop: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCrops: prev.selectedCrops.includes(crop)
        ? prev.selectedCrops.filter((c) => c !== crop)
        : [...prev.selectedCrops, crop],
    }))
  }

  const handleEquipmentToggle = (eq: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedEquipment: prev.selectedEquipment.includes(eq)
        ? prev.selectedEquipment.filter((e) => e !== eq)
        : [...prev.selectedEquipment, eq],
    }))
  }

  const simulateDocUpload = (docKey: string) => {
    setUploadedDocs((prev) => ({
      ...prev,
      [docKey]: { uploaded: true, status: Math.random() > 0.3 ? "ok" : Math.random() > 0.5 ? "warning" : "error" },
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Button variant="ghost" asChild className="gap-2 mb-4">
          <Link href={`/detail/${landId}`}>
            <ArrowLeft className="h-4 w-4" />
            農地詳細に戻る
          </Link>
        </Button>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">農地法3条申請手続き</h1>
        <p className="text-muted-foreground mt-2">農地法第3条許可申請書をオンラインで作成・提出できます</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { id: "wizard", label: "営農計画作成", icon: ClipboardList },
          { id: "documents", label: "書類アップロード", icon: Upload },
          { id: "dashboard", label: "進捗ダッシュボード", icon: Clock },
          { id: "preview", label: "書類プレビュー", icon: Eye },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeTab === tab.id ? "default" : "outline"}
            className={`gap-2 ${activeTab !== tab.id ? "bg-transparent" : ""}`}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Wizard Tab */}
      {activeTab === "wizard" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      営農計画書作成ウィザード
                    </CardTitle>
                    <CardDescription>質問に答えるだけで営農計画書の草案が完成します</CardDescription>
                  </div>
                  <Badge variant="secondary">
                    ステップ {wizardStep}/{totalWizardSteps}
                  </Badge>
                </div>
                <Progress value={wizardProgress} className="h-2 mt-4" />
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1: Crop Selection */}
                {wizardStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">栽培品目の選択</h3>
                      <p className="text-sm text-muted-foreground">
                        栽培を予定している作物を選択してください（複数選択可）
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {crops.map((crop) => (
                        <div
                          key={crop}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors text-center ${
                            formData.selectedCrops.includes(crop)
                              ? "bg-primary/10 border-primary"
                              : "bg-card border-border hover:border-primary/50"
                          }`}
                          onClick={() => handleCropToggle(crop)}
                        >
                          <span
                            className={
                              formData.selectedCrops.includes(crop) ? "text-primary font-medium" : "text-foreground"
                            }
                          >
                            {crop}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Yearly Schedule */}
                {wizardStep === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">年間作業予定</h3>
                      <p className="text-sm text-muted-foreground">各月の作業予定を入力してください</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {formData.yearlySchedule.map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <Label className="text-xs text-muted-foreground">{item.month}</Label>
                          <Input
                            placeholder="作業内容"
                            value={item.task}
                            onChange={(e) => {
                              const newSchedule = [...formData.yearlySchedule]
                              newSchedule[idx].task = e.target.value
                              setFormData((prev) => ({ ...prev, yearlySchedule: newSchedule }))
                            }}
                            className="h-9 text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Funding */}
                {wizardStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">資金計画</h3>
                      <p className="text-sm text-muted-foreground">就農に必要な資金の詳細を入力してください</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="selfFunding" className="flex items-center gap-2">
                          <Coins className="h-4 w-4 text-primary" />
                          自己資金
                        </Label>
                        <div className="relative">
                          <Input
                            id="selfFunding"
                            type="number"
                            placeholder="例: 3000000"
                            value={formData.selfFunding}
                            onChange={(e) => setFormData((prev) => ({ ...prev, selfFunding: e.target.value }))}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">円</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="loanAmount" className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-primary" />
                          借入予定額
                        </Label>
                        <div className="relative">
                          <Input
                            id="loanAmount"
                            type="number"
                            placeholder="例: 1500000"
                            value={formData.loanAmount}
                            onChange={(e) => setFormData((prev) => ({ ...prev, loanAmount: e.target.value }))}
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">円</span>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="salesPlan">販売計画</Label>
                      <Textarea
                        id="salesPlan"
                        placeholder="収穫物の販売先や販売方法を記入してください（例：地元直売所への出荷、契約栽培など）"
                        value={formData.salesPlan}
                        onChange={(e) => setFormData((prev) => ({ ...prev, salesPlan: e.target.value }))}
                        rows={3}
                      />
                    </div>
                  </div>
                )}

                {/* Step 4: Equipment */}
                {wizardStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">所有農機具</h3>
                      <p className="text-sm text-muted-foreground">
                        現在所有している、または購入予定の農機具を選択してください
                      </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {equipment.map((eq) => (
                        <div
                          key={eq}
                          className={`p-4 rounded-lg border cursor-pointer transition-colors text-center ${
                            formData.selectedEquipment.includes(eq)
                              ? "bg-primary/10 border-primary"
                              : "bg-card border-border hover:border-primary/50"
                          }`}
                          onClick={() => handleEquipmentToggle(eq)}
                        >
                          <Tractor
                            className={`h-5 w-5 mx-auto mb-2 ${formData.selectedEquipment.includes(eq) ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <span
                            className={
                              formData.selectedEquipment.includes(eq)
                                ? "text-primary font-medium text-sm"
                                : "text-foreground text-sm"
                            }
                          >
                            {eq}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="experience">農業経験</Label>
                      <Select
                        value={formData.farmingExperience}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, farmingExperience: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="経験年数を選択" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">未経験</SelectItem>
                          <SelectItem value="less1">1年未満</SelectItem>
                          <SelectItem value="1to3">1〜3年</SelectItem>
                          <SelectItem value="3to5">3〜5年</SelectItem>
                          <SelectItem value="more5">5年以上</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setWizardStep((prev) => prev - 1)}
                  disabled={wizardStep === 1}
                  className="gap-2 bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4" />
                  前へ
                </Button>
                {wizardStep < totalWizardSteps ? (
                  <Button onClick={() => setWizardStep((prev) => prev + 1)} className="gap-2">
                    次へ
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button onClick={() => setActiveTab("preview")} className="gap-2">
                    <FileText className="h-4 w-4" />
                    計画書を生成
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {/* Sidebar Summary */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">入力内容の要約</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <p className="text-muted-foreground mb-1">栽培品目</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.selectedCrops.length > 0 ? (
                      formData.selectedCrops.map((crop) => (
                        <Badge key={crop} variant="secondary" className="text-xs">
                          {crop}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">未選択</span>
                    )}
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground mb-1">資金計画</p>
                  <p className="text-foreground">
                    自己資金: {formData.selfFunding ? `${Number(formData.selfFunding).toLocaleString()}円` : "未入力"}
                  </p>
                  <p className="text-foreground">
                    借入予定: {formData.loanAmount ? `${Number(formData.loanAmount).toLocaleString()}円` : "未入力"}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-muted-foreground mb-1">農機具</p>
                  <div className="flex flex-wrap gap-1">
                    {formData.selectedEquipment.length > 0 ? (
                      formData.selectedEquipment.map((eq) => (
                        <Badge key={eq} variant="secondary" className="text-xs">
                          {eq}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-muted-foreground text-xs">未選択</span>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === "documents" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  必要書類のアップロード
                </CardTitle>
                <CardDescription>書類をアップロードするとAIが自動で不足項目をチェックします</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: "mynumber", label: "マイナンバーカード（両面）", required: true },
                  { key: "residence", label: "住民票の写し", required: true },
                  { key: "bankStatement", label: "預金残高証明書", required: true },
                  { key: "farmingPlan", label: "営農計画書", required: true },
                ].map((doc) => (
                  <div
                    key={doc.key}
                    className={`p-4 rounded-lg border ${
                      uploadedDocs[doc.key]?.status === "ok"
                        ? "bg-primary/5 border-primary/30"
                        : uploadedDocs[doc.key]?.status === "error"
                          ? "bg-destructive/5 border-destructive/30"
                          : uploadedDocs[doc.key]?.status === "warning"
                            ? "bg-yellow-500/5 border-yellow-500/30"
                            : "border-border"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-foreground">{doc.label}</p>
                          {doc.required && (
                            <Badge variant="outline" className="text-xs mt-1">
                              必須
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {uploadedDocs[doc.key]?.uploaded && (
                          <>
                            {uploadedDocs[doc.key]?.status === "ok" && (
                              <Badge className="bg-primary text-primary-foreground gap-1">
                                <CheckCircle2 className="h-3 w-3" />
                                確認済み
                              </Badge>
                            )}
                            {uploadedDocs[doc.key]?.status === "error" && (
                              <Badge variant="destructive" className="gap-1">
                                <XCircle className="h-3 w-3" />
                                不備あり
                              </Badge>
                            )}
                            {uploadedDocs[doc.key]?.status === "warning" && (
                              <Badge className="bg-yellow-500 text-white gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                要確認
                              </Badge>
                            )}
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          onClick={() => simulateDocUpload(doc.key)}
                        >
                          <Upload className="h-4 w-4" />
                          {uploadedDocs[doc.key]?.uploaded ? "再アップロード" : "アップロード"}
                        </Button>
                      </div>
                    </div>
                    {uploadedDocs[doc.key]?.status === "error" && (
                      <div className="mt-3 p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>書類の有効期限が切れています。3ヶ月以内に発行されたものを再提出してください。</span>
                      </div>
                    )}
                    {uploadedDocs[doc.key]?.status === "warning" && (
                      <div className="mt-3 p-3 rounded-md bg-yellow-500/10 text-yellow-700 text-sm flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>画像が不鮮明です。再度スキャンしてアップロードすることをお勧めします。</span>
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* AI Check Summary */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AIチェック結果
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-4">
                  <div className="text-4xl font-bold text-primary mb-1">
                    {Object.values(uploadedDocs).filter((d) => d.status === "ok").length}/
                    {Object.keys(uploadedDocs).length}
                  </div>
                  <p className="text-sm text-muted-foreground">書類が確認済み</p>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                      確認済み
                    </span>
                    <span className="font-medium text-foreground">
                      {Object.values(uploadedDocs).filter((d) => d.status === "ok").length}件
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      要確認
                    </span>
                    <span className="font-medium text-foreground">
                      {Object.values(uploadedDocs).filter((d) => d.status === "warning").length}件
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-muted-foreground">
                      <XCircle className="h-4 w-4 text-destructive" />
                      不備あり
                    </span>
                    <span className="font-medium text-foreground">
                      {Object.values(uploadedDocs).filter((d) => d.status === "error").length}件
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Dashboard Tab */}
      {activeTab === "dashboard" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  手続き進捗ダッシュボード
                </CardTitle>
                <CardDescription>申請から許可までの進捗をリアルタイムで確認できます</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {/* Progress Line */}
                  <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-border" />
                  <div
                    className="absolute left-6 top-8 w-0.5 bg-primary transition-all duration-500"
                    style={{
                      height: `${((applicationStatus.currentStep - 1) / (applicationStatus.steps.length - 1)) * 100}%`,
                    }}
                  />

                  <div className="space-y-6">
                    {applicationStatus.steps.map((step, idx) => (
                      <div key={step.id} className="relative flex gap-4">
                        <div
                          className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                            step.status === "completed"
                              ? "bg-primary border-primary text-primary-foreground"
                              : step.status === "current"
                                ? "bg-primary/10 border-primary text-primary"
                                : "bg-card border-border text-muted-foreground"
                          }`}
                        >
                          {step.status === "completed" ? (
                            <CheckCircle2 className="h-6 w-6" />
                          ) : step.status === "current" ? (
                            <Clock className="h-6 w-6" />
                          ) : (
                            <span className="text-lg font-semibold">{step.id}</span>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center gap-3 mb-1">
                            <h4
                              className={`font-semibold ${step.status === "upcoming" ? "text-muted-foreground" : "text-foreground"}`}
                            >
                              {step.label}
                            </h4>
                            {step.status === "current" && (
                              <Badge className="bg-primary/10 text-primary border-primary/20">進行中</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {step.date}
                          </p>
                          {step.note && <p className="text-sm text-muted-foreground mt-1">{step.note}</p>}
                          {step.status === "current" && (
                            <div className="mt-3 p-3 rounded-lg bg-primary/5 border border-primary/20">
                              <p className="text-sm text-foreground font-medium">現在：農業委員会が書類を確認中</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                次回審議予定：2026/02/15（月例審議会）
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Issues Card */}
            {applicationStatus.issues.length > 0 && (
              <Card className="border-destructive/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    修正が必要な項目
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {applicationStatus.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border ${
                        issue.severity === "error"
                          ? "bg-destructive/5 border-destructive/30"
                          : "bg-yellow-500/5 border-yellow-500/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {issue.severity === "error" ? (
                          <XCircle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p
                            className={`font-medium ${issue.severity === "error" ? "text-destructive" : "text-yellow-700"}`}
                          >
                            {issue.field}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">{issue.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Timeline Summary */}
          <div>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">予定スケジュール</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-xs text-muted-foreground">次のアクション</p>
                  <p className="font-medium text-foreground mt-1">農業委員会 月例審議</p>
                  <p className="text-sm text-primary mt-1">2026年2月15日</p>
                </div>
                <div className="p-3 rounded-lg bg-secondary">
                  <p className="text-xs text-muted-foreground">許可予定日</p>
                  <p className="font-medium text-foreground mt-1">2026年2月20日頃</p>
                </div>
                <Separator />
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">審議まであと</p>
                  <p className="text-3xl font-bold text-primary mt-1">32日</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Preview Tab */}
      {activeTab === "preview" && (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <FileCheck className="h-5 w-5 text-primary" />
                      農地法第3条許可申請書
                    </CardTitle>
                    <CardDescription>入力内容が申請書フォーマットに反映されています</CardDescription>
                  </div>
                  <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    PDFダウンロード
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* PDF-like Preview */}
                <div className="bg-white border border-border rounded-lg p-8 shadow-inner">
                  <div className="space-y-6 font-serif">
                    {/* Header */}
                    <div className="text-center border-b border-border pb-4">
                      <h2 className="text-xl font-bold text-foreground">農地法第3条の規定による許可申請書</h2>
                      <p className="text-sm text-muted-foreground mt-2">令和8年1月14日</p>
                    </div>

                    {/* Applicant Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">申請者氏名</p>
                        <p className="font-medium text-foreground border-b border-dashed border-border pb-1">
                          山田 太郎
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">住所</p>
                        <p className="font-medium text-foreground border-b border-dashed border-border pb-1">
                          長野県松本市中央1-1-1
                        </p>
                      </div>
                    </div>

                    {/* Land Info */}
                    <div className="p-4 bg-muted/30 rounded-lg">
                      <h3 className="font-semibold text-foreground mb-3">申請農地の表示</h3>
                      <table className="w-full text-sm">
                        <tbody>
                          <tr className="border-b border-border">
                            <td className="py-2 text-muted-foreground w-1/3">所在地</td>
                            <td className="py-2 text-foreground">長野県松本市梓川梓1234-5</td>
                          </tr>
                          <tr className="border-b border-border">
                            <td className="py-2 text-muted-foreground">地目</td>
                            <td className="py-2 text-foreground">田</td>
                          </tr>
                          <tr>
                            <td className="py-2 text-muted-foreground">面積</td>
                            <td className="py-2 text-foreground">1,200㎡</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Farming Plan */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">営農計画</h3>
                      <table className="w-full text-sm border border-border">
                        <tbody>
                          <tr className="border-b border-border">
                            <td className="py-2 px-3 bg-muted/50 text-muted-foreground w-1/3">栽培品目</td>
                            <td className="py-2 px-3 text-foreground">
                              {formData.selectedCrops.length > 0 ? formData.selectedCrops.join("、") : "稲（米）"}
                            </td>
                          </tr>
                          <tr className="border-b border-border">
                            <td className="py-2 px-3 bg-muted/50 text-muted-foreground">自己資金</td>
                            <td className="py-2 px-3 text-foreground">
                              {formData.selfFunding
                                ? `${Number(formData.selfFunding).toLocaleString()}円`
                                : "3,000,000円"}
                            </td>
                          </tr>
                          <tr className="border-b border-border">
                            <td className="py-2 px-3 bg-muted/50 text-muted-foreground">借入予定額</td>
                            <td className="py-2 px-3 text-foreground">
                              {formData.loanAmount
                                ? `${Number(formData.loanAmount).toLocaleString()}円`
                                : "1,500,000円"}
                            </td>
                          </tr>
                          <tr>
                            <td className="py-2 px-3 bg-muted/50 text-muted-foreground">所有農機具</td>
                            <td className="py-2 px-3 text-foreground">
                              {formData.selectedEquipment.length > 0
                                ? formData.selectedEquipment.join("、")
                                : "軽トラック、草刈り機"}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Signature Area */}
                    <div className="pt-8 border-t border-border">
                      <div className="flex justify-end">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">申請者印</p>
                          <div className="w-16 h-16 border-2 border-dashed border-border rounded-lg mt-2" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Sidebar */}
          <div className="space-y-4">
            <Card className="border-primary bg-primary/5">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto">
                    <Send className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">電子申請の準備完了</h3>
                    <p className="text-sm text-muted-foreground mt-1">自治体の窓口に行かずに、ここから申請できます</p>
                  </div>
                  <Button size="lg" className="w-full gap-2">
                    <Send className="h-4 w-4" />
                    電子申請を送信する
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    ※ 送信前に全ての書類がアップロードされていることを確認してください
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">申請前チェックリスト</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "営農計画書の作成", done: formData.selectedCrops.length > 0 },
                  { label: "必要書類のアップロード", done: Object.values(uploadedDocs).some((d) => d.uploaded) },
                  { label: "本人確認書類の確認", done: uploadedDocs.mynumber?.status === "ok" },
                  { label: "資金計画の記入", done: !!formData.selfFunding },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-secondary">
                    {item.done ? (
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />
                    )}
                    <span className={item.done ? "text-foreground" : "text-muted-foreground"}>{item.label}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
