declare module "midtrans-client" {
  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface SnapOptions {
    isProduction?: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface SnapTransactionParams {
    transaction_details: TransactionDetails;
    item_details?: unknown[];
    customer_details?: unknown;
  }

  interface Snap {
    createTransaction(
      params: SnapTransactionParams
    ): Promise<{ token?: string; redirect_url?: string }>;
  }

  interface SnapConstructor {
    new (options: SnapOptions): Snap;
  }

  const midtransClient: { Snap: SnapConstructor };
  export default midtransClient;
}
