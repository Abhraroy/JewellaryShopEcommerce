create table public.wishlist (
  wishlist_id uuid not null default extensions.uuid_generate_v4 (),
  user_id uuid not null,
  constraint wishlist_pkey primary key (wishlist_id),
  constraint wishlist_user_id_fkey foreign KEY (user_id) references users (user_id) on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_wishlist_user on public.wishlist using btree (user_id) TABLESPACE pg_default;





create table public.wishlist_items (
  wishlist_item_id uuid not null default gen_random_uuid (),
  created_at timestamp with time zone not null default now(),
  wishlist_id uuid null,
  product_id uuid null,
  constraint wishlist_items_pkey primary key (wishlist_item_id),
  constraint wishlist_items_product_id_fkey foreign KEY (product_id) references products (product_id) on update CASCADE on delete CASCADE,
  constraint wishlist_items_wishlist_id_fkey foreign KEY (wishlist_id) references wishlist (wishlist_id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;


create table public.products (
  product_id uuid not null default extensions.uuid_generate_v4 (),
  category_id uuid null,
  product_name character varying(255) not null,
  description text null,
  base_price numeric(10, 2) not null,
  discount_percentage numeric(5, 2) null default 0,
  final_price numeric(10, 2) not null,
  stock_quantity integer null default 0,
  weight_grams numeric(8, 2) null,
  created_at timestamp without time zone null default now(),
  updated_at timestamp without time zone null default now(),
  subcategory_id uuid null,
  thumbnail_image text null,
  size text[] null,
  constraint products_pkey primary key (product_id),
  constraint products_category_id_fkey foreign KEY (category_id) references categories (category_id) on delete set null,
  constraint products_subcategory_id_fkey foreign KEY (subcategory_id) references sub_categories (subcategory_id) on update CASCADE on delete CASCADE
) TABLESPACE pg_default;

create index IF not exists idx_products_category on public.products using btree (category_id) TABLESPACE pg_default;

create trigger update_products_updated_at BEFORE
update on products for EACH row
execute FUNCTION update_updated_at_column ();


create table public.categories (
  category_id uuid not null default extensions.uuid_generate_v4 (),
  category_name character varying(100) not null,
  slug character varying(100) not null,
  description text null,
  category_image_url text null,
  is_active boolean null default true,
  constraint categories_pkey primary key (category_id),
  constraint categories_slug_key unique (slug)
) TABLESPACE pg_default;