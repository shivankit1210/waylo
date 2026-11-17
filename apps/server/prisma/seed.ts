import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  const passwordHash = await bcrypt.hash('Demo@1234', 10);

  // 1. Create or update Demo User
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@waylo.app' },
    update: {
      passwordHash,
      displayName: 'Demo Traveler',
      timezone: 'Asia/Kolkata',
      preferredCurrency: 'INR',
      bio: 'Passionate road tripper, motorcycle enthusiast, and photographer.',
      interests: ['Motorcycling', 'Photography', 'Road Trips', 'Camping'],
      dietaryPreferences: ['Vegetarian'],
    },
    create: {
      email: 'demo@waylo.app',
      passwordHash,
      displayName: 'Demo Traveler',
      timezone: 'Asia/Kolkata',
      preferredCurrency: 'INR',
      bio: 'Passionate road tripper, motorcycle enthusiast, and photographer.',
      interests: ['Motorcycling', 'Photography', 'Road Trips', 'Camping'],
      dietaryPreferences: ['Vegetarian'],
    },
  });

  console.log(`👤 Demo user created/updated: ${demoUser.email} (ID: ${demoUser.id})`);

  // 2. Check for existing trips for demo user to keep seed idempotent
  const existingTrips = await prisma.trip.findMany({
    where: { ownerId: demoUser.id },
  });

  if (existingTrips.length === 0) {
    const twoWeeksFromNow = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    const threeWeeksFromNow = new Date(Date.now() + 20 * 24 * 60 * 60 * 1000);

    // Trip 1: PLANNED
    const trip1 = await prisma.trip.create({
      data: {
        name: 'Goa Coastal Cruise',
        description:
          'An epic coastal ride from Mumbai along the Konkan belt down to North Goa, exploring sea forts, beaches, and local cuisine.',
        coverImageUrl:
          'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
        status: 'PLANNED',
        tripType: 'MOTORCYCLE',
        transportModes: ['MOTORCYCLE'],
        startDate: twoWeeksFromNow,
        endDate: threeWeeksFromNow,
        startLocation: 'Mumbai, Maharashtra',
        destination: 'Goa, India',
        returnLocation: 'Mumbai, Maharashtra',
        currency: 'INR',
        estimatedBudget: 2500000, // 25,000 INR in paise
        visibility: 'PRIVATE',
        tags: ['coastal', 'roadtrip', 'riding', 'monsoon'],
        ownerId: demoUser.id,
        members: {
          create: {
            userId: demoUser.id,
            role: 'OWNER',
          },
        },
      },
    });

    console.log(`🗺️ Created sample trip (PLANNED): ${trip1.name} (ID: ${trip1.id})`);

    const twoMonthsFromNow = new Date(Date.now() + 60 * 24 * 60 * 60 * 1000);
    const seventyFourDays = new Date(Date.now() + 74 * 24 * 60 * 60 * 1000);

    // Trip 2: DRAFT
    const trip2 = await prisma.trip.create({
      data: {
        name: 'Himalayan High Altitude Expedition',
        description:
          'Bucket-list road trip traversing the high passes: Rohtang, Baralacha La, Khardung La, and camping under the stars at Pangong Tso.',
        coverImageUrl:
          'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
        status: 'DRAFT',
        tripType: 'MULTI_VEHICLE',
        transportModes: ['MOTORCYCLE', 'CAR'],
        startDate: twoMonthsFromNow,
        endDate: seventyFourDays,
        startLocation: 'Manali, Himachal Pradesh',
        destination: 'Leh Ladakh',
        returnLocation: 'Srinagar, Jammu & Kashmir',
        currency: 'INR',
        estimatedBudget: 7500000, // 75,000 INR in paise
        visibility: 'PRIVATE',
        tags: ['mountains', 'adventure', 'ladakh', 'himalayas'],
        ownerId: demoUser.id,
        members: {
          create: {
            userId: demoUser.id,
            role: 'OWNER',
          },
        },
      },
    });

    console.log(`🗺️ Created sample trip (DRAFT): ${trip2.name} (ID: ${trip2.id})`);
  }

  // 3. Seed sample itinerary days & stops for existing or created trips
  const allTrips = await prisma.trip.findMany({
    where: { ownerId: demoUser.id },
  });

  for (const trip of allTrips) {
    const existingDays = await prisma.itineraryDay.findMany({
      where: { tripId: trip.id },
    });

    if (existingDays.length === 0) {
      console.log(`📅 Seeding sample itinerary days for trip: ${trip.name}...`);

      const day1 = await prisma.itineraryDay.create({
        data: {
          tripId: trip.id,
          dayNumber: 1,
          date: trip.startDate ? new Date(trip.startDate) : new Date(),
          title: `Departure from ${trip.startLocation || 'Base'}`,
          startLocation: trip.startLocation || 'Mumbai Base',
          endLocation: 'Chiplun Valley',
          plannedDeparture: '06:00',
          plannedArrival: '16:00',
          plannedDistanceKm: 240,
          notes: 'Early morning start to beat the city traffic. Scenic NH66 highway route.',
          items: {
            create: [
              {
                title: 'Morning Convoy Briefing & Gear Check',
                description: 'Tyre pressure check, helmet intercom pairing, luggage strapping.',
                itemType: 'ACTIVITY',
                orderIndex: 0,
                startTime: '06:00',
                endTime: '06:30',
                location: 'Highway Plaza',
                flexibility: 'FIXED',
                isCompleted: true,
                isOptional: false,
                notes: 'Check fuel and emergency kits.',
              },
              {
                title: 'Kashedi Ghat Scenic Viewpoint',
                description: 'Famous mountain pass curves with panoramic valley overlook.',
                itemType: 'SIGHTSEEING',
                orderIndex: 1,
                startTime: '10:00',
                endTime: '10:45',
                location: 'Kashedi Ghat',
                flexibility: 'FLEXIBLE',
                isCompleted: true,
                isOptional: false,
              },
              {
                title: 'Traditional Konkani Lunch & Refill',
                description: 'Authentic coastal thali and fuel top-up at HP petrol pump.',
                itemType: 'MEAL',
                orderIndex: 2,
                startTime: '13:00',
                endTime: '14:00',
                location: 'Chiplun Riverside Dhaba',
                flexibility: 'FLEXIBLE',
                isCompleted: false,
                isOptional: false,
                cost: 650,
                currency: 'INR',
              },
              {
                title: 'Overnight Riverside Resort Check-in',
                description: 'Check-in, unpack gear, relax by the river, evening group dinner.',
                itemType: 'CHECK_IN',
                orderIndex: 3,
                startTime: '16:30',
                endTime: '17:30',
                location: 'Riverside Heritage Resort',
                flexibility: 'FIXED',
                isCompleted: false,
                isOptional: false,
                cost: 3200,
                currency: 'INR',
              },
            ],
          },
        },
      });

      const day2Date = trip.startDate
        ? new Date(new Date(trip.startDate).getTime() + 86400000)
        : new Date(Date.now() + 86400000);

      await prisma.itineraryDay.create({
        data: {
          tripId: trip.id,
          dayNumber: 2,
          date: day2Date,
          title: `Coastline Cruise to ${trip.destination || 'North Goa'}`,
          startLocation: 'Chiplun Valley',
          endLocation: trip.destination || 'Vagator, Goa',
          plannedDeparture: '07:30',
          plannedArrival: '17:00',
          plannedDistanceKm: 280,
          notes: 'Scenic Konkan coastal twists. Stop at Jaigad fort and Ganpatipule beach.',
          items: {
            create: [
              {
                title: 'Ganpatipule Beach Stop & Coconut Water',
                description: 'White sand beach break and temple arch photo stop.',
                itemType: 'SIGHTSEEING',
                orderIndex: 0,
                startTime: '10:30',
                endTime: '11:30',
                location: 'Ganpatipule Beach',
                flexibility: 'FLEXIBLE',
                isCompleted: false,
                isOptional: true,
                notes: 'Optional detour depending on convoy pace.',
              },
              {
                title: 'Fuel & High-Octane Refill',
                description: 'Indian Oil COCO fuel pump on NH66.',
                itemType: 'FUEL_STOP',
                orderIndex: 1,
                startTime: '13:30',
                endTime: '14:00',
                location: 'Kankavli Highway',
                flexibility: 'FIXED',
                isCompleted: false,
                isOptional: false,
                cost: 1800,
                currency: 'INR',
              },
              {
                title: 'Sunset Arrival at North Goa Villa',
                description: 'Villa check-in, pool dip, and celebration dinner at Curlies.',
                itemType: 'CHECK_IN',
                orderIndex: 2,
                startTime: '17:00',
                endTime: '18:00',
                location: 'Vagator Beach Villa',
                flexibility: 'FIXED',
                isCompleted: false,
                isOptional: false,
                cost: 4500,
                currency: 'INR',
              },
            ],
          },
        },
      });

      console.log(`✅ Sample itinerary days created for: ${trip.name}`);
    }

    // 4. Seed sample packing list & luggage bags for trip
    const existingLists = await prisma.packingList.findMany({
      where: { tripId: trip.id },
    });

    if (existingLists.length === 0) {
      console.log(`🎒 Seeding sample packing list and bags for trip: ${trip.name}...`);

      // Create Bags
      const tankBag = await prisma.luggageBag.create({
        data: {
          tripId: trip.id,
          name: 'Magnetic Tank Bag (15L)',
          bagType: 'TANK_BAG',
          capacityLiters: 15,
          maxWeightKg: 5,
          color: 'Black / Orange',
          notes: 'Quick access items: documents, emergency tools, first-aid kit',
        },
      });

      const leftSaddle = await prisma.luggageBag.create({
        data: {
          tripId: trip.id,
          name: 'Left Waterproof Saddlebag (30L)',
          bagType: 'SADDLEBAGS',
          capacityLiters: 30,
          maxWeightKg: 12,
          color: 'Charcoal Grey',
          notes: 'Clothing, daily outfits, rainwear, and toiletries',
        },
      });

      const rightSaddle = await prisma.luggageBag.create({
        data: {
          tripId: trip.id,
          name: 'Right Waterproof Saddlebag (30L)',
          bagType: 'SADDLEBAGS',
          capacityLiters: 30,
          maxWeightKg: 12,
          color: 'Charcoal Grey',
          notes: 'Footwear, chain lube, tool roll, camping essentials',
        },
      });

      // Create Packing List
      const packingList = await prisma.packingList.create({
        data: {
          tripId: trip.id,
          name: 'Coastal Motorcycle Expedition Checklist',
          description: 'Armored safety riding layers, weather gear, toolkit roll, and beachwear.',
          isTemplate: false,
          category: 'MOTORCYCLE',
          items: {
            create: [
              {
                name: 'DOT/ECE Full-Face Helmet with Anti-Fog Visor',
                category: 'MOTORCYCLE_GEAR',
                quantity: 1,
                weightGrams: 1550,
                status: 'PACKED',
                isRequired: true,
                isShared: false,
                bagId: tankBag.id,
                notes: 'Cleaned with anti-glare shield',
              },
              {
                name: 'All-Weather Armored Riding Jacket',
                category: 'MOTORCYCLE_GEAR',
                quantity: 1,
                weightGrams: 2800,
                status: 'WORN',
                isRequired: true,
                isShared: false,
                dayNumber: 1,
                notes: 'Wearing for morning departure',
              },
              {
                name: 'Merino Wool Thermal Base Layer (Set of 2)',
                category: 'WEATHER_LAYERS',
                quantity: 2,
                weightGrams: 420,
                status: 'PACKED',
                isRequired: true,
                isShared: false,
                bagId: leftSaddle.id,
                dayNumber: 2,
              },
              {
                name: 'Tubeless Tyre Puncture Kit & Electric Inflator',
                category: 'MISCELLANEOUS',
                quantity: 1,
                weightGrams: 850,
                status: 'PACKED',
                isRequired: true,
                isShared: true,
                bagId: tankBag.id,
                notes: 'Keep in top pouch for quick roadside access',
              },
              {
                name: 'Chain Cleaner & High-Speed Lube Spray',
                category: 'MISCELLANEOUS',
                quantity: 1,
                weightGrams: 450,
                status: 'PACKED',
                isRequired: true,
                isShared: true,
                bagId: rightSaddle.id,
              },
              {
                name: 'High-Vis Waterproof Two-Piece Rain Suit',
                category: 'WEATHER_LAYERS',
                quantity: 1,
                weightGrams: 750,
                status: 'NOT_PACKED',
                isRequired: true,
                isShared: false,
                bagId: leftSaddle.id,
              },
              {
                name: 'Original Vehicle RC, Insurance & Pollution Papers',
                category: 'DOCUMENTS',
                quantity: 1,
                status: 'PACKED',
                isRequired: true,
                isShared: false,
                bagId: tankBag.id,
              },
              {
                name: 'Action Camera Extra Batteries & SD Cards',
                category: 'ELECTRONICS',
                quantity: 3,
                weightGrams: 180,
                status: 'MISSING',
                isRequired: false,
                isShared: false,
                notes: 'Need to purchase before Thursday',
              },
              {
                name: 'Compact First Aid Kit & Emergency Medicines',
                category: 'MEDICINES',
                quantity: 1,
                weightGrams: 300,
                status: 'PACKED',
                isRequired: true,
                isShared: true,
                bagId: tankBag.id,
              },
              {
                name: 'Quick-Dry Beach Swimwear & Flip Flops',
                category: 'BOTTOMS',
                quantity: 2,
                status: 'NOT_PACKED',
                isRequired: false,
                isShared: false,
                bagId: leftSaddle.id,
                dayNumber: 2,
              },
            ],
          },
        },
      });

      console.log(`✅ Sample packing list and bags created for: ${trip.name}`);
    }
  }

  // 5. Seed Vehicles, Fuel Logs, Inspections & Expenses
  const primaryTrip = allTrips[0];
  if (primaryTrip) {
    // Ensure second trip member exists for multi-party splits
    const secondUserEmail = 'rohan@waylo.app';
    let secondUser = await prisma.user.findUnique({ where: { email: secondUserEmail } });
    if (!secondUser) {
      const passwordHash = await bcrypt.hash('Demo@1234', 10);
      secondUser = await prisma.user.create({
        data: {
          email: secondUserEmail,
          passwordHash,
          displayName: 'Rohan Sharma',
          preferredCurrency: 'INR',
          bio: 'Motorcycle enthusiast and outdoor adventurer.',
        },
      });
      console.log(`👤 Created co-traveler member: ${secondUser.displayName}`);
    }

    // Add Rohan as member to primary trip if not already member
    const existingMembership = await prisma.tripMember.findUnique({
      where: {
        tripId_userId: {
          tripId: primaryTrip.id,
          userId: secondUser.id,
        },
      },
    });

    if (!existingMembership) {
      await prisma.tripMember.create({
        data: {
          tripId: primaryTrip.id,
          userId: secondUser.id,
          role: 'MEMBER',
        },
      });
      console.log(`🤝 Added ${secondUser.displayName} as member to ${primaryTrip.name}`);
    }

    // Seed vehicle
    const existingVehicle = await prisma.vehicle.findFirst({
      where: { userId: demoUser.id },
    });

    if (!existingVehicle) {
      console.log('🏍️ Seeding sample vehicle, fuel logs, and inspection checklist...');
      const vehicle = await prisma.vehicle.create({
        data: {
          userId: demoUser.id,
          tripId: primaryTrip.id,
          name: 'Royal Enfield Himalayan 450',
          type: 'MOTORCYCLE',
          make: 'Royal Enfield',
          model: 'Himalayan 450 Kaza Brown',
          year: 2024,
          registrationNumber: 'MH 02 EE 7788',
          fuelType: 'PETROL',
          tankCapacityLiters: 17,
          initialOdometer: 4200,
          currentOdometer: 4620,
          fuelLogs: {
            create: [
              {
                tripId: primaryTrip.id,
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                odometer: 4200,
                litersOrKwh: 15.2,
                cost: 160000, // 1600.00 INR
                currency: 'INR',
                isFullTank: true,
                fuelPricePerUnit: 105.26,
                stationLocation: 'HPCL Highway Plaza, Panvel NH66',
                notes: 'Full tank departure fill-up. Fresh tyre pressure 32 PSI.',
              },
              {
                tripId: primaryTrip.id,
                date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                odometer: 4620,
                litersOrKwh: 14.5,
                cost: 153000, // 1530.00 INR
                currency: 'INR',
                isFullTank: true,
                fuelPricePerUnit: 105.51,
                stationLocation: 'Indian Oil Chiplun Bypass',
                notes: 'Second tank after ghat section. Smooth ride.',
              },
            ],
          },
          inspections: {
            create: [
              {
                tripId: primaryTrip.id,
                status: 'PASSED',
                checklist: {
                  brakes: true,
                  tyreTreadPressure: true,
                  chainLubeTension: true,
                  engineOilLevel: true,
                  headlightsHornIndicators: true,
                  cablesClutchThrottle: true,
                  luggageMountsBungees: true,
                },
                notes: 'All fluids checked, chain lubed with Motul, brake pads 80% life remaining.',
                odometer: 4200,
              },
            ],
          },
        },
      });

      console.log(`✅ Sample vehicle seeded: ${vehicle.name}`);
    }

    // Seed expenses with splits
    const existingExpenses = await prisma.expense.findMany({
      where: { tripId: primaryTrip.id },
    });

    if (existingExpenses.length === 0) {
      console.log('💰 Seeding sample expenses and debt splits...');

      // Expense 1: Fuel by Demo User
      await prisma.expense.create({
        data: {
          tripId: primaryTrip.id,
          title: 'Highway Fuel Tank Fill-up',
          amount: 160000, // 1600.00 INR
          currency: 'INR',
          category: 'FUEL',
          paymentMethod: 'UPI',
          paidById: demoUser.id,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          notes: 'HPCL Highway Station tank fill-up for the convoy.',
          splitType: 'EQUAL',
          splits: {
            create: [
              { userId: demoUser.id, amount: 80000, percentage: 50, isSettled: true },
              { userId: secondUser.id, amount: 80000, percentage: 50, isSettled: false },
            ],
          },
        },
      });

      // Expense 2: Seafood Shack Dinner by Rohan
      await prisma.expense.create({
        data: {
          tripId: primaryTrip.id,
          title: 'Konkani Seafood Beach Shack Dinner',
          amount: 240000, // 2400.00 INR
          currency: 'INR',
          category: 'FOOD',
          paymentMethod: 'CARD',
          paidById: secondUser.id,
          date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          notes: 'Fresh catch fish thali and sol kadhi at seaside cafe.',
          splitType: 'EQUAL',
          splits: {
            create: [
              { userId: secondUser.id, amount: 120000, percentage: 50, isSettled: true },
              { userId: demoUser.id, amount: 120000, percentage: 50, isSettled: false },
            ],
          },
        },
      });

      // Expense 3: Heritage Fort Tickets by Demo User
      await prisma.expense.create({
        data: {
          tripId: primaryTrip.id,
          title: 'Sindhudurg Sea Fort Entry & Ferry Tickets',
          amount: 50000, // 500.00 INR
          currency: 'INR',
          category: 'ACTIVITIES',
          paymentMethod: 'UPI',
          paidById: demoUser.id,
          date: new Date(),
          notes: 'Boat transfer and conservation fee.',
          splitType: 'EQUAL',
          splits: {
            create: [
              { userId: demoUser.id, amount: 25000, percentage: 50, isSettled: true },
              { userId: secondUser.id, amount: 25000, percentage: 50, isSettled: false },
            ],
          },
        },
      });

      console.log(`✅ Sample expenses with debt splits seeded for ${primaryTrip.name}`);
    }

    // 6. Seed Accommodations & Documents Vault
    const existingAccommodations = await prisma.accommodation.findMany({
      where: { tripId: primaryTrip.id },
    });

    if (existingAccommodations.length === 0) {
      console.log('🏨 Seeding sample accommodations & stay bookings...');
      await prisma.accommodation.create({
        data: {
          tripId: primaryTrip.id,
          name: 'Morjim Sunset Beachfront Villa & Homestay',
          type: 'HOMESTAY',
          location: 'Morjim Beach Road, North Goa 403512',
          checkInDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
          checkOutDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
          checkInTime: '13:00',
          checkOutTime: '11:00',
          confirmationCode: 'MRJ-2026-VIL-99',
          totalCost: 850000, // 8500.00 INR
          currency: 'INR',
          contactPhone: '+91 98221 44556',
          contactEmail: 'stay@morjimvilla.in',
          notes: 'Includes seaside breakfast, fast WiFi, and private secure gated parking for motorbikes.',
          bookingStatus: 'CONFIRMED',
        },
      });
      console.log('✅ Sample accommodation booking seeded');
    }

    const existingDocuments = await prisma.tripDocument.findMany({
      where: { tripId: primaryTrip.id },
    });

    if (existingDocuments.length === 0) {
      console.log('📑 Seeding sample documents to trip vault...');
      await prisma.tripDocument.create({
        data: {
          tripId: primaryTrip.id,
          uploadedById: demoUser.id,
          title: 'Himalayan Comprehensive Insurance & 24/7 Roadside Assistance',
          documentType: 'INSURANCE_POLICY',
          fileName: 'Himalayan_Insurance_Policy.pdf',
          fileSize: 1450000,
          expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
          isShared: true,
          notes: 'Policy #ICICI-LOMB-778812. Toll-free RSA emergency helpline: 1800-2666.',
        },
      });

      await prisma.tripDocument.create({
        data: {
          tripId: primaryTrip.id,
          uploadedById: demoUser.id,
          title: 'Coastal Zone Tourism & Convoy Entry Permit',
          documentType: 'PERMIT',
          fileName: 'Goa_Coastal_Expedition_Permit.pdf',
          fileSize: 820000,
          isShared: true,
          notes: 'QR code verified. Keep digital copy handy at state highway toll gates.',
        },
      });
      console.log('✅ Sample travel documents seeded');
    }
  }

  console.log('✅ Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
