// supabase/functions/create-payment-intent/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@11.1.0"

// Inicializa Stripe con tu CLAVE SECRETA, que guardaremos de forma segura.
const stripe = new Stripe(Deno.env.get('STRIPE_API_KEY'), {
  apiVersion: "2022-11-15",
})

serve(async (req) => {
  const { amount, currency, member_id } = await req.json()

  try {
    // Crea una intención de pago en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // en centavos, ej: 10000 para $100.00
      currency: currency, // ej: 'mxn'
      metadata: { member_id: member_id } // Guarda el ID del socio para referencia
    })

    // Devuelve el 'client_secret' al frontend
    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }
})