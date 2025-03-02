
export interface Profile {
  id: string;
  name: string;
  age: number;
  bio: string;
  distance: number;
  images: string[];
  tags: string[];
}

export const profiles: Profile[] = [
  {
    id: "1",
    name: "Sophie",
    age: 28,
    bio: "Passionate photographer and coffee enthusiast. Let's explore the city together!",
    distance: 3,
    images: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80"
    ],
    tags: ["Photography", "Coffee", "Travel"]
  },
  {
    id: "2",
    name: "Alex",
    age: 30,
    bio: "Software developer by day, amateur chef by night. I make a mean pasta carbonara!",
    distance: 5,
    images: [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80"
    ],
    tags: ["Coding", "Cooking", "Music"]
  },
  {
    id: "3",
    name: "Emma",
    age: 26,
    bio: "Yoga instructor and plant mom. Looking for someone to share adventures and quiet moments with.",
    distance: 2,
    images: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    ],
    tags: ["Yoga", "Plants", "Meditation"]
  },
  {
    id: "4",
    name: "James",
    age: 32,
    bio: "Marketing professional who loves hiking and craft beer. Dog dad to a golden retriever named Max.",
    distance: 7,
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1148&q=80"
    ],
    tags: ["Hiking", "Craft Beer", "Dogs"]
  },
  {
    id: "5",
    name: "Olivia",
    age: 27,
    bio: "Art curator with a passion for indie films and vinyl records. Let's discuss our favorite albums over cocktails.",
    distance: 4,
    images: [
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80"
    ],
    tags: ["Art", "Films", "Music"]
  }
];
