import { View, Text, FlatList, Image, RefreshControl, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import images from "../../constants/images";
import SearchInput from "../../components/search-input";
import Trending from "../../components/trending";
import EmptyState from "../../components/empty-state";
import { useGlobalContext } from "@/context/GlobalProvider";
import useAppwrite from "../../lib/useAppwrite";
import {getAllPosts, getLatestPosts} from '../../lib/appwrite'
import VideoCard from "../../components/video-card";


const Home = () => {
  
  const {data: posts, refetch} = useAppwrite(getAllPosts)
  const {data: latestPosts} = useAppwrite(getLatestPosts)

  const [refreshing, setRefreshing] = useState(false)
  const {user} = useGlobalContext()

  const onRefresh = async ()=> {
    setRefreshing(true)
    await refetch();
    setRefreshing(false);
    console.log("Refetched");
  }


  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        // data={[]}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-9 h-10"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>
              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first on to upload a video"
          />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  );
};

export default Home;
