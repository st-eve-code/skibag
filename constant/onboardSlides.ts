type Slide = {
  id: string;
  title: string;
  description: string;
  backgroundImage: any;
  gradient: readonly string[];
};

const Slides: Slide[] = [
  {
    id: "1",
    title: "Welcome to skibag",
    description:
      "Discover and join millions of players in epic battles and adventures",
    backgroundImage: require("@/assets/images/mufa.jpeg"),
    gradient: ["rgba(0, 0, 0, 0.04)", "rgba(0, 0, 0, 0.69)","rgba(0, 0, 0, 0.97)","rgb(0, 0, 0)"] as const,
  },
  {
    id: "2",
    title: "Epic Battles",
    description: "Fight intense arcade battles and climb the leaderboards",
    backgroundImage: require("@/assets/images/modern.jpeg"),
    gradient: ["rgba(55, 80, 83, 0.13)", "rgba(18, 49, 53, 0.75)","rgb(1, 8, 9)","rgb(0, 0, 0)"] as const,
  },
  {
    id: "3",
    title: "Win Rewards",
    description: "Unlock exclusive levels, bonus, skins and archievements",
    backgroundImage: require("@/assets/images/race.jpeg"),
    gradient: ["rgba(215, 110, 48, 0.06)", "rgba(27, 2, 48, 0.39)","rgb(34, 2, 3)","rgb(0, 0, 0)"] as const,
  },
  {
    id: "4",
    title: "Ready to play ?",
    description: "Your gaming journey starts now !  it's time for adventure.",
    backgroundImage: require("../assets/images/mobile.jpeg"),
    gradient: ["rgba(85, 163, 98, 0.07)", "rgba(8, 55, 61, 0.57)", "rgba(1, 13, 15, 0.98)", "rgb(0, 0, 0)"] as const,
  },
];

export default Slides;
