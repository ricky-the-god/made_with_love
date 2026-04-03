-- ============================================================
-- Made with Love — Expanded Demo Seed Data
-- ============================================================
-- BEFORE RUNNING THIS FILE:
--   1. Create a user in Supabase Auth with:
--      Email: demo@madewithlo.ve
--      Password: 123456
--   2. Run the schema migrations first.
--   3. Then run this file in the Supabase SQL Editor.
--
-- This script is idempotent for its fixed IDs.
-- ============================================================

do $$
declare
  v_user_id uuid;

  -- Family
  v_family_id uuid := 'f1111111-1111-4111-8111-111111111111';
  v_nguyen_family_id uuid := 'f2222222-2222-4222-8222-222222222222';
  v_alvarez_family_id uuid := 'f3333333-3333-4333-8333-333333333333';

  -- Family members
  v_lola_carmen_id uuid := 'a1111111-1111-4111-8111-111111111101';
  v_lolo_eduardo_id uuid := 'a1111111-1111-4111-8111-111111111102';
  v_tita_rosa_id uuid := 'a1111111-1111-4111-8111-111111111103';
  v_tatay_mario_id uuid := 'a1111111-1111-4111-8111-111111111104';
  v_tita_elena_id uuid := 'a1111111-1111-4111-8111-111111111105';
  v_lili_id uuid := 'a1111111-1111-4111-8111-111111111106';
  v_marco_id uuid := 'a1111111-1111-4111-8111-111111111107';
  v_nina_id uuid := 'a1111111-1111-4111-8111-111111111108';
  v_lucia_id uuid := 'a1111111-1111-4111-8111-111111111109';
  v_tito_joel_id uuid := 'a1111111-1111-4111-8111-11111111110a';

  -- Nguyen family members
  v_ba_lan_id uuid := 'a2222222-2222-4222-8222-222222222101';
  v_mei_nguyen_id uuid := 'a2222222-2222-4222-8222-222222222102';
  v_daniel_nguyen_id uuid := 'a2222222-2222-4222-8222-222222222103';

  -- Alvarez family members
  v_abuela_carmen_id uuid := 'a3333333-3333-4333-8333-333333333101';
  v_mateo_alvarez_id uuid := 'a3333333-3333-4333-8333-333333333102';
  v_sofia_alvarez_id uuid := 'a3333333-3333-4333-8333-333333333103';

  -- Recipes
  v_adobo_id uuid := 'b1111111-1111-4111-8111-111111111201';
  v_sinigang_id uuid := 'b1111111-1111-4111-8111-111111111202';
  v_bibingka_id uuid := 'b1111111-1111-4111-8111-111111111203';
  v_lechon_id uuid := 'b1111111-1111-4111-8111-111111111204';
  v_pancit_id uuid := 'b1111111-1111-4111-8111-111111111205';
  v_nilaga_id uuid := 'b1111111-1111-4111-8111-111111111206';
  v_karekare_id uuid := 'b1111111-1111-4111-8111-111111111207';
  v_arrozcaldo_id uuid := 'b1111111-1111-4111-8111-111111111208';
  v_ubehalaya_id uuid := 'b1111111-1111-4111-8111-111111111209';
  v_lumpia_id uuid := 'b1111111-1111-4111-8111-11111111120a';

  -- Nguyen family recipes
  v_pho_id uuid := 'b2222222-2222-4222-8222-222222222201';
  v_banhxeo_id uuid := 'b2222222-2222-4222-8222-222222222202';
  v_chethai_id uuid := 'b2222222-2222-4222-8222-222222222203';

  -- Alvarez family recipes
  v_birria_id uuid := 'b3333333-3333-4333-8333-333333333201';
  v_tamales_id uuid := 'b3333333-3333-4333-8333-333333333202';
  v_arrozconleche_id uuid := 'b3333333-3333-4333-8333-333333333203';

begin
  select id into v_user_id
  from auth.users
  where email = 'demo@madewithlo.ve'
  limit 1;

  if v_user_id is null then
    raise exception 'Demo user not found. Create demo@madewithlo.ve in Supabase Authentication first.';
  end if;

  insert into public.profiles (id, email, full_name)
  values (v_user_id, 'demo@madewithlo.ve', 'Lili Santos')
  on conflict (id) do update
  set email = excluded.email,
      full_name = excluded.full_name,
      updated_at = now();

  insert into public.families (id, family_name, owner_id, privacy_setting, created_at, updated_at)
  values (
    v_family_id,
    'The Santos Family',
    v_user_id,
    'private',
    now() - interval '2 years',
    now()
  )
  on conflict (id) do update
  set family_name = excluded.family_name,
      owner_id = excluded.owner_id,
      updated_at = now();

  insert into public.families (id, family_name, owner_id, privacy_setting, created_at, updated_at)
  values
    (
      v_nguyen_family_id,
      'The Nguyen Family',
      v_user_id,
      'public',
      now() - interval '18 months',
      now()
    ),
    (
      v_alvarez_family_id,
      'The Alvarez Family',
      v_user_id,
      'public',
      now() - interval '16 months',
      now()
    )
  on conflict (id) do update
  set family_name = excluded.family_name,
      owner_id = excluded.owner_id,
      privacy_setting = excluded.privacy_setting,
      updated_at = now();

  update public.profiles
  set family_id = v_family_id,
      role = 'owner',
      full_name = 'Lili Santos',
      updated_at = now()
  where id = v_user_id;

  -- ============================================================
  -- FAMILY MEMBERS
  -- ============================================================
  insert into public.family_members (id, family_id, name, relation, generation, bio, country_of_origin, cultural_background, birth_year, is_memorial, created_by, created_at, updated_at)
  values
    (
      v_lola_carmen_id,
      v_family_id,
      'Carmen Santos',
      'Grandmother',
      1,
      'Lola Carmen was born in Pampanga and cooked from instinct. Her recipes are the emotional center of the family archive.',
      'Philippines',
      'Filipino / Kapampangan',
      1935,
      true,
      v_user_id,
      now() - interval '22 months',
      now()
    ),
    (
      v_lolo_eduardo_id,
      v_family_id,
      'Eduardo Santos',
      'Grandfather',
      1,
      'Lolo Eduardo woke before sunrise for the market and always chose ingredients as if he were curating a feast.',
      'Philippines',
      'Filipino / Ilocano',
      1932,
      true,
      v_user_id,
      now() - interval '22 months',
      now()
    ),
    (
      v_tita_rosa_id,
      v_family_id,
      'Rosa Santos-Reyes',
      'Great-Aunt',
      2,
      'Tita Rosa adapted family recipes to California kitchens without losing their soul.',
      'Philippines',
      'Filipino',
      1948,
      false,
      v_user_id,
      now() - interval '18 months',
      now()
    ),
    (
      v_tatay_mario_id,
      v_family_id,
      'Mario Santos',
      'Father',
      3,
      'Tatay Mario owns every New Year''s Eve menu and treats crispy pork like a sacred duty.',
      'Philippines',
      'Filipino',
      1965,
      false,
      v_user_id,
      now() - interval '16 months',
      now()
    ),
    (
      v_tita_elena_id,
      v_family_id,
      'Elena Santos-Miraflores',
      'Aunt',
      3,
      'Tita Elena is the undisputed keeper of birthday noodles and large-family catering strategy.',
      'Philippines',
      'Filipino',
      1968,
      false,
      v_user_id,
      now() - interval '14 months',
      now()
    ),
    (
      v_lili_id,
      v_family_id,
      'Lili Santos',
      'Myself',
      4,
      'Started this archive out of fear that family flavors could vanish faster than the stories behind them.',
      'United States',
      'Filipino-American',
      1993,
      false,
      v_user_id,
      now() - interval '2 years',
      now()
    ),
    (
      v_marco_id,
      v_family_id,
      'Marco Santos',
      'Cousin',
      4,
      'Marco cooks with video calls open and a notebook full of auntie corrections.',
      'United States',
      'Filipino-American',
      1990,
      false,
      v_user_id,
      now() - interval '11 months',
      now()
    ),
    (
      v_nina_id,
      v_family_id,
      'Nina Reyes',
      'Cousin',
      4,
      'Nina is the family baker and the first one to turn heirloom recipes into printable cards for friends.',
      'United States',
      'Filipino-American',
      1996,
      false,
      v_user_id,
      now() - interval '9 months',
      now()
    ),
    (
      v_lucia_id,
      v_family_id,
      'Lucia Santos',
      'Daughter',
      5,
      'Lucia is still small enough to stand on a chair to mix batter, but already asks why every dish has a story.',
      'United States',
      'Filipino-American',
      2020,
      false,
      v_user_id,
      now() - interval '6 months',
      now()
    ),
    (
      v_tito_joel_id,
      v_family_id,
      'Joel Reyes',
      'Uncle',
      3,
      'Tito Joel handles the grill, the playlist, and most of the jokes at family gatherings.',
      'United States',
      'Filipino-American',
      1970,
      false,
      v_user_id,
      now() - interval '10 months',
      now()
    )
  on conflict (id) do update
  set name = excluded.name,
      relation = excluded.relation,
      generation = excluded.generation,
      bio = excluded.bio,
      country_of_origin = excluded.country_of_origin,
      cultural_background = excluded.cultural_background,
      birth_year = excluded.birth_year,
      is_memorial = excluded.is_memorial,
      updated_at = now();

  update public.family_members
  set linked_user_id = v_user_id,
      updated_at = now()
  where id = v_lili_id;

  insert into public.family_members (id, family_id, name, relation, generation, bio, country_of_origin, cultural_background, birth_year, is_memorial, created_by, created_at, updated_at)
  values
    (
      v_ba_lan_id,
      v_nguyen_family_id,
      'Lan Nguyen',
      'Grandmother',
      1,
      'Ba Lan carried her pho broth method from Hanoi to San Jose and still judges every bowl by aroma before taste.',
      'Vietnam',
      'Vietnamese',
      1942,
      false,
      v_user_id,
      now() - interval '13 months',
      now()
    ),
    (
      v_mei_nguyen_id,
      v_nguyen_family_id,
      'Mei Nguyen',
      'Mother',
      2,
      'Mei translates oral recipes into notes without flattening the family voice behind them.',
      'Vietnam',
      'Vietnamese-American',
      1974,
      false,
      v_user_id,
      now() - interval '12 months',
      now()
    ),
    (
      v_daniel_nguyen_id,
      v_nguyen_family_id,
      'Daniel Nguyen',
      'Son',
      3,
      'Daniel documents meals first with a camera and then with a second helping.',
      'United States',
      'Vietnamese-American',
      2001,
      false,
      v_user_id,
      now() - interval '10 months',
      now()
    ),
    (
      v_abuela_carmen_id,
      v_alvarez_family_id,
      'Carmen Alvarez',
      'Grandmother',
      1,
      'Abuela Carmen treats tamales as a communal ritual and birria as a Sunday promise.',
      'Mexico',
      'Mexican',
      1940,
      false,
      v_user_id,
      now() - interval '12 months',
      now()
    ),
    (
      v_mateo_alvarez_id,
      v_alvarez_family_id,
      'Mateo Alvarez',
      'Father',
      2,
      'Mateo manages the fire, the playlist, and the broth with equal seriousness.',
      'Mexico',
      'Mexican-American',
      1978,
      false,
      v_user_id,
      now() - interval '11 months',
      now()
    ),
    (
      v_sofia_alvarez_id,
      v_alvarez_family_id,
      'Sofia Alvarez',
      'Daughter',
      3,
      'Sofia writes down her grandmother''s side comments because they are usually the real recipe.',
      'United States',
      'Mexican-American',
      2003,
      false,
      v_user_id,
      now() - interval '9 months',
      now()
    )
  on conflict (id) do update
  set name = excluded.name,
      relation = excluded.relation,
      generation = excluded.generation,
      bio = excluded.bio,
      country_of_origin = excluded.country_of_origin,
      cultural_background = excluded.cultural_background,
      birth_year = excluded.birth_year,
      is_memorial = excluded.is_memorial,
      updated_at = now();

  -- ============================================================
  -- RECIPES
  -- ============================================================
  insert into public.recipes (id, family_id, member_id, created_by, title, description, ingredients, steps, notes, prep_time, cook_time, servings, country_of_origin, culture_tag, occasion, language, is_favorite, is_family_favorite, visibility, created_at, updated_at)
  values
    (
      v_adobo_id,
      v_family_id,
      v_lola_carmen_id,
      v_user_id,
      'Lola Carmen''s Chicken Adobo',
      'The recipe that defines our family. Salty, sharp, glossy, and better the next day.',
E'1 whole chicken, cut into serving pieces\n1/2 cup cane vinegar\n1/3 cup soy sauce\n1 head garlic, smashed\n3 bay leaves\n1 tsp black peppercorns\n2 tbsp oil\n1/2 cup water',
E'1. Marinate chicken with vinegar, soy sauce, garlic, bay leaves, and peppercorns.\n2. Bring to a boil without stirring.\n3. Lower heat and simmer until tender.\n4. Reduce the sauce until glossy.\n5. Briefly fry the chicken if you want a richer finish.\n6. Serve with rice.',
      'Never stir during the first boil. That rule gets repeated in our family more often than birthdays.',
      '15 min',
      '45 min',
      '4-6',
      'Philippines',
      'Filipino',
      'Sunday dinner',
      'en',
      true,
      true,
      'public',
      now() - interval '18 months',
      now()
    ),
    (
      v_sinigang_id,
      v_family_id,
      v_tita_rosa_id,
      v_user_id,
      'Tita Rosa''s Sinigang na Baboy',
      'A sour pork soup for rainy days, heartbreak, and any week that needs comfort.',
E'1.5 lbs pork belly\n1 packet sinigang mix\n6 cups water\n1 tomato\n1 onion\n2 green chilies\n1 bunch water spinach\n6 string beans\n1 radish\nFish sauce to taste',
E'1. Simmer pork, tomato, and onion until tender.\n2. Add radish and string beans.\n3. Stir in the souring mix.\n4. Add fish sauce and chilies.\n5. Turn off heat and fold in water spinach.\n6. Serve hot over rice.',
      'The right level of sour should make you sit up straighter after the first spoonful.',
      '15 min',
      '55 min',
      '4-5',
      'Philippines',
      'Filipino',
      'Rainy day',
      'en',
      true,
      false,
      'family',
      now() - interval '14 months',
      now()
    ),
    (
      v_bibingka_id,
      v_family_id,
      v_lola_carmen_id,
      v_user_id,
      'Lola Carmen''s Christmas Bibingka',
      'Coconut rice cake lined with banana leaf and tied to dawn masses in December.',
E'2 cups glutinous rice flour\n1 cup rice flour\n1 can coconut milk\n3/4 cup sugar\n3 eggs\n1 tsp baking powder\nBanana leaves\nSalted duck eggs\nGrated coconut\nButter',
E'1. Line pans with banana leaves.\n2. Mix dry ingredients.\n3. Whisk wet ingredients.\n4. Combine gently.\n5. Bake until almost set.\n6. Add toppings.\n7. Bake until golden.\n8. Brush with butter and serve warm.',
      'The banana leaf fragrance matters as much as the flavor.',
      '20 min',
      '30 min',
      '8-10 pieces',
      'Philippines',
      'Filipino',
      'Christmas',
      'en',
      true,
      true,
      'public',
      now() - interval '16 months',
      now()
    ),
    (
      v_lechon_id,
      v_family_id,
      v_tatay_mario_id,
      v_user_id,
      'Tatay Mario''s Lechon Kawali',
      'Crispy pork belly with the kind of crackling that silences a room.',
E'2 lbs pork belly\n1 head garlic\n3 bay leaves\n1 tbsp peppercorns\n1 tbsp salt\nWater\nOil for frying',
E'1. Simmer pork with aromatics until tender.\n2. Chill uncovered until completely dry.\n3. Heat oil.\n4. Fry carefully until deeply blistered.\n5. Rest and chop.\n6. Serve with cane vinegar.',
      'The drying step is not optional.',
      '20 min',
      '1 hr 20 min',
      '4',
      'Philippines',
      'Filipino',
      'New Year''s Eve',
      'en',
      true,
      true,
      'family',
      now() - interval '11 months',
      now()
    ),
    (
      v_pancit_id,
      v_family_id,
      v_tita_elena_id,
      v_user_id,
      'Tita Elena''s Birthday Pancit Bihon',
      'Long noodles for long life, made in a tray big enough for cousins, neighbors, and whoever walks in hungry.',
E'400g bihon noodles\n300g shredded chicken\n1/4 cabbage\n2 carrots\n1 cup snap peas\n1 stalk celery\n4 garlic cloves\n1 onion\n3 tbsp soy sauce\n2 cups chicken broth',
E'1. Soak noodles briefly.\n2. Sauté garlic and onion.\n3. Add chicken and vegetables.\n4. Add noodles, broth, and soy sauce.\n5. Toss until just tender.\n6. Serve with calamansi.',
      'Do not cut the noodles. That point gets made every single year.',
      '20 min',
      '20 min',
      '8-10',
      'Philippines',
      'Filipino',
      'Birthdays',
      'en',
      true,
      true,
      'public',
      now() - interval '8 months',
      now()
    ),
    (
      v_nilaga_id,
      v_family_id,
      v_tatay_mario_id,
      v_user_id,
      'Tatay Mario''s Bulalo-style Nilaga',
      'Slow beef broth with bone marrow, potatoes, greens, and a long afternoon built into it.',
E'2 lbs beef shanks\n2 lbs short ribs\n8 cups water\n1 onion\n1 tsp peppercorns\n2 tsp salt\n3 potatoes\n1/4 cabbage\n1 bundle pechay\nFish sauce',
E'1. Boil and rinse the beef.\n2. Simmer with fresh water and aromatics for several hours.\n3. Add potatoes.\n4. Add cabbage.\n5. Turn off heat and add pechay.\n6. Season and serve.',
      'The marrow gets its own little ceremony at the table.',
      '15 min',
      '3 hrs',
      '4-6',
      'Philippines',
      'Filipino',
      'Cold nights',
      'en',
      false,
      false,
      'family',
      now() - interval '5 months',
      now()
    ),
    (
      v_karekare_id,
      v_family_id,
      v_tita_rosa_id,
      v_user_id,
      'Tita Rosa''s Kare-Kare',
      'Peanut stew with oxtail and vegetables, always served with bagoong and a warning not to skimp on it.',
E'2 lbs oxtail\n1 onion\n6 cups water\n1/2 cup peanut butter\n2 tbsp toasted rice powder\n1 eggplant\n1 bunch bok choy\n1 banana blossom\nBagoong to serve',
E'1. Simmer oxtail until tender.\n2. Stir in peanut butter and rice powder.\n3. Add vegetables in stages.\n4. Simmer until silky.\n5. Serve with bagoong and rice.',
      'This is one of the dishes guests ask for by name.',
      '25 min',
      '3 hrs',
      '6',
      'Philippines',
      'Filipino',
      'Family gatherings',
      'en',
      true,
      true,
      'public',
      now() - interval '4 months',
      now()
    ),
    (
      v_arrozcaldo_id,
      v_family_id,
      v_lili_id,
      v_user_id,
      'Lili''s Late-Night Arroz Caldo',
      'Ginger rice porridge for sick days, late arrivals, and homesick evenings.',
E'1 cup rice\n6 cups chicken stock\n2 chicken thighs\n1 onion\n6 cloves garlic\n2 inches ginger\nFish sauce\nGreen onions\nBoiled eggs\nCalamansi',
E'1. Toast garlic separately for topping.\n2. Sauté ginger and onion.\n3. Add chicken and rice.\n4. Pour in stock and simmer until creamy.\n5. Season.\n6. Top with garlic, egg, and green onion.',
      'This is the first dish I learned to make without calling anyone halfway through.',
      '10 min',
      '40 min',
      '4',
      'Philippines',
      'Filipino',
      'Sick day',
      'en',
      false,
      false,
      'family',
      now() - interval '3 months',
      now()
    ),
    (
      v_ubehalaya_id,
      v_family_id,
      v_nina_id,
      v_user_id,
      'Nina''s Ube Halaya',
      'Purple yam jam for holiday dessert tables and violet-stained wooden spoons.',
E'2 lbs ube\n1 can condensed milk\n1 can evaporated milk\n1/2 cup butter\n1/2 cup sugar\n1 tsp vanilla',
E'1. Boil and mash the ube.\n2. Cook with milks, butter, and sugar over low heat.\n3. Stir constantly until thick and glossy.\n4. Transfer to a buttered dish.\n5. Chill or serve warm.',
      'Every good batch gives you a sore arm by the end.',
      '20 min',
      '50 min',
      '8',
      'Philippines',
      'Filipino',
      'Holiday dessert',
      'en',
      false,
      false,
      'public',
      now() - interval '2 months',
      now()
    ),
    (
      v_lumpia_id,
      v_family_id,
      v_tito_joel_id,
      v_user_id,
      'Tito Joel''s Party Lumpiang Shanghai',
      'The first platter to disappear at every gathering and the first thing people start snacking on before dinner.',
E'1 lb ground pork\n1 carrot\n1 onion\n4 garlic cloves\n1 egg\n2 tbsp soy sauce\nSalt\nPepper\nSpring roll wrappers\nOil for frying',
E'1. Mix filling ingredients thoroughly.\n2. Roll tightly in wrappers.\n3. Fry in batches until crisp and golden.\n4. Drain well.\n5. Serve with sweet chili sauce.',
      'No one can roll these as tightly as Joel when he''s showing off.',
      '35 min',
      '20 min',
      '30 rolls',
      'Philippines',
      'Filipino',
      'Parties',
      'en',
      true,
      true,
      'public',
      now() - interval '6 weeks',
      now()
    )
  on conflict (id) do update
  set title = excluded.title,
      description = excluded.description,
      ingredients = excluded.ingredients,
      steps = excluded.steps,
      notes = excluded.notes,
      prep_time = excluded.prep_time,
      cook_time = excluded.cook_time,
      servings = excluded.servings,
      country_of_origin = excluded.country_of_origin,
      culture_tag = excluded.culture_tag,
      occasion = excluded.occasion,
      language = excluded.language,
      is_favorite = excluded.is_favorite,
      is_family_favorite = excluded.is_family_favorite,
      visibility = excluded.visibility,
      member_id = excluded.member_id,
      updated_at = now();

  insert into public.recipes (id, family_id, member_id, created_by, title, description, ingredients, steps, notes, prep_time, cook_time, servings, country_of_origin, culture_tag, occasion, language, is_favorite, is_family_favorite, visibility, created_at, updated_at)
  values
    (
      v_pho_id,
      v_nguyen_family_id,
      v_ba_lan_id,
      v_user_id,
      'Ba Lan''s Weekend Pho',
      'A broth that takes all day and makes the whole house smell like it is waiting for people to arrive.',
E'3 lbs beef bones\n1 onion\n1 ginger knob\nStar anise\nCinnamon stick\nFish sauce\nRice noodles\nThinly sliced beef\nThai basil\nBean sprouts\nLime',
E'1. Roast bones, onion, and ginger.\n2. Simmer bones for several hours.\n3. Toast spices and add to the broth.\n4. Season carefully.\n5. Cook noodles separately.\n6. Assemble bowls with beef and herbs.\n7. Pour hot broth over everything.',
      'The broth should smell deep and clean before anyone starts tasting.',
      '40 min',
      '6 hrs',
      '8',
      'Vietnam',
      'Vietnamese',
      'Weekend gathering',
      'en',
      true,
      true,
      'public',
      now() - interval '7 months',
      now()
    ),
    (
      v_banhxeo_id,
      v_nguyen_family_id,
      v_mei_nguyen_id,
      v_user_id,
      'Mei''s Crispy Banh Xeo',
      'Turmeric crepes with shrimp, herbs, and a crisp edge that matters as much as the filling.',
E'Rice flour\nCoconut milk\nTurmeric\nShrimp\nPork belly\nBean sprouts\nScallions\nLettuce\nMint\nNuoc cham',
E'1. Whisk the batter smooth.\n2. Cook pork and shrimp.\n3. Pour batter into a hot skillet.\n4. Add the filling and let the crepe crisp.\n5. Fold and serve with herbs and sauce.',
      'The first crepe is a test and does not count.',
      '25 min',
      '25 min',
      '4',
      'Vietnam',
      'Vietnamese',
      'Family lunch',
      'en',
      false,
      true,
      'public',
      now() - interval '5 months',
      now()
    ),
    (
      v_chethai_id,
      v_nguyen_family_id,
      v_daniel_nguyen_id,
      v_user_id,
      'Daniel''s Che Thai',
      'A bright, icy fruit dessert that arrives when the afternoon gets too warm for anything heavy.',
E'Jackfruit\nLychees\nLongan\nCoconut milk\nHalf-and-half\nSugar\nCrushed ice\nJellies',
E'1. Chill the fruit.\n2. Sweeten the coconut milk mixture.\n3. Fill bowls with fruit and jellies.\n4. Add ice.\n5. Pour over the coconut milk and serve immediately.',
      'The ice goes in last so the photos stay sharp and the dessert stays cold.',
      '15 min',
      '10 min',
      '6',
      'Vietnam',
      'Vietnamese',
      'Summer',
      'en',
      false,
      false,
      'public',
      now() - interval '2 months',
      now()
    ),
    (
      v_birria_id,
      v_alvarez_family_id,
      v_mateo_alvarez_id,
      v_user_id,
      'Mateo''s Sunday Birria',
      'Slow-braised meat with chile broth and tortillas waiting nearby before anyone is seated.',
E'3 lbs beef chuck\nDried guajillo chiles\nDried ancho chiles\nOnion\nGarlic\nCloves\nCinnamon\nVinegar\nBay leaves\nTortillas',
E'1. Toast and soak the chiles.\n2. Blend the marinade.\n3. Coat the meat and rest it.\n4. Braise slowly until shreddable.\n5. Reduce the broth.\n6. Serve with tortillas, onion, and cilantro.',
      'The broth should be strong enough that people ask for a cup of it on the side.',
      '35 min',
      '4 hrs',
      '8',
      'Mexico',
      'Mexican',
      'Sunday gathering',
      'en',
      true,
      true,
      'public',
      now() - interval '6 months',
      now()
    ),
    (
      v_tamales_id,
      v_alvarez_family_id,
      v_abuela_carmen_id,
      v_user_id,
      'Abuela Carmen''s Red Chile Tamales',
      'A masa-and-filling assembly line recipe that only makes sense when the whole kitchen helps.',
E'Corn husks\nMasa harina\nLard\nChicken broth\nShredded pork\nRed chile sauce\nSalt',
E'1. Soak the husks.\n2. Whip the masa until light.\n3. Prepare the filling.\n4. Spread masa on husks.\n5. Fill and fold.\n6. Steam until set.',
      'Tamales are never really a solo recipe in this family.',
      '1 hr',
      '2 hrs',
      '24 tamales',
      'Mexico',
      'Mexican',
      'Christmas Eve',
      'en',
      true,
      true,
      'public',
      now() - interval '4 months',
      now()
    ),
    (
      v_arrozconleche_id,
      v_alvarez_family_id,
      v_sofia_alvarez_id,
      v_user_id,
      'Sofia''s Arroz con Leche Notebook Version',
      'Rice pudding captured in writing before it had the chance to disappear back into oral tradition.',
E'1 cup rice\n4 cups milk\n1 cinnamon stick\n1 lemon peel\n1/2 cup sugar\nVanilla\nGround cinnamon',
E'1. Simmer rice with cinnamon.\n2. Add milk gradually.\n3. Stir until creamy.\n4. Add sugar and vanilla.\n5. Cool slightly.\n6. Dust with cinnamon.',
      'This is the first version in the family with exact measurements on purpose.',
      '10 min',
      '45 min',
      '6',
      'Mexico',
      'Mexican',
      'Dessert',
      'en',
      false,
      false,
      'public',
      now() - interval '6 weeks',
      now()
    )
  on conflict (id) do update
  set title = excluded.title,
      description = excluded.description,
      ingredients = excluded.ingredients,
      steps = excluded.steps,
      notes = excluded.notes,
      prep_time = excluded.prep_time,
      cook_time = excluded.cook_time,
      servings = excluded.servings,
      country_of_origin = excluded.country_of_origin,
      culture_tag = excluded.culture_tag,
      occasion = excluded.occasion,
      language = excluded.language,
      is_favorite = excluded.is_favorite,
      is_family_favorite = excluded.is_family_favorite,
      visibility = excluded.visibility,
      member_id = excluded.member_id,
      updated_at = now();

  -- ============================================================
  -- MEMORIES
  -- ============================================================
  insert into public.memories (id, recipe_id, created_by, text, occasion, meaning_note, created_at, updated_at)
  values
    (
      'c1111111-1111-4111-8111-111111111301',
      v_adobo_id,
      v_user_id,
      'The morning after Lola Carmen''s funeral, Tita Elena made adobo without asking anyone. We sat in silence and ate until the house felt human again.',
      'March 2019',
      'Adobo is how our family says we are still here.',
      now() - interval '17 months',
      now()
    ),
    (
      'c1111111-1111-4111-8111-111111111302',
      v_bibingka_id,
      v_user_id,
      'Every December, the smell of banana leaves meant we were home from dawn mass and breakfast was seconds away.',
      'Simbang Gabi',
      'This is what Christmas smells like to us.',
      now() - interval '16 months',
      now()
    ),
    (
      'c1111111-1111-4111-8111-111111111303',
      v_pancit_id,
      v_user_id,
      'Someone once suggested pasta instead of pancit for a birthday and was treated like they had proposed a felony.',
      'Family birthday dinner',
      'Long noodles, long life. No substitutions.',
      now() - interval '8 months',
      now()
    ),
    (
      'c1111111-1111-4111-8111-111111111304',
      v_lechon_id,
      v_user_id,
      'By midafternoon on New Year''s Eve, everyone knows to stay out of Mario''s kitchen unless asked to carry plates.',
      'New Year''s Eve',
      'The crackle when it''s chopped is part of the celebration.',
      now() - interval '7 months',
      now()
    ),
    (
      'c1111111-1111-4111-8111-111111111305',
      v_karekare_id,
      v_user_id,
      'Tita Rosa always places the bagoong on the table with a warning look, as if anyone would dare forget it.',
      'Sunday lunch',
      'Every good kare-kare has a tiny lecture attached.',
      now() - interval '4 months',
      now()
    ),
    (
      'c1111111-1111-4111-8111-111111111306',
      v_arrozcaldo_id,
      v_user_id,
      'I started making this after long workdays because it was the closest thing to hearing someone say, "Sit down, I''ll feed you."',
      'Late night',
      'Sometimes comfort is mostly ginger, garlic, and steam.',
      now() - interval '3 months',
      now()
    ),
    (
      'c1111111-1111-4111-8111-111111111307',
      v_ubehalaya_id,
      v_user_id,
      'Nina turns holiday prep into an assembly line and somehow makes stirring ube look glamorous.',
      'Holiday dessert table',
      'The purple spoon stains are basically proof of effort.',
      now() - interval '2 months',
      now()
    ),
    (
      'c1111111-1111-4111-8111-111111111308',
      v_lumpia_id,
      v_user_id,
      'The first tray of lumpia never actually makes it to the party table. It gets eaten by whoever is helping in the kitchen.',
      'Before every party',
      'There is always a hidden cook''s batch.',
      now() - interval '6 weeks',
      now()
    )
  on conflict (id) do update
  set text = excluded.text,
      occasion = excluded.occasion,
      meaning_note = excluded.meaning_note,
      updated_at = now();

  insert into public.memories (id, recipe_id, created_by, text, occasion, meaning_note, created_at, updated_at)
  values
    (
      'c2222222-2222-4222-8222-222222222301',
      v_pho_id,
      v_user_id,
      'The broth starts before sunrise, and nobody asks when it will be done because the answer is always the same: when the kitchen smells right.',
      'Sunday morning',
      'Patience is the first ingredient.',
      now() - interval '7 months',
      now()
    ),
    (
      'c2222222-2222-4222-8222-222222222302',
      v_banhxeo_id,
      v_user_id,
      'The sound of batter hitting the hot pan is Mei''s way of announcing that lunch has officially started.',
      'Family lunch',
      'The crisp edge matters as much as the filling.',
      now() - interval '5 months',
      now()
    ),
    (
      'c3333333-3333-4333-8333-333333333301',
      v_birria_id,
      v_user_id,
      'When the lid comes off the birria pot, everyone in the room stops pretending they were not already hungry.',
      'Sunday gathering',
      'Good broth announces itself before it is served.',
      now() - interval '6 months',
      now()
    ),
    (
      'c3333333-3333-4333-8333-333333333302',
      v_tamales_id,
      v_user_id,
      'Nobody remembers learning how to fold tamales. They only remember being handed one and told to keep moving.',
      'Christmas prep day',
      'Some recipes are basically family choreography.',
      now() - interval '4 months',
      now()
    )
  on conflict (id) do update
  set text = excluded.text,
      occasion = excluded.occasion,
      meaning_note = excluded.meaning_note,
      updated_at = now();

  -- ============================================================
  -- AI OUTPUTS
  -- ============================================================
  insert into public.ai_outputs (id, recipe_id, extracted_text, structured_recipe, guided_steps, translation_output, confidence_note, model_used, created_at)
  values
    (
      'd1111111-1111-4111-8111-111111111401',
      v_adobo_id,
      'Chicken, vinegar, soy sauce, garlic, bay leaves, peppercorns.',
      '{"title":"Lola Carmen''s Chicken Adobo","servings":"4-6"}'::jsonb,
      '[{"step":1,"title":"Marinate the chicken"},{"step":2,"title":"Simmer until tender"},{"step":3,"title":"Reduce the sauce"}]'::jsonb,
      '{"tagalog":{"title":"Adobong Manok ni Lola Carmen"}}'::jsonb,
      'Amounts are inferred from family notes and may need final review.',
      'claude-3-7-sonnet',
      now() - interval '10 days'
    ),
    (
      'd1111111-1111-4111-8111-111111111402',
      v_bibingka_id,
      'Rice flour, coconut milk, eggs, banana leaves, salted egg.',
      '{"title":"Christmas Bibingka","occasion":"Christmas"}'::jsonb,
      '[{"step":1,"title":"Prepare banana leaves"},{"step":2,"title":"Mix batter"},{"step":3,"title":"Bake and butter"}]'::jsonb,
      '{"tagalog":{"title":"Bibingka ng Pasko"}}'::jsonb,
      'Topping order and baking time are high-confidence.',
      'claude-3-7-sonnet',
      now() - interval '8 days'
    )
  on conflict (id) do update
  set extracted_text = excluded.extracted_text,
      structured_recipe = excluded.structured_recipe,
      guided_steps = excluded.guided_steps,
      translation_output = excluded.translation_output,
      confidence_note = excluded.confidence_note,
      model_used = excluded.model_used;

  -- ============================================================
  -- INVITATIONS
  -- ============================================================
  insert into public.family_invitations (id, family_id, invited_by, email, role, accepted_at, expires_at, created_at)
  values
    (
      'e1111111-1111-4111-8111-111111111501',
      v_family_id,
      v_user_id,
      'nina@example.com',
      'editor',
      now() - interval '20 days',
      now() + interval '10 days',
      now() - interval '24 days'
    ),
    (
      'e1111111-1111-4111-8111-111111111502',
      v_family_id,
      v_user_id,
      'marco@example.com',
      'contributor',
      null,
      now() + interval '5 days',
      now() - interval '2 days'
    ),
    (
      'e1111111-1111-4111-8111-111111111503',
      v_family_id,
      v_user_id,
      'joel@example.com',
      'viewer',
      now() - interval '5 days',
      now() + interval '20 days',
      now() - interval '8 days'
    )
  on conflict (id) do update
  set email = excluded.email,
      role = excluded.role,
      accepted_at = excluded.accepted_at,
      expires_at = excluded.expires_at;

  raise notice 'Expanded demo seed complete for primary family %, plus public families % and %', v_family_id, v_nguyen_family_id, v_alvarez_family_id;
end $$;
