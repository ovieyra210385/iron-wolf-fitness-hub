// supabase/functions/create-payment-intent/index.ts

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@11.1.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Verify authentication first
    const authHeader = req.headers.get("Authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new Error("Authentication required")
    }

    // Initialize Supabase client for user verification
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    )

    const token = authHeader.replace("Bearer ", "")
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !userData.user) {
      throw new Error("Invalid authentication token")
    }

    // Parse request body
    const { amount, currency, description, member_id } = await req.json()

    // Validate inputs
    if (!amount || amount < 50) { // Minimum $0.50
      throw new Error("Invalid amount: minimum $0.50 required")
    }
    
    if (!currency || !["usd", "eur", "mxn"].includes(currency.toLowerCase())) {
      throw new Error("Invalid currency: only USD, EUR, MXN supported")
    }

    // Verify member_id matches authenticated user
    if (member_id && member_id !== userData.user.id) {
      throw new Error("Member ID mismatch with authenticated user")
    }

    // Initialize Stripe with validation
    const stripeKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeKey) {
      throw new Error("Stripe configuration error")
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2022-11-15",
    })

    // Create payment intent with security measures
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure integer
      currency: currency.toLowerCase(),
      description: description || "Gym membership payment",
      metadata: { 
        member_id: userData.user.id,
        authenticated: "true",
        timestamp: new Date().toISOString()
      },
      // Add security settings
      confirmation_method: 'manual',
      confirm: false,
    })

    // Log for audit trail (optional)
    console.log(`Payment intent created: ${paymentIntent.id} for user: ${userData.user.id}`)

    return new Response(
      JSON.stringify({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      }),
      { 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    )
  } catch (error) {
    console.error("Payment intent creation error:", error.message)
    
    return new Response(
      JSON.stringify({ 
        error: "Payment processing failed",
        details: error.message 
      }), 
      {
        status: 400,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        },
      }
    )
  }
})