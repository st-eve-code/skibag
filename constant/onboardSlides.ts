type Slide = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  backgroundImage: any;
  gradient: readonly string[];
};

const Slides: Slide[] = [
  {
    id: "1",
    titleKey: "onboarding_welcome_title",
    descriptionKey: "onboarding_welcome_desc",
    backgroundImage: require("@/assets/images/mufa.jpeg"),
    gradient: [
      "rgba(0, 0, 0, 0.04)",
      "rgba(0, 0, 0, 0.69)",
      "rgba(0, 0, 0, 0.97)",
      "rgb(0, 0, 0)",
    ] as const,
  },
  {
    id: "2",
    titleKey: "onboarding_battles_title",
    descriptionKey: "onboarding_battles_desc",
    backgroundImage: require("@/assets/images/modern.jpeg"),
    gradient: [
      "rgba(55, 80, 83, 0.13)",
      "rgba(18, 49, 53, 0.75)",
      "rgb(1, 8, 9)",
      "rgb(0, 0, 0)",
    ] as const,
  },
  {
    id: "3",
    titleKey: "onboarding_rewards_title",
    descriptionKey: "onboarding_rewards_desc",
    backgroundImage: require("@/assets/images/race.jpeg"),
    gradient: [
      "rgba(215, 110, 48, 0.06)",
      "rgba(27, 2, 48, 0.39)",
      "rgb(34, 2, 3)",
      "rgb(0, 0, 0)",
    ] as const,
  },
  {
    id: "4",
    titleKey: "onboarding_ready_title",
    descriptionKey: "onboarding_ready_desc",
    backgroundImage: require("../assets/images/mobile.jpeg"),
    gradient: [
      "rgba(85, 163, 98, 0.07)",
      "rgba(8, 55, 61, 0.57)",
      "rgba(1, 13, 15, 0.98)",
      "rgb(0, 0, 0)",
    ] as const,
  },
];

export default Slides;
