import "@supabase/functions-js/edge-runtime.d.ts"
import crypto from "node:crypto"

// Declare Deno to silence local VS Code TypeScript errors
declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Handle simple GET test
  if (req.method === 'GET') {
    return new Response(JSON.stringify({ status: "Edge function is alive" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }

  try {
    const bodyText = await req.text()
    if (!bodyText) {
      throw new Error("Empty request body")
    }

    const data = JSON.parse(bodyText)
    const { action, ...rest } = data
    
    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID') || 'rzp_test_placeholder_key'
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET') || 'placeholder_secret'

    if (action === 'create-order') {
      const { amount, currency = 'INR', receipt } = rest
      
      const authHeader = "Basic " + btoa(`${razorpayKeyId}:${razorpayKeySecret}`)
      
      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: Math.round(Number(amount) * 100), // ensure it's a valid integer
          currency,
          receipt,
        })
      })

      const order = await response.json()

      if (!response.ok) {
        throw new Error(order.error?.description || "Failed to create Razorpay order")
      }

      return new Response(JSON.stringify(order), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    if (action === 'verify-payment') {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = rest
      
      const text = `${razorpay_order_id}|${razorpay_payment_id}`
      const expectedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(text)
        .digest('hex')

      if (expectedSignature === razorpay_signature) {
        return new Response(JSON.stringify({ verified: true }), {
          status: 200,
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
    return new Response(JSON.stringify({ _server_error: errorMessage }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
