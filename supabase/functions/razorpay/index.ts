import "@supabase/functions-js/edge-runtime.d.ts"
import crypto from "node:crypto"

// Declare Deno to silence local VS Code TypeScript errors
declare const Deno: any;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE',
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  })
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  // Handle simple GET test
  if (req.method === 'GET') {
    return jsonResponse({ status: "Edge function is alive" })
  }

  try {
    const bodyText = await req.text()
    if (!bodyText) {
      return jsonResponse({ error: "Empty request body" }, 400)
    }

    const data = JSON.parse(bodyText)
    const { action, ...rest } = data

    const razorpayKeyId = Deno.env.get('RAZORPAY_KEY_ID')
    const razorpayKeySecret = Deno.env.get('RAZORPAY_KEY_SECRET')

    // Validate that real keys are configured
    if (!razorpayKeyId || !razorpayKeySecret) {
      return jsonResponse({ error: "Razorpay credentials are not configured on the server." }, 500)
    }

    if (action === 'create-order') {
      const { amount, currency = 'INR', receipt } = rest

      if (!amount || !receipt) {
        return jsonResponse({ error: "Missing required fields: amount, receipt" }, 400)
      }
      
      const authHeader = "Basic " + btoa(`${razorpayKeyId}:${razorpayKeySecret}`)
      
      const response = await fetch("https://api.razorpay.com/v1/orders", {
        method: "POST",
        headers: {
          "Authorization": authHeader,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          amount: Math.round(Number(amount) * 100), // paise
          currency,
          receipt,
        })
      })

      const order = await response.json()

      if (!response.ok) {
        return jsonResponse({ error: order.error?.description || "Failed to create Razorpay order" }, 502)
      }

      return jsonResponse(order)
    }

    if (action === 'verify-payment') {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = rest

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return jsonResponse({ error: "Missing payment verification fields" }, 400)
      }
      
      const text = `${razorpay_order_id}|${razorpay_payment_id}`
      const expectedSignature = crypto
        .createHmac('sha256', razorpayKeySecret)
        .update(text)
        .digest('hex')

      if (expectedSignature === razorpay_signature) {
        return jsonResponse({ verified: true })
      } else {
        return jsonResponse({ verified: false }, 400)
      }
    }

    return jsonResponse({ error: 'Unknown action' }, 400)

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error("Edge function error:", errorMessage)
    return jsonResponse({ error: errorMessage }, 500)
  }
})

