import "@supabase/functions-js/edge-runtime.d.ts"
import crypto from "node:crypto"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { action, ...data } = await req.json()
    
    // In Edge Functions, env vars are set via supabase secrets, but we use Deno.env.get
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || 'rzp_test_placeholder_key'
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || 'placeholder_secret'

    if (action === 'create-order') {
      const { amount, currency = 'INR', receipt } = data
      
      const authHeader = "Basic " + btoa(`${razorpayKeyId}:${razorpayKeySecret}`)
      
      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: amount * 100, // amount in the smallest currency unit (paise)
          currency,
          receipt,
        })
      })

      const order = await response.json()

      if (!response.ok) {
        throw new Error(order.error?.description || "Failed to create Razorpay order")
      }

      return new Response(JSON.stringify(order), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    if (action === 'verify-payment') {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data
      
      const text = `${razorpay_order_id}|${razorpay_payment_id}`
      const expectedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(text)
        .digest('hex')

      if (expectedSignature === razorpay_signature) {
        return new Response(JSON.stringify({ verified: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      } else {
        return new Response(JSON.stringify({ verified: false }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
    }

    return new Response(JSON.stringify({ error: 'Unknown action' }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
