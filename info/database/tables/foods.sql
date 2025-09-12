create table public.foods (
  id uuid not null default gen_random_uuid (),
  name text not null,
  calories_per_100g numeric not null default 0,
  carbohydrates_g numeric not null default 0,
  protein_g numeric not null default 0,
  fats_g numeric not null default 0,
  free_sugar_g numeric not null default 0,
  fiber_g numeric not null default 0,
  sodium_mg numeric not null default 0,
  calcium_mg numeric not null default 0,
  iron_mg numeric not null default 0,
  vitamin_c_mg numeric not null default 0,
  folate_mcg numeric not null default 0,
  created_at timestamp with time zone not null default timezone ('utc'::text, now()),
  updated_at timestamp with time zone not null default timezone ('utc'::text, now()),
  constraint foods_pkey primary key (id)
) TABLESPACE pg_default;

create index IF not exists foods_name_idx on public.foods using btree (name) TABLESPACE pg_default;

create trigger update_foods_updated_at BEFORE
update on foods for EACH row
execute FUNCTION update_updated_at_column ();