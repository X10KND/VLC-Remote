import { StyleSheet, View, Text, Image, TouchableWithoutFeedback } from "react-native";

import { Slider } from "@miblanchard/react-native-slider";
import GestureRecognizer from "react-native-swipe-gestures";

import AppScreen from "./AppScreen";
import { useEffect, useReducer } from "react";
// import AppIcon from "./AppIcon";

export default function App() {
    const [state, updateState] = useReducer(
        (prev, next) => {
            return { ...prev, ...next };
        },
        { volume: 0 }
    );

    useEffect(() => {
        setTimeout(() => {
            callAPI();
        }, 1000);
    }, []);

    const onSwipe = (gestureName, gestureState) => {
        var dx = Math.round(gestureState["dx"]);
        var dy = -Math.round(gestureState["dy"]);

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                forwardPress(Math.round(dx / 10));
            }
            if (dx < 0) {
                rewindPress(Math.round(dx / 10));
            }
        } else {
            if (dy > 0) {
                volumeUp(Math.round(dy / 2.56));
            }
            if (dy < 0) {
                volumeDown(Math.round(dy / 2.56));
            }
        }
    };

    const volumeUp = (v) => {
        if (state.volume < 512) {
            console.log("volume up");
            callAPI(`?command=volume&val=+${v}`);
        } else {
            console.log("volume max");
            callAPI(`?command=volume&val=512`);
        }
    };
    const volumeDown = (v) => {
        console.log(state);
        console.log("volume down");
        callAPI(`?command=volume&val=${v}`);
    };

    const pausePress = () => {
        console.log("play/pause");
        callAPI("?command=pl_pause");
    };

    const forwardPress = (t = 10) => {
        console.log("forward");
        callAPI(`?command=seek&val=+0H:0M:${t}S`);
    };

    const rewindPress = (t = 10) => {
        console.log("rewind");
        callAPI(`?command=seek&val=-0H:0M:${t}S`);
    };

    const callAPI = (param = "") => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic OjEyMzQ=");
        var url = "http://192.168.1.181:8080/requests/status.json" + param;

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow"
        };
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                updateState({
                    isPlay: result.state,
                    time: result.time,
                    length: result.length,
                    volume: result.volume,
                    buttonName: result.state == "playing" ? "pause" : "play-arrow",
                    runDuration: new Date(result.time * 1000).toISOString().slice(11, 19),
                    totalDuration: new Date(result.length * 1000).toISOString().slice(11, 19)
                });
            })
            .catch((error) => console.error("Error", error));
    };

    return (
        <AppScreen style={styles.container}>
            <View style={styles.slide}>
                <View style={styles.slide}>
                    <Text style={styles.volumeText}>Volume {Math.min(Math.round(state.volume / 2.56), 200)}%</Text>
                </View>
            </View>

            <View style={styles.slide}>
                <Slider
                    value={state.time}
                    onValueChange={(value) => {
                        callAPI("?command=seek&val=" + Math.round(value));
                    }}
                    maximumTrackTintColor="#222"
                    maximumValue={state.length}
                    minimumTrackTintColor="#AAA"
                    minimumValue={0}
                    thumbStyle={styles.seekSlide.thumb}
                    trackStyle={styles.seekSlide.track}
                />
            </View>

            <View style={styles.duration}>
                <Text style={styles.durText}>{state.runDuration}</Text>

                <Text style={styles.durText}>{state.totalDuration}</Text>
            </View>

            <View>
                <GestureRecognizer onSwipe={(direction, state) => onSwipe(direction, state)}>
                    <TouchableWithoutFeedback onPress={pausePress}>
                        <View style={styles.trackpad} />
                    </TouchableWithoutFeedback>
                </GestureRecognizer>
            </View>
        </AppScreen>
    );
}

const styles = StyleSheet.create({
    slide: {
        marginHorizontal: 15,
        marginBottom: 20
    },
    seekSlide: {
        thumb: {
            height: 0,
            width: 0
        },
        track: {
            height: 2,
            borderRadius: 4
        }
    },
    control: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",
        marginTop: -10,
        marginHorizontal: 15
    },
    volumeControl: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        //alignSelf: "center",
        marginHorizontal: 15,
        marginBottom: 20
    },
    container: {
        flexDirection: "column-reverse",
        height: "100%",
        width: "100%"
    },
    duration: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 15
    },
    durText: {
        color: "#AAA",
        fontFamily: "monospace"
    },
    volumeText: {
        color: "#AAA",
        fontSize: 15,
        fontFamily: "monospace",
        textAlign: "center"
    },
    trackpad: {
        backgroundColor: "#0A0A0F",
        borderRadius: 20,
        flexDirection: "row",
        alignSelf: "center",
        verticalAlign: "middle",
        width: "95%",
        height: 550,
        margin: 40
    }
});
