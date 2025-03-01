import { ResizeMode, Video } from 'expo-av';
import React, { useRef, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, StyleSheet, Text, View, ViewToken } from 'react-native';
import { useVideos } from '../../hooks';
import { Video as VideoType } from '../../types';
import { formatNumber } from '../../utils';

const { width, height } = Dimensions.get('window');

const FeedScreen: React.FC = () => {
  const { videos, loading } = useVideos();
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const flatListRef = useRef<FlatList<VideoType>>(null);

  // Renderizar cada video
  const renderVideoItem = ({ item, index }: { item: VideoType; index: number }) => {
    const isActive = index === activeVideoIndex;

    return (
      <View style={styles.videoContainer}>
        <Video
          source={{ uri: item.url }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isActive}
          isLooping
          style={styles.video}
        />

        <View style={styles.videoInfo}>
          <Text style={styles.videoTitle}>{item.title}</Text>
          <Text style={styles.videoDescription}>{item.description}</Text>

          <View style={styles.statsContainer}>
            <Text style={styles.statText}>
              {formatNumber(item.likes)} likes
            </Text>
            <Text style={styles.statText}>
              {formatNumber(item.comments)} comentarios
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Manejar el cambio de video visible
  const handleViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setActiveVideoIndex(viewableItems[0].index as number);
    }
  }).current;

  // Configuración de visibilidad
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50
  }).current;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4285F4" />
        <Text style={styles.loadingText}>Cargando videos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {videos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay videos disponibles</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={videos}
          renderItem={renderVideoItem}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={height}
          snapToAlignment="start"
          decelerationRate="fast"
          viewabilityConfig={viewabilityConfig}
          onViewableItemsChanged={handleViewableItemsChanged}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  videoContainer: {
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  videoInfo: {
    position: 'absolute',
    bottom: 80,
    left: 20,
    right: 20,
  },
  videoTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  videoDescription: {
    color: 'white',
    fontSize: 14,
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  statText: {
    color: 'white',
    marginRight: 15,
    fontSize: 14,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  emptyText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FeedScreen; 