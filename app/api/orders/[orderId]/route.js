import { supabase } from "../../../../lib/supabaseClient";

export async function PUT(request, { params }) {
  const { orderId } = params;
  const updates = await request.json();

  const payload = {};
  if (updates.customerName !== undefined)
    payload.customer_name = updates.customerName;
  if (updates.isPaid !== undefined) payload.is_paid = updates.isPaid;
  if (updates.status !== undefined) payload.status = updates.status;

  const { error } = await supabase
    .from("orders")
    .update(payload)
    .eq("order_id", orderId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  return new Response(null, { status: 204 });
}
