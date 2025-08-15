import { View, Text, ScrollView, Switch } from 'react-native';
import styles from '../styles/styles';

interface Week {
  weekNum: number;
  date: string;
  type: string;
  isAvailable: boolean;
  caregiverId?: string;
}

interface Person {
  id: string;
  name: string;
  weeks: Week[];
}

interface CoverageTableProps {
  weekHeaders: { weekNum: number; date: string }[];
  coverageData: Person[];
  weeklyCoverageSummary: boolean[];
  onToggleAvailability: (caregiverId: string, weekNum: number, value: boolean) => void;
}

const CoverageTable: React.FC<CoverageTableProps> = ({ weekHeaders, coverageData, weeklyCoverageSummary, onToggleAvailability }) => (
  <View style={styles.outputSection}>
    <Text style={styles.sectionTitle}>Ukesoversikt Dekning</Text>
    <ScrollView horizontal style={styles.tableScrollView}>
      <View>
        {/* Tabellhode */}
        <View style={styles.tableHeaderRowsContainer}>
          <Text style={[styles.tableHeaderCell, styles.stickyCell, styles.personHeader]}>Person</Text>
          <View style={styles.subHeaderRow}>
            {weekHeaders.map((header, index) => (
              <Text key={`week-${index}`} style={styles.tableHeaderCell}>
                {header.weekNum}
              </Text>
            ))}
          </View>
          <View style={styles.subHeaderRow}>
            {weekHeaders.map((header, index) => (
              <Text key={`date-${index}`} style={[styles.tableHeaderCell, styles.dateHeader]}>
                {header.date}
              </Text>
            ))}
          </View>
        </View>

        {/* Tabellkropp */}
        {coverageData.map(person => (
          <View key={person.id} style={styles.tableRow}>
            <Text style={[styles.tableCell, styles.stickyCell, styles.personNameCell]}>
              {person.name}
            </Text>
            {person.weeks.map(week => (
              <View
                key={`${person.id}-${week.weekNum}`}
                style={[
                  styles.tableCell,
                  week.type === 'parent'
                    ? week.isAvailable
                      ? styles.parentCoveredCell
                      : styles.parentNotCoveredCell
                    : week.isAvailable
                      ? styles.otherCoveredCell
                      : styles.otherNotCoveredCell,
                ]}
              >
                {week.type === 'parent' ? (
                  <Text>{week.isAvailable ? '✔️' : '❌'}</Text>
                ) : (
                  <Switch
                    value={week.isAvailable}
                    onValueChange={(value) => onToggleAvailability(week.caregiverId ?? '', week.weekNum, value)}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={week.isAvailable ? '#f5dd4b' : '#f4f3f4'}
                  />
                )}
              </View>
            ))}
          </View>
        ))}

        {/* Oppsummeringstablåfot */}
        <View style={styles.tableFooterRow}>
          <Text style={[styles.tableHeaderCell, styles.stickyCell, styles.summaryCell]}>Dekning</Text>
          {weeklyCoverageSummary.map((isCovered, index) => (
            <Text
              key={`summary-${index}`}
              style={[
                styles.tableCell,
                styles.summaryCell,
                isCovered ? styles.summaryCovered : styles.summaryNotCovered,
              ]}
            >
              {isCovered ? 'Dekket' : 'Manglende'}
            </Text>
          ))}
        </View>
      </View>
    </ScrollView>
  </View>
);

export default CoverageTable;