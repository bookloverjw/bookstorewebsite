/**
 * Book data for Chapter & Verse Bookstore
 */
const BOOKS = [
  {
    id: 1,
    title: "The Midnight Library",
    author: "Matt Haig",
    genre: "fiction",
    format: "paperback",
    price: 16.99,
    rating: 4.5,
    color: "#1a5276",
    badge: "Staff Pick",
    featured: true,
    description: "Between life and death there is a library filled with books of alternate lives. When Nora Seed finds herself there, she gets to live the lives she could have lived, and discover what truly makes life worth living.",
    pages: 288,
    isbn: "978-0525559474",
    published: "2020",
    reviews: [
      { name: "Sarah M.", rating: 5, text: "A beautiful, life-affirming story that made me appreciate the choices I've made." },
      { name: "James K.", rating: 4, text: "Thought-provoking premise with a heartwarming conclusion." }
    ]
  },
  {
    id: 2,
    title: "Project Hail Mary",
    author: "Andy Weir",
    genre: "sci-fi",
    format: "hardcover",
    price: 18.99,
    rating: 4.8,
    color: "#6c3483",
    badge: "Bestseller",
    featured: true,
    description: "A lone astronaut must save Earth from an extinction-level threat. Ryland Grace wakes up on a spaceship with no memory of how he got there, and the fate of humanity rests on his shoulders.",
    pages: 496,
    isbn: "978-0593135204",
    published: "2021",
    reviews: [
      { name: "David R.", rating: 5, text: "Even better than The Martian. The friendship at the heart of this story is unforgettable." },
      { name: "Emily T.", rating: 5, text: "Couldn't put it down. Hard sci-fi with real heart." }
    ]
  },
  {
    id: 3,
    title: "Educated",
    author: "Tara Westover",
    genre: "non-fiction",
    format: "paperback",
    price: 15.99,
    rating: 4.7,
    color: "#117864",
    badge: null,
    featured: true,
    description: "A memoir of a woman who leaves her survivalist family to earn a PhD from Cambridge. Tara Westover's story of self-invention is a testament to the transformative power of education.",
    pages: 334,
    isbn: "978-0399590504",
    published: "2018",
    reviews: [
      { name: "Michelle P.", rating: 5, text: "Absolutely gripping. One of the most powerful memoirs I've ever read." },
      { name: "Tom W.", rating: 4, text: "Hard to believe this is a true story. Incredibly compelling." }
    ]
  },
  {
    id: 4,
    title: "The Silent Patient",
    author: "Alex Michaelides",
    genre: "mystery",
    format: "paperback",
    price: 14.99,
    rating: 4.3,
    color: "#922b21",
    badge: "Staff Pick",
    featured: true,
    description: "Alicia Berenson shoots her husband five times and then never speaks again. Criminal psychotherapist Theo Faber is determined to unravel the mystery of her silence.",
    pages: 325,
    isbn: "978-1250301697",
    published: "2019",
    reviews: [
      { name: "Lisa C.", rating: 5, text: "The twist at the end completely floored me. A masterful thriller." },
      { name: "Robert H.", rating: 4, text: "Atmospheric and gripping from the very first page." }
    ]
  },
  {
    id: 5,
    title: "Dune",
    author: "Frank Herbert",
    genre: "sci-fi",
    format: "hardcover",
    price: 17.99,
    rating: 4.6,
    color: "#b7950b",
    badge: "Classic",
    featured: false,
    description: "The sweeping tale of a desert planet called Arrakis, the focus of an ideological struggle that spans the cosmos. A young boy, Paul Atreides, is destined to rule it all.",
    pages: 688,
    isbn: "978-0441172719",
    published: "1965",
    reviews: [
      { name: "Alex J.", rating: 5, text: "The greatest science fiction novel ever written. Period." },
      { name: "Rachel F.", rating: 4, text: "Dense but rewarding. The world-building is unparalleled." }
    ]
  },
  {
    id: 6,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "classic",
    format: "paperback",
    price: 9.99,
    rating: 4.7,
    color: "#c0392b",
    badge: null,
    featured: false,
    description: "The classic story of Elizabeth Bennet and Mr. Darcy. Austen's witty commentary on class, marriage, and morality remains as sharp and entertaining as ever.",
    pages: 279,
    isbn: "978-0141439518",
    published: "1813",
    reviews: [
      { name: "Anna B.", rating: 5, text: "Timeless. Every re-read reveals something new." },
      { name: "Chris D.", rating: 5, text: "Austen's humor is criminally underappreciated." }
    ]
  },
  {
    id: 7,
    title: "Atomic Habits",
    author: "James Clear",
    genre: "non-fiction",
    format: "hardcover",
    price: 16.49,
    rating: 4.8,
    color: "#2e86c1",
    badge: "Bestseller",
    featured: false,
    description: "Tiny changes, remarkable results. James Clear reveals a proven system for building good habits and breaking bad ones, backed by science and real-world examples.",
    pages: 320,
    isbn: "978-0735211292",
    published: "2018",
    reviews: [
      { name: "Karen L.", rating: 5, text: "Actually changed my daily routine. Practical and actionable." },
      { name: "Brian S.", rating: 4, text: "The 1% improvement philosophy is powerful and simple." }
    ]
  },
  {
    id: 8,
    title: "The Girl with the Dragon Tattoo",
    author: "Stieg Larsson",
    genre: "mystery",
    format: "paperback",
    price: 13.99,
    rating: 4.4,
    color: "#1c2833",
    badge: null,
    featured: false,
    description: "A journalist and a brilliant hacker investigate a decades-old disappearance from a wealthy Swedish family. A dark, twisting thriller that keeps you guessing.",
    pages: 465,
    isbn: "978-0307454546",
    published: "2005",
    reviews: [
      { name: "Peter N.", rating: 5, text: "Lisbeth Salander is one of the most compelling characters in modern fiction." },
      { name: "Diana M.", rating: 4, text: "Slow start but absolutely riveting once it picks up." }
    ]
  },
  {
    id: 9,
    title: "1984",
    author: "George Orwell",
    genre: "classic",
    format: "paperback",
    price: 11.99,
    rating: 4.7,
    color: "#7d3c98",
    badge: "Classic",
    featured: false,
    description: "Big Brother is watching in this dystopian masterpiece. Winston Smith's struggle for truth and freedom in a totalitarian society remains chillingly relevant.",
    pages: 328,
    isbn: "978-0451524935",
    published: "1949",
    reviews: [
      { name: "Mark T.", rating: 5, text: "More relevant today than ever. Essential reading." },
      { name: "Sophie G.", rating: 5, text: "Haunting and unforgettable. Changed how I think about language and power." }
    ]
  },
  {
    id: 10,
    title: "Where the Crawdads Sing",
    author: "Delia Owens",
    genre: "fiction",
    format: "hardcover",
    price: 15.49,
    rating: 4.5,
    color: "#196f3d",
    badge: null,
    featured: false,
    description: "A coming-of-age story set in the marshlands of North Carolina. Kya Clark, the 'Marsh Girl,' grows up wild and alone, until a murder mystery draws her into the spotlight.",
    pages: 368,
    isbn: "978-0735219106",
    published: "2018",
    reviews: [
      { name: "Nancy R.", rating: 5, text: "Beautiful prose and a mystery that keeps you turning pages." },
      { name: "Greg H.", rating: 4, text: "The nature writing alone makes this worth reading." }
    ]
  },
  {
    id: 11,
    title: "The Martian",
    author: "Andy Weir",
    genre: "sci-fi",
    format: "paperback",
    price: 14.99,
    rating: 4.7,
    color: "#e74c3c",
    badge: null,
    featured: false,
    description: "An astronaut must survive alone on Mars after being left behind by his crew. Armed with wit, ingenuity, and a lot of potatoes, Mark Watney refuses to give up.",
    pages: 369,
    isbn: "978-0553418026",
    published: "2014",
    reviews: [
      { name: "Jake P.", rating: 5, text: "Hilarious and gripping. Science has never been this fun." },
      { name: "Maria V.", rating: 5, text: "I learned more about botany from this novel than from school." }
    ]
  },
  {
    id: 12,
    title: "Sapiens",
    author: "Yuval Noah Harari",
    genre: "non-fiction",
    format: "hardcover",
    price: 18.49,
    rating: 4.6,
    color: "#d68910",
    badge: "Staff Pick",
    featured: false,
    description: "A brief history of humankind from the Stone Age to the present. Harari weaves biology, anthropology, and economics into a sweeping narrative of our species.",
    pages: 443,
    isbn: "978-0062316097",
    published: "2015",
    reviews: [
      { name: "Steve L.", rating: 5, text: "Completely reshaped how I see human civilization." },
      { name: "Amy W.", rating: 4, text: "Ambitious and thought-provoking, even where I disagreed." }
    ]
  },
  {
    id: 13,
    title: "And Then There Were None",
    author: "Agatha Christie",
    genre: "mystery",
    format: "paperback",
    price: 10.99,
    rating: 4.6,
    color: "#283747",
    badge: "Classic",
    featured: false,
    description: "Ten strangers are lured to a remote island off the Devon coast. One by one, they begin to die according to a sinister nursery rhyme. The queen of mystery at her best.",
    pages: 272,
    isbn: "978-0062073488",
    published: "1939",
    reviews: [
      { name: "Helen K.", rating: 5, text: "The original locked-room mystery. Still the best after all these years." },
      { name: "Daniel J.", rating: 5, text: "Christie's plotting is absolutely flawless here." }
    ]
  },
  {
    id: 14,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "classic",
    format: "paperback",
    price: 9.49,
    rating: 4.4,
    color: "#1e8449",
    badge: null,
    featured: false,
    description: "The story of the mysteriously wealthy Jay Gatsby and his obsession with the beautiful Daisy Buchanan. A portrait of the American Dream in all its glory and tragedy.",
    pages: 180,
    isbn: "978-0743273565",
    published: "1925",
    reviews: [
      { name: "Oliver Q.", rating: 5, text: "Fitzgerald's prose is pure poetry. Every sentence is perfect." },
      { name: "Megan S.", rating: 4, text: "Short but devastatingly powerful." }
    ]
  },
  {
    id: 15,
    title: "Klara and the Sun",
    author: "Kazuo Ishiguro",
    genre: "fiction",
    format: "hardcover",
    price: 17.49,
    rating: 4.3,
    color: "#f39c12",
    badge: null,
    featured: false,
    description: "An Artificial Friend named Klara observes the world from a store window, waiting to be chosen by a customer. A haunting meditation on love, consciousness, and what it means to be human.",
    pages: 303,
    isbn: "978-0593318171",
    published: "2021",
    reviews: [
      { name: "Claire E.", rating: 5, text: "Ishiguro does it again. Quietly devastating." },
      { name: "Ryan A.", rating: 4, text: "A unique perspective on AI that feels more human than most human stories." }
    ]
  },
  {
    id: 16,
    title: "The Hitchhiker's Guide to the Galaxy",
    author: "Douglas Adams",
    genre: "sci-fi",
    format: "paperback",
    price: 12.99,
    rating: 4.6,
    color: "#2980b9",
    badge: null,
    featured: false,
    description: "Seconds before Earth is demolished to make way for a galactic freeway, Arthur Dent is whisked off the planet by his friend Ford Prefect. The answer to life, the universe, and everything is 42.",
    pages: 193,
    isbn: "978-0345391803",
    published: "1979",
    reviews: [
      { name: "Ben F.", rating: 5, text: "The funniest book ever written. Don't panic." },
      { name: "Kate Y.", rating: 5, text: "Pure genius. Adams' wit is unmatched in any genre." }
    ]
  }
];
