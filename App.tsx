// import { Container, Subtitle, Title } from './components/styled';

// export default function App() {
//   return (
//     <Container>
//       <Title>Velkommen til BarselBuddy 👋</Title>
//       <Subtitle>Her finner du oversikt over alt i barseltiden.</Subtitle>
//     </Container>
//   );
// }

import React, { useState, useEffect } from 'react';
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
import { getMonday, addWeeks, getWeekNumber, formatDate, parseDate } from './scripts/dateHelper';
import CoverageTable from './components/coverageTable';
import ParentInput from './components/parentInput';
import OtherCaregiverInput from './components/otherCaregiverInput';
import styles from './styles/styles';

const App = () => {
  const [childBirthDateStr, setChildBirthDateStr] = useState('');
  const [kindergartenStartStr, setKindergartenStartStr] = useState('');
  const [parent1LeaveStartStr, setParent1LeaveStartStr] = useState('');
  const [parent1LeaveWeeks, setParent1LeaveWeeks] = useState(49);
  const [parent2LeaveStartStr, setParent2LeaveStartStr] = useState('');
  const [parent2LeaveWeeks, setParent2LeaveWeeks] = useState(15);
  const [otherCaregivers, setOtherCaregivers] = useState([]);
  const [coverageData, setCoverageData] = useState([]);
  const [weeklyCoverageSummary, setWeeklyCoverageSummary] = useState([]);
  const [weekHeaders, setWeekHeaders] = useState([]);
  const [coverageStatus, setCoverageStatus] = useState('');

  // Initial data setup
  useEffect(() => {
    const today = new Date();
    const threeMonthsFromNow = new Date(today);
    threeMonthsFromNow.setMonth(today.getMonth() + 3);
    const kindergartenDefault = new Date(today);
    kindergartenDefault.setFullYear(today.getFullYear() + 1);
    kindergartenDefault.setMonth(kindergartenDefault.getMonth() + 1);

    setChildBirthDateStr(formatDate(today));
    setParent1LeaveStartStr(formatDate(today));
    setParent2LeaveStartStr(formatDate(threeMonthsFromNow));
    setKindergartenStartStr(formatDate(kindergartenDefault));
  }, []);

  // Recalculate coverage whenever relevant inputs change
  useEffect(() => {
    calculateCoverage();
  }, [
    childBirthDateStr,
    kindergartenStartStr,
    parent1LeaveStartStr,
    parent1LeaveWeeks,
    parent2LeaveStartStr,
    parent2LeaveWeeks,
    otherCaregivers,
  ]);

  const addOtherCaregiver = () => {
    const newCaregiver = {
      id: `other-${Date.now()}`,
      name: `Ny person ${otherCaregivers.length + 1}`,
      weeklyAvailability: {},
    };
    setOtherCaregivers(prev => [...prev, newCaregiver]);
  };

  const removeOtherCaregiver = (idToRemove) => {
    setOtherCaregivers(prev => prev.filter(c => c.id !== idToRemove));
  };

  const toggleCaregiverAvailability = (caregiverId, weekNum, value) => {
    setOtherCaregivers(prev =>
      prev.map(caregiver =>
        caregiver.id === caregiverId
          ? { ...caregiver, weeklyAvailability: { ...caregiver.weeklyAvailability, [weekNum]: value } }
          : caregiver
      )
    );
  };

  const calculateCoverage = () => {
    const childBirthDate = parseDate(childBirthDateStr);
    const kindergartenStartDate = parseDate(kindergartenStartStr);

    if (!childBirthDate || !kindergartenStartDate) {
      setCoverageStatus('');
      setCoverageData([]);
      setWeeklyCoverageSummary([]);
      setWeekHeaders([]);
      return;
    }
    if (kindergartenStartDate < childBirthDate) {
      setCoverageStatus('Barnehagestart kan ikke være før barnets fødselsdato.');
      setCoverageData([]);
      setWeeklyCoverageSummary([]);
      setWeekHeaders([]);
      return;
    }

    const parent1LeaveStartDate = parseDate(parent1LeaveStartStr);
    const parent1LeaveEndDate = parent1LeaveStartDate ? addWeeks(parent1LeaveStartDate, parent1LeaveWeeks - 1) : null;
    const parent2LeaveStartDate = parseDate(parent2LeaveStartStr);
    const parent2LeaveEndDate = parent2LeaveStartDate ? addWeeks(parent2LeaveStartDate, parent2LeaveWeeks - 1) : null;

    const allCaregivers = [
      { id: 'parent1', name: 'Mor', type: 'parent', leaveStartDate: parent1LeaveStartDate, leaveEndDate: parent1LeaveEndDate },
      { id: 'parent2', name: 'Far', type: 'parent', leaveStartDate: parent2LeaveStartDate, leaveEndDate: parent2LeaveEndDate },
      ...otherCaregivers,
    ];

    const startOfChildsFirstWeek = getMonday(childBirthDate);
    const startOfKindergartenWeek = getMonday(kindergartenStartDate);

    const diffTime = Math.abs(startOfKindergartenWeek.getTime() - startOfChildsFirstWeek.getTime());
    const numWeeks = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 7));

    const maxWeeks = 104;
    const actualNumWeeks = Math.min(numWeeks, maxWeeks);

    const newWeekHeaders = [];
    const weekStartDates = [];
    for (let i = 0; i < actualNumWeeks; i++) {
      const weekStartDate = addWeeks(startOfChildsFirstWeek, i);
      weekStartDates.push(weekStartDate);
      newWeekHeaders.push({
        weekNum: `Uke ${getWeekNumber(weekStartDate)}`,
        date: formatDate(weekStartDate),
      });
    }
    setWeekHeaders(newWeekHeaders);

    const newCoverageData = [];
    const newWeeklyCoverageSummary = Array(actualNumWeeks).fill(false);

    allCaregivers.forEach(person => {
      const personWeeks = [];
      for (let i = 0; i < actualNumWeeks; i++) {
        const weekNum = i + 1;
        const weekStartDate = weekStartDates[i];
        let isAvailable = false;

        if (person.type === 'parent') {
          if (person.leaveStartDate && person.leaveEndDate && weekStartDate >= person.leaveStartDate && weekStartDate <= person.leaveEndDate) {
            isAvailable = true;
          }
        } else if (person.type === 'other') {
          isAvailable = !!person.weeklyAvailability[weekNum];
        }

        personWeeks.push({ weekNum, isAvailable, type: person.type, caregiverId: person.id });
        if (isAvailable) {
          newWeeklyCoverageSummary[i] = true;
        }
      }
      newCoverageData.push({ id: person.id, name: person.name, weeks: personWeeks });
    });

    setCoverageData(newCoverageData);
    setWeeklyCoverageSummary(newWeeklyCoverageSummary);

    // Oppdater den dynamiske statusmeldingen
    const isFullyCovered = newWeeklyCoverageSummary.every(covered => covered);
    if (isFullyCovered) {
        setCoverageStatus('🥳 Gratulerer! Hele perioden frem til barnehagestart er dekket!');
    } else {
        setCoverageStatus('⚠️ Det er manglende dekning i perioden. Legg til flere bidragsytere eller juster permisjonsukene for å sikre full dekning.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Barneomsorg Dekningsplanlegger</Text>
        <Text style={styles.subtitle}>
          Fyll inn informasjon for å se din barneomsorgsdekning frem til barnehagestart.
        </Text>

        {/* Input for barnets fødselsdato og barnehagestart */}
        <View style={styles.inputSection}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Barnets fødselsdato (DD.MM.YYYY):</Text>
            <TextInput
              style={styles.textInput}
              value={childBirthDateStr}
              onChangeText={setChildBirthDateStr}
              placeholder="DD.MM.YYYY"
              keyboardType={Platform.OS === 'ios' ? 'default' : 'numeric'}
            />
          </View>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Forventet barnehagestart (ca.) (DD.MM.YYYY):</Text>
            <TextInput
              style={styles.textInput}
              value={kindergartenStartStr}
              onChangeText={setKindergartenStartStr}
              placeholder="DD.MM.YYYY"
              keyboardType={Platform.OS === 'ios' ? 'default' : 'numeric'}
            />
          </View>
        </View>

        {/* Input for foreldrepermisjon */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Foreldrepermisjon</Text>
          <View style={styles.parentsContainer}>
            <ParentInput
              name="Mor"
              leaveStart={parent1LeaveStartStr}
              setLeaveStart={setParent1LeaveStartStr}
              leaveWeeks={parent1LeaveWeeks}
              setLeaveWeeks={setParent1LeaveWeeks}
            />
            <ParentInput
              name="Far"
              leaveStart={parent2LeaveStartStr}
              setLeaveStart={setParent2LeaveStartStr}
              leaveWeeks={parent2LeaveWeeks}
              setLeaveWeeks={setParent2LeaveWeeks}
            />
          </View>
        </View>

        {/* Input for andre bidragsytere */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Andre bidragsytere</Text>
          <View style={styles.otherCaregiversContainer}>
            {otherCaregivers.map(caregiver => (
              <OtherCaregiverInput
                key={caregiver.id}
                caregiver={caregiver}
                onNameChange={(text) => setOtherCaregivers(prev =>
                  prev.map(c => (c.id === caregiver.id ? { ...c, name: text } : c))
                )}
                onRemove={() => removeOtherCaregiver(caregiver.id)}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.addButton} onPress={addOtherCaregiver}>
            <Text style={styles.addButtonText}>Legg til person</Text>
          </TouchableOpacity>
        </View>
        
        {/* Tabell for dekning */}
        {coverageData.length > 0 && weekHeaders.length > 0 && (
          <>
            <View style={
              coverageStatus.startsWith('🥳')
                ? styles.coverageStatusSuccess
                : styles.coverageStatusWarning
            }>
              <Text style={styles.coverageStatusText}>{coverageStatus}</Text>
            </View>
            <CoverageTable
              weekHeaders={weekHeaders}
              coverageData={coverageData}
              weeklyCoverageSummary={weeklyCoverageSummary}
              onToggleAvailability={toggleCaregiverAvailability}
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

export default App;