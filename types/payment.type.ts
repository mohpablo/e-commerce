export type CreateIntentionRequest = {
  amount: number;
  currency: string;
  payment_methods: (number | string)[];
  items?: {
    name: string;
    amount: number;
    description?: string;
    quantity: number;
    image?: string | null;
  }[];
  billing_data: {
    apartment?: string;
    floor?: string;
    first_name: string;
    last_name: string;
    street?: string;
    building?: string;
    phone_number?: string;
    city?: string;
    country?: string;
    state?: string;
    email: string;
    postal_code?: string;
    shipping_method?: string;
  };
  extras?: Record<string, unknown>;
  special_reference?: string;
  expiration?: number;
  notification_url?: string;
  redirection_url?: string;
};

export type CreateIntentionResponse = {
  payment_keys: {
    integration: number;
    key: string;
    gateway_type: string;
    iframe_id: number | null;
    order_id: number;
  }[];
  intention_order_id: number;
  id: string;
  intention_detail: {
    amount: number;
    items: {
      name: string;
      amount: number;
      description?: string;
      quantity: number;
      image?: string | null;
    }[];
    currency: string;
    billing_data: {
      apartment?: string;
      floor?: string;
      first_name: string;
      last_name: string;
      street?: string;
      building?: string;
      phone_number?: string;
      city?: string;
      country?: string;
      state?: string;
      email: string;
      postal_code?: string;
      shipping_method?: string;
    };
  };
  client_secret: string;
  payment_methods: {
    integration_id: number;
    alias: string | null;
    name: string;
    method_type: string;
    currency: string;
    live: boolean;
    use_cvc_with_moto: boolean;
  }[];
  special_reference?: string | null;
  extras: {
    creation_extras?: Record<string, unknown>;
    confirmation_extras?: unknown | null;
  };
  confirmed: boolean;
  status: string;
  created: string;
  card_detail: unknown | null;
  card_tokens: unknown[];
  object: string;
};

export type PaymobRedirectCallbackParams = {
  id: string;
  pending: string;
  amount_cents: string;
  success: string;
  is_auth: string;
  is_capture: string;
  is_standalone_payment: string;
  is_voided: string;
  is_refunded: string;
  is_3d_secure: string;
  integration_id: string;
  profile_id: string;
  has_parent_transaction: string;
  order: string;
  created_at: string;
  currency: string;
  merchant_commission: string;
  accept_fees: string;
  discount_details: string;
  amount_cents_int: string;
  is_void: string;
  is_refund: string;
  error_occured: string;
  refunded_amount_cents: string;
  refunded_amount_cents_int: string;
  captured_amount: string;
  captured_amount_int: string;
  settlement_amount_cents_int: string;
  accept_fees_cents_int: string;
  vat_cents_int: string;
  updated_at: string;
  is_settled: string;
  bill_balanced: string;
  is_bill: string;
  owner: string;
  "data.message": string;
  "source_data.type": string;
  "source_data.pan": string;
  "source_data.sub_type": string;
  acq_response_code: string;
  txn_response_code: string;
  hmac: string;
};

export type PaymobWebhookPayload = {
  type: string;
  hmac: string;
  obj: PaymobTransactionObject;
};

export type PaymobTransactionObject = {
  id: number;
  pending: boolean;
  amount_cents: number;
  success: boolean;
  is_auth: boolean;
  is_capture: boolean;
  is_standalone_payment: boolean;
  is_voided: boolean;
  is_refunded: boolean;
  is_3d_secure: boolean;
  integration_id: number;
  profile_id?: number;
  has_parent_transaction: boolean;
  order:
    | number
    | {
        id: number;
        created_at?: string;
        amount_cents?: number;
        currency?: string;
        [key: string]: unknown;
      };
  created_at: string;
  currency: string;
  error_occured: boolean;
  owner: number;
  source_data: {
    type: string;
    pan: string;
    sub_type: string;
    [key: string]: unknown;
  };
  merchant_commission?: number;
  accept_fees?: number;
  data?: {
    message?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export const hmacKeys = [
  "amount_cents",
  "created_at",
  "currency",
  "error_occured",
  "has_parent_transaction",
  "id",
  "integration_id",
  "is_3d_secure",
  "is_auth",
  "is_capture",
  "is_refunded",
  "is_standalone_payment",
  "is_voided",
  "order.id",
  "owner",
  "pending",
  "source_data.pan",
  "source_data.sub_type",
  "source_data.type",
  "success",
] as const;
