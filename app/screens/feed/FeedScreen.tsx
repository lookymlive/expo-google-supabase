import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View, ViewToken } from 'react-native';
import { Loading } from '../../components/ui';
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
    const videoRef = useRef<Video>(null);

    // Obtener la primera letra para el avatar (o usar 'U' como fallback)
    const userInitial = item.userId ? item.userId.charAt(0).toUpperCase() : 'U';

    return (
      <View style={styles.videoContainer}>
        <Video
          ref={videoRef}
          source={{ uri: item.url }}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode={ResizeMode.COVER}
          shouldPlay={isActive}
          isLooping
          style={styles.video}
        />

        <View style={styles.overlay}>
          <View style={styles.videoInfo}>
            <Text style={styles.videoTitle}>{item.title}</Text>
            <Text style={styles.videoDescription}>{item.description || 'Sin descripción'}</Text>

            <View style={styles.userInfo}>
              <View style={styles.userAvatar}>
                <Text style={styles.userInitial}>{userInitial}</Text>
              </View>
              <Text style={styles.userName}>Usuario</Text>
            </View>
          </View>

          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={30} color="white" />
              <Text style={styles.actionText}>{formatNumber(item.likes)}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={30} color="white" />
              <Text style={styles.actionText}>{formatNumber(item.comments)}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="share-social-outline" size={30} color="white" />
              <Text style={styles.actionText}>Compartir</Text>
            </TouchableOpacity>
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
    return <Loading fullScreen text="Cargando videos..." color="#fff" />;
  }

  return (
    <View style={styles.container}>
      {videos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="videocam-off-outline" size={50} color="#fff" />
          <Text style={styles.emptyText}>No hay videos disponibles</Text>
          <Text style={styles.emptySubtext}>Los videos aparecerán aquí cuando los comercios los suban</Text>
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
  overlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 50,
  },
  videoInfo: {
    flex: 3,
    justifyContent: 'flex-end',
  },
  videoTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    textShadow: '1px 1px 10px rgba(0, 0, 0, 0.75)',
  },
  videoDescription: {
    color: 'white',
    fontSize: 14,
    marginBottom: 15,
    textShadow: '1px 1px 10px rgba(0, 0, 0, 0.75)',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4285F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  userInitial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userName: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textShadow: '1px 1px 10px rgba(0, 0, 0, 0.75)',
  },
  actionsContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  actionText: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
    textShadow: '1px 1px 10px rgba(0, 0, 0, 0.75)',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  emptyText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    color: '#ccc',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default FeedScreen;