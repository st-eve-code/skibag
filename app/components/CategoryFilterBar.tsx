import { fontScale, hp, wp } from "@/lib/responsive";
import React from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity
} from "react-native";

interface CategoryFilterBarProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
  getLabel?: (category: string) => string;
}

export default function CategoryFilterBar({
  categories,
  selected,
  onSelect,
  getLabel,
}: CategoryFilterBarProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.content}
    >
      {categories.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.item, selected === item && styles.itemActive]}
          onPress={() => onSelect(item)}
        >
          <Text style={[styles.text, selected === item && styles.textActive]}>
            {getLabel ? getLabel(item) : item.charAt(0).toUpperCase() + item.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { maxHeight: hp(7) },
  content: {
    paddingHorizontal: wp(4),
    gap: wp(2.5),
    alignItems: "center",
  },
  item: {
    paddingHorizontal: wp(4),
    paddingVertical: hp(1),
    backgroundColor: "rgba(37, 37, 37, 0.8)",
    borderRadius: hp(2.5),
    justifyContent: "center",
    alignItems: "center",
    height: hp(4.5),
    borderWidth: 1,
    borderColor: "transparent",
  },
  itemActive: {
    backgroundColor: "rgb(59, 132, 226)",
    borderColor: "rgb(59, 132, 226)",
  },
  text: {
    color: "white",
    fontSize: fontScale(12),
    fontWeight: "500",
    textAlign: "center",
  },
  textActive: { fontWeight: "600" },
});
