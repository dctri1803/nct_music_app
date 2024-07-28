import React from "react";
import {Image, StyleSheet } from 'react-native'

export default function Logo() {
    return <Image source={require('../assets/NCT_logo.png')} style={styles.img}/>
}

const styles = StyleSheet.create({
    img: {
        width: 210,
        height: 210,
        marginBottom:80,
    }
})