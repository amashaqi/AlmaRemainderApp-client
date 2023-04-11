import React from 'react';
import {Image} from 'react-native';

const MaterialIcon = ({source, width, height, color, style}) => {
  return (
    <Image
      source={source}
      style={{
        ...style,
        width: width,
        height: height,
        tintColor: color,
      }}
    />
  );
};

export default MaterialIcon;
