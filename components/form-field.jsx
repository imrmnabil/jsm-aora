import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { TextInput } from "react-native";
import {icons} from '../constants'

const FormField = ({
  title,
  value,
  handleChangeText,
  otherStyles,
  placeholder,
  keyboardType,
  ...props
}) => {
 const [showPassword, setShowPassword] = useState(false);
  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>
      <View className="w-full h-16 px-4 bg-black-200 border-2 border-black-200 rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput
          className="flex-1 text-white font-psemibold text-base w-full "
          value={value}
          placeholder={placeholder}
          placeholderTextColor={`#7b7b8b`}
          onChangeText={handleChangeText}
          secureTextEntry={title === 'Password' && !showPassword}
          keyboardType={keyboardType}
        />
        {title === 'Password' && (
            <TouchableOpacity onPress={()=> setShowPassword(!showPassword)}>
                <Image className='w-6 h-6' source={!showPassword ? icons.eye : icons.eyeHide}/>
            </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
