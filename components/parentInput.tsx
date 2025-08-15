import { View, Text, TextInput, Platform } from 'react-native';
import { addWeeks, getWeekNumber, formatDate, parseDate } from '../scripts/dateHelper';
import styles from '../styles/styles';

interface ParentInputProps {
  name: string;
  leaveStart: string;
  setLeaveStart: (value: string) => void;
  leaveWeeks: number;
  setLeaveWeeks: (value: number) => void;
}

const ParentInput: React.FC<ParentInputProps> = ({ name, leaveStart, setLeaveStart, leaveWeeks, setLeaveWeeks }) => {
  const leaveStartDate = parseDate(leaveStart);
  const leaveEndDate = leaveStartDate ? addWeeks(leaveStartDate, leaveWeeks - 1) : null;
  const endWeek = leaveEndDate ? getWeekNumber(leaveEndDate) : null;

  return (
    <View style={styles.parentCard}>
      <Text style={styles.label}>{name}</Text>
      <Text style={styles.label}>Permisjon start (DD.MM.YYYY):</Text>
      <TextInput
        style={styles.textInput}
        value={leaveStart}
        onChangeText={setLeaveStart}
        placeholder="DD.MM.YYYY"
        keyboardType={Platform.OS === 'ios' ? 'default' : 'numeric'}
      />
      <Text style={styles.label}>Antall uker permisjon:</Text>
      <TextInput
        style={styles.textInput}
        value={String(leaveWeeks)}
        onChangeText={text => setLeaveWeeks(parseInt(text, 10) || 0)}
        keyboardType="numeric"
      />
      <Text style={styles.leaveEndText}>
        {leaveEndDate ? `Ferdig i uke ${endWeek}, ${formatDate(leaveEndDate)}.` : ''}
      </Text>
    </View>
  );
};

export default ParentInput;