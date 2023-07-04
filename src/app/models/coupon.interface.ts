export type newCoupon = {
  code?:  string | null| undefined;
  discountPercentage?: string | null| undefined;
  maxDiscount?: string | null| undefined;
  minAmount?: string | null| undefined;
  expDate?: string | null| undefined;
}
export type coupon = {
  coupon: string | null | undefined;
  price: number | null | undefined;
  token: string | null | undefined;
}

export type reportVideo = {
  text?: string | null | undefined;
  token?: string | null | undefined;
  courseId?: string | null | undefined;
}
