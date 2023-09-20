import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Vibration,
    Pressable,
    Keyboard,
} from 'react-native'
import { RadioButton } from 'react-native-paper'
import { Permissions } from 'expo';
import styles from './style'
import * as Location from 'expo-location';
import Voto from '../../services/sqlite/Voto'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'

WebBrowser.maybeCompleteAuthSession();

export default function Form() { 
    const [location, setLocation ] = useState(null)
    const [address, setAddress] = useState()
    const [permErr, setPermErr] = useState(null)
    const [selectedOption, setSelectedOption] = useState([]);
    const [errorMessage, setErrorMessage] = useState("")
    const [messageOption, setMessageOption] = useState("")
    const [status, setStatus] = useState("open")
    const options = [
        { label: 'Ana', value: 'ana' },
        { label: 'Ze Lins', value: 'zelins' },
        { label: 'Lucas', value: 'lucas' },
    ];
    const [isVerified, setIsVerified] = useState(false)
    const [isLogged, setIsLogged] = useState(false)
    const [alreadySend, setAlreadySend] = useState(false)
    const [alreadySendError, setAlreadySendError] = useState("")
    const [userEmail, setUserEmail] = useState(null)
    const [userInfo, setUserInfo] = useState({});
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId:
         "994161586593-9b8s1fns502egfgol0hdp6drkhu7r6aq.apps.googleusercontent.com",
        webClientId:
         "994161586593-3q1ps3naci9rtjgi844ma45pirta23q1.apps.googleusercontent.com",
        iosClientId:
         "994161586593-hd061uer8tliogmkdvfumgibhqhn76np.apps.googleusercontent.com",
    });

    // useEffect(() => {
    //     handleSignInWithGoogle();
    // }, [response])

    useEffect(() => {
        getUserInfo();
    }, [])

    const callAuthGoogle = () => {
        promptAsync();
    }

    // async function handleSignInWithGoogle() {
    //     // const user = await AsyncStorage.getItem("@user");
    //     // if (!user) {

    //     if (!isLogged) {
    //         if (response?.type === "success") {
    //             await getUserInfo(response.authentication.accessToken);
    //         }
    //     } else {
    //         // setUserInfo(JSON.parse(user));
    //     }
    // }

    // const getUserInfo = async (token) => {
    //     if (!token) return;
    //     try {
    //         const response = await fetch(
    //             "https://www.googleapis.com/userinfo/v2/me",
    //             {
    //                 headers: { Authorization: `Bearer ${token}` },
    //             }
    //         );

    //         const user = await response.json();
    //         // await AsyncStorage.setItem("@user", JSON.stringify(user));
    //         setUserInfo(user);
    //         setIsLogged(true)
    //     } catch (error) {

    //     }
    // }

    const getUserInfo = async () => {
        if (response) {
            switch (response.type) {
                case 'error':
                    ToastAndroid.show('Houve um erro', ToastAndroid.SHORT);
                    break;
                case 'cancel':
                    ToastAndroid.show('Login cancelado', ToastAndroid.SHORT);
                    break;
                case 'success':
                    try {
                        // https://www.googleapis.com/userinfo/v2/me
                        const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                            headers: {
                                Authorization: `Bearer ${response.authentication?.accessToken}`,
                            },
                        }
                    );
                    const userLogin = await res.json();
                    setUserInfo(userLogin)
                    } catch (e) {
                        console.warn('ERROR')
                    }
                    break;
                default:
                    () => {}

            }
        }
    }


    // var latitude = location.coords.latitude
    // var longitude = location.coords.longitude

    useEffect(() => {
        const getPermissions = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setPermErr('Permission to acess location was denied')
                return;
            }

            let getLocation = await Location.getCurrentPositionAsync({});
            setLocation(getLocation);
        };
        getPermissions();
    }, []);

    async function getReverseGeocodingAsync(latitude, longitude) {
        try {
            const locationGeocode = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
            });

            if (locationGeocode.length > 0) {
                const address = locationGeocode[0];
                console.log('Endereço:', address);
                setAddress(address)
                return address;
            } else {
            console.error('Nenhum endereço encontrado para as coordenadas fornecidas.');
            return null;
            }
        } catch (error) {
            console.error('Erro ao obter endereço:', error);
            return null;
        }
    }

    function verificationOption() {
        if (!selectedOption[0]) {
            Vibration.vibrate();
            setErrorMessage("*Por favor selecione uma opção")
            setMessageOption("");
        }
    }

    function validationOption() {
        if (!selectedOption[0]) {
            verificationOption();
        } else {
            getReverseGeocodingAsync(location.coords.latitude, location.coords.longitude)

            Voto.findByEmail(userInfo.email)
                .then( setAlreadySend(true) )
                .catch( setAlreadySend(false) );
            
            if (!alreadySend) {
                Voto.create( {email: userInfo.email, candidato: selectedOption, localizacao: address.district} )
                    .then( id => console.log('Voto created with id: '+ id) )
                    .catch( err => console.log(err) )
            } else {
                setAlreadySendError("Você já votou!")
            }
            // Voto.remove(11)
            //     .then( updated => console.log('Votos removed: '+ updated) )
            //     .catch( err => console.log(err) )
            Voto.all()
                .then(
                    votos => votos.forEach( v => console.log(v))
                )
            setSelectedOption([])
            setErrorMessage("")
            setMessageOption("Sucesso! ✅")
        }
    }

    return (
        
        <View style={styles.container}>
            {isLogged == true ? 
            <Pressable onPress={Keyboard.dismiss} style={styles.form}>
            <Text style={styles.question}>Selecione um Candidato(a)</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            {options.map((option) => (
                <View key={option.value} style={styles.option}>
                <RadioButton
                    value={option.value}
                    status={selectedOption === option.value ? 'checked' : 'unchecked'}
                    onPress={() => setSelectedOption(option.value)}
                />
                <Text style={styles.optionText}>{option.label}</Text>
                </View>
            ))}
            <TouchableOpacity
            style={styles.buttonSend}
            onPress={() => {
                validationOption()
            }}
            >
                <Text style={styles.textButtonSend}>Enviar</Text>
            </TouchableOpacity>

            <Text style={styles.textMessageOption}>{messageOption}</Text>
            <Text>{alreadySendError}</Text>
        </Pressable>
        :
        <View style={styles.loginContext}>
            <Text>{JSON.stringify(userInfo.email)}</Text>
            <Text style={styles.loginTitle}>Login with google</Text>
            <TouchableOpacity
            style={styles.signInButton}
            onPress={callAuthGoogle}
            >
                <Text style={styles.buttonTitle}>Sign in with google</Text>
            </TouchableOpacity>
        </View>
}
    </View>
    );
}