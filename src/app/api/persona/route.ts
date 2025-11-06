import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Schema validasi
const personaSchema = z.object({
  whatsapp_number: z.string().min(1, "WhatsApp number is required"),
  cameo_name: z.string().min(1, "Persona name is required").max(100),
  system_prompt: z.string().min(10, "System prompt is required (min 10 characters)"),
  image_url: z.string().optional().nullable().or(z.literal("")),
  status: z.boolean().default(true),
});

// GET - Fetch user's persona
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const whatsappNumber = searchParams.get("whatsapp_number");

    if (!whatsappNumber) {
      return NextResponse.json(
        { error: "WhatsApp number is required" },
        { status: 400 }
      );
    }

    // Fetch persona dari database
    const { data, error } = await supabase
      .from("cameo_personas")
      .select("*")
      .eq("user_whatsapp_number", whatsappNumber)
      .single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows returned
      console.error("Error fetching persona:", error);
      return NextResponse.json(
        { error: "Failed to fetch persona" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data || null,
    });
  } catch (error) {
    console.error("Error in GET /api/persona:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create or Update persona
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validasi input
    const validatedData = personaSchema.parse(body);

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("whatsapp_number")
      .eq("whatsapp_number", validatedData.whatsapp_number)
      .single();

    if (userError || !user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Check if persona already exists
    const { data: existingPersona } = await supabase
      .from("cameo_personas")
      .select("user_whatsapp_number")
      .eq("user_whatsapp_number", validatedData.whatsapp_number)
      .single();

    let result;

    if (existingPersona) {
      // Update existing persona
      const { data, error } = await supabase
        .from("cameo_personas")
        .update({
          cameo_name: validatedData.cameo_name,
          system_prompt: validatedData.system_prompt,
          image_url: validatedData.image_url,
          status: validatedData.status,
          updated_at: new Date().toISOString(),
        })
        .eq("user_whatsapp_number", validatedData.whatsapp_number)
        .select()
        .single();

      if (error) {
        console.error("Error updating persona:", error);
        return NextResponse.json(
          { error: "Failed to update persona" },
          { status: 500 }
        );
      }

      result = data;
    } else {
      // Create new persona
      const { data, error } = await supabase
        .from("cameo_personas")
        .insert({
          user_whatsapp_number: validatedData.whatsapp_number,
          cameo_name: validatedData.cameo_name,
          system_prompt: validatedData.system_prompt,
          image_url: validatedData.image_url,
          status: validatedData.status,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating persona:", error);
        return NextResponse.json(
          { error: "Failed to create persona" },
          { status: 500 }
        );
      }

      result = data;
    }

    return NextResponse.json({
      success: true,
      message: existingPersona
        ? "Persona berhasil diupdate! ✨"
        : "Persona berhasil dibuat! 🎉",
      data: result,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 }
      );
    }

    console.error("Error in POST /api/persona:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT - Toggle persona status
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { whatsapp_number, status } = body;

    if (!whatsapp_number) {
      return NextResponse.json(
        { error: "WhatsApp number is required" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("cameo_personas")
      .update({
        status: status,
        updated_at: new Date().toISOString(),
      })
      .eq("user_whatsapp_number", whatsapp_number)
      .select()
      .single();

    if (error) {
      console.error("Error updating persona status:", error);
      return NextResponse.json(
        { error: "Failed to update persona status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: status
        ? "Persona diaktifkan! 🎉"
        : "Persona dinonaktifkan",
      data,
    });
  } catch (error) {
    console.error("Error in PUT /api/persona:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

