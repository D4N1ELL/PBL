import "react-native-gesture-handler";
import Navigation from './components/Navigation';
import { StyleSheet} from "react-native";

export default function App() {
    return(
        <Navigation/>
    ) 
    
}


const styles = StyleSheet.create({
container: {
fLex: 1,
backgroundColor: "#fff",
alignItems: "center",
justifyContent: "center",
},
});