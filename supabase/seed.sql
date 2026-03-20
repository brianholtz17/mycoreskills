-- Seed launch areas (8 areas)
insert into public.launch_areas (id, slug, title, sort_order) values
  ('a0000001-0001-4000-8000-000000000001', 'math', 'Math', 1),
  ('a0000001-0001-4000-8000-000000000002', 'reading', 'Reading and Spelling', 2),
  ('a0000001-0001-4000-8000-000000000003', 'english-grammar', 'English Grammar and Sentence Writing', 3),
  ('a0000001-0001-4000-8000-000000000004', 'science', 'Science', 4),
  ('a0000001-0001-4000-8000-000000000008', 'geography-of-the-world', 'Geography of the World', 5),
  ('a0000001-0001-4000-8000-000000000005', 'typing', 'Typing', 6),
  ('a0000001-0001-4000-8000-000000000007', 'my-workshops', 'My Workshops', 7),
  ('a0000001-0001-4000-8000-000000000006', 'im-bored', 'I''m Bored!', 8)
on conflict do nothing;

-- Keep a deterministic launch-area order when re-running seed
update public.launch_areas set sort_order = 5 where slug = 'geography-of-the-world';
update public.launch_areas set sort_order = 6 where slug = 'typing';
update public.launch_areas set sort_order = 7 where slug = 'my-workshops';
update public.launch_areas set sort_order = 8 where slug = 'im-bored';

-- Tiles (sample data from Brian's list)
-- Math
insert into public.tiles (launch_area_id, title, url, sort_order) values
  ('a0000001-0001-4000-8000-000000000001', 'ALEKS', 'https://www.aleks.com/?_s=6740734816686303', 1),
  ('a0000001-0001-4000-8000-000000000001', 'XtraMath', 'https://xtramath.org/#/signin/student_other', 2);

-- Reading
insert into public.tiles (launch_area_id, title, url, sort_order) values
  ('a0000001-0001-4000-8000-000000000002', 'ReadTheory', 'https://readtheory.org/auth/login', 1);

-- English Grammar
insert into public.tiles (launch_area_id, title, url, sort_order) values
  ('a0000001-0001-4000-8000-000000000003', 'IXL', 'https://www.ixl.com/signin', 1);

-- Science
insert into public.tiles (launch_area_id, title, url, sort_order) values
  ('a0000001-0001-4000-8000-000000000004', 'IXL Science', 'https://www.ixl.com/signin', 1);

-- Typing
insert into public.tiles (launch_area_id, title, url, sort_order) values
  ('a0000001-0001-4000-8000-000000000005', 'TypingClub (Home Row Expert)', 'https://homerowexpert.typingclub.com/', 1),
  ('a0000001-0001-4000-8000-000000000005', 'Speed Typing Online', 'https://www.speedtypingonline.com/typing-test.php', 2);

-- I'm Bored!
insert into public.tiles (launch_area_id, title, url, sort_order) values
  ('a0000001-0001-4000-8000-000000000006', 'The True Size Of', 'https://thetruesize.com', 1),
  ('a0000001-0001-4000-8000-000000000006', 'NASA Astronaut Test 1958', 'https://apps.dtic.mil/sti/tr/pdf/AD0234749.pdf', 2),
  ('a0000001-0001-4000-8000-000000000006', 'Oblique Strategies', 'https://ob-strat.netlify.app/', 3),
  ('a0000001-0001-4000-8000-000000000006', 'Web Adventures', 'https://webadventures.games/', 4),
  ('a0000001-0001-4000-8000-000000000006', 'Titanic Sinking in Real-Time', 'https://www.youtube.com/watch?v=rs9w5bgtJC8', 5),
  ('a0000001-0001-4000-8000-000000000006', 'Learn to Walk in Slow-Motion', 'https://www.youtube.com/watch?v=mwOd7WRUxlw', 6),
  ('a0000001-0001-4000-8000-000000000006', 'Nobel Prize', 'https://www.nobelprize.org/', 7),
  ('a0000001-0001-4000-8000-000000000006', 'While My Guitar Gently Weeps', 'https://www.youtube.com/watch?v=VJDJs9dumZI', 8),
  ('a0000001-0001-4000-8000-000000000006', 'Gates Notes', 'https://www.gatesnotes.com/', 9),
  ('a0000001-0001-4000-8000-000000000006', 'Leonardo da Vinci''s Notebook', 'https://www.vam.ac.uk/articles/leonardo-da-vincis-notebooks', 10),
  ('a0000001-0001-4000-8000-000000000006', 'Teach Yourself Physics', 'https://archive.org/details/in.ernet.dli.2015.449423', 11),
  ('a0000001-0001-4000-8000-000000000006', 'Einstein for Everyone', 'https://sites.pitt.edu/~jdnorton/teaching/HPS_0410/chapters/', 12),
  ('a0000001-0001-4000-8000-000000000006', 'The Illusions Index', 'https://www.illusionsindex.org/', 13),
  ('a0000001-0001-4000-8000-000000000006', 'Stephen Hawking''s College Thesis', 'https://www.repository.cam.ac.uk/items/68bed7b6-e2dd-4d95-a207-1c81215e5c78', 14),
  ('a0000001-0001-4000-8000-000000000006', 'Ultimate Collection of Physics Videos', 'https://futurism.com/ultimate-collection-free-physics-videos', 15),
  ('a0000001-0001-4000-8000-000000000006', 'Euclid''s Elements of Geometry', 'https://farside.ph.utexas.edu/Books/Euclid/Elements.pdf', 16),
  ('a0000001-0001-4000-8000-000000000006', 'Ernest Hemingway''s First 49 Stories', 'https://archive.org/details/firstfortyninest030256mbp', 17);
