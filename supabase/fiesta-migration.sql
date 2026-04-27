-- ====================================================================
-- STEP 1: Add metadata JSONB column to events table
-- This allows storing prize structures, time controls, officials etc.
-- ====================================================================
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS metadata JSONB;

-- ====================================================================
-- STEP 2: Insert the Summer Fiesta Grand Chess Open event
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ====================================================================
INSERT INTO public.events (
  title, type, status, description, date, location, entry_fee, thumbnail_url, max_participants, metadata
)
VALUES (
  'Summer Fiesta Grand Chess Open',
  'tournament',
  'upcoming',
  'Ambuja Mall & Team Chess City Raipur presents Summer Fiesta Grand Chess Open. Total Cash Prize Rs. 1,00,000+!',
  '2026-05-10',
  'Ambuja City Centre Mall, Raipur',
  900,
  '/chess-fiesta.jpeg',
  500,
  '{
    "presented_by": "Ambuja Mall & Team Chess City Raipur",
    "association": "Hangout The Food Court",
    "time_control": "15+5",
    "rounds": "7/8 Rounds",
    "reporting_time": "08:30 AM",
    "start_time": "09:00 AM",
    "end_time": "06:00 PM",
    "registration_last_date": "06 May 2026",
    "whatsapp_group": "https://chat.whatsapp.com/L16X7Ak3F2b2DxTQ6HAkGA",
    "prize_pool": {
      "total_cash": "100,000+",
      "categories": {
        "open": [
          { "position": "1st", "prize": 11000 },
          { "position": "2nd", "prize": 7000 },
          { "position": "3rd", "prize": 4000 },
          { "position": "4th", "prize": 3000 },
          { "position": "5th", "prize": 2000 },
          { "position": "6th-10th", "prize": 1000 }
        ],
        "below_1700": [
          { "position": "1st", "prize": 11000 },
          { "position": "2nd", "prize": 7000 },
          { "position": "3rd", "prize": 4000 },
          { "position": "4th", "prize": 3000 },
          { "position": "5th", "prize": 2000 },
          { "position": "6th-10th", "prize": 1000 }
        ],
        "unrated": [
          { "position": "1st", "prize": 9000 },
          { "position": "2nd", "prize": 5000 },
          { "position": "3rd", "prize": 3000 },
          { "position": "4th-10th", "prize": 1000 }
        ]
      },
      "special_prizes": [
        "Best Raipur", "Best Female", "Youngest Player",
        "Best Player U-07", "Best Player U-09", "Best Player U-11", "Best Player U-13"
      ]
    },
    "facilities": [
      "AC Venue", "Parking Facility", "Parents Sitting Facility",
      "Food Facility at Mall", "Movie Facility for Parents", "Shopping Facility"
    ],
    "officials": [
      { "role": "Event Organiser", "name": "Mr. Amogh Yadav", "phone": "8871549125" },
      { "role": "Tournament Director", "name": "Mr. Vinesh Dhultani", "phone": "7869952072" },
      { "role": "Co Director", "name": "Adv. Ravi Rochlani", "phone": "9343970024" },
      { "role": "Chief Arbiter", "name": "FA Shubham Soni", "phone": null },
      { "role": "Deputy Chief Arbiter", "name": "SNA Alok Singh Kshatriya", "phone": null },
      { "role": "Arbiter", "name": "SNA Rohit Rajak", "phone": null }
    ]
  }'::jsonb
)
ON CONFLICT DO NOTHING;

-- ====================================================================
-- STEP 3: To UPDATE the entry fee or status later, run:
-- ====================================================================
-- UPDATE public.events SET entry_fee = 1000, status = 'ongoing' WHERE title = 'Summer Fiesta Grand Chess Open';

-- ====================================================================
-- STEP 4: To UPDATE prize structure later, run:
-- ====================================================================
-- UPDATE public.events
-- SET metadata = jsonb_set(metadata, '{prize_pool,categories,open,0,prize}', '12000')
-- WHERE title = 'Summer Fiesta Grand Chess Open';
