import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function ProfileScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    return (
        <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <View style={styles.header}>
                <View style={[styles.avatar, { backgroundColor: Colors[colorScheme].surface }]} />
                <Text style={[styles.username, { color: Colors[colorScheme].text }]}>Guest User</Text>
            </View>

            <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme].primary }]}>
                <Text style={styles.buttonText}>Login to Review</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    button: {
        paddingHorizontal: 32,
        paddingVertical: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
});
