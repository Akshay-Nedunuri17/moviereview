import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, FlatList } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useRouter } from 'expo-router';

const MOCK_MOVIES = [
  { id: '1', title: 'Inception', poster: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg' },
  { id: '2', title: 'Interstellar', poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg' },
  { id: '3', title: 'The Dark Knight', poster: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg' },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'dark';
  const router = useRouter();

  const renderMovie = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.movieCard}
      onPress={() => router.push(`/movie/${item.id}`)}
    >
      <Image source={{ uri: item.poster }} style={styles.poster} />
      <Text style={[styles.movieTitle, { color: Colors[colorScheme].text }]} numberOfLines={1}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderSection = (title: string, data: any[]) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: Colors[colorScheme].text }]}>{title}</Text>
      <FlatList
        data={data}
        renderItem={renderMovie}
        keyExtractor={item => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: Colors[colorScheme].primary }]}>CineRate</Text>
      </View>

      {renderSection('Trending Now', MOCK_MOVIES)}
      {renderSection('Top Rated', MOCK_MOVIES)}
      {renderSection('Upcoming', MOCK_MOVIES)}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 15,
  },
  listContent: {
    paddingHorizontal: 15,
  },
  movieCard: {
    width: 140,
    marginHorizontal: 5,
  },
  poster: {
    width: 140,
    height: 210,
    borderRadius: 8,
    marginBottom: 8,
  },
  movieTitle: {
    fontSize: 14,
    fontWeight: '500',
  }
});
