create table public.meals (
  id uuid not null default gen_random_uuid (),
  user_id uuid not null,
  meal_type text not null,
  meal_name text not null,
  date date not null default CURRENT_DATE,
  time time without time zone not null default CURRENT_TIME,
  foods jsonb not null default '[]'::jsonb,
  total_calories integer null default 0,
  total_protein_g numeric(8, 2) null default 0,
  total_carbs_g numeric(8, 2) null default 0,
  total_fat_g numeric(8, 2) null default 0,
  total_fiber_g numeric(8, 2) null default 0,
  total_sugar_g numeric(8, 2) null default 0,
  total_sodium_mg numeric(8, 2) null default 0,
  notes text null,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint meals_pkey primary key (id),
  constraint meals_user_id_fkey foreign KEY (user_id) references auth.users (id) on delete CASCADE,
  constraint meals_meal_type_check check (
    (
      meal_type = any (
        array[
          'breakfast'::text,
          'lunch'::text,
          'dinner'::text,
          'snack'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_meals_user_id on public.meals using btree (user_id) TABLESPACE pg_default;

create index IF not exists idx_meals_date on public.meals using btree (date) TABLESPACE pg_default;

create index IF not exists idx_meals_user_date on public.meals using btree (user_id, date) TABLESPACE pg_default;

create trigger update_meals_updated_at BEFORE
update on meals for EACH row
execute FUNCTION update_updated_at_column ();