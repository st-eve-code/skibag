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
    titleKey: "Good At Gaming ?",
    descriptionKey: "[18+] gambling involves financial risk, play at your own risk.",
    backgroundImage: require("@/assets/onboarding/onboard1.jpg"),
    gradient: [
      "rgba(0, 0, 0, 0.04)",
      "rgba(0, 0, 0, 0.69)",
      "rgba(0, 0, 0, 0.97)",
      "rgb(0, 0, 0)",
    ] as const,
  },
  {
    id: "2",
    titleKey: " Willing To Put Your Money On The Line ?",
    descriptionKey: "[18+] gambling involves financial risk, play at your own risk.",
    backgroundImage: require("@/assets/onboarding/onboard2.png"),
    gradient: [
      "rgba(55, 80, 83, 0.13)",
      "rgba(18, 49, 53, 0.75)",
      "rgb(1, 8, 9)",
      "rgb(0, 0, 0)",
    ] as const,
  },
  {
    id: "3",
    titleKey: "Bet With Real PLayers And Earn Rewards While Gaming !",
    descriptionKey: "[18+] gambling involves financial risk, play at your own risk.",
    backgroundImage: require("@/assets/onboarding/onboard3.png"),
    gradient: [
      "rgba(215, 110, 48, 0.06)",
      "rgba(27, 2, 48, 0.39)",
      "rgb(34, 2, 3)",
      "rgb(0, 0, 0)",
    ] as const,
  },
  {
    id: "4",
    titleKey: "Ready To Get Started ?",
    descriptionKey: "[18+] gambling involves financial risk, play at your own risk.",
    backgroundImage: require("../assets/onboarding/onboard4.png"),
    gradient: [
      "rgba(85, 163, 98, 0.07)",
      "rgba(8, 55, 61, 0.57)",
      "rgba(1, 13, 15, 0.98)",
      "rgb(0, 0, 0)",
    ] as const,
  },
];

export default Slides;
