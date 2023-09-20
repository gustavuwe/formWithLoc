// web 994161586593-3q1ps3naci9rtjgi844ma45pirta23q1.apps.googleusercontent.com
// ios 994161586593-hd061uer8tliogmkdvfumgibhqhn76np.apps.googleusercontent.com
// android 994161586593-9b8s1fns502egfgol0hdp6drkhu7r6aq.apps.googleusercontent.com

import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Form from './src/components/Form/';
import Title from './src/components/Title/';

export default function App() {
  return (
    <View style={styles.container}>
      <Title />
      <Form />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#304A5C",
    paddingTop: 40,
  },
});
