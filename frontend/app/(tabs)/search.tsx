import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { movieApi } from '@/services/api';

export default function SearchScreen() {
    const colorScheme = useColorScheme() ?? 'dark';
    const router = useRouter();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (text: string) => {
        setQuery(text);
        if (text.length > 2) {
            setLoading(true);
            try {
                const response = await movieApi.searchMovies(text);
                setResults(response.data);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        } else {
            setResults([]);
        }
    };

    const getPosterUrl = (path: string) => path ? `https://image.tmdb.org/t/p/w200${path}` : 'https://via.placeholder.com/100x150';

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity
            style={styles.resultItem}
            onPress={() => router.push(`/movie/${item._id || item.tmdbId}`)}
        >
            <Image source={{ uri: getPosterUrl(item.posterPath) }} style={styles.poster} />
            <View style={styles.resultInfo}>
                <Text style={[styles.title, { color: Colors[colorScheme].text }]} numberOfLines={2}>
                    {item.title}
                </Text>
                <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#f5c518" />
                    <Text style={[styles.rating, { color: Colors[colorScheme].text }]}>
                        {item.combinedRating ? item.combinedRating.toFixed(1) : item.tmdbRating ? item.tmdbRating.toFixed(1) : 'N/A'}
                    </Text>
                </View>
                <Text style={[styles.release, { color: Colors[colorScheme].icon }]}>
                    {item.releaseDate ? item.releaseDate.split('-')[0] : ''}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <View style={[styles.searchBar, { backgroundColor: Colors[colorScheme].surface }]}>
                <Ionicons name="search" size={20} color={Colors[colorScheme].icon} style={styles.searchIcon} />
                <TextInput
                    style={[styles.input, { color: Colors[colorScheme].text }]}
                    placeholder="Search movies..."
                    placeholderTextColor={Colors[colorScheme].icon}
                    value={query}
                    onChangeText={handleSearch}
                />
                {query.length > 0 && (
                    <TouchableOpacity onPress={() => handleSearch('')}>
                        <Ionicons name="close-circle" size={20} color={Colors[colorScheme].icon} />
                    </TouchableOpacity>
                )}
            </View>

            {loading ? (
                <View style={styles.centerContent}>
                    <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
                </View>
            ) : results.length > 0 ? (
                <FlatList
                    data={results}
                    renderItem={renderItem}
                    keyExtractor={item => (item._id || item.tmdbId).toString()}
                    contentContainerStyle={styles.listContent}
                />
            ) : query.length > 2 ? (
                <View style={styles.centerContent}>
                    <Text style={[styles.text, { color: Colors[colorScheme].icon }]}>No movies found</Text>
                </View>
            ) : (
                <View style={styles.centerContent}>
                    <Ionicons name="film-outline" size={60} color={Colors[colorScheme].icon} style={{ marginBottom: 16, opacity: 0.5 }} />
                    <Text style={[styles.text, { color: Colors[colorScheme].icon }]}>Search for your favorite movies</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 8,
        marginHorizontal: 16,
        marginBottom: 16,
        paddingHorizontal: 12,
        paddingVertical: 10,
    },
    searchIcon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    resultItem: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    poster: {
        width: 60,
        height: 90,
        borderRadius: 6,
        marginRight: 12,
    },
    resultInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    rating: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: 'bold',
    },
    release: {
        fontSize: 14,
    }
});
