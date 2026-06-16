export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const email = data.email;

    if (!email) {
      return new Response(JSON.stringify({ message: 'Email requerido.' }), { status: 400 });
    }

    // Conexión segura con la API de Buttondown
    const response = await fetch('https://api.buttondown.email/v1/subscribers', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${import.meta.env.BUTTONDOWN_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address: email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      let customMessage = 'Error al registrar el correo.';
      
      // Si el usuario ya existe, Buttondown nos avisa
      if (JSON.stringify(errorData).includes('already subscribed')) {
        customMessage = 'Este correo ya está registrado.';
      }
      return new Response(JSON.stringify({ message: customMessage }), { status: response.status });
    }

    return new Response(JSON.stringify({ message: '¡Suscrito con éxito!' }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ message: 'Error interno del servidor.' }), { status: 500 });
  }
};