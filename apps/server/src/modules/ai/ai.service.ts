import { prisma } from '../../config/database.js';
import { env } from '../../config/env.js';
import { logger } from '../../utils/logger.js';
import { AppError } from '../../utils/errors.js';
import {
  ItineraryItemType,
  ActivityFlexibility,
  PackingCategory,
  TripType,
  type GenerateItineraryInput,
  type ApplyAIItineraryInput,
  type GeneratePackingInput,
  type ApplyAIPackingInput,
  type ChatCopilotInput,
  type AIGeneratedItinerary,
  type AIGeneratedPackingList,
  type AIChatResponse,
} from '@waylo/shared';

// ─── Destination Curated Profiles ─────────────────────────────
interface DestinationProfile {
  name: string;
  keywords: string[];
  vibe: string;
  morningSpots: string[];
  afternoonSpots: string[];
  sunsetSpots: string[];
  diningSpots: string[];
  drivingPointers: string[];
  packingHighlights: string[];
}

const DESTINATION_PROFILES: DestinationProfile[] = [
  {
    name: 'Goa',
    keywords: ['goa', 'panaji', 'morjim', 'vagator', 'anjuna', 'palolem', 'arambol'],
    vibe: 'Sun-drenched coastal cruising, palm-lined twisties, and bohemian shacks',
    morningSpots: ['Chapora Fort panoramic view', 'Fontainhas Latin Quarter walk', 'Dudhsagar Waterfall trek trail', 'Arambol Sweet Water Lake'],
    afternoonSpots: ['Reis Magos Fort & Mandovi estuary', 'Spice Plantation tour & traditional buffet', 'Cabo de Rama sea cliff viewpoint', 'Divar Island ferry loop'],
    sunsetSpots: ['Morjim Beach Olive Ridley turtle sanctuary', 'Vagator Hill sunset viewpoint', 'Thalassa cliffside lounge', 'Ashvem beach shoreline ride'],
    diningSpots: ['Gunpowder (Assagao) South Indian feast', 'Fisherman’s Wharf Goan seafood', 'Vinayak Family Restaurant fish thali', 'Burger Factory Anjuna'],
    drivingPointers: ['Watch for soft sand patches along village coastal link roads', 'Wear UV sunglasses and keep hydration packs full'],
    packingHighlights: ['Polarized sunglasses', 'SPF 50+ Sunscreen', 'Quick-dry beach shorts', 'Waterproof pouch for electronics'],
  },
  {
    name: 'Ladakh / Himalayas',
    keywords: ['ladakh', 'leh', 'nubra', 'pangong', 'manali', 'spiti', 'khardung', 'himalaya'],
    vibe: 'High-altitude dramatic mountain passes, prayer flags, and azure glacial lakes',
    morningSpots: ['Shanti Stupa sunrise reflection', 'Magnetic Hill & Indus-Zanskar confluence', 'Thiksey Monastery morning chanting', 'Khardung La Pass (17,982 ft) ascent'],
    afternoonSpots: ['Nubra Valley Hunder sand dunes double-hump camel ride', 'Diskit Monastery giant Buddha statue', 'Lamayuru Moonland landscape', 'Hemis high gompa exploration'],
    sunsetSpots: ['Pangong Tso shore color change viewpoint', 'Leh Palace rooftop dusk view', 'Tso Moriri tranquil wilderness', 'Tanglang La twilight descent'],
    diningSpots: ['Tibetan Kitchen (Leh) piping momos & thukpa', 'Gesmo Bakery apple pie & ginger lemon tea', 'Chopsticks Asian Bar & Grill Leh'],
    drivingPointers: ['Acclimatize in Leh for 48 hours before crossing 14,000 ft', 'Carry portable tyre inflator, spare tubes, and octane booster for cold starts'],
    packingHighlights: ['Diamox & altitude sickness meds', 'Heavy thermal base layers', 'Windproof gore-tex riding armor', 'Lip balm & cold cream'],
  },
  {
    name: 'Western Ghats / Coorg / Ooty',
    keywords: ['coorg', 'ooty', 'munnar', 'wayanad', 'chikmagalur', 'kodaikanal', 'ghats'],
    vibe: 'Lush misty hairpin bends, sprawling coffee estates, and cool mountain air',
    morningSpots: ['Raja’s Seat morning cloud inversion', 'Abbi Falls misty rainforest walk', 'Mullayanagiri peak summit ride', 'Emerald Lake serene lakeside ride'],
    afternoonSpots: ['Coffee & Cardamom plantation estate tour', 'Dubare Elephant Camp riverbank', 'Tea Museum and factory tasting', 'Pykara Lake speedboat trail'],
    sunsetSpots: ['Mandalpatti 4x4 peak sunset vista', 'Doddabetta Peak Nilgiris viewpoint', 'Shooting Point meadows sunset', 'Banasura Sagar dam horizon'],
    diningSpots: ['Coorg Cuisine (Madikeri) Pandi Curry & Akki Roti', 'Earl’s Secret colonial restaurant Ooty', 'Town Table authentic Kodava lunch'],
    drivingPointers: ['Expect sudden thick fog roll-ins on ghat hairpins; use hazard lights judiciously', 'Traction drops rapidly when wet leaves coat the asphalt'],
    packingHighlights: ['Waterproof rain mac / oversuit', 'Warm fleece sweater', 'Insect repellent spray', 'Anti-fog visor spray'],
  },
  {
    name: 'Rajasthan / Desert Circuit',
    keywords: ['jaipur', 'jodhpur', 'jaisalmer', 'udaipur', 'pushkar', 'rajasthan'],
    vibe: 'Royal desert fortresses, golden hour sand dunes, and vibrant folk heritage',
    morningSpots: ['Amer Fort elephant pathway & Maota Lake', 'Mehrangarh Fort ramparts morning walk', 'City Palace Udaipur lakeside stroll', 'Jaisalmer Golden Fort living citadel'],
    afternoonSpots: ['Hawa Mahal & Old Pink City bazaars', 'Jaswant Thada white marble cenotaphs', 'Umaid Bhawan Palace vintage museum', 'Kuldhara abandoned heritage village'],
    sunsetSpots: ['Sam Sand Dunes camel safari at sunset', 'Nahargarh Fort sunset lounge with Jaipur panorama', 'Lake Pichola sunset boat cruise', 'Gadisar Lake illuminated pavilions'],
    diningSpots: ['Chokhi Dhani ethnic Rajasthani thali', 'LMB (Laxmi Misthan Bhandar) Ghewar & Kachori', 'Ambrai Udaipur waterfront dinner'],
    drivingPointers: ['Desert highways are smooth but watch for stray camels and heat shimmer', 'Check tyre pressures cold in the morning as tarmac temperatures soar'],
    packingHighlights: ['Breathable cotton clothing', 'Dust bandana / riding balaclava', 'Sunscreen SPF 50', 'Wide-brim hat & sunglasses'],
  },
];

function findDestinationProfile(destination: string): DestinationProfile | null {
  const lower = destination.toLowerCase();
  return (
    DESTINATION_PROFILES.find((p) =>
      p.keywords.some((k) => lower.includes(k) || k.includes(lower))
    ) || null
  );
}

export class AIService {
  /**
   * Helper to invoke Google Gemini 1.5 Flash with structured JSON or text
   */
  private async callGemini(prompt: string, isJson: boolean = true): Promise<any> {
    const apiKey = env.GEMINI_API_KEY;
    if (!apiKey) return null;

    const models = ['gemini-3.5-flash', 'gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-2.5-flash'];

    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const payload: any = {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
          },
        };

        if (isJson) {
          payload.generationConfig.responseMimeType = 'application/json';
        }

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          continue;
        }

        const data: any = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) continue;

        if (isJson) {
          let cleaned = text.trim();
          if (cleaned.startsWith('```json')) cleaned = cleaned.slice(7);
          else if (cleaned.startsWith('```')) cleaned = cleaned.slice(3);
          if (cleaned.endsWith('```')) cleaned = cleaned.slice(0, -3);
          return JSON.parse(cleaned.trim());
        }

        return text;
      } catch (err) {
        continue;
      }
    }
    return null;
  }

  /**
   * Generate an intelligent, structured day-by-day itinerary
   */
  async generateItinerary(input: GenerateItineraryInput): Promise<AIGeneratedItinerary> {
    const { destination, origin, daysCount, tripType, travelPace, budget, interests, preferences } = input;

    // 1. Try Google Gemini Generative AI if API key is provided
    if (env.GEMINI_API_KEY) {
      const prompt = `You are the master travel planner and road trip architect for Waylo.
Create an extraordinary, rich, and highly realistic day-by-day travel itinerary with these requirements:
- Destination: ${destination}
- Origin / Departure Point: ${origin || 'Same as destination'}
- Duration: ${daysCount} days
- Trip Type / Vehicle: ${tripType}
- Travel Pace: ${travelPace}
- Budget Level: ${budget}
- Traveler Interests: ${interests?.join(', ') || 'Scenic routes, local culture, cuisine, photography'}
- Custom User Preferences: ${preferences || 'None'}

Return ONLY a valid JSON object matching this TypeScript structure:
{
  "tripTitle": "Catchy adventure title for this trip",
  "summary": "2-3 sentences capturing the essence, route character, and experience",
  "estimatedBudgetNotes": "Actionable budget allocation breakdown for ${budget} tier",
  "highlights": ["3 to 5 key highlights and must-visit spots"],
  "days": [
    {
      "dayNumber": 1,
      "title": "Day 1 theme / title",
      "startLocation": "Starting location",
      "endLocation": "End location for day",
      "notes": "Route pointer, driving conditions, or photography tips",
      "stops": [
        {
          "title": "Specific landmark, restaurant, scenic viewpoint, or hotel",
          "itemType": "SIGHTSEEING" | "ACTIVITY" | "MEAL" | "TRAVEL" | "REST" | "FUEL_STOP" | "CHECK_IN" | "CHECK_OUT" | "OTHER",
          "location": "Location name",
          "plannedStartTime": "09:00",
          "plannedEndTime": "11:00",
          "plannedDistanceKm": 25,
          "flexibility": "FIXED" | "FLEXIBLE" | "OPTIONAL",
          "isOptional": false,
          "notes": "Practical tip or description"
        }
      ]
    }
  ]
}

Ensure all itemType values match: SIGHTSEEING, ACTIVITY, MEAL, TRAVEL, REST, FUEL_STOP, CHECK_IN, CHECK_OUT, or OTHER.
Ensure all flexibility values match: FIXED, FLEXIBLE, or OPTIONAL.
Keep each day focused to 3-4 distinct highlight stops (Morning, Midday/Lunch, Sunset/Dinner). Keep notes to 1 crisp sentence for fast generation.
Include real local attractions and authentic food spots for ${destination}.`;

      const aiPlan = await this.callGemini(prompt, true);
      if (aiPlan && Array.isArray(aiPlan.days) && aiPlan.days.length > 0) {
        logger.info(`✨ Generated itinerary for ${destination} using Google Gemini 1.5 Flash`);
        return {
          tripTitle: aiPlan.tripTitle || `${destination} Adventure`,
          summary: aiPlan.summary || `A personalized ${daysCount}-day trip to ${destination}.`,
          estimatedBudgetNotes: aiPlan.estimatedBudgetNotes || `Estimated budget level: ${budget}`,
          highlights: Array.isArray(aiPlan.highlights) ? aiPlan.highlights : [],
          days: aiPlan.days.map((d: any, idx: number) => ({
            dayNumber: d.dayNumber || idx + 1,
            title: d.title || `Day ${idx + 1}`,
            startLocation: d.startLocation || origin || destination,
            endLocation: d.endLocation || destination,
            notes: d.notes || null,
            stops: Array.isArray(d.stops)
              ? d.stops.map((s: any) => ({
                  title: s.title || 'Stop',
                  itemType: s.itemType || ItineraryItemType.SIGHTSEEING,
                  location: s.location || destination,
                  plannedStartTime: s.plannedStartTime || '09:00',
                  plannedEndTime: s.plannedEndTime || '10:30',
                  plannedDistanceKm: typeof s.plannedDistanceKm === 'number' ? s.plannedDistanceKm : null,
                  flexibility: s.flexibility || ActivityFlexibility.FLEXIBLE,
                  isOptional: Boolean(s.isOptional),
                  notes: s.notes || null,
                }))
              : [],
          })),
        };
      }
    }

    // 2. Fallback to curated heuristic & profile engine
    const profile = findDestinationProfile(destination);

    const tripTitle = `${destination} ${tripType === TripType.MOTORCYCLE ? 'Rider’s Odyssey' : 'Expedition'}`;
    const summary = profile
      ? `A carefully crafted ${daysCount}-day itinerary exploring ${destination}. Featuring ${profile.vibe}. Optimized for a ${travelPace.toLowerCase()} pace and ${budget.toLowerCase()} budget.`
      : `An inspiring ${daysCount}-day custom adventure to ${destination}. Curated with scenic waypoints, local culinary gems, and thrilling landmarks at a ${travelPace.toLowerCase()} pace.`;

    const highlights: string[] = profile
      ? [
          `${destination} iconic viewpoints & scenic passes`,
          `Authentic regional dining at ${profile.diningSpots[0]}`,
          `Sunset vista from ${profile.sunsetSpots[0]}`,
          ...(interests && interests.length > 0 ? [`Special focus on: ${interests.slice(0, 3).join(', ')}`] : []),
        ]
      : [
          `Explore prime landmarks of ${destination}`,
          `Scenic driving and route connection from ${origin || 'starting point'}`,
          `Curated leisure and local photography stops`,
          ...(interests && interests.length > 0 ? [`Handpicked activities tailored to ${interests.join(', ')}`] : []),
        ];

    const days = [];
    const numDays = Math.min(Math.max(daysCount, 1), 30);

    for (let dayNum = 1; dayNum <= numDays; dayNum++) {
      const isFirstDay = dayNum === 1;
      const isLastDay = dayNum === numDays;

      let dayTitle = `Day ${dayNum}: Exploring ${destination}`;
      let startLoc = isFirstDay ? (origin || destination) : destination;
      let endLoc = destination;

      if (isFirstDay && origin && origin.toLowerCase() !== destination.toLowerCase()) {
        dayTitle = `Day 1: Journey from ${origin} to ${destination}`;
        startLoc = origin;
        endLoc = destination;
      } else if (isLastDay && origin && origin.toLowerCase() !== destination.toLowerCase()) {
        dayTitle = `Day ${dayNum}: Return Drive back to ${origin}`;
        startLoc = destination;
        endLoc = origin;
      } else if (profile) {
        const themeIndex = (dayNum - 1) % 4;
        const themes = [
          `Arrival & Cultural Highlights`,
          `Scenic Routes & Nature Exploration`,
          `Hidden Trails & Heritage Discovery`,
          `Leisure, Sunset Vistas & Farewell Feast`,
        ];
        dayTitle = `Day ${dayNum}: ${themes[themeIndex]}`;
      }

      // Generate stops for this day
      const stops = [];

      // Stop 1: Morning Departure / Sightseeing
      stops.push({
        title: isFirstDay && origin
          ? `Roll-out Departure from ${origin}`
          : profile
          ? profile.morningSpots[(dayNum - 1) % profile.morningSpots.length]
          : `Morning Discovery Walk & Breakfast in ${startLoc}`,
        itemType: isFirstDay ? ItineraryItemType.TRAVEL : ItineraryItemType.SIGHTSEEING,
        location: startLoc,
        plannedStartTime: travelPace === 'PACKED' ? '06:30' : '08:30',
        plannedEndTime: travelPace === 'PACKED' ? '08:30' : '10:30',
        plannedDistanceKm: isFirstDay ? 45 : 12,
        flexibility: ActivityFlexibility.FIXED,
        isOptional: false,
        notes: isFirstDay
          ? 'Check vehicle fluids, zero trip meter, and start early to beat peak corridor traffic.'
          : 'Early morning light is ideal for photography without crowds.',
      });

      // Stop 2: Mid-day Activity or Scenic Drive
      stops.push({
        title: profile
          ? profile.afternoonSpots[(dayNum - 1) % profile.afternoonSpots.length]
          : `Scenic Exploration & Historical Landmark in ${destination}`,
        itemType: ItineraryItemType.ACTIVITY,
        location: destination,
        plannedStartTime: '11:00',
        plannedEndTime: '13:00',
        plannedDistanceKm: 25,
        flexibility: ActivityFlexibility.FLEXIBLE,
        isOptional: false,
        notes: profile?.drivingPointers[0] || 'Take regular hydration breaks and enjoy the scenic curves.',
      });

      // Stop 3: Lunch stop
      stops.push({
        title: profile
          ? `Lunch & Rest Break at ${profile.diningSpots[(dayNum - 1) % profile.diningSpots.length]}`
          : `Local Culinary Specialty Lunch in ${destination}`,
        itemType: ItineraryItemType.MEAL,
        location: destination,
        plannedStartTime: '13:15',
        plannedEndTime: '14:30',
        plannedDistanceKm: 5,
        flexibility: ActivityFlexibility.FLEXIBLE,
        isOptional: false,
        notes: 'Savor regional flavors and rest during the hottest midday hour.',
      });

      // Stop 4: Sunset stop or Evening Leisure
      stops.push({
        title: profile
          ? profile.sunsetSpots[(dayNum - 1) % profile.sunsetSpots.length]
          : `Golden Hour Sunset Panorama over ${destination}`,
        itemType: ItineraryItemType.SIGHTSEEING,
        location: endLoc,
        plannedStartTime: '17:00',
        plannedEndTime: '19:00',
        plannedDistanceKm: 18,
        flexibility: ActivityFlexibility.FLEXIBLE,
        isOptional: travelPace === 'RELAXED',
        notes: 'Spectacular sunset viewpoint. Bring a light windbreaker as temperature drops.',
      });

      // Stop 5: Check-in / Dinner
      stops.push({
        title: isLastDay
          ? `Final Wrap-up & Safe Arrival in ${endLoc}`
          : `Evening Chill & Dinner at Stay in ${endLoc}`,
        itemType: isLastDay ? ItineraryItemType.CHECK_OUT : ItineraryItemType.CHECK_IN,
        location: endLoc,
        plannedStartTime: '19:30',
        plannedEndTime: '21:00',
        plannedDistanceKm: null,
        flexibility: ActivityFlexibility.FLEXIBLE,
        isOptional: false,
        notes: 'Review the day’s fuel logs, sync route notes with crew, and charge electronics.',
      });

      days.push({
        dayNumber: dayNum,
        title: dayTitle,
        startLocation: startLoc,
        endLocation: endLoc,
        notes: `Pace: ${travelPace}. Estimated riding/drive distance: ~${stops.reduce((acc, s) => acc + (s.plannedDistanceKm || 0), 0)} km.`,
        stops,
      });
    }

    return {
      tripTitle,
      summary,
      estimatedBudgetNotes: `Estimated budget level: ${budget}. Recommended allocation: 40% Stay, 25% Fuel/Transit, 20% Food, 15% Reserves.`,
      highlights,
      days,
    };
  }

  /**
   * Persist a generated itinerary directly into a trip's itinerary days and items
   */
  async applyItineraryToTrip(tripId: string, itineraryData: ApplyAIItineraryInput['itinerary']) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { itineraryDays: true },
    });

    if (!trip) {
      throw AppError.notFound('Trip not found');
    }

    // Execute in a transaction to replace existing draft days with the new plan
    return prisma.$transaction(async (tx) => {
      // 1. Delete existing days (cascade will delete items)
      await tx.itineraryDay.deleteMany({
        where: { tripId },
      });

      // 2. Insert new days with their stops
      const createdDays = [];
      for (const day of itineraryData.days) {
        // Calculate date if trip has a start date
        let calculatedDate: Date | null = null;
        if (trip.startDate) {
          calculatedDate = new Date(trip.startDate);
          calculatedDate.setDate(calculatedDate.getDate() + (day.dayNumber - 1));
        }

        const newDay = await tx.itineraryDay.create({
          data: {
            tripId,
            dayNumber: day.dayNumber,
            date: calculatedDate,
            title: day.title,
            startLocation: day.startLocation || trip.startLocation,
            endLocation: day.endLocation || trip.destination,
            notes: day.notes,
          },
        });

        // Insert stops
        if (day.stops && day.stops.length > 0) {
          for (let i = 0; i < day.stops.length; i++) {
            const stop = day.stops[i];
            await tx.itineraryItem.create({
              data: {
                dayId: newDay.id,
                orderIndex: i + 1,
                title: stop.title,
                itemType: stop.itemType,
                location: stop.location || null,
                startTime: stop.plannedStartTime || null,
                endTime: stop.plannedEndTime || null,
                flexibility: stop.flexibility,
                isOptional: stop.isOptional,
                notes: stop.notes || null,
              },
            });
          }
        }

        createdDays.push(newDay);
      }

      return {
        appliedDaysCount: createdDays.length,
        message: `Successfully applied ${createdDays.length} days of AI-crafted itinerary to trip.`,
      };
    });
  }

  /**
   * Generate intelligent packing suggestions tailored to the destination and trip style
   */
  async generatePacking(input: GeneratePackingInput): Promise<AIGeneratedPackingList> {
    const { destination, tripType, daysCount, climate, includeRidingGear } = input;

    // 1. Try Google Gemini Generative AI if API key is provided
    if (env.GEMINI_API_KEY) {
      const prompt = `You are the master travel gear and packing expert for Waylo.
Generate an intelligent, comprehensive packing checklist for a ${daysCount}-day trip to ${destination}.
Trip Type / Transport: ${tripType}
Climate / Weather: ${climate || 'Seasonal'}
Include Riding Gear: ${Boolean(includeRidingGear || tripType === TripType.MOTORCYCLE)}

Return ONLY a valid JSON object matching this structure:
{
  "title": "${destination} AI Smart Packing Checklist",
  "summary": "Tailored checklist of gear and clothing essentials optimized for ${destination}",
  "items": [
    {
      "name": "Specific gear or clothing item name",
      "category": "TOPS" | "BOTTOMS" | "INNERWEAR" | "SLEEPWEAR" | "FOOTWEAR" | "WEATHER_LAYERS" | "MOTORCYCLE_GEAR" | "DOCUMENTS" | "ELECTRONICS" | "TOILETRIES" | "MEDICINES" | "FOOD_WATER" | "MISCELLANEOUS",
      "quantity": 1,
      "isRequired": true,
      "notes": "Practical tip on packing or why it is essential"
    }
  ]
}

Ensure all category values match one of: TOPS, BOTTOMS, INNERWEAR, SLEEPWEAR, FOOTWEAR, WEATHER_LAYERS, MOTORCYCLE_GEAR, DOCUMENTS, ELECTRONICS, TOILETRIES, MEDICINES, FOOD_WATER, MISCELLANEOUS.
Include practical essentials tailored specifically to ${destination} and ${tripType}.`;

      const aiPacking = await this.callGemini(prompt, true);
      if (aiPacking && Array.isArray(aiPacking.items) && aiPacking.items.length > 0) {
        logger.info(`✨ Generated smart packing checklist for ${destination} using Google Gemini`);
        return {
          title: aiPacking.title || `${destination} Packing Checklist`,
          summary: aiPacking.summary || `Smart checklist for a ${daysCount}-day trip to ${destination}`,
          items: aiPacking.items.map((item: any) => ({
            name: item.name || 'Essential Item',
            category: item.category || PackingCategory.MISCELLANEOUS,
            quantity: typeof item.quantity === 'number' ? item.quantity : 1,
            isRequired: Boolean(item.isRequired),
            notes: item.notes || null,
          })),
        };
      }
    }

    // 2. Fallback to curated heuristic checklist
    const profile = findDestinationProfile(destination);
    const isCold = climate?.toLowerCase().includes('cold') || destination.toLowerCase().includes('ladakh') || destination.toLowerCase().includes('spiti') || destination.toLowerCase().includes('himalaya');
    const isMotorcycle = tripType === TripType.MOTORCYCLE || includeRidingGear;

    const items: Array<{
      name: string;
      category: PackingCategory;
      quantity: number;
      isRequired: boolean;
      notes?: string;
    }> = [
      // Tops & Bottoms
      { name: 'Breathable Technical T-shirts', category: PackingCategory.TOPS, quantity: Math.min(daysCount + 1, 6), isRequired: true, notes: 'Quick-dry synthetic or merino' },
      { name: 'Lightweight Cargo or Casual Pants', category: PackingCategory.BOTTOMS, quantity: Math.min(Math.ceil(daysCount / 2), 3), isRequired: true },
      { name: 'Innerwear & Moisture-Wicking Socks', category: PackingCategory.INNERWEAR, quantity: Math.min(daysCount + 2, 7), isRequired: true },
      { name: 'Comfortable Sleepwear / Loungewear', category: PackingCategory.SLEEPWEAR, quantity: 2, isRequired: false },
      { name: 'Casual Sneakers or Camp Flip-flops', category: PackingCategory.FOOTWEAR, quantity: 1, isRequired: true },

      // Weather & Layers
      { name: isCold ? 'Heavy Down Thermal Jacket' : 'Lightweight Windbreaker Jacket', category: PackingCategory.WEATHER_LAYERS, quantity: 1, isRequired: true },
      { name: 'Full-Coverage Rain Poncho or Rain Oversuit', category: PackingCategory.WEATHER_LAYERS, quantity: 1, isRequired: true, notes: 'Compact roll-up design' },

      // Electronics
      { name: 'Fast-Charge Power Bank (20,000mAh)', category: PackingCategory.ELECTRONICS, quantity: 1, isRequired: true, notes: 'Airline carry-on approved' },
      { name: 'Multi-Port USB Wall Adapter & Braided Cables', category: PackingCategory.ELECTRONICS, quantity: 2, isRequired: true },

      // Toiletries & Meds
      { name: 'Toiletry Bag (Toothbrush, Paste, Shampoo Bar, Sunscreen)', category: PackingCategory.TOILETRIES, quantity: 1, isRequired: true },
      { name: 'Travel First-Aid & Emergency Meds Kit', category: PackingCategory.MEDICINES, quantity: 1, isRequired: true, notes: 'Bandages, ORS, antiseptic, analgesics' },

      // Documents
      { name: 'Government ID Proof (Aadhaar / Passport) & Driving License', category: PackingCategory.DOCUMENTS, quantity: 1, isRequired: true },
      { name: 'Emergency Contact & Hotel Reservation Vouchers (Physical Copy)', category: PackingCategory.DOCUMENTS, quantity: 1, isRequired: false },

      // Food & Water
      { name: 'Reusable Insulated Thermal Flask / Water Bottle', category: PackingCategory.FOOD_WATER, quantity: 1, isRequired: true },
      { name: 'High-Energy Trail Mix & Protein Bars', category: PackingCategory.FOOD_WATER, quantity: Math.max(daysCount, 3), isRequired: false },
    ];

    // Add cold weather gear
    if (isCold) {
      items.push(
        { name: 'Thermal Base Layer Underwear (Top & Bottom)', category: PackingCategory.WEATHER_LAYERS, quantity: 2, isRequired: true, notes: 'Essential for sub-zero passes' },
        { name: 'Fleece Neck Gaiter & Beanie Cap', category: PackingCategory.WEATHER_LAYERS, quantity: 1, isRequired: true },
        { name: 'Moisturizing Lip Balm & Cold Cream', category: PackingCategory.TOILETRIES, quantity: 1, isRequired: true }
      );
    }

    // Add motorcycle specific riding gear
    if (isMotorcycle) {
      items.push(
        { name: 'ECE 22.06 / DOT Certified Full-Face Helmet', category: PackingCategory.MOTORCYCLE_GEAR, quantity: 1, isRequired: true, notes: 'Inspect visor and strap' },
        { name: 'Armored All-Weather Riding Jacket (CE Level 2)', category: PackingCategory.MOTORCYCLE_GEAR, quantity: 1, isRequired: true },
        { name: 'Abrasion-Resistant Riding Pants with Knee Protectors', category: PackingCategory.MOTORCYCLE_GEAR, quantity: 1, isRequired: true },
        { name: 'Gauntlet Riding Gloves + Rain Overgloves', category: PackingCategory.MOTORCYCLE_GEAR, quantity: 2, isRequired: true },
        { name: 'Ankle-Protection Waterproof Riding Boots', category: PackingCategory.MOTORCYCLE_GEAR, quantity: 1, isRequired: true },
        { name: 'Tubeless Tyre Puncture Kit & Electric Air Pump', category: PackingCategory.MISCELLANEOUS, quantity: 1, isRequired: true, notes: 'Essential roadside backup' },
        { name: 'Chain Lube Spray (100ml compact can)', category: PackingCategory.MISCELLANEOUS, quantity: 1, isRequired: true }
      );
    }

    // Include destination-specific items
    if (profile?.packingHighlights) {
      for (const highlight of profile.packingHighlights) {
        if (!items.some((i) => i.name.toLowerCase().includes(highlight.toLowerCase()))) {
          items.push({
            name: highlight,
            category: PackingCategory.MISCELLANEOUS,
            quantity: 1,
            isRequired: false,
            notes: `Special recommendation for ${destination}`,
          });
        }
      }
    }

    return {
      title: `${destination} AI Smart Packing Checklist`,
      summary: `Tailored checklist of ${items.length} gear and clothing essentials optimized for a ${daysCount}-day ${tripType.toLowerCase().replace(/_/g, ' ')} in ${destination}.`,
      items,
    };
  }

  /**
   * Apply AI generated packing items into the trip's packing checklist
   */
  async applyPackingToTrip(tripId: string, items: ApplyAIPackingInput['items']) {
    const trip = await prisma.trip.findUnique({
      where: { id: tripId },
      include: { packingLists: true },
    });

    if (!trip) {
      throw AppError.notFound('Trip not found');
    }

    // Find or create primary packing list
    let list = trip.packingLists[0];
    if (!list) {
      list = await prisma.packingList.create({
        data: {
          tripId,
          userId: trip.ownerId,
          name: `${trip.name} Essentials`,
          description: 'AI-generated packing checklist',
        },
      });
    }

    // Batch insert items
    const createdItems = await Promise.all(
      items.map((item) =>
        prisma.packingItem.create({
          data: {
            listId: list.id,
            name: item.name,
            category: item.category,
            quantity: item.quantity,
            isRequired: item.isRequired,
            notes: item.notes || null,
          },
        })
      )
    );

    return {
      listId: list.id,
      addedItemsCount: createdItems.length,
      message: `Successfully added ${createdItems.length} items to your packing list.`,
    };
  }

  /**
   * Conversational Travel Copilot with trip-awareness
   */
  async chatCopilot(input: ChatCopilotInput): Promise<AIChatResponse> {
    const { message, tripContext } = input;
    const destination = tripContext?.destination || 'your destination';

    // 1. Try Google Gemini Generative AI if API key is provided
    if (env.GEMINI_API_KEY) {
      const prompt = `You are Waylo AI Travel Copilot, an enthusiastic, knowledgeable, and road-tested travel companion and expedition guide.
Trip Context:
- Destination: ${destination}
- Trip Type / Transport: ${tripContext?.tripType || 'Road Trip'}
- Duration: ${tripContext?.daysCount || 'Multi-day'} days
- Start Location: ${tripContext?.startLocation || 'Not specified'}

User says: "${message}"

Respond with:
1. An engaging, helpful, practical markdown response (2-3 concise paragraphs with bullet points or tips where relevant).
2. Exactly 3-4 short, punchy follow-up questions or actions the user might want to take next.

Return ONLY a JSON object:
{
  "message": "Your markdown response here",
  "suggestions": ["Short suggestion 1", "Short suggestion 2", "Short suggestion 3"]
}`;

      const aiChat = await this.callGemini(prompt, true);
      if (aiChat && aiChat.message) {
        return {
          message: aiChat.message,
          suggestions: Array.isArray(aiChat.suggestions) ? aiChat.suggestions : [],
        };
      }
    }

    // 2. Fallback to contextual heuristic intent engine
    const lower = message.toLowerCase();
    const profile = findDestinationProfile(destination);

    // Contextual responses based on intent
    if (lower.includes('weather') || lower.includes('rain') || lower.includes('temperature') || lower.includes('climate')) {
      return {
        message: profile
          ? `For **${destination}**, the weather usually offers pleasant cruising conditions, but morning mist and sudden temperature dips on mountain passes or coastal humidity can happen. Always keep your rain poncho or oversuit handy at the top of your bag!`
          : `For **${destination}**, plan for mixed conditions en-route. Check the Route & Weather tab for real-time 5-day forecasts and wind advisories before hitting the road.`,
        suggestions: [
          'What gear should I pack?',
          'Recommend a good lunch stop',
          'Check my trip budget progress',
        ],
      };
    }

    if (lower.includes('food') || lower.includes('eat') || lower.includes('lunch') || lower.includes('dinner') || lower.includes('restaurant')) {
      const diningRec = profile?.diningSpots
        ? `I highly recommend checking out **${profile.diningSpots.join('**, **')}** for an authentic local culinary experience.`
        : `Look for bustling local roadside dhabas and heritage family restaurants near ${destination} with high traveler reviews.`;

      return {
        message: `${diningRec} Make sure to stay well-hydrated throughout your journey!`,
        suggestions: [
          'What are the best sunset viewpoints?',
          'Are there any riding safety hazards?',
          'Give me a 3-day itinerary overview',
        ],
      };
    }

    if (lower.includes('gear') || lower.includes('pack') || lower.includes('clothes') || lower.includes('helmet')) {
      const gearTips = profile?.packingHighlights
        ? `Don’t forget these essentials for **${destination}**: ${profile.packingHighlights.join(', ')}.`
        : `Key gear essentials: Full-face helmet, armored riding jacket/rain layer, 20,000mAh power bank, first-aid kit, and offline GPS maps.`;

      return {
        message: `${gearTips} You can also tap **"AI Packing Suggestions"** in your Packing tab to auto-generate a full checklist!`,
        suggestions: [
          'Suggest scenic stops along the way',
          'How should we split group expenses?',
          'What time should we leave in the morning?',
        ],
      };
    }

    if (lower.includes('budget') || lower.includes('cost') || lower.includes('expense') || lower.includes('money')) {
      return {
        message: `For a trip to **${destination}**, aim for a balanced split: ~40% accommodations, 25% fuel/transit, 20% food & dining, and 15% emergency buffer. You can log all your receipts in the **Expenses & Split** tab to track who owes whom automatically!`,
        suggestions: [
          'How does expense debt settlement work?',
          'Find budget stays near destination',
          'Give me tips to save fuel on long rides',
        ],
      };
    }

    if (lower.includes('safety') || lower.includes('ride') || lower.includes('road') || lower.includes('hazard')) {
      const pointer = profile?.drivingPointers[0] || 'Keep safe following distances, maintain optimal tyre pressures, and take a 10-minute stretch break every 100 km.';
      return {
        message: `🛡️ **Waylo Ride Safety Alert for ${destination}:** ${pointer} Always complete a quick 2-minute pre-ride inspection before rolling out!`,
        suggestions: [
          'Open pre-ride vehicle inspection',
          'What are the best scenic photo spots?',
          'How many km should we ride per day?',
        ],
      };
    }

    // Default conversational response
    return {
      message: `I'm your **Waylo AI Travel Copilot**! I can help you find hidden scenic stops in **${destination}**, forecast riding conditions, suggest packing essentials, or calculate optimal rest stops for your crew. What would you like to explore?`,
      suggestions: [
        'Recommend top 3 scenic spots in ' + destination,
        'What should I pack for this trip?',
        'What is the best time to start riding?',
        'Suggest local cuisine to try in ' + destination,
      ],
    };
  }
}

export const aiService = new AIService();
