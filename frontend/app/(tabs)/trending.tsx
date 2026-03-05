import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TrendingScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    return (
        <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <Text style={[styles.text, { color: Colors[colorScheme].text }]}>Trending Movies</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
    }
});
