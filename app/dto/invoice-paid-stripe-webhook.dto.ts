export interface InvoicePaidStripeWebhook {
  id:               string;
  object:           string;
  api_version:      Date;
  created:          number;
  data:             InvoicePaidStripeWebhookData;
  livemode:         boolean;
  pending_webhooks: number;
  request:          Request;
  type:             string;
}

export interface InvoicePaidStripeWebhookData {
  object: Object;
}

export interface Object {
  id:                               string;
  object:                           string;
  account_country:                  string;
  account_name:                     string;
  account_tax_ids:                  null;
  amount_due:                       number;
  amount_paid:                      number;
  amount_remaining:                 number;
  application_fee_amount:           null;
  attempt_count:                    number;
  attempted:                        boolean;
  auto_advance:                     boolean;
  automatic_tax:                    AutomaticTax;
  billing_reason:                   string;
  charge:                           string;
  collection_method:                string;
  created:                          number;
  currency:                         string;
  custom_fields:                    null;
  customer:                         string;
  customer_address:                 CustomerAddress;
  customer_email:                   string;
  customer_name:                    string;
  customer_phone:                   null;
  customer_shipping:                null;
  customer_tax_exempt:              string;
  customer_tax_ids:                 any[];
  default_payment_method:           null;
  default_source:                   null;
  default_tax_rates:                any[];
  description:                      null;
  discount:                         null;
  discounts:                        any[];
  due_date:                         null;
  ending_balance:                   number;
  footer:                           null;
  hosted_invoice_url:               string;
  invoice_pdf:                      string;
  last_finalization_error:          null;
  lines:                            Lines;
  livemode:                         boolean;
  metadata:                         Metadata;
  next_payment_attempt:             null;
  number:                           string;
  on_behalf_of:                     null;
  paid:                             boolean;
  paid_out_of_band:                 boolean;
  payment_intent:                   string;
  payment_settings:                 PaymentSettings;
  period_end:                       number;
  period_start:                     number;
  post_payment_credit_notes_amount: number;
  pre_payment_credit_notes_amount:  number;
  quote:                            null;
  receipt_number:                   null;
  starting_balance:                 number;
  statement_descriptor:             null;
  status:                           string;
  status_transitions:               StatusTransitions;
  subscription:                     string;
  subtotal:                         number;
  tax:                              null;
  total:                            number;
  total_discount_amounts:           any[];
  total_tax_amounts:                any[];
  transfer_data:                    null;
  webhooks_delivered_at:            number;
}

export interface AutomaticTax {
  enabled: boolean;
  status:  null;
}

export interface CustomerAddress {
  city:        null;
  country:     string;
  line1:       null;
  line2:       null;
  postal_code: null;
  state:       null;
}

export interface Lines {
  object:      string;
  data:        Datum[];
  has_more:    boolean;
  total_count: number;
  url:         string;
}

export interface Datum {
  id:                string;
  object:            string;
  amount:            number;
  currency:          string;
  description:       string;
  discount_amounts:  any[];
  discountable:      boolean;
  discounts:         any[];
  livemode:          boolean;
  metadata:          Metadata;
  period:            Period;
  plan:              Plan;
  price:             Price;
  proration:         boolean;
  quantity:          number;
  subscription:      string;
  subscription_item: string;
  tax_amounts:       any[];
  tax_rates:         any[];
  type:              string;
}

export interface Metadata {
}

export interface Period {
  end:   number;
  start: number;
}

export interface Plan {
  id:                string;
  object:            string;
  active:            boolean;
  aggregate_usage:   null;
  amount:            number;
  amount_decimal:    string;
  billing_scheme:    string;
  created:           number;
  currency:          string;
  interval:          string;
  interval_count:    number;
  livemode:          boolean;
  metadata:          Metadata;
  nickname:          null;
  product:           string;
  tiers_mode:        null;
  transform_usage:   null;
  trial_period_days: null;
  usage_type:        string;
}

export interface Price {
  id:                  string;
  object:              string;
  active:              boolean;
  billing_scheme:      string;
  created:             number;
  currency:            string;
  livemode:            boolean;
  lookup_key:          null;
  metadata:            Metadata;
  nickname:            null;
  product:             string;
  recurring:           Recurring;
  tax_behavior:        string;
  tiers_mode:          null;
  transform_quantity:  null;
  type:                string;
  unit_amount:         number;
  unit_amount_decimal: string;
}

export interface Recurring {
  aggregate_usage:   null;
  interval:          string;
  interval_count:    number;
  trial_period_days: null;
  usage_type:        string;
}

export interface PaymentSettings {
  payment_method_options: null;
  payment_method_types:   null;
}

export interface StatusTransitions {
  finalized_at:            number;
  marked_uncollectible_at: null;
  paid_at:                 number;
  voided_at:               null;
}

export interface Request {
  id:              string;
  idempotency_key: string;
}
