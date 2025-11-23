import Stripe from 'stripe'
import QRCode from 'qrcode'
import { MercadoPagoConfig, Preference, Payment as MPPayment } from 'mercadopago'

type CreatePaymentInput = {
  orderId: string
  amountCents: number
  method: 'PIX' | 'CARD' | 'BOLETO'
  baseUrl?: string
}

export async function createPayment(input: CreatePaymentInput) {
  const useMP = !!process.env.MERCADOPAGO_ACCESS_TOKEN
  const useStripe = !!process.env.STRIPE_SECRET_KEY
  if (!useMP && !useStripe) {
    if (input.method === 'PIX') {
      const data = `PIX|ORDER:${input.orderId}|AMOUNT:${input.amountCents}`
      const qr = await QRCode.toDataURL(data)
      return { provider: 'SIMULATOR', status: 'PENDING', method: input.method, pixQrData: qr, providerRef: null }
    }
    if (input.method === 'BOLETO') {
      const num = `23791${Math.floor(Math.random() * 1e12).toString().padStart(12, '0')}`
      return { provider: 'SIMULATOR', status: 'PENDING', method: input.method, boletoNumber: num, providerRef: null }
    }
    return { provider: 'SIMULATOR', status: 'PENDING', method: input.method, providerRef: null }
  }
  if (useMP) {
    const client = new MercadoPagoConfig({ accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN as string })
    const pref = new Preference(client)
    const baseUrl = input.baseUrl || process.env.APP_URL || 'http://localhost:3000'
    const preference = await pref.create({ body: {
      items: [{ id: input.orderId, title: 'Retiro de Carnaval', quantity: 1, unit_price: input.amountCents / 100, currency_id: 'BRL' }],
      external_reference: input.orderId,
      back_urls: { success: `${baseUrl}/user`, failure: `${baseUrl}/tickets`, pending: `${baseUrl}/tickets` },
      auto_return: 'approved',
      notification_url: `${baseUrl}/api/payments/mercadopago`
    } })
    return { provider: 'MERCADOPAGO', status: 'PENDING', method: input.method, providerRef: String(preference.id), initPoint: preference.init_point }
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)
  const currency = 'brl'
  if (input.method === 'CARD') {
    const pi = await stripe.paymentIntents.create({ amount: input.amountCents, currency, metadata: { orderId: input.orderId } })
    return { provider: 'STRIPE', status: 'PENDING', method: input.method, providerRef: pi.id }
  }
  if (input.method === 'PIX') {
    const pm = await stripe.paymentMethods.create({ type: 'pix' as any })
    const pi = await stripe.paymentIntents.create({ amount: input.amountCents, currency, payment_method: pm.id, payment_method_types: ['pix'], metadata: { orderId: input.orderId } })
    return { provider: 'STRIPE', status: 'PENDING', method: input.method, providerRef: pi.id }
  }
  if (input.method === 'BOLETO') {
    const pi = await stripe.paymentIntents.create({ amount: input.amountCents, currency, payment_method_types: ['boleto'], metadata: { orderId: input.orderId } })
    return { provider: 'STRIPE', status: 'PENDING', method: input.method, providerRef: pi.id }
  }
  return { provider: 'STRIPE', status: 'PENDING', method: input.method, providerRef: null }
}
