-- this file was manually created
INSERT INTO public.users (display_name, email, handle, cognito_user_id)
VALUES
  ('Everly Grandest', 'everlygrandest@gmail.com', 'everlygrandest', 'MOCK'),
  ('Grandest Everly', 'everlygrandest+1@gmail.com', 'grandesteverly', 'MOCK'),
  ('Human Being', 'everlygrandest+human@gmail.com', 'Human', 'MOCK'),
  ('Andrew Brown', 'andrewbrown@exampro.co', 'andrewbrown', 'MOCK'),
  ('Andrew Bayko', 'bayko@domain.com', 'bayko', 'MOCK');

INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES
  (
    (SELECT uuid from public.users WHERE users.handle = 'everlygrandest' LIMIT 1),
    'This was imported as seed data!',
    current_timestamp + interval '10 day'
  ),
  (
    (SELECT uuid from public.users WHERE users.handle = 'Human' LIMIT 1),
    'I am a human!',
    current_timestamp + interval '10 day'
  );