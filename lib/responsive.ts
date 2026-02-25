import { Dimensions } from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const wp = (percentage: number) => (SCREEN_WIDTH / 100) * percentage;
export const hp = (percentage: number) => (SCREEN_HEIGHT / 100) * percentage;
export const fontScale = (size: number) => (SCREEN_WIDTH / 375) * size;
