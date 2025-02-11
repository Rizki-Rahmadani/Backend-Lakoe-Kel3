export type OrderItem = {
  name: string;
  description: string;
  category: string;
  value: number;
  quantity: number;
  height: number;
  length: number;
  weight: number;
  width: number;
};

export type OrderRequest = {
  shipper_contact_name: string;
  shipper_contact_phone: string;
  shipper_contact_email: string;
  shipper_organization: string;
  origin_contact_name: string;
  origin_contact_phone: string;
  origin_address: string;
  origin_note: string;
  origin_postal_code: number;
  destination_contact_name: string;
  destination_contact_phone: string;
  destination_contact_email: string;
  destination_address: string;
  destination_postal_code: number;
  destination_note: string;
  courier_company: string;
  courier_type: string;
  courier_insurance?: number;
  delivery_type: string;
  delivery_date?: string; // Required if delivery_type is 'schedule'
  delivery_time?: string; // Required if delivery_type is 'schedule'
  order_note: string;
  metadata?: Record<string, any>;
  items: OrderItem[];
  payment_type?: string;
  cash_on_delivery?: number;
  external_id?: string;
  label?: string;
};
