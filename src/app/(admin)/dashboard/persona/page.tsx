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
  RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { getUserData } from "@/utils/cookies";
import { PERSONA_PRESETS, PersonaPreset } from "@/data/persona-presets";

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
  
  // Form state
  const [formData, setFormData] = useState({
    cameo_name: "",
    system_prompt: "",
    image_url: "",
    status: true,
  });

  const userData = getUserData();
  const whatsappNumber = userData?.whatsapp_number as string;

  // Fetch current persona
  useEffect(() => {
    if (whatsappNumber) {
      fetchPersona();
    }
  }, [whatsappNumber]);

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
    if (!formData.cameo_name.trim()) {
      toast.error("Nama persona harus diisi!");
      return;
    }

    if (!formData.system_prompt.trim() || formData.system_prompt.length < 10) {
      toast.error("System prompt minimal 10 karakter!");
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

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">AI Persona</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Atur kepribadian asisten AI kamu ✨
              </p>
            </div>
          </div>
          {currentPersona && (
            <Badge
              variant={formData.status ? "default" : "secondary"}
              className="text-sm"
            >
              {formData.status ? "Aktif" : "Nonaktif"}
            </Badge>
          )}
        </div>
      </div>

      {/* Preset Personas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-600" />
            Pilih Preset Persona
          </CardTitle>
          <CardDescription>
            Klik salah satu preset di bawah untuk mulai dengan cepat, atau buat custom persona sendiri
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PERSONA_PRESETS.map((preset) => (
              <Card
                key={preset.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedPreset === preset.id
                    ? "border-blue-500 ring-2 ring-blue-200 dark:border-blue-600 dark:ring-blue-900"
                    : "border-slate-200 hover:border-blue-300 dark:border-slate-800"
                }`}
                onClick={() => handlePresetSelect(preset)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">{preset.emoji}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{preset.name}</h4>
                      <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                        {preset.description}
                      </p>
                    </div>
                  </div>
                  {selectedPreset === preset.id && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400">
                      <CheckCircle2 className="h-3 w-3" />
                      Terpilih
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Edit Persona */}
      <Card>
        <CardHeader>
          <CardTitle>Konfigurasi Persona</CardTitle>
          <CardDescription>
            Edit dan sesuaikan persona sesuai kebutuhan kamu
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Nama Persona */}
          <div className="space-y-2">
            <Label htmlFor="cameo_name">Nama Persona *</Label>
            <Input
              id="cameo_name"
              placeholder="Misal: Mini, Assistant Pro, dll"
              value={formData.cameo_name}
              onChange={(e) =>
                setFormData({ ...formData, cameo_name: e.target.value })
              }
            />
            <p className="text-xs text-slate-500">
              Nama persona yang akan muncul saat berkomunikasi
            </p>
          </div>

          {/* System Prompt */}
          <div className="space-y-2">
            <Label htmlFor="system_prompt">System Prompt *</Label>
            <Textarea
              id="system_prompt"
              placeholder="Deskripsi lengkap tentang karakteristik dan cara berkomunikasi persona..."
              value={formData.system_prompt}
              onChange={(e) =>
                setFormData({ ...formData, system_prompt: e.target.value })
              }
              rows={12}
              className="font-mono text-sm"
            />
            <p className="text-xs text-slate-500">
              Instruksi detail tentang bagaimana AI harus berperilaku dan berkomunikasi (minimal 10 karakter)
            </p>
          </div>

          {/* Image URL (Optional) */}
          {/* <div className="space-y-2">
            <Label htmlFor="image_url">Image URL (Opsional)</Label>
            <Input
              id="image_url"
              type="url"
              placeholder="https://example.com/avatar.png"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
            />
            <p className="text-xs text-slate-500">
              URL gambar untuk avatar persona
            </p>
          </div> */}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-600 hover:bg-blue-700"
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

            {currentPersona && (
              <>
                <Button
                  onClick={handleToggleStatus}
                  variant={formData.status ? "outline" : "default"}
                >
                  {formData.status ? "Nonaktifkan" : "Aktifkan"}
                </Button>

                <Button
                  onClick={fetchPersona}
                  variant="outline"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 dark:border-blue-900 dark:from-blue-950/20 dark:to-purple-950/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="text-2xl">💡</div>
            <div className="flex-1 space-y-2">
              <h4 className="font-semibold">Tips Membuat Persona</h4>
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                <li>• Jelaskan tone dan style komunikasi yang diinginkan</li>
                <li>• Sebutkan kata-kata atau frasa yang sering digunakan</li>
                <li>• Berikan contoh cara merespon dalam berbagai situasi</li>
                <li>• Tentukan hal-hal yang harus dihindari</li>
                <li>• Satu user hanya bisa memiliki satu persona aktif</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

