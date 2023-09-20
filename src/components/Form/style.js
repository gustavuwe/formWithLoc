import { AuthError } from 'expo-auth-session';
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
      paddingTop: 30,
      backgroundColor: "#fff"
    },
    form: {
        width: "100%",
        padding: 15
    },
    question: {
      fontSize: 28,
    },
    option: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 20,
      marginBotton: 8,
    },
    optionText: {
        fontSize: 20,
    },
    buttonSend: {
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
        backgroundColor: "#304A5C",
        paddingTop: 14,
        paddingBottom: 14,
        marginLeft: 12,
        margin: 30,
    },
    textButtonSend: {
        fontSize: 20,
        color: "#ffffff",
    },
    errorMessage: {
        fontSize: 12,
        color: "red",
        fontWeight: "bold",
    },
    textMessageOption: {
        color: "#C1F5AC",
        fontSize: 30,
        fontWeight: "bold",
        marginLeft: 100
    },
    loginContext: {
      alignItems: "center",
      display: "flex",
      marginTop: 200,
      gap: 15

    },
    loginTitle: {
      fontSize: 24
    },
    signInButton: {
      padding: 15,
      backgroundColor: "#FF0D00",
      borderRadius: 20,
      textAlign: "center",
    },
    buttonTitle: {
      color: "#fff",
      fontWeight: "bold"
    }
  });

export default styles;