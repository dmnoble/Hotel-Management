import { supabaseUrl } from "../services/supabase";

const imageUrl = `${supabaseUrl}/storage/v1/object/public/cabin-images/`;

export const cabins = [
  {
    name: "001",
    maxCapacity: 2,
    regularPrice: 250,
    discount: 0,
    image: imageUrl + "chamber-001.jpg",
    description:
      "A narrow, timber-lined chamber that leans into the wind as if listening. Candles gutter in iron brackets, and the window looks out over a courtyard where the fog never quite lifts. Guests report hearing footsteps on the roof when the inn is otherwise silent.",
  },
  {
    name: "002",
    maxCapacity: 2,
    regularPrice: 350,
    discount: 25,
    image: imageUrl + "chamber-002.jpg",
    description:
      "Lanterns of tinted glass bathe this chamber in amber and violet light, masking the stains in the floorboards. A writing desk stands beneath a cracked mirror, and letters addressed to no one in particular keep appearing in its single locked drawer.",
  },
  {
    name: "003",
    maxCapacity: 4,
    regularPrice: 300,
    discount: 0,
    image: imageUrl + "chamber-003.jpg",
    description:
      "Once a family suite, now a maze of mismatched beds and inherited trunks. The fire in the hearth always seems recently stoked, even when no one has stayed here for weeks. Children who sleep in this room wake up with pockets full of dried flower petals.",
  },
  {
    name: "004",
    maxCapacity: 4,
    regularPrice: 500,
    discount: 50,
    image: imageUrl + "chamber-004.jpg",
    description:
      "Curtained alcoves and carved wood make this chamber feel almost grand, if you ignore the faint smell of rain on stone. Portraits of former proprietors line the walls; every season, another frame quietly turns to face the wall for reasons no one will admit.",
  },
  {
    name: "005",
    maxCapacity: 6,
    regularPrice: 350,
    discount: 0,
    image: imageUrl + "chamber-005.jpg",
    description:
      "A long dormitory-style room meant for travelers who swear they are not afraid of creaking beams. The ceiling bears old chalk markings, half protective sigils and half tally marks. Sometimes, guests wake up having added a line while they slept.",
  },
  {
    name: "006",
    maxCapacity: 6,
    regularPrice: 800,
    discount: 100,
    image: imageUrl + "chamber-006.jpg",
    description:
      "This grand chamber was clearly built for someone important who never arrived. Velvet curtains hang heavy and dustless; the bed is always freshly turned down. On especially cold nights, there is an impression in the mattress beside whoever is sleeping there.",
  },
  {
    name: "007",
    maxCapacity: 8,
    regularPrice: 600,
    discount: 100,
    image: imageUrl + "chamber-007.jpg",
    description:
      "A sprawling loft of staggered bunks and low beams where large parties settle in and whisper until dawn. Every group that stays here independently invents the same ghost story about a figure at the foot of the stairs—though no such stairs exist in the room.",
  },
  {
    name: "008",
    maxCapacity: 10,
    regularPrice: 1400,
    discount: 0,
    image: imageUrl + "chamber-008.jpg",
    description:
      "The inn’s largest and oldest chamber, with walls too thick for the current architecture. Multiple fireplaces sit back-to-back, sharing the same unseen chimney. When all of them are lit, every mirror in the room reflects a slightly different version of the guests.",
  },
];
