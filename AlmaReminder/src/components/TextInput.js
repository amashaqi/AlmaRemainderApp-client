import {React} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {TextInput as Input} from 'react-native-paper';
import {theme} from '../theme/theme';

const TextInput = ({errorText, description, ...props}) => {
  return (
    <View style={styles.container}>
      <Input
        style={styles.input}
        underlineColor="transparent"
        mode="outlined"
        theme={{
          colors: {
            primary: theme.colors.almaPrimary,
            underlineColor: 'transparent',
          },
        }}
        {...props}
      />
      {description && !errorText ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
      {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 12,
    borderColor: theme.colors.almaPrimary,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.almaPrimary,
    color: theme.colors.almaPrimary,
  },
  description: {
    fontSize: 13,
    color: theme.colors.secondary,
    paddingTop: 8,
  },
  error: {
    fontSize: 13,
    color: theme.colors.error,
    paddingTop: 8,
  },
});

export default TextInput;
