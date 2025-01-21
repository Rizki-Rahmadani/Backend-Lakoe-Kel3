-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "Fullname" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "profilesId" TEXT,
    "rolesId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profiles" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "Profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Roles" (
    "id" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "Roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "attachments" BYTEA NOT NULL,
    "is_active" BOOLEAN DEFAULT false,
    "size" TEXT,
    "minimum_order" INTEGER,
    "storesId" TEXT,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stores" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slogan" TEXT,
    "description" TEXT,
    "domain" TEXT,
    "logo_attachment" BYTEA,
    "banner_attachment" BYTEA,

    CONSTRAINT "Stores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bank_accounts" (
    "id" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "acc_number" TEXT NOT NULL,
    "acc_name" TEXT NOT NULL,
    "storesId" TEXT,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "postal_code" TEXT NOT NULL,
    "city_district" TEXT NOT NULL,
    "is_main_location" BOOLEAN DEFAULT false,
    "longitude" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "storesId" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant_option_values" (
    "id" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "stock" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "variant_optionsId" TEXT NOT NULL,

    CONSTRAINT "Variant_option_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant_options" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "variantsId" TEXT NOT NULL,

    CONSTRAINT "Variant_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carts" (
    "id" TEXT NOT NULL,
    "prices" INTEGER NOT NULL,
    "discount" TEXT,
    "userId" TEXT NOT NULL,
    "storesId" TEXT NOT NULL,

    CONSTRAINT "Carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart_items" (
    "id" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "cartsId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "storesId" TEXT NOT NULL,
    "variant_option_valuesId" TEXT NOT NULL,

    CONSTRAINT "Cart_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoices" (
    "id" TEXT NOT NULL,
    "prices" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "receiver_longitude" TEXT NOT NULL,
    "receiver_latitude" TEXT NOT NULL,
    "receiver_district" TEXT NOT NULL,
    "receiver_phone" TEXT NOT NULL,
    "receiver_address" TEXT NOT NULL,
    "receiver_name" TEXT NOT NULL,
    "invoice_number" TEXT NOT NULL,
    "cartsId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentsId" TEXT NOT NULL,

    CONSTRAINT "Invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Confirmation_payment" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "bank" TEXT NOT NULL,
    "invoicesId" TEXT NOT NULL,

    CONSTRAINT "Confirmation_payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice_histories" (
    "id" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "invoicesId" TEXT NOT NULL,

    CONSTRAINT "Invoice_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payments" (
    "id" TEXT NOT NULL,
    "bank" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "moota_transaction_id" TEXT,
    "userId" TEXT NOT NULL,
    "invoicesId" TEXT NOT NULL,

    CONSTRAINT "Payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Couriers" (
    "id" TEXT NOT NULL,
    "courier_code" TEXT NOT NULL,
    "courier_service_name" TEXT NOT NULL,
    "courier_service_code" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "order_id" TEXT NOT NULL,
    "invoicesId" TEXT NOT NULL,

    CONSTRAINT "Couriers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Decoration" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "Decoration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stores_on_decorations" (
    "id" TEXT NOT NULL,
    "storesId" TEXT NOT NULL,

    CONSTRAINT "Stores_on_decorations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operation_hours" (
    "id" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "open_at" TEXT NOT NULL,
    "close_at" TEXT NOT NULL,
    "is_off" BOOLEAN NOT NULL,
    "storesId" TEXT NOT NULL,

    CONSTRAINT "Operation_hours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message_templates" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "storesId" TEXT NOT NULL,

    CONSTRAINT "Message_templates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_number_key" ON "User"("phone_number");

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_id_key" ON "Profiles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Profiles_locationId_key" ON "Profiles"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "Roles_id_key" ON "Roles"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Product_id_key" ON "Product"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Stores_id_key" ON "Stores"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Stores_name_key" ON "Stores"("name");

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_id_key" ON "bank_accounts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Location_id_key" ON "Location"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_option_values_id_key" ON "Variant_option_values"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Variant_options_id_key" ON "Variant_options"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Variants_id_key" ON "Variants"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Variants_productId_key" ON "Variants"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Categories_id_key" ON "Categories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Carts_id_key" ON "Carts"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_items_id_key" ON "Cart_items"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Invoices_id_key" ON "Invoices"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Invoices_paymentsId_key" ON "Invoices"("paymentsId");

-- CreateIndex
CREATE UNIQUE INDEX "Confirmation_payment_id_key" ON "Confirmation_payment"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_histories_id_key" ON "Invoice_histories"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_id_key" ON "Payments"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Payments_invoicesId_key" ON "Payments"("invoicesId");

-- CreateIndex
CREATE UNIQUE INDEX "Couriers_id_key" ON "Couriers"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Couriers_invoicesId_key" ON "Couriers"("invoicesId");

-- CreateIndex
CREATE UNIQUE INDEX "Decoration_id_key" ON "Decoration"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Stores_on_decorations_id_key" ON "Stores_on_decorations"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Operation_hours_id_key" ON "Operation_hours"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Message_templates_id_key" ON "Message_templates"("id");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_profilesId_fkey" FOREIGN KEY ("profilesId") REFERENCES "Profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rolesId_fkey" FOREIGN KEY ("rolesId") REFERENCES "Roles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "Stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "Stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Location" ADD CONSTRAINT "Location_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "Stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant_option_values" ADD CONSTRAINT "Variant_option_values_variant_optionsId_fkey" FOREIGN KEY ("variant_optionsId") REFERENCES "Variant_options"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant_options" ADD CONSTRAINT "Variant_options_variantsId_fkey" FOREIGN KEY ("variantsId") REFERENCES "Variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variants" ADD CONSTRAINT "Variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Categories" ADD CONSTRAINT "Categories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carts" ADD CONSTRAINT "Carts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carts" ADD CONSTRAINT "Carts_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "Stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_items" ADD CONSTRAINT "Cart_items_cartsId_fkey" FOREIGN KEY ("cartsId") REFERENCES "Carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_items" ADD CONSTRAINT "Cart_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_items" ADD CONSTRAINT "Cart_items_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "Stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_items" ADD CONSTRAINT "Cart_items_variant_option_valuesId_fkey" FOREIGN KEY ("variant_option_valuesId") REFERENCES "Variant_option_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_cartsId_fkey" FOREIGN KEY ("cartsId") REFERENCES "Carts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoices" ADD CONSTRAINT "Invoices_paymentsId_fkey" FOREIGN KEY ("paymentsId") REFERENCES "Payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Confirmation_payment" ADD CONSTRAINT "Confirmation_payment_invoicesId_fkey" FOREIGN KEY ("invoicesId") REFERENCES "Invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice_histories" ADD CONSTRAINT "Invoice_histories_invoicesId_fkey" FOREIGN KEY ("invoicesId") REFERENCES "Invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payments" ADD CONSTRAINT "Payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Couriers" ADD CONSTRAINT "Couriers_invoicesId_fkey" FOREIGN KEY ("invoicesId") REFERENCES "Invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stores_on_decorations" ADD CONSTRAINT "Stores_on_decorations_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "Stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation_hours" ADD CONSTRAINT "Operation_hours_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "Stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message_templates" ADD CONSTRAINT "Message_templates_storesId_fkey" FOREIGN KEY ("storesId") REFERENCES "Stores"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
