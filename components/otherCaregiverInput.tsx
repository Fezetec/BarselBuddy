import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles from '../styles/styles';

interface OtherCaregiverInputProps {
  caregiver: { name: string };
  onNameChange: (text: string) => void;
  onRemove: () => void;
}

const OtherCaregiverInput: React.FC<OtherCaregiverInputProps> = ({ caregiver, onNameChange, onRemove }) => (
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