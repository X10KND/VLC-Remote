import React, { Component } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableWithoutFeedback,
} from "react-native";

import { Slider } from "@miblanchard/react-native-slider";
import GestureRecognizer from "react-native-swipe-gestures";

import AppScreen from "./AppScreen";
import AppIcon from "./AppIcon";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            volume: 0,
        };
        this.callAPI();
    }

    onSwipe(gestureName, gestureState) {
        var dx = Math.round(gestureState["dx"]);
        var dy = -Math.round(gestureState["dy"]);

        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx > 0) {
                this.forwardPress(Math.round(dx / 10));
            }
            if (dx < 0) {
                this.rewindPress(Math.round(dx / 10));
            }
        } else {
            if (dy > 0) {
                this.volumeUp(Math.round(dy / 2.56));
            }
            if (dy < 0) {
                this.volumeDown(Math.round(dy / 2.56));
            }
        }
    }

    volumeUp = (v) => {
        if (this.state.volume < 512) {
            console.log("volume up");
            this.callAPI(`?command=volume&val=+${v}`);
        } else {
            console.log("volume max");
            this.callAPI(`?command=volume&val=512`);
        }
    };
    volumeDown = (v) => {
        console.log("volume down");
        this.callAPI(`?command=volume&val=${v}`);
    };

    pausePress = () => {
        console.log("play/pause");
        this.callAPI("?command=pl_pause");
    };

    forwardPress = (t = 10) => {
        console.log("foward");
        this.callAPI(`?command=seek&val=+0H:0M:${t}S`);
    };

    rewindPress = (t = 10) => {
        console.log("rewind");
        this.callAPI(`?command=seek&val=-0H:0M:${t}S`);
    };

    callAPI = (param = "") => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", "Basic OjEyMzQ=");
        var url = "http://192.168.1.172:8080/requests/status.json" + param;

        var requestOptions = {
            method: "GET",
            headers: myHeaders,
            redirect: "follow",
        };
        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((result) => {
                this.setState({
                    isPlay: result.state,
                    time: result.time,
                    length: result.length,
                    volume: result.volume,

                    buttonName:
                        result.state == "playing" ? "pause" : "play-arrow",
                });

                this.setState({
                    runDuration: new Date(this.state.time * 1000)
                        .toISOString()
                        .slice(11, 19),
                    totalDuration: new Date(this.state.length * 1000)
                        .toISOString()
                        .slice(11, 19),
                });
            })
            .catch((error) => console.error("Error", error))
            .finally((output) => {
                if (param == "") {
                    this.callAPI();
                }
            });
    };

    render() {
        return (
            <AppScreen style={styles.container}>
                <View style={styles.slide}>
                    <View style={styles.slide}>
                        <Text style={styles.volumeText}>
                            Volume{" "}
                            {Math.min(
                                Math.round(this.state.volume / 2.56),
                                200
                            )}
                            %
                        </Text>
                    </View>
                </View>

                <View style={styles.slide}>
                    <Slider
                        value={this.state.time}
                        onValueChange={(value) => {
                            this.callAPI(
                                "?command=seek&val=" + Math.round(value)
                            );
                        }}
                        maximumTrackTintColor="#222"
                        maximumValue={this.state.length}
                        minimumTrackTintColor="#AAA"
                        minimumValue={0}
                        thumbStyle={styles.seekSlide.thumb}
                        trackStyle={styles.seekSlide.track}
                    />
                </View>

                <View style={styles.duration}>
                    <Text style={styles.durText}>{this.state.runDuration}</Text>

                    <Text style={styles.durText}>
                        {this.state.totalDuration}
                    </Text>
                </View>

                <View>
                    <GestureRecognizer
                        onSwipe={(direction, state) =>
                            this.onSwipe(direction, state)
                        }
                    >
                        <TouchableWithoutFeedback onPress={this.pausePress}>
                            <View style={styles.trackpad} />
                        </TouchableWithoutFeedback>
                    </GestureRecognizer>
                </View>
            </AppScreen>
        );
    }
}

const styles = StyleSheet.create({
    slide: {
        marginHorizontal: 15,
        marginBottom: 20,
    },
    seekSlide: {
        thumb: {
            height: 0,
            width: 0,
        },
        track: {
            height: 2,
            borderRadius: 4,
        },
    },
    control: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        alignSelf: "center",
        marginTop: -10,
        marginHorizontal: 15,
    },
    volumeControl: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        //alignSelf: "center",
        marginHorizontal: 15,
        marginBottom: 20,
    },
    container: {
        flexDirection: "column-reverse",
        height: "100%",
        width: "100%",
    },
    duration: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginHorizontal: 15,
    },
    durText: {
        color: "#AAA",
        fontFamily: "monospace",
    },
    volumeText: {
        color: "#AAA",
        fontSize: 15,
        fontFamily: "monospace",
        textAlign: "center",
    },
    trackpad: {
        backgroundColor: "#0A0A0F",
        borderRadius: 20,
        flexDirection: "row",
        alignSelf: "center",
        verticalAlign: "middle",
        width: "95%",
        height: 550,
        margin: 40,
    },
});

export default App;
