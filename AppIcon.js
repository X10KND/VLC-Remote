import React from "react";
import { View, TouchableWithoutFeedback } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

function AppIcon({
    name,
    style,
    size = 70,
    iconColor = "#142740",
    backColor = "#FFF",
    testPress,
}) {
    return (
        <TouchableWithoutFeedback onPress={testPress}>
            <View
                style={{
                    width: 70 + 20,
                    height: 70 - 20,
                    borderRadius: size / 5,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: backColor,
                    marginBottom: 20,
                }}
            >
                <MaterialIcons
                    name={name}
                    color={iconColor}
                    size={size * 0.5}
                />
            </View>
        </TouchableWithoutFeedback>
    );
}

export default AppIcon;
