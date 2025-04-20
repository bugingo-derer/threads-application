const name = "GoalShare";

const DefaultPosts = [
  {
    postedBy: 1,
    text: `This application - ${name} is really great, it helps teenagers with talents post their achievements and goals.`,
    img: "",
    profilePic: "https://res.cloudinary.com/dizkxmaoh/image/upload/v1745143511/9_wttgmi.jpg",
    likes: [2],
    replies: [
      {
        userId: 8,
        text: "Excited to see more people join!",
        userProfilePic: "https://res.cloudinary.com/dizkxmaoh/image/upload/v1745143511/9_wttgmi.jpg",
        username: "mentorMike"
      },
      {
        userId: 1,
        text: "Excited to see more people join!",
        userProfilePic: "https://res.cloudinary.com/dizkxmaoh/image/upload/v1745143511/9_wttgmi.jpg",
        username: "mentorMike"
      },
      {
        userId: 10,
        text: "Yes, to see more people join!",
        userProfilePic: "https://res.cloudinary.com/dizkxmaoh/image/upload/v1745143511/9_wttgmi.jpg",
        username: "mentorMike"
      },
    ],
    createdAt: Date.now()
  },
  {
    postedBy: 2,
    text: "Just finished my first mural on a public wall! Art is freedom!",
    img: "https://example.com/mural.jpg",
    profilePic: "https://res.cloudinary.com/dizkxmaoh/image/upload/v1745143505/8_eabks2.jpg",
    likes: [15],
    replies: [
      {
        userId: 3,
        text: "That’s amazing! Keep going!",
        userProfilePic: "https://example.com/user3.jpg",
        username: "creativeCee"
      }
    ],
    createdAt: Date.now()
  },
  {
    postedBy: 3,
    text: "Landed my first gig as a freelance photographer 🎉",
    img: "",
    profilePic: "https://res.cloudinary.com/dizkxmaoh/image/upload/v1745143489/6_qzlzyk.jpg",
    likes: [20],
    replies: [
      {
        userId: 2,
        text: "Congrats! Share some pics!",
        userProfilePic: "https://example.com/user2.jpg",
        username: "vibeQueen"
      }
    ],
    createdAt: Date.now()
  },
  {
    postedBy: 4,
    text: "I finally ran a full 5K without stopping 😤💪",
    img: "",
    profilePic: "https://res.cloudinary.com/dizkxmaoh/image/upload/v1745143468/3_m5bdml.jpg",
    likes: [11],
    replies: [
      {
        userId: 5,
        text: "Let’s goooo 🔥",
        userProfilePic: "https://example.com/user5.jpg",
        username: "runnerRay"
      }
    ],
    createdAt: Date.now()
  },
  {
    postedBy: 5,
    text: "Composed my first original song on the guitar 🎶",
    img: "https://example.com/songcover.jpg",
    profilePic: "https://res.cloudinary.com/dizkxmaoh/image/upload/v1745143481/5_qlqgs2.jpg",
    likes: [9],
    replies: [
      {
        userId: 1,
        text: "Drop a link, I wanna hear it!",
        userProfilePic: "https://example.com/user1.jpg",
        username: "mentorMike"
      }
    ],
    createdAt: Date.now()
  },
  {
    postedBy: 6,
    text: "Started a small online business selling handmade bracelets 🧵✨",
    img: "https://example.com/bracelets.jpg",
    profilePic: "https://res.cloudinary.com/dizkxmaoh/image/upload/v1745143457/1_y4ibdf.jpg",
    likes: [18],
    replies: [
      {
        userId: 3,
        text: "Those look awesome! Do you ship internationally?",
        userProfilePic: "https://example.com/user3.jpg",
        username: "creativeCee"
      }
    ],
    createdAt: Date.now()
  },
  {
    postedBy: 7,
    text: "Got accepted into a summer coding bootcamp!",
    img: "",
    profilePic: "https://res.cloudinary.com/dizkxmaoh/image/upload/v1745143558/15_zlkoax.jpg",
    likes: [25],
    replies: [
      {
        userId: 4,
        text: "Proud of you, go build something cool 😎",
        userProfilePic: "https://example.com/user4.jpg",
        username: "techTina"
      }
    ],
    createdAt: Date.now()
  },
  {
    postedBy: 8,
    text: "Made my first animated short film, took 3 months but totally worth it 🎥",
    img: "https://example.com/shortfilm.jpg",
    profilePic: "https://res.cloudinary.com/dizkxmaoh/image/upload/v1745143570/16_xih0ke.jpg",
    likes: [14],
    replies: [
      {
        userId: 6,
        text: "Whoa, send a link!",
        userProfilePic: "https://example.com/user6.jpg",
        username: "filmFinn"
      }
    ],
    createdAt: Date.now()
  },
  {
    postedBy: 9,
    text: "Read 12 books this year so far 📚💡 What should I read next?",
    img: "",
    profilePic: "https://res.cloudinary.com/dizkxmaoh/image/upload/v1745143568/18_sglvrv.jpg",
    likes: [8],
    replies: [
      {
        userId: 2,
        text: "Try 'The Alchemist' if you haven’t!",
        userProfilePic: "",
        username: "vibeQueen"
      }
    ],
    createdAt: Date.now()
  },
  {
    postedBy: 10,
    text: "Designed my first website from scratch! Frontend is fun!",
    img: "",
    profilePic: "https://res.cloudinary.com/dizkxmaoh/image/upload/v1745143462/2_f6d6po.jpg",
    likes: [13],
    replies: [
      {
        userId: 7,
        text: "Looks clean! Wanna collaborate?",
        userProfilePic: "https://example.com/user7.jpg",
        username: "devDerek"
      }
    ],
    createdAt: Date.now()
  },
  {
    postedBy: 11,
    text: "Just did a TED-style talk at my school on mental health 💬❤️",
    img: "",
    profilePic: "https://res.cloudinary.com/dizkxmaoh/image/upload/v1745143457/1_y4ibdf.jpg",
    likes: [30],
    replies: [
      {
        userId: 9,
        text: "Respect. That’s a powerful topic.",
        userProfilePic: "https://example.com/user9.jpg",
        username: "talkTara"
      }
    ],
    createdAt: Date.now()
  }
];

export default DefaultPosts;