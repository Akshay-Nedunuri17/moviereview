import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { Ionicons } from '@expo/vector-icons';
import { movieApi, reviewApi } from '@/services/api';

export default function MovieDetailsScreen() {
    const { id } = useLocalSearchParams();
    const colorScheme = useColorScheme() ?? 'dark';

    const [movie, setMovie] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieData = async () => {
            try {
                const movieRes = await movieApi.getMovieDetails(id as string);
                setMovie(movieRes.data);

                // Use either _id or fall back depending on the API payload structure
                const realMovieId = movieRes.data._id || movieRes.data.tmdbId;
                const reviewRes = await reviewApi.getReviewsForMovie(realMovieId);
                setReviews(reviewRes.data);
            } catch (error) {
                console.error('Error fetching movie details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieData();
    }, [id]);

    if (loading || !movie) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: Colors[colorScheme].background }]}>
                <ActivityIndicator size="large" color={Colors[colorScheme].primary} />
            </View>
        );
    }

    const getImageUrl = (path: string, size: string = 'w500') => path ? `https://image.tmdb.org/t/p/${size}${path}` : 'https://via.placeholder.com/500x750';

    const displayRating = movie.combinedRating || movie.tmdbRating || 0;

    return (
        <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <Image source={{ uri: getImageUrl(movie.backdropPath, 'w1280') }} style={styles.backdrop} />

            <View style={styles.content}>
                <View style={styles.header}>
                    <Image source={{ uri: getImageUrl(movie.posterPath) }} style={styles.poster} />
                    <View style={styles.headerInfo}>
                        <Text style={[styles.title, { color: Colors[colorScheme].text }]}>{movie.title}</Text>
                        <View style={styles.ratingContainer}>
                            <Ionicons name="star" size={20} color="#f5c518" />
                            <Text style={[styles.rating, { color: Colors[colorScheme].text }]}>{displayRating.toFixed(1)}/10</Text>
                            <Text style={[styles.votes, { color: Colors[colorScheme].icon }]}>
                                ({movie.tmdbVotes + (movie.userVotes || 0)} votes)
                            </Text>
                        </View>
                        <Text style={[styles.release, { color: Colors[colorScheme].icon }]}>{movie.releaseDate}</Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>Overview</Text>
                    <Text style={[styles.overview, { color: Colors[colorScheme].icon }]}>{movie.overview}</Text>
                </View>

                <View style={styles.section}>
                    <View style={styles.reviewsHeader}>
                        <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>User Reviews</Text>
                        <TouchableOpacity onPress={() => alert('Review posting to be implemented via Auth module')}>
                            <Text style={{ color: Colors[colorScheme].primary, fontWeight: 'bold' }}>+ Write Review</Text>
                        </TouchableOpacity>
                    </View>

                    {reviews.length === 0 ? (
                        <Text style={{ color: Colors[colorScheme].icon }}>No user reviews yet. Be the first!</Text>
                    ) : (
                        reviews.map((review) => (
                            <View key={review._id} style={[styles.reviewCard, { backgroundColor: Colors[colorScheme].surface, marginBottom: 12 }]}>
                                <View style={styles.reviewHeader}>
                                    <Text style={[styles.reviewer, { color: Colors[colorScheme].text }]}>{review.user?.username || 'User'}</Text>
                                    <View style={styles.ratingContainer}>
                                        <Ionicons name="star" size={14} color="#f5c518" />
                                        <Text style={{ color: Colors[colorScheme].text, marginLeft: 4 }}>{review.rating}</Text>
                                    </View>
                                </View>
                                <Text style={{ color: Colors[colorScheme].icon, marginTop: 8 }}>{review.comment}</Text>
                            </View>
                        ))
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        width: '100%',
        height: 200,
    },
    content: {
        padding: 20,
        marginTop: -40,
    },
    header: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    poster: {
        width: 100,
        height: 150,
        borderRadius: 8,
        marginRight: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    headerInfo: {
        flex: 1,
        justifyContent: 'flex-end',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    rating: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 6,
    },
    votes: {
        marginLeft: 8,
        fontSize: 12,
    },
    release: {
        fontSize: 14,
        marginBottom: 8,
        marginTop: 4,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    overview: {
        fontSize: 15,
        lineHeight: 24,
    },
    reviewsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    reviewCard: {
        padding: 16,
        borderRadius: 12,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reviewer: {
        fontWeight: 'bold',
    }
});
