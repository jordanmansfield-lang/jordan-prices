// The starting content for the site. Once you save anything in /admin,
// the saved version (stored in Cloudflare KV) is used instead of this.
export const DEFAULT_CONTENT = {
  // The part of each photo (by photo id) to keep in frame when it's cropped
  // to a different aspect ratio. x/y are percentages; 50/50 is centered.
  imageFocus: {
    "sunset-dunes": { x: 62, y: 40 },
    jordan: { x: 35, y: 50 }
  },
  site: {
    name: "Jordan Mansfield",
    pageTitle: "Jordan Mansfield Weddings",
    metaDescription: "Natural, authentic wedding photography and film by Jordan Mansfield, based in Horsham, West Sussex. Packages, prices and enquiries.",
    favicon: false,
    footerLeft: "Jordan Mansfield Weddings · Horsham, West Sussex",
    footerRight: "Prices for 2027 – 2028 weddings"
  },
  hero: {
    title: "Jordan Mansfield",
    subtitle: "Natural and authentic, emotion-filled photography & video",
    year: "Brochure 2027 – 2028",
    image: "sunset-dunes",
    alt: "A couple holding hands, silhouetted against an orange sunset on the dunes"
  },
  about: {
    eyebrow: "About me",
    heading: "Hello, I’m Jordan",
    paragraphs: [
      "One of my earliest memories was watching my dad develop film in the darkroom he built out the back of our old house. I remember seeing the images slowly appear on the paper out of nowhere. It was like magic, and I was hooked.",
      "He was a photographer his whole life, and I grew up in a house with camera equipment in every room. I used to toddle along to weddings with him when I was young, enthralled watching people enjoy the happiest day of their lives.",
      "I went on to study Fashion Photography at the London College of Fashion, then spent 10 years as a full-time editorial and commercial photographer at Getty Images.",
      "My favourite thing is meeting new people. Every one of us has our own story, and my aim is to tell the story of you through pictures. I’m a husband to my gorgeous wife Siobhan and dad to our two daughters, Bonnie and Maisie. In my spare time I ride my bike and have as much fun as possible with my girls."
    ],
    image: "jordan",
    alt: "Jordan laughing as his daughter covers his eyes with her hands",
    caption: "Me, and one of my two favourite people to photograph."
  },
  facts: [
    { big: "2008", small: "Covering weddings since" },
    { big: "10 yrs", small: "Editorial & commercial photographer at Getty Images" },
    { big: "72 hrs", small: "Photo previews delivered within" },
    { big: "Horsham", small: "West Sussex based, travelling across the UK & worldwide" }
  ],
  style: {
    eyebrow: "What I do & my style",
    quote: "My approach is not to be a wedding photographer, but a guest who has a camera.",
    quoteNote: "Visual storyteller · stills & film",
    paragraphs: [
      "I’m both a stills photographer and a videographer, and I love capturing weddings in both. Since 2008 I’ve learnt how to capture all the tiny special moments intimately and discreetly.",
      "I try to capture your day in the most beautiful and natural way possible: the real, spontaneous reactions and emotions of the people around you, and everything that makes your relationship unique. That authenticity is what you’ll want to remember in the months and years to come.",
      "My hope is that you won’t notice me while you’re wrapped up in the emotion of the day, but that I’m right there when you want me to be, and front and centre when I need to be."
    ]
  },
  packagesIntro: { eyebrow: "Packages" },
  packages: [
    {
      chapterTitle: "Photography", chapterPrice: "from £2600",
      name: "Photography", lede: "",
      items: ["10 hours coverage", "Prep to party & everything in-between", "Pre-wedding planning call", "800+ beautifully edited images", "Previews within 72 hours", "Beautiful personal online gallery"],
      price: 2600, priceIsFrom: false, includesFilm: false,
      builderNote: "800+ images, previews in 72 hours",
      image: "confetti", alt: "Bride and groom laughing through a shower of confetti on the steps of a country house",
      panelPosition: "top left",
      linkText: "See a sample gallery", linkUrl: "https://galleries.jordanmansfieldweddings.com/emilyandalex/"
    },
    {
      chapterTitle: "Video", chapterPrice: "from £2600",
      name: "Wedding Film", lede: "",
      items: ["10 hours coverage", "Prep to party & everything in-between", "Pre-wedding planning call", "1-minute teaser trailer", "15-minute full wedding film"],
      price: 2600, priceIsFrom: false, includesFilm: true,
      builderNote: "Teaser + 15-minute full film",
      image: "sparklers", alt: "A couple walking through a tunnel of guests holding sparklers at night",
      panelPosition: "bottom right",
      linkText: "Watch sample films", linkUrl: "https://www.jordanmansfieldweddings.com/video/"
    },
    {
      chapterTitle: "Photography + Video", chapterPrice: "from £3200",
      name: "Hybrid Photo & Video", lede: "For couples who want a relaxed mix of photos and some video.",
      items: ["10 hours coverage", "Pre-wedding planning call", "Previews within 72 hours", "400+ beautifully edited images", "1-minute teaser trailer", "3–5 minute highlights film", "Beautiful personal online gallery"],
      price: 3200, priceIsFrom: true, includesFilm: true,
      builderNote: "400+ images + 3–5 minute highlights",
      image: "flash-spin", alt: "Black and white flash photo of a groom spinning his bride, both in heart-shaped sunglasses",
      panelPosition: "bottom left",
      linkText: "", linkUrl: ""
    },
    {
      chapterTitle: "", chapterPrice: "",
      name: "Photography & Videography", lede: "Photography by Ben Hoskins alongside wedding films by me.",
      items: ["10 hours coverage", "Prep to party & everything in-between", "Pre-wedding planning call", "Previews within 72 hours", "800+ beautifully edited images", "1-minute teaser trailer", "15-minute full wedding film", "Beautiful personal online gallery"],
      price: 5000, priceIsFrom: false, includesFilm: true,
      builderNote: "Ben on photos, me on film",
      image: "flower-arch", alt: "A couple kissing between tall white rose arrangements at an outdoor ceremony",
      panelPosition: "top right",
      linkText: "More about Ben & me", linkUrl: "https://www.jordanmansfieldweddings.com/photo-and-video"
    }
  ],
  extras: {
    eyebrow: "Add to your day",
    heading: "Extras",
    filmHeading: "Film extras",
    filmNote: "Available with any package that includes film.",
    filmExtras: [
      { name: "Full ceremony", price: 195 },
      { name: "Full speeches", price: 195 },
      { name: "Documentary edit", price: 295 },
      { name: "Raw footage", price: 395 }
    ],
    addOns: [
      { heading: "2nd photographer", name: "Second photographer", price: 450, priceIsFrom: true,
        text: "As much as I’d like to be, I can’t be in two places at once. To make sure nothing about your wedding is missed, second photographers are available for all photo & video packages on request." },
      { heading: "Engagement shoot", name: "Engagement shoot", price: 450, priceIsFrom: true,
        text: "Celebrate your engagement with some beautiful, natural photos of the two of you ahead of the big day." }
    ],
    drone: {
      eyebrow: "Included", title: "Drone",
      text: "Drone photography and videography is included in all my packages wherever flight restrictions allow. It’s the best way to get everyone in one frame.",
      builderLine: "Drone (where flight rules allow)",
      image: "drone-group", alt: "Aerial drone photo of a full wedding party waving in a flint courtyard"
    }
  },
  builder: {
    eyebrow: "Your quote",
    heading: "Build your day",
    intro: "Choose a package and any extras to see an estimated total, then send it to me and I’ll come back to you with availability.",
    fromNote: "Items marked “from” are a starting price. I’ll confirm your exact quote after our planning call.",
    thanksHeading: "Thank you, that’s on its way to me",
    thanksText: "I’ve emailed you a copy of your selection too. I’ll be in touch very soon, usually within a day or two."
  },
  films: {
    eyebrow: "Moving pictures",
    heading: "Films",
    intro: "Every film package starts with a 1-minute teaser trailer, often ready within 48 hours of your wedding.",
    items: [
      { title: "Wedding films", note: "Watch my latest films", url: "https://www.jordanmansfieldweddings.com/video/", image: "sparklers" },
      { title: "Photo + video", note: "Ben & me, together", url: "https://www.jordanmansfieldweddings.com/photo-and-video", image: "golden-kiss" }
    ]
  },
  gallery: {
    eyebrow: "Recent weddings",
    heading: "Gallery",
    photos: [
      { image: "golden-kiss", alt: "A couple kissing in golden backlight" },
      { image: "bride-mirror", alt: "A bride looking down beside a mirror" },
      { image: "boat", alt: "A couple kissing in a rowing boat decorated with flowers" },
      { image: "ceremony-applause", alt: "Guests applauding as a couple embrace at the ceremony" },
      { image: "castle-walk", alt: "A couple walking past cypress trees beside a stone house" },
      { image: "field-sun", alt: "A couple embracing in a sunlit meadow" },
      { image: "garden-walk", alt: "A couple walking hand in hand on a gravel drive" },
      { image: "bride-garden", alt: "A bride with a long veil in a cottage garden" },
      { image: "piggyback", alt: "A groom giving his bride a piggyback through long grass" },
      { image: "stationery", alt: "Wedding stationery with pearl jewellery and ribbon" },
      { image: "flower-arch-tall", alt: "A couple kissing at a flower-framed outdoor ceremony" },
      { image: "groomsmen", alt: "Groomsmen in black tie walking across a lawn" },
      { image: "sunset-dunes", alt: "A couple silhouetted on the dunes at sunset" },
      { image: "silhouette-sepia", alt: "A couple silhouetted against the setting sun" }
    ]
  },
  testimonials: {
    eyebrow: "From my couples",
    heading: "Kind words",
    items: [
      { names: "Emily + Alex", image: "", alt: "", paragraphs: ["Jordan is THE BEST. As soon as I saw Jordan’s work, there was only ever one person I wanted as our wedding photographer. He is incredibly talented and we could not be happier with our photos of the day.", "Jordan is funny, kind and will blend in seamlessly to your day. He is a dream to work with. He also turned our photos round very quickly, and years later we still have easy access to every photo.", "Anyone considering Jordan as their wedding photographer will have zero regrets in booking him!"] },
      { names: "Hollie + Jack", image: "", alt: "", paragraphs: ["If you’re newly engaged, you need Jordan Mansfield & Ben Hoskins. Jordan and Ben are exceptional, both as artists and as people. It honestly felt like having two extra best friends beside us, sharing in every moment with the same excitement we felt.", "Their direction during our portraits felt so natural and full of fun, and you can truly see that joy in our photos! We received our teaser trailer and photo previews within 48 hours, and we were blown away.", "Booking them was the best decision we ever made."] },
      { names: "Sam + Wayne", image: "", alt: "", paragraphs: ["Thank you SO much for the photos! WOW! When we first viewed them we were speechless, they are beautiful and everything we wanted them to be.", "Thank you for being the BEST photographer and making us feel so at ease whilst you took our pictures. Everyone has been so complimentary of your pictures and we are so glad we chose you for our special day."] },
      { names: "Charlotte + Danny", image: "", alt: "", paragraphs: ["Photography was really important to us. We wanted all of those candid moments captured from morning until night and what we received was beyond what we could have ever asked for.", "Jordan blended in with our guests, organised the bridal and groom parties and made everyone feel at ease in front of the camera. He captured so many moments we weren’t there to see. He is a wedding must have!"] },
      { names: "Ellie + Reece", image: "", alt: "", paragraphs: ["Jordan was incredible and is the best! From the very beginning, he made us feel comfortable and relaxed and nothing ever felt staged or forced.", "Jordan blended in seamlessly, yet somehow managed to capture so many special moments. We got our sneak peeks within 48 hours and are so pleased with how they’ve come out."] },
      { names: "Charlotte + Philip", image: "", alt: "", paragraphs: ["Jordan and Ben were the absolute dream team. After meeting Jordan at a wedding fayre I instantly fell in love with his style of work and knew I wanted to use him.", "The guys were such a laugh on the day and put up with a very bossy bride, putting everyone at ease and making it super fun throughout. You would be mad not to hire these guys!"] },
      { names: "Belle + Harry", image: "", alt: "", paragraphs: ["Jordan WOW, what a day! Like reliving the day all over again, thank you so so much! Thank you for fitting in so seamlessly. Everyone was convinced you were our mate beforehand! We had an amazing day and you’ve captured it PERFECTLY!"] },
      { names: "Sophie + Adam", image: "", alt: "", paragraphs: ["It is incredible, it’s beyond beautiful and safe to say I think I’ve watched it about 20 times already today! I can’t wait to see the service and speeches videos too.", "We knew you were good but WOW, you both captured our day so beautifully and we couldn’t have asked for a better duo. We felt like you were old friends we’ve had for years."] },
      { names: "Rebecca + Harry", image: "", alt: "", paragraphs: ["We just wanted to say a HUGE thank you for your incredible service at our wedding. You created the most amazing atmosphere and made my vision come to life.", "Everyone’s reaction to our video has been quite literally, WOW! Your professionalism and guidance on the day was so greatly appreciated."] },
      { names: "Lucy + Frank", image: "", alt: "", paragraphs: ["The best of the best! Jordan was the most fantastic photographer for our wedding from start to finish. He spoke to us about what we wanted, and made sure he fit in all those photos as well as all the lovely different style ones, which is why we chose him in the first place.", "He also sent us a little box with a personalised memory card for all the photos from our special day."] },
      { names: "Megan + Ben", image: "", alt: "", paragraphs: ["As soon as I met Jordan I felt as though he was a friend. He is so kind, sweet and helpful, and so incredibly good at getting everyone for the photos and making everyone smile!", "Receiving a sneak peek gallery of our images only 24 hours later was amazing. The wedding day goes by so fast but the photos will last a lifetime and I will be forever grateful we chose Jordan!"] }
    ]
  },
  contact: {
    eyebrow: "Let’s talk",
    heading: "Tell me about your wedding",
    text: "To find out more, talk to me about your wedding, or just to say hi, email me at",
    email: "hello@jordanmansfieldweddings.com",
    instagram: "https://www.instagram.com/jordanmansfieldweddings/",
    website: "https://www.jordanmansfieldweddings.com/",
    image: "silhouette-sepia"
  },
  emails: {
    coupleSubject: "Your wedding enquiry with Jordan Mansfield",
    coupleIntro: "Thank you so much for getting in touch! Here’s a copy of what you sent me. I’ll come back to you very soon, usually within a day or two, with my availability.",
    coupleSignoff: "Speak soon,\nJordan",
    jordanSubject: "New enquiry from the prices page"
  }
};
