import { useRef } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { TextInput, TextInputProps } from 'react-native-paper';
import { brToIso, isoToBr } from '../hooks/useDateInput';

interface DateInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  label: string;
  value: string; // Expected to be in DD/MM/AAAA or YYYY-MM-DD
  onChangeText: (value: string) => void;
  style?: any;
  dense?: boolean;
}

export default function DateInput({
  label,
  value,
  onChangeText,
  style,
  dense,
  ...rest
}: DateInputProps) {
  const hiddenInputRef = useRef<HTMLInputElement | null>(null);

  const openPicker = () => {
    if (Platform.OS === 'web' && hiddenInputRef.current) {
      if (typeof hiddenInputRef.current.showPicker === 'function') {
        try {
          hiddenInputRef.current.showPicker();
        } catch {
          hiddenInputRef.current.click();
        }
      } else {
        hiddenInputRef.current.click();
      }
    }
  };

  // Convert for hidden date picker (needs YYYY-MM-DD)
  const isoForPicker = value?.includes('/') ? brToIso(value) : (value || '');

  return (
    <View style={[styles.container, style]}>
      <TextInput
        {...rest}
        mode="outlined"
        label={label}
        value={value}
        onChangeText={onChangeText}
        maxLength={10}
        keyboardType="number-pad"
        dense={dense}
        outlineStyle={styles.outline}
        right={<TextInput.Icon icon="calendar" onPress={openPicker} forceTextInputFocus={false} />}
      />
      {Platform.OS === 'web' && (
        <input
          ref={hiddenInputRef}
          type="date"
          value={isoForPicker}
          onChange={(e) => {
            if (e.target.value) {
              const brDate = isoToBr(e.target.value);
              onChangeText(brDate);
            }
          }}
          style={styles.hiddenInput}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  outline: {
    borderRadius: 8,
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 0,
    height: 0,
    pointerEvents: 'none',
    bottom: 0,
    left: 0,
  },
});
