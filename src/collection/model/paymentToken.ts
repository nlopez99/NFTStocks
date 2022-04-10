export interface PaymentToken {
  id: string
  symbol: string
  address: string
  imageUrl: string
  name: string
  ethPrice: number
  usdPrice: number
}

export const paymentToken = {
  id: { type: String, required: true },
  symbol: { type: String, required: true },
  address: { type: String, required: true },
  imageUrl: { type: String, required: false },
  name: { type: String, required: true },
  ethPrice: { type: Number, required: true },
  usdPrice: { type: Number, required: true },
}
