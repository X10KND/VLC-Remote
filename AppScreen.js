import React from "react";
import Constants from "expo-constants";
import { StyleSheet, SafeAreaView, View, StatusBar } from "react-native";
//import { LinearGradient } from "expo-linear-gradient";

function AppScreen({ children, style }) {
    return (
        <SafeAreaView style={[styles.screen, style]}>
            <StatusBar hidden backgroundColor="#142740" />
            <View style={style}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    screen: {
        //paddingTop: Constants.statusBarHeight + 5,
        flex: 1,
        backgroundColor: "#000",
        //backgroundColor: "transparent",
    },
});

export default AppScreen;
