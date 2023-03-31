-- this file was manually created
INSERT INTO public.users (display_name, handle, email, cognito_user_id)
VALUES
  ('Everly Grandest', 'everlygrandest', 'everlygrandest@gmail.com', 'MOCK'),
  ('Andrew Brown', 'andrewbrown', 'andrewbrown@exampro.co', 'MOCK'),
  ('Andrew Bayko', 'bayko', 'bayko@domain.com', 'MOCK'),
  ('Jane Doe', 'janedoe', 'janedoe@yahoo.com', 'MOCK'),
  ('Peter Obi', 'obi', 'obi@gov.ng', 'MOCK');

INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES
  (
    (SELECT uuid from public.users WHERE users.handle = 'everlygrandest' LIMIT 1),
    'This was imported as seed data!',
    current_timestamp + interval '10 day'
  )