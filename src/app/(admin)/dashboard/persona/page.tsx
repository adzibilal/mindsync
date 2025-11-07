"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Sparkles, 
  Save, 
  Loader2, 
  CheckCircle2,
  Bot,
  RefreshCw,
  AlertCircle,
  Info,
  Lightbulb
} from "lucide-react";
import { toast } from "sonner";
import { getUserData } from "@/utils/cookies";
import { PERSONA_PRESETS, PersonaPreset } from "@/data/persona-presets";
import { AnimatedCard } from "@/components/ui/animated-card";
import { GlassCard } from "@/components/ui/glass-card";
import { FloatingIcon } from "@/components/ui/floating-icon";
import { BlurFade } from "@/components/ui/blur-fade";
import { motion } from "framer-motion";

interface CameoPersona {
  user_whatsapp_number: string;
  cameo_name: string;
  system_prompt: string;
  image_url: string | null;
  status: boolean;
  updated_at: string;
}

export default function PersonaPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<CameoPersona | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    cameo_name: "",
    system_prompt: "",
    image_url: "",
    status: true,
  });

  const userData = getUserData();
  const whatsappNumber = userData?.whatsapp_number as string;

  // Character limits
  const MAX_PROMPT_LENGTH = 2000;
  const MIN_PROMPT_LENGTH = 10;

  // Fetch current persona
  useEffect(() => {
    if (whatsappNumber) {
      fetchPersona();
    }
  }, [whatsappNumber]);

  // Track unsaved changes
  useEffect(() => {
    if (currentPersona) {
      const hasChanges = 
        formData.cameo_name !== currentPersona.cameo_name ||
        formData.system_prompt !== currentPersona.system_prompt ||
        formData.image_url !== (currentPersona.image_url || "");
      setHasUnsavedChanges(hasChanges);
    }
  }, [formData, currentPersona]);

  const fetchPersona = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/persona?whatsapp_number=${whatsappNumber}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        setCurrentPersona(data.data);
        setFormData({
          cameo_name: data.data.cameo_name,
          system_prompt: data.data.system_prompt,
          image_url: data.data.image_url || "",
          status: data.data.status,
        });
      }
    } catch (error) {
      console.error("Error fetching persona:", error);
      toast.error("Gagal memuat persona");
    } finally {
      setLoading(false);
    }
  };

  const handlePresetSelect = (preset: PersonaPreset) => {
    setSelectedPreset(preset.id);
    setFormData({
      cameo_name: preset.name,
      system_prompt: preset.systemPrompt,
      image_url: preset.imageUrl || "",
      status: true,
    });
    toast.success(`Preset "${preset.name}" dipilih! ✨`);
  };

  const handleSave = async () => {
    // Validation
    if (!formData.cameo_name.trim()) {
      toast.error("Nama persona harus diisi!");
      return;
    }

    if (!formData.system_prompt.trim() || formData.system_prompt.length < MIN_PROMPT_LENGTH) {
      toast.error(`System prompt minimal ${MIN_PROMPT_LENGTH} karakter!`);
      return;
    }

    if (formData.system_prompt.length > MAX_PROMPT_LENGTH) {
      toast.error(`System prompt maksimal ${MAX_PROMPT_LENGTH} karakter!`);
      return;
    }

    try {
      setSaving(true);
      const response = await fetch("/api/persona", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          whatsapp_number: whatsappNumber,
          ...formData,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        fetchPersona();
        setSelectedPreset(null);
        setHasUnsavedChanges(false);
      } else {
        toast.error(data.error || "Gagal menyimpan persona");
      }
    } catch (error) {
      console.error("Error saving persona:", error);
      toast.error("Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      const newStatus = !formData.status;
      const response = await fetch("/api/persona", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          whatsapp_number: whatsappNumber,
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setFormData({ ...formData, status: newStatus });
        fetchPersona();
      } else {
        toast.error(data.error || "Gagal mengubah status");
      }
    } catch (error) {
      console.error("Error toggling status:", error);
      toast.error("Terjadi kesalahan");
    }
  };

  const promptLength = formData.system_prompt.length;
  const isPromptValid = promptLength >= MIN_PROMPT_LENGTH && promptLength <= MAX_PROMPT_LENGTH;

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-8 w-8 text-blue-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <BlurFade delay={0} duration={0.5}>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <FloatingIcon duration={3}>
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-purple-500/50"
                >
                  <Bot className="h-7 w-7 text-white" />
                </motion.div>
              </FloatingIcon>
              <div>
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                >
                  AI Persona
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-slate-600 dark:text-slate-400"
                >
                  Customize kepribadian asisten AI kamu ✨
                </motion.p>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2"
            >
              {hasUnsavedChanges && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500 }}
                >
                  <Badge variant="outline" className="border-orange-300 text-orange-600 backdrop-blur-sm">
                    <AlertCircle className="mr-1 h-3 w-3" />
                    Unsaved
                  </Badge>
                </motion.div>
              )}
              {currentPersona && (
                <Badge
                  variant={formData.status ? "default" : "secondary"}
                  className={formData.status ? "bg-green-600 shadow-lg shadow-green-500/30" : ""}
                >
                  {formData.status ? "Aktif" : "Nonaktif"}
                </Badge>
              )}
            </motion.div>
          </div>
        </div>
      </BlurFade>

      {/* Main Layout - 2 Columns on Desktop */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Presets */}
        <div className="space-y-6 lg:col-span-1">
          {/* Preset Personas */}
          <BlurFade delay={0.3} duration={0.4}>
            <GlassCard className="flex flex-col lg:h-[calc(100vh-16rem)]">
              <Card className="border-0 bg-transparent shadow-none flex flex-col h-full">
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="flex items-center gap-2 text-lg bg-gradient-to-r from-yellow-600 to-orange-500 bg-clip-text text-transparent">
                    <Sparkles className="h-5 w-5 text-yellow-600" />
                    Preset Personas
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Pilih template untuk memulai dengan cepat
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-3 overflow-y-auto">
                  {PERSONA_PRESETS.map((preset, index) => (
                    <motion.div
                      key={preset.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      <AnimatedCard>
                        <GlassCard
                          className={`cursor-pointer transition-all duration-200 ${
                            selectedPreset === preset.id
                              ? "ring-2 ring-blue-500/50 shadow-lg shadow-blue-500/20"
                              : ""
                          }`}
                          onClick={() => handlePresetSelect(preset)}
                        >
                          <Card className="border-0 bg-transparent shadow-none">
                            <CardContent className="p-4">
                              <div className="flex items-start gap-3">
                                <motion.div 
                                  whileHover={{ scale: 1.2, rotate: 10 }}
                                  className="text-2xl"
                                >
                                  {preset.emoji}
                                </motion.div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-semibold text-sm">{preset.name}</h4>
                                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                                    {preset.description}
                                  </p>
                                </div>
                              </div>
                              {selectedPreset === preset.id && (
                                <motion.div 
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  transition={{ type: "spring", stiffness: 500 }}
                                  className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400"
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  Terpilih
                                </motion.div>
                              )}
                            </CardContent>
                          </Card>
                        </GlassCard>
                      </AnimatedCard>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </GlassCard>
          </BlurFade>

          {/* Tips Card */}
          <BlurFade delay={0.5} duration={0.4}>
            <GlassCard className="border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20">
              <Card className="border-0 bg-transparent shadow-none">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <FloatingIcon duration={2.5}>
                      <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900 shadow-lg shadow-blue-500/30">
                        <Lightbulb className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </FloatingIcon>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Tips Membuat Persona
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                        {[
                          "Jelaskan tone dan style komunikasi yang diinginkan",
                          "Sebutkan kata-kata atau frasa yang sering digunakan",
                          "Berikan contoh cara merespon dalam berbagai situasi",
                          "Tentukan hal-hal yang harus dihindari"
                        ].map((tip, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="flex items-start gap-2"
                          >
                            <span className="text-blue-600">•</span>
                            <span>{tip}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </GlassCard>
          </BlurFade>
        </div>

        {/* Right Column - Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Form Edit Persona */}
          <BlurFade delay={0.4} duration={0.5}>
            <GlassCard>
              <Card className="border-0 bg-transparent shadow-none">
                <CardHeader>
                  <CardTitle className="text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Konfigurasi Persona
                  </CardTitle>
                  <CardDescription>
                    Edit dan sesuaikan persona sesuai kebutuhan kamu
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
              {/* Nama Persona */}
              <div className="space-y-2">
                <Label htmlFor="cameo_name" className="text-sm font-medium">
                  Nama Persona *
                </Label>
                <Input
                  id="cameo_name"
                  placeholder="Misal: Mini, Assistant Pro, Jarvis, dll"
                  value={formData.cameo_name}
                  onChange={(e) =>
                    setFormData({ ...formData, cameo_name: e.target.value })
                  }
                  className="transition-all focus:ring-2 focus:ring-blue-200"
                />
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Info className="h-3 w-3" />
                  <span>Nama persona yang akan muncul saat berkomunikasi</span>
                </div>
              </div>

              {/* System Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="system_prompt" className="text-sm font-medium">
                    System Prompt *
                  </Label>
                  <span
                    className={`text-xs font-medium ${
                      !isPromptValid
                        ? "text-red-600"
                        : promptLength > MAX_PROMPT_LENGTH * 0.9
                        ? "text-orange-600"
                        : "text-slate-500"
                    }`}
                  >
                    {promptLength} / {MAX_PROMPT_LENGTH}
                  </span>
                </div>
                <Textarea
                  id="system_prompt"
                  placeholder="Contoh: Kamu adalah asisten AI yang ramah dan helpful. Kamu berkomunikasi dengan bahasa Indonesia yang santai tapi tetap sopan. Kamu suka menggunakan emoji untuk membuat percakapan lebih menarik..."
                  value={formData.system_prompt}
                  onChange={(e) =>
                    setFormData({ ...formData, system_prompt: e.target.value })
                  }
                  rows={14}
                  className={`font-mono text-sm transition-all focus:ring-2 ${
                    isPromptValid
                      ? "focus:ring-blue-200"
                      : "border-red-300 focus:ring-red-200"
                  }`}
                />
                <div className="flex items-start gap-1.5 text-xs text-slate-500">
                  <Info className="h-3 w-3 mt-0.5" />
                  <span>
                    Instruksi detail tentang bagaimana AI harus berperilaku dan berkomunikasi 
                    (minimal {MIN_PROMPT_LENGTH} karakter, maksimal {MAX_PROMPT_LENGTH} karakter)
                  </span>
                </div>
                {!isPromptValid && promptLength > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-red-600">
                    <AlertCircle className="h-3 w-3" />
                    <span>
                      {promptLength < MIN_PROMPT_LENGTH
                        ? `Tambah ${MIN_PROMPT_LENGTH - promptLength} karakter lagi`
                        : `Kurangi ${promptLength - MAX_PROMPT_LENGTH} karakter`}
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-white/20 dark:border-white/10">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleSave}
                    disabled={saving || !isPromptValid || !formData.cameo_name.trim()}
                    className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/30"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Simpan Persona
                      </>
                    )}
                  </Button>
                </motion.div>

                {currentPersona && (
                  <>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={handleToggleStatus}
                        variant={formData.status ? "outline" : "default"}
                        className={!formData.status ? "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30" : "backdrop-blur-sm"}
                      >
                        {formData.status ? "Nonaktifkan" : "Aktifkan"}
                      </Button>
                    </motion.div>

                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        onClick={fetchPersona}
                        variant="outline"
                        disabled={!hasUnsavedChanges}
                        className="backdrop-blur-sm"
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </motion.div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </GlassCard>
      </BlurFade>

          {/* Info Banner */}
          {currentPersona && (
            <BlurFade delay={0.6} duration={0.4}>
              <GlassCard className="border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                <Card className="border-0 bg-transparent shadow-none">
                  <CardContent className="p-4">
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      <FloatingIcon duration={2}>
                        <Info className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                      </FloatingIcon>
                      <p className="text-slate-700 dark:text-slate-300">
                        Persona ini akan digunakan untuk semua percakapan WhatsApp kamu. 
                        Perubahan akan berlaku untuk chat berikutnya.
                      </p>
                    </motion.div>
                  </CardContent>
                </Card>
              </GlassCard>
            </BlurFade>
          )}
        </div>
      </div>
    </div>
  );
}
