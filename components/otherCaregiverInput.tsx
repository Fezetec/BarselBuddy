import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { getMonday, addWeeks, getWeekNumber, formatDate, parseDate } from '../scripts/dateHelper';
import styles from '../styles/styles';

// --- Komponent for Andre bidragsytere-input ---
const OtherCaregiverInput = ({ caregiver, onNameChange, onRemove }) => (
  <View style={styles.otherCaregiverCard}>
    <Text style={styles.label}>Navn:</Text>
    <TextInput
      style={styles.textInput}
      value={caregiver.name}
      onChangeText={onNameChange}
    />
    <TouchableOpacity
      style={styles.removeButton}
      onPress={onRemove}
    >
      <Text style={styles.removeButtonText}>Fjern</Text>
    </TouchableOpacity>
  </View>
);

export default OtherCaregiverInput;