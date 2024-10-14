import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import FormField from "../../components/form-field";
import { Video, ResizeMode } from "expo-av";
import { icons, images } from "../../constants";
import CustomButton from "../../components/custom-button";
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";
import {createVideo} from '../../lib/appwrite'
import { useGlobalContext } from "@/context/GlobalProvider";

const Create = () => {
  const [uploading, setUploading] = useState(false);
  const {user} = useGlobalContext();
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const submit = async () => {
    if (
      !(form.prompt !== "" && form.thumbnail && form.title !== "" && form.video)
    ) {
      return Alert.alert("Please fill in all the fields");
    }
    setUploading(true);
    try {
      await createVideo({...form, userId: user.$id})
      Alert.alert("Success", "Post uploaded successfully.");
      router.push('/home')
    } catch (error) {
      Alert.alert("Error", error.message);
      
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
      setUploading(false);
    }
  };

  const openPicker = async (selectType) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: selectType=== 'image'? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }
      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
    } else {
      setTimeout(() => {
        Alert.alert("Document Picked", JSON.stringify(result, null, 2));
      }, 100);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full ">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>
        <FormField
          title="Video Title"
          value={form.title}
          placeholder="Give your video a catchy title..."
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles={`mt-10`}
        />
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            {" "}
            Upload Video
          </Text>
          <TouchableOpacity
            onPress={() => {
              openPicker("video");
            }}
          >
            {form.video ? (
              <Video
                className="w-full h-40 px-4 rounded-2xl bg-black-100"
                source={{ uri: form.video.uri }}
                useNativeControls
                resizeMode={ResizeMode.COVER}
                shouldPlay
                isLooping
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary justify-center items-center">
                  <Image
                    source={icons.upload}
                    className="w-1/2 h-1/2"
                    resizeMode="contain"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            {" "}
            Upload Thumbnail
          </Text>
          <TouchableOpacity
            onPress={() => {
              openPicker("image");
            }}
          >
            {form.thumbnail ? (
              <Image
                className="w-full h-40 px-4 rounded-2xl bg-black-100"
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  className="w-5 h-5"
                  resizeMode="contain"
                />
                <Text className="text-sm text-gray-100 font-pregular">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder="Prompt used to create this video"
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles={`mt-7`}
        />
        <CustomButton
          title="Publish Video"
          containerStyles="mt-7"
          isLoading={uploading}
          handlePress={submit}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
