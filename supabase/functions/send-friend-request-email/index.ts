
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  receiverId: string;
  requestId: string;
  senderName: string;
  appUrl: string;
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") ?? "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
);

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { receiverId, requestId, senderName, appUrl }: EmailRequest = await req.json();
    
    // Buscar email do destinatário
    const { data: receiver, error: receiverError } = await supabase
      .from('profiles')
      .select('id, username, email')
      .eq('id', receiverId)
      .single();
      
    if (receiverError || !receiver) {
      console.error("Error fetching receiver:", receiverError);
      throw new Error("Destinatário não encontrado");
    }
    
    // Gerar token para o link de confirmação (usamos o ID do pedido como token)
    const confirmationUrl = `${appUrl}/confirm-friend?requestId=${requestId}`;
    
    // Enviar email com o link de confirmação
    const emailResponse = await resend.emails.send({
      from: "Habitz <noreply@resend.dev>",
      to: [receiver.email || ''],
      subject: `${senderName} quer ser seu amigo no Habitz!`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #6366f1;">Novo pedido de amizade!</h1>
          <p style="font-size: 16px; line-height: 1.5;">
            Olá ${receiver.username || 'usuário'},
          </p>
          <p style="font-size: 16px; line-height: 1.5;">
            <strong>${senderName}</strong> gostaria de ser seu amigo no Habitz.
          </p>
          <div style="margin: 30px 0;">
            <a href="${confirmationUrl}" style="background-color: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Aceitar pedido de amizade
            </a>
          </div>
          <p style="font-size: 14px; color: #666;">
            Ou copie e cole este link no seu navegador:<br>
            <a href="${confirmationUrl}" style="color: #6366f1; word-break: break-all;">
              ${confirmationUrl}
            </a>
          </p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="font-size: 12px; color: #999;">
            Este é um email automático, por favor não responda.
          </p>
        </div>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-friend-request-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Erro ao enviar e-mail" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
