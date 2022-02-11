export interface CheckoutSessionCompletedStripeWebhook {
  id:               string;
  object:           string;
  api_version:      Date;
  created:          number;
  data:             CheckoutSessionCompletedDataStripeWebhook;
  livemode:         boolean;
  pending_webhooks: number;
  request:          Request;
  type:             string;
}

export interface CheckoutSessionCompletedDataStripeWebhook {
  object: Object;
}

export interface Object {
  id:                          string;
  object:                      string;
  after_expiration:            null;
  allow_promotion_codes:       null;
  amount_subtotal:             number;
  amount_total:                number;
  automatic_tax:               AutomaticTax;
  billing_address_collection:  null;
  cancel_url:                  string;
  client_reference_id:         null;
  consent:                     null;
  consent_collection:          null;
  currency:                    string;
  customer:                    string;
  customer_creation:           string;
  customer_details:            CustomerDetails;
  customer_email:              null;
  expires_at:                  number;
  livemode:                    boolean;
  locale:                      null;
  metadata:                    Metadata;
  mode:                        string;
  payment_intent:              null;
  payment_link:                null;
  payment_method_options:      Metadata;
  payment_method_types:        string[];
  payment_status:              string;
  phone_number_collection:     PhoneNumberCollection;
  recovered_from:              null;
  setup_intent:                null;
  shipping:                    null;
  shipping_address_collection: null;
  shipping_options:            any[];
  shipping_rate:               null;
  status:                      string;
  submit_type:                 null;
  subscription:                string;
  success_url:                 string;
  total_details:               TotalDetails;
  url:                         null;
}

export interface AutomaticTax {
  enabled: boolean;
  status:  null;
}

export interface CustomerDetails {
  email:      string;
  phone:      null;
  tax_exempt: string;
  tax_ids:    any[];
}

export interface Metadata {
}

export interface PhoneNumberCollection {
  enabled: boolean;
}

export interface TotalDetails {
  amount_discount: number;
  amount_shipping: number;
  amount_tax:      number;
}

export interface Request {
  id:              string;
  idempotency_key: string;
}
